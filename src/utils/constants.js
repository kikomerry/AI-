// 生成唯一 ID
export function uid() {
  return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
}

// 学科分类常量
export const CATEGORIES = [
  { key: 'civil_law', label: '民法', emoji: '📜' },
  { key: 'criminal_law', label: '刑法', emoji: '⚖️' },
  { key: 'admin_law', label: '行政法', emoji: '🏛️' },
  { key: 'civil_procedure', label: '民诉法', emoji: '📋' },
  { key: 'criminal_procedure', label: '刑诉法', emoji: '🔍' },
  { key: 'commercial_economic', label: '商经法', emoji: '💼' },
  { key: 'theory_law', label: '理论法', emoji: '📖' },
  { key: 'international_law', label: '三国法', emoji: '🌏' },
  { key: 'other', label: '其他', emoji: '📌' },
]

// 条目类型
export const ENTRY_TYPES = [
  { key: 'law_article', label: '法条解释' },
  { key: 'legal_concept', label: '法律概念' },
  { key: 'case_analysis', label: '案例分析' },
  { key: 'exam_point', label: '考点总结' },
  { key: 'comparison', label: '对比辨析' },
  { key: 'free_note', label: '自由笔记' },
]

// 获取分类标签
export function getCategory(key) {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[8]
}

// 格式化日期
export function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  return d.toLocaleDateString('zh-CN')
}

// 截取摘要
export function excerpt(text, maxLen = 100) {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}
