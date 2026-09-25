import { useState, useEffect } from 'react'
import axios from 'axios'

const ShieldCheckIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

const SettingsIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
  </svg>
)

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [profile, setProfile] = useState(null)
  
  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState(1)
  const [location, setLocation] = useState('Daet')
  const [specificAddress, setSpecificAddress] = useState('')
  const [image, setImage] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchCategories()
    fetchProfile()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/products/seller', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/orders/seller', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories')
      setCategories(res.data)
      if (res.data.length > 0) setCategory(res.data[0].name)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const profileRes = await axios.get('/api/sellers/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setProfile({ ...res.data, ...profileRes.data })
    } catch (error) {
      console.error(error)
    }
  }

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', file)
      await axios.put('/api/sellers/image', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      alert('Profile image updated successfully.')
      fetchProfile()
    } catch (error) {
      console.error(error)
      alert('Failed to update profile image: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleRequestNameChange = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/sellers/request-name', 
        { newName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Name change requested and pending Admin approval.')
      setNewName('')
      fetchProfile()
    } catch (error) {
      console.error(error)
      alert('Failed to update store name.')
    }
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    if (!newEmail.trim()) return
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/users/profile', 
        { email: newEmail }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Email updated successfully.')
      setNewEmail('')
      fetchProfile()
    } catch (error) {
      console.error(error)
      alert('Failed to update email.')
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/users/profile', 
        { password: newPassword }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Password updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error(error)
      alert('Failed to update password.')
    }
  }

  const handleAddOrEdit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', price)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('stock', stock)
      formData.append('location', location)
      formData.append('specific_address', specificAddress)
      if (image) formData.append('image', image)

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('Product updated and submitted for admin approval.')
      } else {
        await axios.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('Product submitted for admin approval.')
      }

      resetForm()
      fetchProducts()
    } catch (error) {
      alert('Failed to save product: ' + (error.response?.data?.error || error.message))
    }
  }

  const resetForm = () => {
    setName('')
    setPrice('')
    setDescription('')
    if (categories.length > 0) setCategory(categories[0].name)
    setStock(1)
    setLocation('Daet')
    setSpecificAddress('')
    setImage(null)
    setIsAdding(false)
    setEditingId(null)
  }

  const openEditForm = (prod) => {
    setEditingId(prod.id)
    setName(prod.name)
    setPrice(prod.price)
    setDescription(prod.description || '')
    setCategory(prod.category || (categories.length > 0 ? categories[0].name : ''))
    setStock(prod.stock || 1)
    setLocation(prod.location || 'Daet')
    setSpecificAddress(prod.specific_address || '')
    setIsAdding(true)
  }

  const handleUpdateStock = async (id, newStock) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/products/${id}/stock`, { stock: newStock }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchProducts()
    } catch (error) {
      alert('Failed to update stock.')
    }
  }

  const markAsPaid = async (orderId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/orders/${orderId}/mark-paid`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
    } catch (error) {
      alert('Failed to mark as paid.')
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOrders()
    } catch (error) {
      alert('Failed to update order.')
    }
  }

  const totalSales = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price * o.quantity), 0)
  
  const getInitials = (name) => {
    if (!name) return 'S';
    return name.charAt(0).toUpperCase();
  }

  const activeOrders = orders.filter(o => o.status !== 'completed').length
  
  
  const rawImage = profile?.logo_url || profile?.profile_image_url || profile?.image_url;
  const displayImage = rawImage ? (rawImage.startsWith('http') ? rawImage : `${rawImage}?t=${Date.now()}`) : null;

    
  const displayName = profile?.store_name || profile?.name || (profile?.email ? profile.email.split('@')[0] : 'UCN Seller')

  if (profile?.verification_status === 'pending') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 w-full flex flex-col items-center justify-center text-center">
        <ShieldCheckIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Account Pending Approval</h2>
        <p className="text-gray-500 max-w-md">Your seller application has been received. An administrator will review your account shortly. You will gain access to your dashboard once approved.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 hidden md:block">Seller Panel</h2>
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>Overview</button>
          <button onClick={() => setActiveTab('products')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'products' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'orders' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>Orders</button>
          <button onClick={() => setIsSettingsOpen(true)} className="text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap text-gray-600 hover:bg-stone-100 flex items-center gap-2 md:mt-4">
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        
        {activeTab === 'overview' && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center transition-all">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-stone-200 shrink-0 bg-stone-50 flex items-center justify-center text-gray-500 font-bold text-2xl">
                    {displayImage ? (
                      <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(displayName)
                    )}
                  </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-1.5 truncate">
                    {displayName}
                    <ShieldCheckIcon className="w-5 h-5 text-[#7C121A] shrink-0" />
                  </h3>
                  {profile?.pending_store_name && (
                    <span className="text-xs font-bold text-orange-500 mt-1 uppercase tracking-wide">
                      Pending Approval: {profile.pending_store_name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-bold mb-1">Total Sales</p>
                <h3 className="text-2xl font-bold text-[#7C121A]">&#8369;{totalSales.toFixed(2)}</h3>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-bold mb-1">Active Orders</p>
                <h3 className="text-2xl font-bold text-gray-800">{activeOrders}</h3>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col justify-center">
                <p className="text-sm text-gray-500 font-bold mb-1">Products Listed</p>
                <h3 className="text-2xl font-bold text-gray-800">{products.length}</h3>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Manage Products</h3>
              <button 
                onClick={() => isAdding ? resetForm() : setIsAdding(true)}
                className="bg-[#7C121A] text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-[#590e15] transition"
              >
                {isAdding ? 'Cancel' : '+ Add Product'}
              </button>
            </div>
            
            {isAdding && (
              <form onSubmit={handleAddOrEdit} className="flex flex-col gap-4 mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Product Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Price (&#8369;)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="1" className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Stock</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="1" className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] bg-white">
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] bg-white">
                      <option value="Basud">Basud</option>
                      <option value="Capalonga">Capalonga</option>
                      <option value="Daet">Daet</option>
                      <option value="Jose Panganiban">Jose Panganiban</option>
                      <option value="Labo">Labo</option>
                      <option value="Mercedes">Mercedes</option>
                      <option value="Paracale">Paracale</option>
                      <option value="San Lorenzo Ruiz">San Lorenzo Ruiz</option>
                      <option value="San Vicente">San Vicente</option>
                      <option value="Santa Elena">Santa Elena</option>
                      <option value="Talisay">Talisay</option>
                      <option value="Vinzons">Vinzons</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Specific Address (Optional)</label>
                  <input type="text" value={specificAddress} onChange={(e) => setSpecificAddress(e.target.value)} className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" placeholder="Purok 1, Barangay 2" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border border-stone-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] h-20 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Product Image {editingId && '(Leave blank to keep current)'}</label>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required={!editingId} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7C121A]/10 file:text-[#7C121A] hover:file:bg-[#7C121A]/20 cursor-pointer" />
                </div>
                <button type="submit" className="bg-[#7C121A] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#590e15] transition w-full self-start">
                  {editingId ? 'Update Product' : 'Submit for Approval'}
                </button>
              </form>
            )}

            <div className="border-t border-stone-100 pt-4 flex-1 overflow-y-auto max-h-[600px] flex flex-col gap-2">
              {products.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No products found. Add your first product.</p>
              ) : (
                products.map(prod => (
                  <div key={prod.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 px-4 bg-stone-50 rounded-lg border border-stone-100 gap-4">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold text-gray-900 truncate">{prod.name}</span>
                      <span className={`text-[10px] uppercase font-bold mt-1 tracking-wider ${prod.status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>
                        Status: {prod.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0">
                        <span className="text-sm font-bold text-[#7C121A]">&#8369;{prod.price.toFixed(2)}</span>
                        <button onClick={() => openEditForm(prod)} className="text-xs bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-bold hover:bg-gray-300 transition shadow-sm">Edit Details</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-stone-200 flex flex-col min-h-[500px]">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Orders</h3>
            <div className="flex-1 overflow-y-auto max-h-[600px] flex flex-col gap-3">
              {orders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No orders yet.</p>
              ) : (
                orders.map(order => (
                  <div key={order.order_item_id} onClick={() => setSelectedOrder(order)} className="p-4 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1 w-full">
                      <img src={order.image_url ? (order.image_url.startsWith('http') || order.image_url.startsWith('data:') ? order.image_url : `${order.image_url}`) : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt={order.product_name} className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0 bg-white" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">{order.product_name}</span>
                        <span className="text-[11px] text-gray-500 mt-0.5 truncate">Qty: {order.quantity} &bull; {new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 shrink-0 border-t sm:border-0 border-stone-100 pt-3 sm:pt-0">
                      <span className="text-sm font-bold text-[#7C121A]">&#8369;{(order.price * order.quantity).toFixed(2)}</span>
                      <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${order.status === 'pending' ? 'bg-orange-100 text-orange-800' : order.status === 'ready for pickup' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50 shrink-0">
              <h3 className="font-serif font-bold text-xl text-gray-800">Store Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-8">
              
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-gray-800 border-b border-stone-100 pb-1">Update Profile Image</h4>
                <input type="file" accept="image/*" onChange={handleProfileUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-stone-100 file:text-gray-700 hover:file:bg-stone-200 cursor-pointer" />
              </div>

              <form onSubmit={handleRequestNameChange} className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-gray-800 border-b border-stone-100 pb-1">Store Name</h4>
                <div className="flex gap-2">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New store name" className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 outline-none focus:border-[#7C121A]" />
                  <button type="submit" className="bg-[#7C121A] text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-[#590e15] transition shrink-0">Request</button>
                </div>
                {profile?.pending_store_name && <p className="text-xs text-orange-500 font-semibold">Pending approval: {profile.pending_store_name}</p>}
              </form>

              <form onSubmit={handleUpdateEmail} className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-gray-800 border-b border-stone-100 pb-1">Account Email</h4>
                <div className="flex gap-2">
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder={profile?.email || "New email address"} className="flex-1 text-sm border border-stone-200 rounded-md px-3 py-2 outline-none focus:border-[#7C121A]" />
                  <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-gray-900 transition shrink-0">Update</button>
                </div>
              </form>

              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-gray-800 border-b border-stone-100 pb-1">Change Password</h4>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 outline-none focus:border-[#7C121A]" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full text-sm border border-stone-200 rounded-md px-3 py-2 outline-none focus:border-[#7C121A]" />
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-gray-900 transition self-start">Update Password</button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold font-serif text-gray-800">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-800 text-xl font-bold">&times;</button>
              </div>
              
              <div className="flex flex-col gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <img src={selectedOrder.image_url || 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop'}  alt="Product" className="w-16 h-16 rounded-md object-cover border border-stone-200 bg-white" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-gray-900 truncate">{selectedOrder.product_name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">Qty: {selectedOrder.quantity} &times; &#8369;{selectedOrder.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Buyer Name:</span>
                    <span className="font-bold text-gray-900 truncate max-w-[60%]">{selectedOrder.buyer_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Date Ordered:</span>
                    <span className="font-bold text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Payment:</span>
                    <span className="uppercase font-bold text-gray-900">{selectedOrder.payment_method === 'qrph' ? 'QRPh' : selectedOrder.payment_method}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-stone-100 mb-2 mt-2 pt-2">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-[#7C121A] text-base">&#8369;{(selectedOrder.price * selectedOrder.quantity).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex flex-col gap-3">
                  {selectedOrder.status === 'pending' && (
                    <button onClick={() => { updateOrderStatus(selectedOrder.order_item_id, 'ready for pickup'); setSelectedOrder(null); }} className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-bold hover:bg-blue-700 transition shadow-sm">
                      Mark as Ready for Pickup
                    </button>
                  )}
                  {selectedOrder.status === 'ready for pickup' && (
                    <button onClick={() => { updateOrderStatus(selectedOrder.order_item_id, 'completed'); setSelectedOrder(null); }} className="w-full bg-green-600 text-white py-2.5 rounded-md text-sm font-bold hover:bg-green-700 transition shadow-sm">
                      Mark as Completed
                    </button>
                  )}
                  <button onClick={() => setSelectedOrder(null)} className="w-full bg-stone-100 text-gray-700 py-2.5 rounded-md text-sm font-bold hover:bg-stone-200 transition">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
