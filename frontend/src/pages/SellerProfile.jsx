import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

export default function SellerProfile({ sellerId, setView, setInitialChat, addToCart, onViewDetails }) {
  const [seller, setSeller] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sellerId) {
      fetchSellerData()
    }
  }, [sellerId])

  const fetchSellerData = async () => {
    try {
      const sellerRes = await axios.get(`/api/sellers/${sellerId}`)
      setSeller(sellerRes.data)
      
      try {
         const prodRes = await axios.get('/api/products/public')
         const sellerProducts = prodRes.data.filter(p => p.seller_id === sellerId)
         
         const productsWithImages = sellerProducts.map(item => ({
           ...item,
           image: item.image_url ? `${item.image_url}?t=${Date.now()}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
         }))
         setProducts(productsWithImages)
      } catch (e) {
         setProducts([])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChat = () => {
    setInitialChat({ ...seller, contact_id: seller.user_id })
    setView('chat')
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading seller profile...</div>
  if (!seller) return <div className="text-center py-20 text-gray-500">Seller not found.</div>

  const rawImage = seller.logo_url || seller.profile_image_url
  const displayImage = rawImage 
    ? (rawImage.startsWith('http') ? rawImage : `${rawImage}?t=${Date.now()}`)
    : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  
  const displayName = seller.store_name || seller.owner_name || (seller.email ? seller.email.split('@')[0] : 'UCN Seller')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
        <img src={displayImage} alt={displayName} className="w-24 h-24 rounded-full object-cover border border-stone-200" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
            {displayName}
            <ShieldCheckIcon className="w-6 h-6 text-[#7C121A]" />
          </h2>
          {seller.description && <p className="text-gray-500 mt-1">{seller.description}</p>}
        </div>
        <button onClick={handleChat} className="bg-[#7C121A] text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide hover:bg-[#590e15] transition shrink-0">
          CHAT SELLER
        </button>
      </div>
      
      <h3 className="text-xl font-serif font-bold text-gray-800 mb-6 border-b border-stone-200 pb-2">Products</h3>
      {products.length === 0 ? (
        <p className="text-gray-500">This seller has no products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  )
}