/**
 * IndexedDB 数据库初始化
 * 使用 Dexie.js 简化操作
 */

import Dexie from 'dexie'
import { CATEGORIES } from '../utils/constants.js'

class LawMindDB extends Dexie {
  constructor() {
    super('LawMindDB')

    this.version(1).stores({
      // 知识条目表
      entries: 'id, category, type, createdAt, updatedAt, isFavorite, *tags',
      // AI 对话表
      conversations: 'id, createdAt',
    })
  }
}

// 单例
const db = new LawMindDB()

// ===== 知识条目 CRUD =====

// 获取所有条目（默认按更新时间倒序）
export async function getEntries({ category, type, tag, search, favorite } = {}) {
  let collection = db.entries.orderBy('updatedAt').reverse()

  if (category) {
    collection = collection.filter(e => e.category === category)
  }
  if (type) {
    collection = collection.filter(e => e.type === type)
  }
  if (favorite) {
    collection = collection.filter(e => e.isFavorite === true)
  }

  let results = await collection.toArray()

  // 标签筛选（客户端过滤）
  if (tag) {
    results = results.filter(e => e.tags && e.tags.includes(tag))
  }

  // 搜索（客户端过滤）
  if (search) {
    const kw = search.toLowerCase()
    results = results.filter(e =>
      e.title.toLowerCase().includes(kw) ||
      (e.plainExplanation && e.plainExplanation.toLowerCase().includes(kw)) ||
      (e.lawText && e.lawText.toLowerCase().includes(kw)) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(kw)))
    )
  }

  return results
}

// 获取单条
export async function getEntry(id) {
  return db.entries.get(id)
}

// 创建
export async function createEntry(data) {
  const now = new Date().toISOString()
  const entry = {
    ...data,
    id: Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8),
    createdAt: now,
    updatedAt: now,
    reviewCount: 0,
    isFavorite: false,
    tags: data.tags || [],
    relatedEntryIds: [],
  }
  await db.entries.put(entry)
  return entry
}

// 更新
export async function updateEntry(id, data) {
  const existing = await db.entries.get(id)
  if (!existing) throw new Error('条目不存在')
  const updated = {
    ...existing,
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  }
  await db.entries.put(updated)
  return updated
}

// 删除
export async function deleteEntry(id) {
  await db.entries.delete(id)
}

// 获取所有标签（去重统计）
export async function getAllTags() {
  const entries = await db.entries.toArray()
  const tagMap = {}
  entries.forEach(e => {
    if (e.tags) {
      e.tags.forEach(t => {
        tagMap[t] = (tagMap[t] || 0) + 1
      })
    }
  })
  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// 统计
export async function getStats() {
  const entries = await db.entries.toArray()
  return {
    total: entries.length,
    byCategory: CATEGORIES.reduce((acc, c) => {
      acc[c.key] = entries.filter(e => e.category === c.key).length
      return acc
    }, {}),
    byType: entries.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1
      return acc
    }, {}),
  }
}

// ===== AI 对话 CRUD =====

export async function getConversations() {
  return db.conversations.orderBy('createdAt').reverse().toArray()
}

export async function addMessage(conversationId, message) {
  const conv = await db.conversations.get(conversationId)
  if (!conv) {
    const now = new Date().toISOString()
    await db.conversations.put({
      id: conversationId,
      title: message.content.slice(0, 30),
      messages: [message],
      createdAt: now,
      updatedAt: now,
    })
  } else {
    conv.messages.push(message)
    conv.updatedAt = new Date().toISOString()
    await db.conversations.put(conv)
  }
}

// ===== 导出 =====
export async function exportAllData() {
  const entries = await db.entries.toArray()
  const conversations = await db.conversations.toArray()
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
    conversations,
  }
}

// ===== 导入 =====
export async function importData(jsonData) {
  if (jsonData.entries) {
    await db.entries.bulkPut(jsonData.entries)
  }
  if (jsonData.conversations) {
    await db.conversations.bulkPut(jsonData.conversations)
  }
}

export default db
