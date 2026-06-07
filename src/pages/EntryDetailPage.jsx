import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEntry, deleteEntry, updateEntry } from '../db/index.js'
import { getCategory, formatDate } from '../utils/constants.js'

export default function EntryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const e = await getEntry(id)
      if (e) {
        setEntry(e)
        // 增加复习次数
        await updateEntry(id, { reviewCount: (e.reviewCount || 0) + 1, lastReviewAt: new Date().toISOString() })
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleDelete() {
    if (window.confirm('确定删除这条知识条目？')) {
      await deleteEntry(id)
      navigate('/')
    }
  }

  async function handleFavorite() {
    const updated = await updateEntry(id, { isFavorite: !entry.isFavorite })
    setEntry(updated)
  }

  async function handleUnderstanding(level) {
    const updated = await updateEntry(id, { understanding: level })
    setEntry(updated)
  }

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-50 rounded w-full" />
          <div className="h-4 bg-gray-50 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-medium text-gray-700 mb-2">条目不存在</h2>
        <p className="text-sm text-gray-500 mb-4">可能已被删除或链接失效</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">返回首页</button>
      </div>
    )
  }

  const cat = getCategory(entry.category)
  const typeMap = {
    law_article: '法条解释', legal_concept: '法律概念', case_analysis: '案例分析',
    exam_point: '考点总结', comparison: '对比辨析', free_note: '自由笔记',
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 trans">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{cat.emoji} {cat.label}</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{typeMap[entry.type]}</span>
        {entry.isFavorite && <span className="text-sm">⭐</span>}
      </div>

      {/* 标题 */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">{entry.title}</h1>

      {/* 操作栏 */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
        <button onClick={handleFavorite} className={`px-3 py-1.5 rounded-md text-sm border trans ${entry.isFavorite ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          {entry.isFavorite ? '⭐ 已收藏' : '☆ 收藏'}
        </button>
        <div className="flex items-center gap-1 ml-3">
          <span className="text-xs text-gray-400 mr-1">理解度</span>
          {[1,2,3,4,5].map(l => (
            <button key={l} onClick={() => handleUnderstanding(l)} className={`w-5 h-5 rounded-full text-xs trans ${entry.understanding >= l ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{l}</button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={() => navigate('/entry/' + id + '/edit')} className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 trans">编辑</button>
        <button onClick={handleDelete} className="px-3 py-1.5 border border-red-200 rounded-md text-sm text-red-500 hover:bg-red-50 trans">删除</button>
      </div>

      {/* ⑩ 结构内容 */}
      <div className="space-y-6">
        {/* ① 法条原文 */}
        {entry.lawText && (
          <Section icon="📜" title="法条原文" color="border-l-blue-400">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono bg-gray-50 p-4 rounded-md">{entry.lawText}</p>
          </Section>
        )}

        {/* ② 白话解释 */}
        {entry.plainExplanation && (
          <Section icon="💬" title="白话解释" color="border-l-green-400">
            <p className="text-sm text-gray-700 leading-relaxed">{entry.plainExplanation}</p>
          </Section>
        )}

        {/* ③ 法考考点 */}
        {entry.examPoints && entry.examPoints.length > 0 && (
          <Section icon="🎯" title="法考考点" color="border-l-yellow-400">
            <ul className="space-y-2">
              {entry.examPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-yellow-500 mt-0.5">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ④ 典型案例 */}
        {entry.typicalCases && entry.typicalCases.length > 0 && (
          <Section icon="📋" title="典型案例" color="border-l-purple-400">
            <div className="space-y-5">
              {entry.typicalCases.map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-md p-4">
                  <h4 className="font-medium text-sm text-gray-800 mb-2">案例{i + 1}：{c.name}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-medium text-gray-700">案情：</span>{c.facts}</div>
                    <div><span className="font-medium text-gray-700">争议焦点：</span>{c.issue}</div>
                    <div><span className="font-medium text-gray-700">裁判要旨：</span>{c.holding}</div>
                    <div><span className="font-medium text-gray-700">关联知识点：</span>{c.relevance}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ⑤ 争议焦点 */}
        {entry.disputePoints && entry.disputePoints.length > 0 && (
          <Section icon="⚡" title="争议焦点" color="border-l-orange-400">
            <ul className="space-y-2">
              {entry.disputePoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-orange-500 mt-0.5">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ⑥ 裁判思路 */}
        {entry.judgmentLogic && (
          <Section icon="🧭" title="裁判思路" color="border-l-teal-400">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{entry.judgmentLogic}</p>
          </Section>
        )}

        {/* ⑦ 易错点 */}
        {entry.commonMistakes && entry.commonMistakes.length > 0 && (
          <Section icon="⚠️" title="易错点" color="border-l-red-400">
            <ul className="space-y-2">
              {entry.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">{m}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* ⑧ 真题关联 */}
        {entry.relatedExamQuestions && entry.relatedExamQuestions.length > 0 && (
          <Section icon="📝" title="真题关联" color="border-l-indigo-400">
            <ul className="space-y-2">
              {entry.relatedExamQuestions.map((q, i) => (
                <li key={i} className="text-sm text-gray-700">📎 {q}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* ⑨ 记忆方法 */}
        {entry.memoryMethod && (
          <Section icon="🧠" title="记忆方法" color="border-l-pink-400">
            <p className="text-sm text-gray-700 leading-relaxed">{entry.memoryMethod}</p>
          </Section>
        )}

        {/* ⑩ 个人笔记 */}
        {entry.personalNotes && (
          <Section icon="✏️" title="个人笔记" color="border-l-gray-400">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{entry.personalNotes}</p>
          </Section>
        )}

        {/* 标签 */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">标签：</span>
            {entry.tags.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="mt-10 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
        <div>创建：{formatDate(entry.createdAt)} · 更新：{formatDate(entry.updatedAt)}</div>
        <div>复习次数：{entry.reviewCount} · 来源：{entry.source || '手动'}</div>
      </div>
    </div>
  )
}

// 段落组件
function Section({ icon, title, color, children }) {
  return (
    <div className={`border-l-2 ${color} pl-4 py-1`}>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">{icon} {title}</h3>
      {children}
    </div>
  )
}
