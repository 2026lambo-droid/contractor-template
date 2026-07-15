import { useState } from 'react'
import { Plus, Edit2, Trash2, Package, ToggleLeft, ToggleRight } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_PRODUCTS, MOCK_VENDORS } from '../../utils/mockData'
import { MEAT_CATEGORIES, CUSTOMIZATION_OPTIONS } from '../../utils/constants'
import { formatPrice } from '../../utils/formatters'

export function VendorProducts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const vendorId = user?.vendorId || 'v1'

  const [products, setProducts] = useState(MOCK_PRODUCTS[vendorId] || [])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'carne-asada', description: '', pricePerLb: '', stockLbs: '', marinade: true, cut: true })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const resetForm = () => {
    setForm({ name: '', category: 'carne-asada', description: '', pricePerLb: '', stockLbs: '', marinade: true, cut: true })
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      pricePerLb: product.pricePerLb.toString(),
      stockLbs: product.stockLbs.toString(),
      marinade: product.options?.marinade ?? true,
      cut: product.options?.cut ?? true,
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.pricePerLb) { toast('Please fill in required fields', 'error'); return }
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p, name: form.name, category: form.category, description: form.description,
        pricePerLb: parseFloat(form.pricePerLb), stockLbs: parseInt(form.stockLbs),
        options: { marinade: form.marinade, cut: form.cut },
      } : p))
      toast('Product updated', 'success')
    } else {
      const newProduct = {
        id: `p-${Date.now()}`, vendorId,
        name: form.name, category: form.category, description: form.description,
        pricePerLb: parseFloat(form.pricePerLb), stockLbs: parseInt(form.stockLbs) || 20,
        image: 'https://carnitaselrincon.com/wp-content/uploads/2021/10/Img01.png',
        inStock: true, popular: false,
        options: { marinade: form.marinade, cut: form.cut },
      }
      setProducts(prev => [...prev, newProduct])
      toast('Product added!', 'success')
    }
    setShowForm(false)
    resetForm()
  }

  const toggleStock = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p))
  }

  const restockAll = () => {
    setProducts(prev => prev.map(p => ({ ...p, inStock: true, stockLbs: Math.max(p.stockLbs, 50) })))
    toast('All products restocked to 50 lbs minimum', 'success')
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast('Product removed', 'info')
  }

  const lowStockCount = products.filter(p => p.inStock && p.stockLbs < 10).length

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="My Products" actions={
        <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true) }} style={{ fontSize: 13 }}>
          <Plus size={14} /> Add
        </button>
      } />

      {lowStockCount > 0 && (
        <div style={{ margin: '8px 16px 0', padding: '10px 14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div style={{ flex: 1, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: 'var(--warning)' }}>{lowStockCount} product{lowStockCount > 1 ? 's' : ''} low on stock</span>
            <span style={{ color: 'var(--text-muted)' }}> — under 10 lbs remaining</span>
          </div>
          <button className="btn btn-sm" onClick={restockAll} style={{ fontSize: 11, padding: '6px 10px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: 'var(--warning)', fontWeight: 700, flexShrink: 0 }}>
            Restock All
          </button>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'flex', gap: 10, padding: '12px 16px 16px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Stock</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{products.filter(p => p.inStock).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value" style={{ color: 'var(--error)' }}>{products.filter(p => !p.inStock).length}</div>
        </div>
      </div>

      {/* Product list */}
      <div style={{ padding: '0 16px' }}>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Package size={56} color="var(--text-muted)" /></div>
            <div className="empty-title">No products yet</div>
            <div className="empty-desc">Add your first product to start selling</div>
            <button className="btn btn-primary mt-16" onClick={() => { resetForm(); setShowForm(true) }}>Add Product</button>
          </div>
        ) : products.map(product => (
          <div key={product.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 10, padding: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row-between" style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{product.name}</div>
                  <span className={`chip ${!product.inStock ? 'chip-error' : product.stockLbs < 10 ? 'chip-warning' : 'chip-success'}`} style={{ fontSize: 10, padding: '3px 8px' }}>
                    {!product.inStock ? 'Out of Stock' : product.stockLbs < 10 ? `⚠ ${product.stockLbs} lbs left` : 'In Stock'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span className="price">{formatPrice(product.pricePerLb)}/lb</span>
                  {' · '}<span style={{ color: product.stockLbs < 10 ? 'var(--warning)' : 'inherit' }}>{product.stockLbs} lbs available</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(product)} style={{ fontSize: 12, padding: '6px 10px', gap: 4 }}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => toggleStock(product.id)} style={{ fontSize: 12, padding: '6px 10px', gap: 4 }}>
                    {product.inStock ? <ToggleRight size={12} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={12} />}
                    {product.inStock ? 'Disable' : 'Enable'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)} style={{ fontSize: 12, padding: '6px 10px' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bottom-sheet-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="bottom-sheet">
            <div className="bottom-sheet-handle" />
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="field">
              <label className="label">Product Name *</label>
              <input className="input" placeholder="e.g. Carne Asada Premium" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Category</label>
              <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                {MEAT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea className="input" rows={2} placeholder="Describe your product..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label className="label">Price per lb *</label>
                <input className="input" type="number" step="0.01" min="1" placeholder="12.99" value={form.pricePerLb} onChange={e => set('pricePerLb', e.target.value)} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label className="label">Stock (lbs)</label>
                <input className="input" type="number" min="0" placeholder="50" value={form.stockLbs} onChange={e => set('stockLbs', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="label">Customization Options</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.marinade} onChange={e => set('marinade', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                  Marinade options
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.cut} onChange={e => set('cut', e.target.checked)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                  Cut style
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setShowForm(false); resetForm() }}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSave}>
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
