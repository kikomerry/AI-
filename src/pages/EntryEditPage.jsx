import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEntry, createEntry, updateEntry } from '../db/index.js'
import { CATEGORIES, ENTRY_TYPES } from '../utils/constants.js'

export default function EntryEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [form, setForm] = useState({
    title: '',
    type: 'law_article',
    category: 'civil_law',
    tags: '',
    lawText: '',
    plainExplanation: '',
    examPoints: '',
    disputePoints: '',
    judgmentLogic: '',
    commonMistakes: '',
    memoryMethod: '',
    personalNotes: '',
    source: '手动',
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)

  useEffect(() => {
    if (!isNew) {
      async function load() {
        const e = await getEntry(id)
        if (e) {
          setForm({
            title: e.title || '',
            type: e.type || 'law_article',
            category: e.category || 'civil_law',
            tags: (e.tags || []).join(', '),
            lawText: e.lawText || '',
            plainExplanation: e.plainExplanation || '',
            examPoints: (e.examPoints || []).join('\n'),
            disputePoints: (e.disputePoints || []).join('\n'),
            judgmentLogic: e.judgmentLogic || '',
            commonMistakes: (e.commonMistakes || []).join('\n'),
            memoryMethod: e.memoryMethod || '',
            personalNotes: e.personalNotes || '',
            source: e.source || '手动',
          })
        }
        setLoading(false)
      }
      load()
    }
  }, [id])

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return alert('请输入标题')
    setSaving(true)

    const data = {
      title: form.title.trim(),
      type: form.type,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      lawText: form.lawText.trim(),
      plainExplanation: form.plainExplanation.trim(),
      examPoints: form.examPoints.trim().split('\n').filter(Boolean),
      disputePoints: form.disputePoints.trim().split('\n').filter(Boolean),
      judgmentLogic: form.judgmentLogic.trim(),
      commonMistakes: form.commonMistakes.trim().split('\n').filter(Boolean),
      memoryMethod: form.memoryMethod.trim(),
      personalNotes: form.personalNotes.trim(),
      source: form.source,
    }

    try {
      if (isNew) {
        const entry = await createEntry(data)
        navigate('/entry/' + entry.id)
      } else {
        await updateEntry(id, data)
        navigate('/entry/' + id)
      }
    } catch (err) {
      alert('保存失败：' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-10 bg-gray-50 rounded w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto p-6 md:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 trans">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">{isNew ? '新建知识条目' : '编辑知识条目'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 基本信息 - 左栏 */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">基本信息</h3>

          <div>
            <label className="block text-xs text-gray-500 mb-1">标题 *</label>
            <input type="text" value={form.title} onChange={e => setField('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-300"
              placeholder="如：善意取得制度（《民法典》第311条）" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">学科分类</label>
              <select value={form.category} onChange={e => setField('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-300">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">条目类型</label>
              <select value={form.type} onChange={e => setField('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-300">
                {ENTRY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">标签（逗号分隔）</label>
            <input type="text" value={form.tags} onChange={e => setField('tags', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-300"
              placeholder="如：物权, 民法, 重点, 善意取得" />
          </div>
        </div>

        {/* 知识内容 - 右栏 */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">知识内容</h3>

          <FieldGroup num="①" label="法条原文" value={form.lawText} onChange={v => setField('lawText', v)} rows={4} placeholder="粘贴法条原文…" />
          <FieldGroup num="②" label="白话解释" value={form.plainExplanation} onChange={v => setField('plainExplanation', v)} rows={3} placeholder="用自己的话解释…" />
          <FieldGroup num="③" label="法考考点（每行一个）" value={form.examPoints} onChange={v => setField('examPoints', v)} rows={4} placeholder="每行一个考点…" />
          <FieldGroup num="⑤" label="争议焦点（每行一个）" value={form.disputePoints} onChange={v => setField('disputePoints', v)} rows={3} placeholder="每行一个争议点…" />
          <FieldGroup num="⑥" label="裁判思路" value={form.judgmentLogic} onChange={v => setField('judgmentLogic', v)} rows={3} placeholder="裁判/分析思路…" />
          <FieldGroup num="⑦" label="易错点（每行一个）" value={form.commonMistakes} onChange={v => setField('commonMistakes', v)} rows={3} placeholder="每行一个易错点…" />
          <FieldGroup num="⑨" label="记忆方法" value={form.memoryMethod} onChange={v => setField('memoryMethod', v)} rows={2} placeholder="口诀、联想记忆…" />
          <FieldGroup num="⑩" label="个人笔记" value={form.personalNotes} onChange={v => setField('personalNotes', v)} rows={4} placeholder="自由记录…" />
        </div>

        {/* 提交 */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 trans">
            {saving ? '保存中…' : isNew ? '创建条目' : '保存修改'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-50 trans">取消</button>
        </div>
      </form>
    </div>
  )
}

function FieldGroup({ num, label, value, onChange, rows, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{num} {label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows || 3}
        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-300 resize-y"
        placeholder={placeholder || ''} />
    </div>
  )
}
