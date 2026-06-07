'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ADMIN_PASSWORD = '20262026'

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h1 style={styles.loginTitle}>管理后台</h1>
        <p style={styles.loginSubtitle}>请输入访问密码</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="输入密码..."
            style={{
              ...styles.loginInput,
              borderColor: error ? '#E50914' : 'rgba(255,255,255,0.1)'
            }}
            autoFocus
          />
          {error && <p style={styles.loginError}>密码错误，请重试</p>}
          <button type="submit" style={styles.loginBtn}>验证</button>
        </form>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .login-box { padding: 32px 24px !important; }
          .login-title { font-size: 1.3rem !important; }
        }
        @media (max-width: 768px) {
          .admin-header { padding: 12px 16px !important; flex-wrap: wrap; gap: 10px; }
          .admin-title { font-size: 1rem !important; }
          .admin-back { font-size: 0.85rem !important; }
          .admin-logout { padding: 8px 14px !important; font-size: 0.85rem !important; }
        }
        @media (max-width: 768px) {
          .admin-main { padding: 20px 16px !important; }
          .admin-toolbar { flex-direction: column; gap: 16px; }
          .add-btn { width: 100%; padding: 14px !important; }
        }
        @media (min-width: 769px) {
          .list-item { flex-direction: row !important; align-items: center !important; }
          .item-top { width: auto !important; flex: 1 !important; }
          .item-tags { width: auto !important; }
          .item-actions { width: auto !important; }
        }
        @media (max-width: 768px) {
          .list-item { padding: 14px !important; border-radius: 12px !important; }
          .item-poster { width: 100px !important; height: 56px !important; }
          .item-title { font-size: 1rem !important; }
          .item-meta { font-size: 0.85rem !important; }
          .edit-btn, .delete-btn { flex: 1; min-width: 80px; padding: 12px !important; font-size: 0.9rem !important; border-radius: 8px !important; }
        }
        @media (max-width: 480px) {
          .admin-form { padding: 20px !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .form-title { font-size: 1.1rem !important; }
          .form-actions { flex-direction: column-reverse; }
          .cancel-btn, .submit-btn { width: 100%; padding: 14px !important; }
        }
      `}</style>
    </div>
  )
}

function AdminHeader({ onLogout }) {
  return (
    <header style={styles.header} className="admin-header">
      <Link href="/" style={styles.backLink} className="admin-back">← 返回</Link>
      <h1 style={styles.title} className="admin-title">管理后台</h1>
      <button onClick={onLogout} style={styles.logoutBtn} className="admin-logout">退出</button>
    </header>
  )
}

function DramaForm({ drama, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    drama || {
      title: '',
      synopsis: '',
      poster: '',
      episodes: 12,
      year: 2024,
      genre: '',
      linkUrl: '',
      linkType: '夸克网盘',
      quality: 'HD',
      featured: false,
      badge: ''
    }
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <div style={styles.formOverlay} onClick={onCancel}>
      <div style={styles.form} className="admin-form" onClick={e => e.stopPropagation()}>
        <h2 style={styles.formTitle} className="form-title">{drama ? '编辑剧集' : '添加新剧集'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>剧名 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>简介 *</label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              required
              rows={3}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>海报图片链接 *</label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="https://..."
            />
          </div>

          <div style={styles.formRow} className="form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>集数</label>
              <input
                type="number"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                min="1"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>年份</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2030"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formRow} className="form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>类型</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                style={styles.input}
                placeholder="如：都市情感"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>标签</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                style={styles.input}
                placeholder="如：独家、热播"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>资源链接 *</label>
            <input
              type="url"
              name="linkUrl"
              value={formData.linkUrl}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="https://pan.quark.cn/..."
            />
          </div>

          <div style={styles.formRow} className="form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>网盘类型</label>
              <select
                name="linkType"
                value={formData.linkType}
                onChange={handleChange}
                style={styles.select}
              >
                <option>夸克网盘</option>
                <option>百度网盘</option>
                <option>阿里云盘</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>画质</label>
              <select
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                style={styles.select}
              >
                <option>HD</option>
                <option>1080P</option>
                <option>4K</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              设为首页推荐
            </label>
          </div>

          <div style={styles.formActions} className="form-actions">
            <button type="button" onClick={onCancel} style={styles.cancelBtn} className="cancel-btn">
              取消
            </button>
            <button type="submit" style={styles.submitBtn} className="submit-btn">
              {drama ? '保存修改' : '添加剧集'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DramaListItem({ drama, onEdit, onDelete }) {
  return (
    <div style={styles.listItem} className="list-item">
      <div style={styles.itemTop}>
        <img src={drama.poster} alt={drama.title} style={styles.itemPoster} className="item-poster" />
        <div style={styles.itemInfo} className="item-info">
          <h3 style={styles.itemTitle} className="item-title">{drama.title}</h3>
          <p style={styles.itemMeta} className="item-meta">{drama.genre} · {drama.year} · {drama.episodes}集</p>
          <p style={styles.itemLink}>{drama.linkType} · {drama.quality}</p>
        </div>
      </div>
      <div style={styles.itemTags} className="item-tags">
        {drama.featured && <span style={styles.featuredTag}>推荐</span>}
        {drama.badge && <span style={styles.badgeTag}>{drama.badge}</span>}
      </div>
      <div style={styles.itemActions} className="item-actions">
        <button onClick={() => onEdit(drama)} style={styles.editBtn} className="edit-btn">编辑</button>
        <button onClick={() => onDelete(drama.id)} style={styles.deleteBtn} className="delete-btn">删除</button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dramas, setDramas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDrama, setEditingDrama] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem('adminLoggedIn')
    if (saved === 'true') setIsLoggedIn(true)
  }, [])

  const loadDramas = async () => {
    const res = await fetch('/api/dramas')
    const data = await res.json()
    setDramas(data)
    setLoading(false)
  }

  useEffect(() => {
    if (isLoggedIn) loadDramas()
  }, [isLoggedIn])

  const handleLogin = () => {
    setIsLoggedIn(true)
    sessionStorage.setItem('adminLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    sessionStorage.removeItem('adminLoggedIn')
  }

  const handleAdd = () => {
    setEditingDrama(null)
    setShowForm(true)
  }

  const handleEdit = (drama) => {
    setEditingDrama(drama)
    setShowForm(true)
  }

  const handleSave = async (data) => {
    if (editingDrama) {
      await fetch(`/api/dramas/${editingDrama.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    } else {
      await fetch('/api/dramas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }
    setShowForm(false)
    setEditingDrama(null)
    loadDramas()
  }

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个剧集吗？')) {
      await fetch(`/api/dramas/${id}`, {
        method: 'DELETE'
      })
      loadDramas()
    }
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div style={styles.container}>
      <AdminHeader onLogout={handleLogout} />
      <main style={styles.main} className="admin-main">
        <div style={styles.toolbar} className="admin-toolbar">
          <div>
            <h2 style={styles.sectionTitle}>剧集管理</h2>
            <p style={styles.sectionDesc}>共 {dramas.length} 部影剧</p>
          </div>
          <button onClick={handleAdd} style={styles.addBtn} className="add-btn">
            + 添加新剧集
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>加载中...</p>
        ) : (
          <div style={styles.list}>
            {dramas.map(drama => (
              <DramaListItem
                key={drama.id}
                drama={drama}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {dramas.length === 0 && (
              <p style={styles.empty}>暂无剧集，点击上方按钮添加</p>
            )}
          </div>
        )}
      </main>

      {showForm && (
        <DramaForm
          drama={editingDrama}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingDrama(null)
          }}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a'
  },
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0a',
    padding: '20px'
  },
  loginBox: {
    width: '100%',
    maxWidth: '360px',
    background: '#141414',
    padding: '48px 40px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  loginTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '8px'
  },
  loginSubtitle: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '32px'
  },
  loginInput: {
    width: '100%',
    padding: '14px 16px',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '1rem',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  loginError: {
    color: '#E50914',
    fontSize: '0.875rem',
    marginTop: '12px'
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    background: '#E50914',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px'
  },
  header: {
    background: '#141414',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.08)'
  },
  backLink: {
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.3s ease'
  },
  title: {
    fontFamily: '"Noto Serif SC", serif',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fff'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '4px'
  },
  sectionDesc: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.4)'
  },
  addBtn: {
    padding: '12px 24px',
    background: '#E50914',
    color: '#fff',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '6px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  listItem: {
    background: '#141414',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderRadius: '12px'
  },
  itemTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%'
  },
  itemPoster: {
    width: '100px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    flexShrink: 0
  },
  itemInfo: {
    flex: 1,
    minWidth: 0
  },
  itemTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  itemMeta: {
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '4px'
  },
  itemLink: {
    fontSize: '0.75rem',
    color: '#E50914'
  },
  itemTags: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%'
  },
  featuredTag: {
    padding: '4px 8px',
    background: '#FFD700',
    color: '#0a0a0a',
    fontSize: '0.7rem',
    fontWeight: 600,
    borderRadius: '2px'
  },
  badgeTag: {
    padding: '4px 8px',
    background: 'rgba(229,9,20,0.8)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 600,
    borderRadius: '2px'
  },
  editBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '0.8rem',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  deleteBtn: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(229,9,20,0.5)',
    color: '#E50914',
    fontSize: '0.8rem',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  loading: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    padding: '60px'
  },
  empty: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    padding: '60px'
  },
  formOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  form: {
    background: '#141414',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '32px',
    borderRadius: '12px'
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '18px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '0.95rem',
    borderRadius: '6px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '0.95rem',
    borderRadius: '6px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '12px',
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '0.95rem',
    borderRadius: '6px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '28px'
  },
  cancelBtn: {
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: '0.95rem',
    cursor: 'pointer',
    borderRadius: '6px'
  },
  submitBtn: {
    padding: '12px 24px',
    background: '#E50914',
    border: 'none',
    color: '#fff',
    fontSize: '0.95rem',
    cursor: 'pointer',
    borderRadius: '6px'
  }
}
