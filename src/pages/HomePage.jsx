import EntryCard from '../components/entry/EntryCard.jsx'

export default function HomePage({ entries, loading, onEntryClick }) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">知识条目</h2>
        <p className="text-[13px] text-gray-400 mt-1 font-normal">
          {loading ? '加载中…' : `共 ${entries.length} 条 · 按更新时间排序`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg p-5 animate-pulse">
              <div className="flex gap-2 mb-3"><div className="h-[18px] w-14 bg-gray-100 rounded-full"/><div className="h-[18px] w-14 bg-gray-100 rounded-full"/></div>
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2"/>
              <div className="h-4 bg-gray-50 rounded w-full mb-1"/>
              <div className="h-4 bg-gray-50 rounded w-2/3"/>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">还没有知识条目</h3>
          <p className="text-sm text-gray-400 mb-5">点击右上角「新建」按钮，开始构建你的法学知识库</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {entries.map(entry => (
            <EntryCard key={entry.id} entry={entry} onClick={onEntryClick} />
          ))}
        </div>
      )}
    </div>
  )
}
