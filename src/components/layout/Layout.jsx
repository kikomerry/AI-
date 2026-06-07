import { useState } from 'react'

export default function Layout({ children, currentCategory, onCategoryChange, onSearch, onNew, searchQuery, stats }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-5 h-13 max-w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 trans"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-[15px] font-semibold tracking-tight text-gray-900">
              <span className="text-blue-600">律</span>思
            </h1>
            <span className="text-xs text-gray-400 hidden sm:inline font-normal">AI 法学知识库</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="搜索…"
                className="w-40 md:w-52 pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg
                           focus:outline-none focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-50 trans"
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <button
              onClick={onNew}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 trans font-medium shadow-sm shadow-blue-200/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              新建
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-full">
        {/* 左侧栏 */}
        {sidebarOpen && (
          <aside className="w-52 flex-shrink-0 border-r border-gray-100 bg-white min-h-[calc(100vh-52px)] p-4">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-3">知识库概览</div>
              <div className="text-2xl font-bold text-blue-600 tracking-tight">{stats.total}</div>
              <div className="text-xs text-gray-400 mt-0.5">条知识条目</div>
            </div>

            <div className="mb-3">
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-medium mb-3">学科分类</div>
              <nav className="space-y-0.5">
                {[
                  { key: 'civil_law', label: '民法', emoji: '📜' },
                  { key: 'criminal_law', label: '刑法', emoji: '⚖️' },
                  { key: 'admin_law', label: '行政法', emoji: '🏛️' },
                  { key: 'civil_procedure', label: '民诉法', emoji: '📋' },
                  { key: 'criminal_procedure', label: '刑诉法', emoji: '🔍' },
                  { key: 'commercial_economic', label: '商经法', emoji: '💼' },
                  { key: 'theory_law', label: '理论法', emoji: '📖' },
                  { key: 'international_law', label: '三国法', emoji: '🌏' },
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => onCategoryChange(cat.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] trans ${
                      currentCategory === cat.key
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 font-normal'
                    }`}
                  >
                    <span>{cat.emoji} {cat.label}</span>
                    {stats.byCategory && (
                      <span className={`text-[11px] ${currentCategory === cat.key ? 'text-blue-500' : 'text-gray-400'}`}>
                        {stats.byCategory[cat.key] || 0}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] trans mt-1 ${
                !currentCategory ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 font-normal'
              }`}
            >
              📚 全部知识
            </button>
          </aside>
        )}

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
