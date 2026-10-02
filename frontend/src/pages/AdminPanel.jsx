import { useState, useEffect } from 'react'
import AdminUsersView from './AdminUsersView'
import axios from 'axios'

export default function AdminPanel({ setView, setInitialChat }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sellers, setSellers] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [nameRequests, setNameRequests] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [selectedPendingSeller, setSelectedPendingSeller] = useState(null)
  const [selectedPendingProduct, setSelectedPendingProduct] = useState(null)
  const [settings, setSettings] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editCatName, setEditCatName] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const resSellers = await axios.get('/api/admin/pending-sellers', { headers })
      const resProducts = await axios.get('/api/admin/pending-products', { headers })
      const resCategories = await axios.get('/api/categories')
      const resNames = await axios.get('/api/admin/pending-names', { headers })
      const resSettings = await axios.get('/api/settings')
      
      setSellers(resSellers.data)
      setProducts(resProducts.data)
      setCategories(resCategories.data)
      setNameRequests(resNames.data)
      setSettings(resSettings.data)
    } catch (error) {
      console.error(error)
    }
  }

  const approveData = async (type, id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/admin/approve-${type}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      alert(`Error approving ${type}`)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/categories', { name: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewCategory('')
      fetchData()
    } catch (error) {
      alert('Failed to add category')
    }
  }


  const handleRenameCategory = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!editCatName.trim() || !selectedCategory || editCatName === selectedCategory.name) return
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/categories/${selectedCategory.id}`, { name: editCatName }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
      setSelectedCategory(prev => ({...prev, name: editCatName}))
      alert('Category renamed successfully!')
    } catch (error) {
      alert('Failed to rename category')
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
      setSelectedCategory(null)
    } catch (error) {
      alert('Failed to delete category')
    }
  }


  const handleNameRequest = async (action, id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/admin/${action}-name/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      alert(`Failed to ${action} name`)
    }
  }


  const handleHeroUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', file)
      await axios.put('/api/settings/hero', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      alert('Hero image updated successfully!')
      fetchData()
    } catch (err) {
      alert('Failed to upload hero image')
    }
  }

  const handleCategoryUpload = async (e, categoryId) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('image', file)
      await axios.put(`/api/categories/${categoryId}/image`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      alert('Category image updated successfully!')
      fetchData()
      if (selectedCategory && categoryId === selectedCategory.id) { setSelectedCategory(prev => ({...prev, image_url: res.data.imageUrl})) }
    } catch (err) {
      alert('Failed to upload category image')
    }
  }

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 hidden md:block">Admin Panel</h2>
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'users' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>User Management</button>
          <button onClick={() => setActiveTab('settings')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'settings' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>Site Settings</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
      
      
      {activeTab === 'settings' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Storefront Settings</h3>
            
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Home Page Hero Image</h4>
              <p className="text-xs text-gray-500 mb-3">Recommended size: 1200x800px. This image appears at the top of the main landing page.</p>
              {settings.hero_image && <img src={settings.hero_image} alt="Hero Preview" className="w-full max-w-sm h-32 object-cover rounded-md mb-3 border border-gray-200 shadow-sm" />}

              <label className="bg-[#7C121A] text-white px-4 py-2 rounded-md text-sm font-bold cursor-pointer hover:bg-[#5a0c12] transition inline-block">
                Upload New Image
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
              </label>
            </div>
            
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Categories</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category Name" className="border border-gray-200 rounded-md px-4 py-2 text-sm outline-none w-full" />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-bold">Add</button>
          </form>
          <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => { setSelectedCategory(cat); setEditCatName(cat.name); }}
                  className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-300 shadow-sm transition"
                >
                  {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-5 h-5 rounded-full object-cover" /> : <div className="w-5 h-5 rounded-full bg-gray-200 text-[8px] flex items-center justify-center text-gray-400">IMG</div>}
                  {cat.name}
                  <span className="text-red-500 ml-1 font-bold">X</span>
                </button>
              ))}
            </div>
        </div>
        </div>
      ) : activeTab === 'users' ? (

        <AdminUsersView setView={setView} setInitialChat={setInitialChat} />
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Store Name Changes</h3>
          {nameRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No pending name changes.</p>
          ) : (
            nameRequests.map(req => (
              <div key={req.user_id} className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Current: {req.store_name}</span>
                  <span className="text-sm font-bold text-orange-600">Requested: {req.pending_store_name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleNameRequest('approve', req.user_id)} className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-bold border border-green-100 hover:bg-green-100 transition">Approve</button>
                  <button onClick={() => handleNameRequest('reject', req.user_id)} className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-bold border border-red-100 hover:bg-red-100 transition">Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Sellers</h3>
          {sellers.map(seller => (
            <div key={seller.id} className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-center">
              <div><p className="text-sm font-bold text-gray-800">{seller.store_name}</p></div>
              <div className="flex gap-2"><button onClick={() => setSelectedPendingSeller(seller)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold hover:bg-gray-200 transition">View Details</button><button onClick={() => approveData('seller', seller.user_id)} className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-bold border border-green-100 hover:bg-green-100 transition">Approve</button></div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pending Products</h3>
          {products.map(product => (
            <div key={product.id} className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-center">
              <div><p className="text-sm font-bold text-gray-800">{product.name}</p></div>
              <div className="flex gap-2"><button onClick={() => setSelectedPendingProduct(product)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-bold hover:bg-gray-200 transition">View Details</button><button onClick={() => approveData('product', product.id)} className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-bold border border-green-100 hover:bg-green-100 transition">Approve</button></div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {selectedPendingSeller && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Seller Details</h3>
            <div className="space-y-3 mb-6">
              <p><span className="text-gray-500 text-sm font-bold">Store Name:</span> {selectedPendingSeller.store_name}</p>
              <p><span className="text-gray-500 text-sm font-bold">Owner Name:</span> {selectedPendingSeller.name}</p>
              <p><span className="text-gray-500 text-sm font-bold">Email:</span> {selectedPendingSeller.email}</p>
              <p><span className="text-gray-500 text-sm font-bold">Phone:</span> {selectedPendingSeller.phone || 'N/A'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedPendingSeller(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md font-bold hover:bg-gray-200">Close</button>
              <button onClick={() => { approveData('seller', selectedPendingSeller.user_id); setSelectedPendingSeller(null); }} className="flex-1 bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700">Approve Seller</button>
            </div>
          </div>
        </div>
      )}

      {selectedPendingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
            {selectedPendingProduct.image_url && (
                <img src={`${selectedPendingProduct.image_url}`} alt="Product" className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              <p><span className="text-gray-500 text-sm font-bold">Name:</span> {selectedPendingProduct.name}</p>
              <p><span className="text-gray-500 text-sm font-bold">Store Name:</span> {selectedPendingProduct.store_name}</p>
              <p><span className="text-gray-500 text-sm font-bold">Category:</span> {selectedPendingProduct.category}</p>
              <p><span className="text-gray-500 text-sm font-bold">Price:</span> &#8369;{Number(selectedPendingProduct.price).toFixed(2)}</p>
              <p><span className="text-gray-500 text-sm font-bold">Stock:</span> {selectedPendingProduct.stock}</p>
              <p><span className="text-gray-500 text-sm font-bold">Location:</span> {selectedPendingProduct.location}</p>
              <p><span className="text-gray-500 text-sm font-bold">Specific Address:</span> {selectedPendingProduct.specific_address || 'N/A'}</p>
              <p><span className="text-gray-500 text-sm font-bold block mb-1">Description:</span> <span className="text-gray-700 text-sm whitespace-pre-wrap">{selectedPendingProduct.description}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedPendingProduct(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md font-bold hover:bg-gray-200">Close</button>
              <button onClick={() => { approveData('product', selectedPendingProduct.id); setSelectedPendingProduct(null); }} className="flex-1 bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700">Approve Product</button>
            </div>
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative flex flex-col items-center animate-scale-up border-2 border-gray-100">
            <button 
              onClick={() => setSelectedCategory(null)} 
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition transform hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <label className="w-48 h-48 rounded-full border-2 border-[#991b1b] overflow-hidden mb-6 cursor-pointer relative group flex items-center justify-center shadow-inner mt-4 bg-gray-50">
              {selectedCategory.image_url ? (
                <img src={selectedCategory.image_url} alt="Category" className="w-full h-full object-cover transition duration-300 group-hover:opacity-50" />
              ) : (
                <span className="text-gray-400 font-bold group-hover:opacity-0 transition duration-300 text-center text-sm">Click to add<br/>image</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-widest">UPLOAD</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCategoryUpload(e, selectedCategory.id)} />
            </label>

            <form onSubmit={handleRenameCategory} className="w-full">
              <input 
                value={editCatName} 
                onChange={(e) => setEditCatName(e.target.value)}
                onBlur={handleRenameCategory}
                className="bg-[#991b1b] text-white text-center rounded-3xl px-6 py-3 text-lg font-bold w-full outline-none focus:ring-4 focus:ring-red-300 transition shadow-md placeholder-white/70"
                placeholder="Category Name"
              />
            </form>
            
            <button 
              onClick={() => handleDeleteCategory(selectedCategory.id)}
              className="mt-6 text-xs font-bold text-red-500 hover:text-red-700 underline underline-offset-2 transition"
            >
              Delete Category
            </button>
          </div>
        </div>
      )}

      </div>
    </div>
  )
}
