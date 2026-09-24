import { useState, useEffect } from 'react'
import axios from 'axios'

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

export default function SellersDirectory({ setView, setSelectedSeller }) {
  const [sellers, setSellers] = useState([])

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      const res = await axios.get('/api/sellers')
      setSellers(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-6 border-b border-stone-200 pb-4">Verified Sellers</h2>
      
      {sellers.length === 0 ? (
        <p className="text-gray-500">No sellers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map(seller => {
            const rawImage = seller.logo_url || seller.profile_image_url
            const displayImage = rawImage 
              ? (rawImage.startsWith('http') ? rawImage : `${rawImage}?t=${Date.now()}`)
              : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            
            const displayName = seller.store_name || seller.owner_name || (seller.email ? seller.email.split('@')[0] : 'UCN Seller')

            return (
              <div 
                key={seller.user_id} 
                onClick={() => { setSelectedSeller(seller.user_id); setView('sellerProfile') }}
                className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-red-200 transition group"
              >
                <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                  <img src={displayImage} alt={displayName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 group-hover:text-[#7C121A] transition">
                    <span className="truncate">{displayName}</span>
                    <ShieldCheckIcon className="w-5 h-5 text-[#7C121A] shrink-0" />
                  </h3>
                  {seller.description && <p className="text-sm text-gray-500 truncate mt-0.5">{seller.description}</p>}
                  <span className="text-xs font-bold text-[#7C121A] mt-1.5 block uppercase tracking-wide">{seller.product_count || 0} Products</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}