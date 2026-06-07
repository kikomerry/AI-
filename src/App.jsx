import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import EntryDetailPage from './pages/EntryDetailPage.jsx'
import EntryEditPage from './pages/EntryEditPage.jsx'
import { getEntries } from './db/index.js'
import { seedEntries } from './db/seed.js'
import { createEntry, getStats } from './db/index.js'

export default function App() {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({ total: 0, byCategory: {}, byType: {} })
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // 初始化：检查是否需要种子数据，加载条目
  useEffect(() => {
    async function init() {
      const all = await getEntries()
      if (all.length === 0) {
        for (const entry of seedEntries) {
          await createEntry(entry)
        }
        const fresh = await getEntries()
        setEntries(fresh)
      } else {
        setEntries(all)
      }
      const s = await getStats()
      setStats(s)
      setLoading(false)
    }
    init()
  }, [])

  async function refresh() {
    setLoading(true)
    const result = await getEntries({ category: currentCategory, search: searchQuery })
    setEntries(result)
    const s = await getStats()
    setStats(s)
    setLoading(false)
  }

  async function handleCategoryChange(cat) {
    const newCat = cat === currentCategory ? null : cat
    setCurrentCategory(newCat)
    setLoading(true)
    const result = await getEntries({ category: newCat, search: searchQuery })
    setEntries(result)
    setLoading(false)
  }

  async function handleSearch(q) {
    setSearchQuery(q)
    setLoading(true)
    const result = await getEntries({ category: currentCategory, search: q || undefined })
    setEntries(result)
    setLoading(false)
  }

  function handleEntryClick(id) {
    navigate('/entry/' + id)
  }

  function handleNew() {
    navigate('/entry/new')
  }

  return (
    <Layout
      currentCategory={currentCategory}
      onCategoryChange={handleCategoryChange}
      onSearch={handleSearch}
      onNew={handleNew}
      searchQuery={searchQuery}
      stats={stats}
    >
      <Routes>
        <Route path="/" element={
          <HomePage
            entries={entries}
            loading={loading}
            onEntryClick={handleEntryClick}
            onRefresh={refresh}
          />
        } />
        <Route path="/entry/new" element={<EntryEditPage />} />
        <Route path="/entry/:id/edit" element={<EntryEditPage />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
      </Routes>
    </Layout>
  )
}
