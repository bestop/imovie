'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

function Header({ searchQuery, onSearchChange }) {
  return (
    <header style={styles.header}>
      <Link href="/admin" style={styles.logo}>
        微剧场<span style={{ color: '#E50914' }}>.</span>
      </Link>
      <div style={styles.searchWrapper} className="header-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" style={styles.searchIcon}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="搜索剧集..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} style={styles.clearBtn}>×</button>
        )}
      </div>
    </header>
  )
}

function Hero({ drama }) {
  if (!drama) return null
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(drama.linkUrl).then(() => {
      alert('链接已复制，请至网盘打开')
    })
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/drama/${drama.id}`
    const shareData = { title: drama.title, text: drama.synopsis, url: shareUrl }
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(`${drama.title} - ${shareUrl}`)
      alert('分享链接已复制到剪贴板！')
    }
  }

  return (
    <section style={styles.hero}>
      <div style={{ ...styles.heroBg, backgroundImage: `url(${drama.poster})` }}></div>
      <div style={styles.heroOverlay}></div>
      <div style={styles.heroContent}>
        <span style={styles.heroTag}>{drama.badge || '精选推荐'}</span>
        <h1 style={styles.heroTitle}>{drama.title}</h1>
        <p style={styles.heroDesc}>{drama.synopsis}</p>
        <div style={styles.heroMeta}>
          <span><strong>{drama.episodes}</strong> 集</span>
          <span><strong>{drama.year}</strong> 年</span>
          <span><strong>{drama.genre}</strong></span>
        </div>
        <div style={styles.heroActions}>
          <button onClick={handleCopyLink} style={styles.heroCta}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            获取链接
          </button>
          <button onClick={handleShare} style={styles.heroShare}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            分享给好友
          </button>
        </div>
      </div>
    </section>
  )
}

function SectionHeader({ title, count }) {
  return (
    <div style={styles.sectionHeader}>
      <div style={styles.sectionTitleGroup}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <span style={styles.sectionCount}>{count} 部影剧</span>
      </div>
    </div>
  )
}

function DramaCard({ drama, index }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80)
    return () => clearTimeout(timer)
  }, [index])

  const handleCopyLink = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(drama.linkUrl)
      alert('链接已复制，请至网盘打开')
    } catch (err) {
      window.open(drama.linkUrl, '_blank')
    }
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/drama/${drama.id}`
    const shareData = { title: drama.title, text: drama.synopsis, url: shareUrl }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${drama.title} - ${shareUrl}`)
        alert('分享链接已复制到剪贴板！')
      }
    } catch (err) { /* cancelled */ }
  }

  const goToDetail = (e) => {
    if (!e.target.closest('button')) {
      window.location.href = `/drama/${drama.id}`
    }
  }

  return (
    <article onClick={goToDetail} style={{
      ...styles.dramaCard,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
    }}>
      <div style={styles.posterWrapper}>
        <img src={drama.poster} alt={drama.title} style={styles.posterImg} />
        {drama.badge && <span style={styles.badge}>{drama.badge}</span>}
        <span style={styles.quality}>{drama.quality}</span>
      </div>
      <div style={styles.cardBody}>
        <h3 style={styles.cardTitle}>{drama.title}</h3>
        <p style={styles.cardMeta}>{drama.genre} · {drama.year} · {drama.episodes}集</p>
        <p style={styles.cardSynopsis}>{drama.synopsis}</p>
        <div style={styles.cardActions}>
          <button onClick={handleCopyLink} style={styles.cardLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {drama.linkType}
          </button>
          <button onClick={handleShare} style={styles.shareBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <p>© 2024 微剧场 · 仅供学习交流</p>
      </div>
    </footer>
  )
}

export default function Home() {
  const [dramas, setDramas] = useState([])
  const [featured, setFeatured] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/dramas')
      .then(res => res.json())
      .then(data => {
        setDramas(data)
        setFeatured(data.find(d => d.featured) || data[0])
      })
  }, [])

  const filteredDramas = dramas.filter(drama =>
    drama.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drama.genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={styles.container}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero drama={featured} />
      <main style={styles.main}>
        <SectionHeader title="精彩影剧" count={filteredDramas.length} />
        {filteredDramas.length > 0 ? (
          <div className="drama-grid" style={styles.grid}>
            {filteredDramas.map((drama, index) => (
              <DramaCard key={drama.id} drama={drama} index={index} />
            ))}
          </div>
        ) : (
          <div style={styles.noResults}>
            <p>未找到匹配的剧集</p>
            <button onClick={() => setSearchQuery('')} style={styles.clearSearchBtn}>清除搜索</button>
          </div>
        )}
      </main>
      <Footer />
      <style>{`
        .drama-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1200px) {
          .drama-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .drama-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .drama-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a'
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '20px 40px',
    background: 'linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px'
  },
  searchWrapper: {
    flex: 1,
    maxWidth: '400px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 42px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0 6px'
  },
  logo: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap'
  },

  hero: {
    position: 'relative',
    height: '100vh',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.8) 100%)'
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '600px',
    padding: '0 40px'
  },
  heroTag: {
    display: 'inline-block',
    padding: '6px 14px',
    background: '#E50914',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '20px',
    borderRadius: '2px'
  },
  heroTitle: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    fontWeight: 700,
    lineHeight: 1.15,
    marginBottom: '20px',
    letterSpacing: '0.02em'
  },
  heroDesc: {
    fontSize: '1.05rem',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: '24px',
    lineHeight: 1.7
  },
  heroMeta: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.6)'
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'nowrap'
  },
  heroCta: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#E50914',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  heroShare: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '80px 40px'
  },
  sectionHeader: {
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  sectionTitleGroup: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px'
  },
  sectionTitle: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: '1.75rem',
    fontWeight: 600
  },
  sectionCount: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.4)'
  },
  grid: {
    // 响应式样式在 <style> 标签中定义
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 20px',
    color: 'rgba(255,255,255,0.5)'
  },
  clearSearchBtn: {
    marginTop: '16px',
    padding: '10px 24px',
    background: '#E50914',
    border: 'none',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '6px'
  },
  dramaCard: {
    background: '#141414',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },
  posterWrapper: {
    position: 'relative',
    aspectRatio: '16/9',
    overflow: 'hidden'
  },
  posterImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease'
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 8px',
    background: '#E50914',
    color: '#fff',
    fontSize: '0.6rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: '2px'
  },
  quality: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    padding: '3px 6px',
    background: 'rgba(0,0,0,0.75)',
    color: '#fff',
    fontSize: '0.6rem',
    fontWeight: 600,
    borderRadius: '2px'
  },
  cardBody: {
    padding: '20px'
  },
  cardTitle: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cardMeta: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '10px'
  },
  cardSynopsis: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  cardLink: {
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 14px',
    background: 'transparent',
    border: '1px solid rgba(229,9,20,0.6)',
    color: '#E50914',
    fontSize: '0.8rem',
    fontWeight: 500,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  shareBtn: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  footer: {
    padding: '60px 40px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    marginTop: '60px'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    textAlign: 'center'
  }
}
