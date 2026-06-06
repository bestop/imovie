'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function DramaDetail({ drama: initialDrama }) {
  const params = useParams()
  const [drama, setDrama] = useState(initialDrama)
  const [loading, setLoading] = useState(!initialDrama)

  useEffect(() => {
    if (!initialDrama && params.id) {
      fetch(`/api/dramas`)
        .then(res => res.json())
        .then(data => {
          const found = data.find(d => d.id === parseInt(params.id))
          setDrama(found)
          setLoading(false)
        })
    }
  }, [params.id, initialDrama])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(drama?.linkUrl || '')
      alert('链接已复制，请至网盘打开')
    } catch (err) {
      window.open(drama?.linkUrl, '_blank')
    }
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/drama/${drama?.id}`
    const shareData = {
      title: drama?.title || '',
      text: drama?.synopsis || '',
      url: shareUrl
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${drama?.title} - ${shareUrl}`)
        alert('分享链接已复制到剪贴板！')
      }
    } catch (err) { /* cancelled */ }
  }

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loading}>加载中...</div>
    </div>
  )

  if (!drama) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loading}>未找到此影剧</div>
      <Link href="/" style={styles.backBtn}>返回首页</Link>
    </div>
  )

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link href="/" style={styles.backLink}>← 返回首页</Link>
        <h1 style={styles.logo}>微剧场<span style={{ color: '#E50914' }}>.</span></h1>
        <div style={{ width: '80px' }}></div>
      </header>

      <div style={styles.hero}>
        <div style={{ ...styles.heroBg, backgroundImage: `url(${drama.poster})` }}></div>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          {drama.badge && <span style={styles.heroTag}>{drama.badge}</span>}
          <h1 style={styles.heroTitle}>{drama.title}</h1>
          <div style={styles.heroMeta}>
            <span><strong>{drama.episodes}</strong> 集</span>
            <span><strong>{drama.year}</strong> 年</span>
            <span><strong>{drama.genre}</strong></span>
            <span><strong>{drama.quality}</strong></span>
          </div>
          <p style={styles.heroDesc}>{drama.synopsis}</p>
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
      </div>

      <div style={styles.infoSection}>
        <div style={styles.infoCard}>
          <h2 style={styles.infoTitle}>资源信息</h2>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>网盘类型</span>
            <span style={styles.infoValue}>{drama.linkType}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>清晰度</span>
            <span style={styles.infoValue}>{drama.quality}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>更新状态</span>
            <span style={styles.infoValue}>{drama.episodes} 集全</span>
          </div>
          <button onClick={handleCopyLink} style={styles.copyBtn}>
            复制网盘链接
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© 2024 微剧场 · 仅供学习交流</p>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#fff'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    color: '#fff'
  },
  loading: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.6)'
  },
  backBtn: {
    marginTop: '20px',
    padding: '10px 24px',
    background: '#E50914',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px'
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '16px 24px',
    background: 'linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s ease'
  },
  logo: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em'
  },
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: '80px',
    paddingBottom: '60px'
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    transform: 'scale(1.1)'
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.4) 100%)'
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '700px',
    padding: '0 24px',
    textAlign: 'center'
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
    marginBottom: '16px',
    borderRadius: '2px'
  },
  heroTitle: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: '16px'
  },
  heroMeta: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.6)'
  },
  heroDesc: {
    fontSize: '1.05rem',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.7,
    marginBottom: '32px'
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'nowrap'
  },
  heroCta: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    background: '#E50914',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  heroShare: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  infoSection: {
    padding: '40px 24px 80px'
  },
  infoCard: {
    maxWidth: '600px',
    margin: '0 auto',
    background: '#141414',
    borderRadius: '12px',
    padding: '28px'
  },
  infoTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '24px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.95rem'
  },
  infoValue: {
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 500
  },
  copyBtn: {
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    background: '#E50914',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  footer: {
    padding: '40px 24px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  }
}