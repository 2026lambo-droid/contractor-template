import { useState } from 'react'
import { Store, Clock, MapPin, Phone, Image, Save, ToggleLeft, ToggleRight } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { MOCK_VENDORS } from '../../utils/mockData'
import { DELIVERY_ZONES, MEAT_CATEGORIES } from '../../utils/constants'

const HOURS_OPTIONS = [
  '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
]

export function VendorSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const vendor = MOCK_VENDORS.find(v => v.id === user?.vendorId) || MOCK_VENDORS[0]

  const [isOpen, setIsOpen] = useState(vendor?.isOpen ?? true)
  const [form, setForm] = useState({
    name: vendor?.name || '',
    description: vendor?.description || '',
    address: vendor?.address || '',
    phone: vendor?.phone || '',
    openTime: '7:00 AM',
    closeTime: '7:00 PM',
    minOrder: vendor?.minOrder || 2,
    deliveryZones: vendor?.deliveryZones || [],
    specialties: vendor?.specialties || [],
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleZone = (zone) => {
    set('deliveryZones', form.deliveryZones.includes(zone)
      ? form.deliveryZones.filter(z => z !== zone)
      : [...form.deliveryZones, zone]
    )
  }

  const toggleSpecialty = (label) => {
    set('specialties', form.specialties.includes(label)
      ? form.specialties.filter(s => s !== label)
      : [...form.specialties, label]
    )
  }

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast('Store settings saved!', 'success')
  }

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Store Settings" />

      {/* Store status */}
      <div style={{ margin: '16px 16px 0', padding: '16px', background: isOpen ? 'rgba(34,197,94,0.08)' : 'var(--bg-card)', borderRadius: 'var(--radius)', border: `1px solid ${isOpen ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Store Status</div>
          <div style={{ fontSize: 13, color: isOpen ? 'var(--success)' : 'var(--text-muted)' }}>
            {isOpen ? '🟢 Open — Accepting orders' : '🔴 Closed — Not accepting orders'}
          </div>
        </div>
        <button onClick={() => { setIsOpen(!isOpen); toast(isOpen ? 'Store closed' : 'Store is now open!', isOpen ? 'info' : 'success') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isOpen ? 'var(--success)' : 'var(--text-muted)' }}>
          {isOpen ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
        </button>
      </div>

      {/* Basic info */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Store size={16} color="var(--primary)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Business Info</h3>
        </div>
        <div className="field">
          <label className="label">Business Name</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="La Carnicería El Rancho" />
        </div>
        <div className="field">
          <label className="label">Description</label>
          <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'none', lineHeight: 1.5 }} placeholder="Tell customers about your business..." />
        </div>
        <div className="field">
          <label className="label">Address</label>
          <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="1420 Story Rd, San Jose, CA 95122" />
        </div>
        <div className="field">
          <label className="label">Phone Number</label>
          <input className="input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(408) 555-0192" />
        </div>
      </div>

      {/* Hours */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Clock size={16} color="var(--primary)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Operating Hours</h3>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Opens</label>
            <select className="select" value={form.openTime} onChange={e => set('openTime', e.target.value)}>
              {HOURS_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Closes</label>
            <select className="select" value={form.closeTime} onChange={e => set('closeTime', e.target.value)}>
              {HOURS_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label className="label">Min. Order (lbs)</label>
          <input className="input" type="number" min={1} max={10} value={form.minOrder} onChange={e => set('minOrder', parseInt(e.target.value))} style={{ maxWidth: 120 }} />
        </div>
      </div>

      {/* Delivery zones */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MapPin size={16} color="var(--primary)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Delivery Zones</h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Select cities/areas you can deliver to:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {DELIVERY_ZONES.map(zone => (
            <button key={zone.id} onClick={() => toggleZone(zone.city)} className={`chip ${form.deliveryZones.includes(zone.city) ? 'chip-primary' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none' }}>
              {zone.city}
            </button>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div style={{ padding: '0 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Specialties</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>What meats do you specialize in?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {MEAT_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => toggleSpecialty(cat.label)} className={`chip ${form.specialties.includes(cat.label) ? 'chip-primary' : 'chip-muted'}`} style={{ cursor: 'pointer', border: 'none' }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payout info */}
      <div style={{ margin: '0 16px 20px', padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Payout Settings</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Earnings are deposited weekly via Stripe Connect</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '12px', background: 'var(--bg-surface)', borderRadius: 10 }}>
          <span style={{ fontSize: 24 }}>🏦</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Bank of America ••••6789</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Default payout account</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm mt-8" style={{ fontSize: 12 }}>Update Payout Account</button>
      </div>

      {/* Save */}
      <div style={{ padding: '0 16px 8px' }}>
        <button className="btn btn-gradient btn-full btn-lg" onClick={save} disabled={saving}>
          {saving ? <><span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Saving...</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  )
}
