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
      
      setSellers(resSellers.data)
      setProducts(resProducts.data)
      setCategories(resCategories.data)
      setNameRequests(resNames.data)
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

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchData()
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 hidden md:block">Admin Panel</h2>
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`text-sm font-bold px-4 py-2.5 rounded-lg text-left transition whitespace-nowrap ${activeTab === 'users' ? 'bg-[#7C121A] text-white shadow-md' : 'text-gray-600 hover:bg-stone-100'}`}>User Management</button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-w-0">
      
      {activeTab === 'users' ? (
        <AdminUsersView setView={setView} setInitialChat={setInitialChat} />
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Manage Categories</h3>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category Name" className="border border-gray-200 rounded-md px-4 py-2 text-sm outline-none w-full" />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-bold">Add</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat.id} className="bg-gray-50 border border-gray-200 px-3 py-1 rounded flex items-center gap-2 text-sm">
                <span>{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 font-bold hover:text-red-700">X</button>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  )
}
