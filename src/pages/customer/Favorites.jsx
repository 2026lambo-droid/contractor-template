import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { VendorCard } from '../../components/customer/VendorCard'
import { useFavorites } from '../../contexts/FavoritesContext'
import { MOCK_VENDORS } from '../../utils/mockData'

export function Favorites() {
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const favVendors = MOCK_VENDORS.filter(v => favorites.includes(v.id))

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Favorites" />

      {favVendors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Heart size={52} color="var(--text-muted)" /></div>
          <div className="empty-title">No favorites yet</div>
          <div className="empty-desc">Tap the heart icon on any vendor to save them here</div>
          <button className="btn btn-primary mt-16" onClick={() => navigate('/vendors')}>Explore Vendors</button>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            {favVendors.length} saved {favVendors.length === 1 ? 'vendor' : 'vendors'}
          </p>
          {favVendors.map(v => <VendorCard key={v.id} vendor={v} />)}
        </div>
      )}
    </div>
  )
}
