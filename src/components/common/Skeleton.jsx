export function Skeleton({ width = '100%', height = 16, radius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'var(--bg-surface)',
      backgroundImage: 'linear-gradient(90deg, var(--bg-surface) 0%, var(--bg-card) 50%, var(--bg-surface) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      flexShrink: 0,
      ...style,
    }} />
  )
}

export function VendorCardSkeleton() {
  return (
    <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
      <Skeleton height={160} radius={0} />
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="55%" height={16} />
          <Skeleton width={50} height={14} />
        </div>
        <Skeleton width="80%" height={12} />
        <Skeleton width="65%" height={12} />
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <Skeleton width={60} height={22} radius={100} />
          <Skeleton width={70} height={22} radius={100} />
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <Skeleton width={80} height={80} radius={10} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton width="70%" height={15} />
        <Skeleton width="90%" height={12} />
        <Skeleton width="50%" height={12} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <Skeleton width={50} height={18} />
          <Skeleton width={60} height={30} radius={8} />
        </div>
      </div>
    </div>
  )
}

export function OrderCardSkeleton() {
  return (
    <div className="card" style={{ marginBottom: 12, padding: '14px 14px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width={40} height={12} />
          <Skeleton width={140} height={16} />
        </div>
        <Skeleton width={16} height={16} />
      </div>
      <Skeleton width="80%" height={12} style={{ marginBottom: 10 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width={80} height={22} radius={100} />
        <Skeleton width={60} height={20} />
      </div>
    </div>
  )
}
