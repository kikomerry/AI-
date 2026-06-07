import { getCategory, formatDate, excerpt } from '../../utils/constants.js'

export default function EntryCard({ entry, onClick }) {
  const cat = getCategory(entry.category)
  const typeMap = {
    law_article: '法条', legal_concept: '概念', case_analysis: '案例',
    exam_point: '考点', comparison: '对比', free_note: '笔记',
  }

  return (
    <article
      onClick={() => onClick(entry.id)}
      className="bg-white border border-gray-100 rounded-lg p-5 cursor-pointer
                 hover:border-blue-100 hover:shadow-sm card-hover group"
    >
      {/* 顶部标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-normal">
          {cat.emoji} {cat.label}
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-normal">
          {typeMap[entry.type] || entry.type}
        </span>
        {entry.isFavorite && <span className="text-xs">⭐</span>}
      </div>

      {/* 标题 */}
      <h3 className="text-[15px] font-semibold text-gray-900 mb-2 group-hover:text-blue-600 trans leading-snug tracking-tight line-clamp-2">
        {entry.title}
      </h3>

      {/* 摘要 */}
      <p className="text-[13px] text-gray-500 leading-relaxed mb-3 line-clamp-2 font-normal">
        {entry.plainExplanation || excerpt(entry.lawText, 120) || '暂无摘要'}
      </p>

      {/* 底部标签 */}
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span className="font-normal">{formatDate(entry.updatedAt)}</span>
        <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
          {entry.tags && entry.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-50 rounded text-gray-400 font-normal">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}
