import { TrendingUp } from 'lucide-react'

export function StatsCard({ label, value, sub, icon: Icon, color = 'var(--primary)' }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="stat-label">{label}</span>
        {Icon && <Icon size={16} style={{ color }} />}
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
