import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

export default function ProductDetailsView({ productId, setView, addToCart, setSelectedSeller, setInitialChat, onViewDetails, setCheckoutItems }) {
  const [data, setData] = useState(null)
  const [sellerProfile, setSellerProfile] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (productId) fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    try {
      const res = await axios.get(`/api/products/${productId}`)
      setData(res.data)
      
      // Kunin ang pinakabagong seller profile gamit ang seller_id ng produkto
      if (res.data.product && res.data.product.seller_id) {
        try {
          const sellerRes = await axios.get(`/api/sellers/${res.data.product.seller_id}`)
          setSellerProfile(sellerRes.data)
        } catch (e) {
          console.error("Could not fetch updated seller profile", e)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAdd = () => {
    const prod = { ...data.product, quantity }
    addToCart(prod)
  }

  const handleBuyNow = () => {
    setCheckoutItems([{
      id: data.product.id,
      name: data.product.name,
      price: data.product.price,
      seller_id: data.product.seller_id,
      store_name: data.product.store_name,
      image_url: data.product.image_url,
      quantity: quantity
    }])
    setView('checkout')
  }

  const handleChat = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You must log in to message a seller.')
      setView('auth')
      return
    }
    setInitialChat({ contact_id: data.product.seller_id, store_name: finalSellerName, logo_url: sellerProfile?.logo_url, role: 'seller' })
    setView('chat')
  }

  const handleViewShop = () => {
    setSelectedSeller(data.product.seller_id)
    setView('sellerProfile')
  }

  if (!data) return <div className="text-center py-20">Loading details...</div>

  const rating = data.product.rating ? Number(data.product.rating).toFixed(1) : 'New'
  const reviewCount = data.product.review_count || 0
  const imgUrl = data.product.image_url ? `${data.product.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  
  const sellerRating = data.sellerStats?.rating || '5.0'
  const responseRate = data.sellerStats?.responseRate || '98%'
  const stock = data.product.stock || 0
  const productLocation = data.product.location || 'Daet';
  const specificAddress = data.product.specific_address ? `, ${data.product.specific_address}` : '';
  const displayLocation = productLocation + specificAddress;

  // Pag-compute ng pinakabagong pangalan at larawan ng seller na may cache-busting
  let finalSellerName = data.product.seller
  let finalSellerImg = data.product.seller_image ? `${data.product.seller_image}?t=${Date.now()}` : null

  if (sellerProfile) {
    finalSellerName = sellerProfile.store_name || sellerProfile.owner_name || sellerProfile.name || finalSellerName
    const rawImg = sellerProfile.logo_url || sellerProfile.profile_image_url
    if (rawImg) {
      finalSellerImg = rawImg.startsWith('http') ? rawImg : `${rawImg}?t=${Date.now()}`
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-2/5">
          <img src={imgUrl} alt={data.product.name} className="w-full h-64 sm:h-80 md:h-[400px] object-cover rounded-lg border border-gray-100" />
        </div>
        <div className="w-full md:w-3/5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{data.product.name}</h2>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1 text-[#7C121A] font-bold border-b border-[#7C121A]">
              <span className="text-yellow-400">&#9733;</span> {rating}
            </div>
            <div className="text-gray-500 border-l border-gray-300 pl-4">{reviewCount} Ratings</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <span className="text-3xl font-bold text-[#7C121A]">&#8369;{data.product.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-6 mb-6 text-sm">
            <span className="text-gray-500 w-20">Variations</span>
            <div className="flex gap-2">
              <button className="border border-[#7C121A] text-[#7C121A] px-4 py-1 rounded-sm bg-red-50 font-semibold">Default</button>
            </div>
          </div>
          <div className="flex items-center gap-6 mb-8 text-sm">
            <span className="text-gray-500 w-20">Quantity</span>
            <div className="flex items-center border border-gray-200 rounded-sm">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={stock <= 0} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-r border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">-</button>
              <span className="px-4 py-1 text-gray-800 font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} disabled={stock <= 0 || quantity >= stock} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-l border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
            </div>
            <span className="text-gray-500 text-xs">{stock} pieces available</span>
          </div>
          <div className="flex gap-2 sm:gap-4 w-full md:w-auto">
                <button onClick={handleAdd} disabled={stock <= 0} className="flex-1 sm:flex-none bg-red-50 text-[#7C121A] px-2 sm:px-6 py-3 rounded-md border border-[#7C121A] font-bold text-sm sm:text-base hover:bg-red-100 transition flex items-center justify-center gap-1 sm:gap-2 leading-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200">
                  {stock <= 0 ? 'Out of Stock' : 'Add To Cart'}
                </button>
                <button onClick={handleBuyNow} disabled={stock <= 0} className="flex-1 sm:flex-none bg-[#7C121A] text-white px-2 sm:px-10 py-3 rounded-md font-bold text-sm sm:text-base hover:bg-red-900 transition shadow-md flex items-center justify-center leading-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400">
                  {stock <= 0 ? 'Unavailable' : 'Buy Now'}
                </button>
              </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          {finalSellerImg ? (
            <img src={finalSellerImg} alt={finalSellerName} className="w-16 h-16 rounded-full object-cover shadow-sm border border-red-100" />
          ) : (
            <div className="w-16 h-16 bg-red-50 text-[#7C121A] rounded-full flex items-center justify-center font-bold text-2xl shadow-sm border border-red-100">
              {finalSellerName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-1.5">
              {finalSellerName}
              <ShieldCheckIcon className="w-5 h-5 text-[#7C121A]" />
            </h3>
            <div className="flex gap-2 mt-2">
              <button onClick={handleChat} className="bg-red-50 text-[#7C121A] px-3 py-1 rounded-sm border border-red-200 text-xs font-bold hover:bg-red-100">Chat</button>
              <button onClick={handleViewShop} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-sm border border-gray-200 text-xs font-bold hover:bg-gray-100">View Shop</button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-6 text-sm text-center md:text-left w-full md:w-auto">
            <div className="flex flex-col"><span className="text-gray-500 text-[10px] sm:text-xs">Ratings</span> <span className="font-bold text-[#7C121A] text-xs sm:text-sm">{sellerRating}</span></div>
            <div className="flex flex-col"><span className="text-gray-500 text-[10px] sm:text-xs">Products</span> <span className="font-bold text-[#7C121A] text-xs sm:text-sm">{data.sellerStats?.total_products || 0}</span></div>
            <div className="flex flex-col"><span className="text-gray-500 text-[10px] sm:text-xs leading-tight">Response Rate</span> <span className="font-bold text-[#7C121A] text-xs sm:text-sm">{responseRate}</span></div>
          </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="bg-gray-50 p-3 font-bold text-gray-800 text-lg rounded-sm mb-4">Product Details</h3>
        <div className="px-3">
          <p className="text-gray-600 text-sm mb-2"><span className="text-gray-400 w-32 inline-block">Category</span> <span className="font-semibold text-gray-700">{data.product.category}</span></p>
          <p className="text-gray-600 text-sm mb-2"><span className="text-gray-400 w-32 inline-block">Stock</span> <span className="font-semibold text-gray-700">{stock}</span></p>
          <p className="text-gray-600 text-sm mb-6"><span className="text-gray-400 w-32 inline-block">Location</span> <span className="font-semibold text-gray-700">{displayLocation}</span></p>
          <h4 className="font-bold text-gray-800 text-sm mb-3">Product Description</h4>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{data.product.description}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-500 uppercase text-sm mb-6 border-b border-gray-100 pb-2">Product Reviews ({data.reviews?.length || 0})</h3>
        {!data.reviews || data.reviews.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data.reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800 text-sm">{review.buyer_name || review.buyer_email?.split('@')[0] || 'Buyer'}</span>
                  <span className="text-yellow-400 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-500 uppercase text-sm mb-6 border-b border-gray-100 pb-2">You Might Also Like</h3>
        {!data.similarProducts || data.similarProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No similar products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.similarProducts.map(prod => {
              const similarImg = prod.image_url ? `${prod.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              return <ProductCard key={prod.id} product={{...prod, image: similarImg}} onViewDetails={onViewDetails} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

