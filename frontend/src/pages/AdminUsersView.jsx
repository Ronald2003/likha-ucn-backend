import { useState, useEffect } from 'react'
import axios from 'axios'

const UsersIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
const UserIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
const ShieldCheckIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>

export default function AdminUsersView({ setView, setInitialChat }) {
  const [activeTab, setActiveTab] = useState('sellers') // 'sellers' or 'buyers'
  const [users, setUsers] = useState({ sellers: [], buyers: [] })
  
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUserId) fetchUserDetails(selectedUserId)
  }, [selectedUserId])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const sellers = res.data.filter(u => u.role === 'seller')
      const buyers = res.data.filter(u => u.role === 'buyer')
      setUsers({ sellers, buyers })
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingList(false)
    }
  }

  const fetchUserDetails = async (id) => {
    setLoadingDetails(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/users/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserDetails(res.data)
    } catch (error) {
      console.error(error)
      setUserDetails(null)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleChatClick = (e, user) => {
    e.stopPropagation() 
    setInitialChat({ 
      contact_id: user.id || user.user.id, 
      store_name: user.store_name || user.name || (user.user ? user.user.name : user.email.split('@')[0]) 
    })
    setView('chat')
  }

  const getDisplayImage = (rawImg) => rawImg ? (rawImg.startsWith('http') ? rawImg : `${rawImg}?t=${Date.now()}`) : 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=150&q=80'
  const getDisplayName = (u) => u.store_name || u.name || u.email.split('@')[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
      
      {/* Left Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 px-2">User Management</h2>
        
        <button 
          onClick={() => { setActiveTab('sellers'); setSelectedUserId(null); setUserDetails(null); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${activeTab === 'sellers' ? 'bg-red-50 text-[#7C121A]' : 'text-gray-600 hover:bg-stone-100'}`}
        >
          <UsersIcon className="w-5 h-5" />
          SELLERS
          <span className="ml-auto bg-white rounded-full px-2 py-0.5 text-[10px] border border-stone-200">{users.sellers.length}</span>
        </button>
        
        <button 
          onClick={() => { setActiveTab('buyers'); setSelectedUserId(null); setUserDetails(null); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition ${activeTab === 'buyers' ? 'bg-red-50 text-[#7C121A]' : 'text-gray-600 hover:bg-stone-100'}`}
        >
          <UserIcon className="w-5 h-5" />
          BUYERS
          <span className="ml-auto bg-white rounded-full px-2 py-0.5 text-[10px] border border-stone-200">{users.buyers.length}</span>
        </button>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 min-h-[600px] overflow-hidden flex flex-col">
        
        {/* LIST VIEW */}
        {!selectedUserId && (
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-stone-100 pb-4">
              {activeTab === 'sellers' ? 'Registered Sellers' : 'Registered Buyers'}
            </h3>
            
            {loadingList ? (
              <div className="text-center py-20 text-gray-500 font-bold">Loading users...</div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                {users[activeTab].length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-10">No {activeTab} found.</p>
                ) : (
                  users[activeTab].map(user => (
                    <div 
                      key={user.id} 
                      onClick={() => setSelectedUserId(user.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-100 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                        <img src={getDisplayImage(user.logo_url || user.profile_image_url)} alt={getDisplayName(user)} className="w-12 h-12 rounded-full object-cover border border-stone-200 bg-white shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 text-base flex items-center gap-1.5 truncate">
                            {getDisplayName(user)}
                            {activeTab === 'sellers' && <ShieldCheckIcon className="w-4 h-4 text-[#7C121A]" />}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Status: {user.status || 'Active'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 shrink-0">
                        {activeTab === 'sellers' && (
                          <div className="text-right flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                              {user.rating || '0.0'} <span className="text-yellow-500 text-xs">★</span>
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold">{user.review_count || 0} Reviews</span>
                          </div>
                        )}
                        <button onClick={(e) => handleChatClick(e, user)} className="text-xs bg-[#7C121A] text-white px-5 py-2 rounded-md font-bold hover:bg-[#590e15] transition shadow-sm">
                          Chat
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* DETAILED PROFILE VIEW */}
        {selectedUserId && (
          <div className="flex-1 flex flex-col h-full">
            {/* Breadcrumb */}
            <div className="bg-stone-50 border-b border-stone-100 px-6 py-3 flex items-center shrink-0">
              <button onClick={() => { setSelectedUserId(null); setUserDetails(null); }} className="text-sm font-bold text-gray-500 hover:text-[#7C121A] transition flex items-center gap-2">
                &larr; Back to {activeTab === 'sellers' ? 'Sellers' : 'Buyers'}
              </button>
            </div>

            {loadingDetails ? (
              <div className="text-center py-20 text-gray-500 font-bold">Loading user details...</div>
            ) : !userDetails ? (
              <div className="text-center py-20 text-red-500 font-bold">Failed to load user details. They might have missing data.</div>
            ) : (
              <div className="p-6 overflow-y-auto flex-1">
                
                {/* 1 & 2. Profile Header & Info */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 border-b border-stone-100 pb-8">
  <div className="flex items-start gap-5 min-w-0 w-full md:w-auto">
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-stone-200 bg-stone-50 shrink-0 shadow-sm">
      <img src={getDisplayImage(userDetails.user.logo_url || userDetails.user.profile_image_url)} alt="Profile" className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col min-w-0 pt-1">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {getDisplayName(userDetails.user)}
        </h2>
        {activeTab === 'sellers' && <ShieldCheckIcon className="w-5 h-5 text-[#7C121A] shrink-0" />}
      </div>
      <p className="text-sm text-gray-500 truncate mb-1">{userDetails.user.email}</p>
      <p className="text-sm text-gray-500 mb-3">{userDetails.user.phone || 'No phone number provided'}</p>
      <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-100 self-start uppercase tracking-wider">
        Status: {userDetails.user.status || 'Active'}
      </span>
    </div>
  </div>
  <button onClick={(e) => handleChatClick(e, userDetails.user)} className="w-full md:w-auto bg-[#7C121A] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#590e15] transition shadow-sm shrink-0">
    Message User
  </button>
</div>

                {/* 3 & 4. Statistics Grid */}
                <h3 className="text-lg font-bold text-gray-800 mb-4">Statistics</h3>
                {activeTab === 'sellers' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Sales</p><p className="text-xl font-bold text-[#7C121A]">{Number(userDetails.stats?.total_sales || 0).toFixed(2)}</p></div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Products Listed</p><p className="text-xl font-bold text-gray-800">{userDetails.stats?.products_listed || 0}</p></div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Overall Rating</p><p className="text-xl font-bold text-gray-800">{userDetails.stats?.overall_rating || '0.0'} ★</p></div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Reviews</p><p className="text-xl font-bold text-gray-800">{userDetails.stats?.total_reviews || 0}</p></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-10">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Purchases</p><p className="text-xl font-bold text-[#7C121A]">{Number(userDetails.stats?.total_purchases || 0).toFixed(2)}</p></div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Orders</p><p className="text-xl font-bold text-gray-800">{userDetails.stats?.total_orders || 0}</p></div>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100"><p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Reviews</p><p className="text-xl font-bold text-gray-800">{userDetails.stats?.total_reviews || 0}</p></div>
                  </div>
                )}

                {/* 5 & 6. Contextual Data Lists */}
                <div className="flex flex-col gap-10">
                  
                  {/* Primary Data List (Products or Purchases) */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{activeTab === 'sellers' ? 'Listed Products' : 'Purchase History'}</h3>
                    <div className="flex flex-col gap-3">
                        {activeTab === 'sellers' ? (
                          (!userDetails.products || userDetails.products.length === 0) ? <p className="p-4 text-sm text-gray-500 bg-stone-50 rounded-lg border border-stone-100">No products listed.</p> :
                          userDetails.products.map(p => (
                            <div key={p.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 px-4 bg-stone-50 rounded-lg border border-stone-100 gap-4">
                              <div className="flex items-center gap-4 min-w-0 flex-1">
                                <img src={getDisplayImage(p.image_url)} alt="" className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0 bg-white" />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-gray-900 truncate">{p.name}</span>
                                  <span className="text-[11px] text-gray-500 mt-0.5">Stock: {p.stock || 0}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 border-t sm:border-0 border-stone-200 pt-3 sm:pt-0">
                                <span className="text-sm font-bold text-[#7C121A]">&#8369;{Number(p.price || 0).toFixed(2)}</span>
                                <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-stone-200 text-gray-800">{p.status || 'Active'}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          (!userDetails.purchases || userDetails.purchases.length === 0) ? <p className="p-4 text-sm text-gray-500 bg-stone-50 rounded-lg border border-stone-100">No purchases found.</p> :
                          userDetails.purchases.map((p, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 px-4 bg-stone-50 rounded-lg border border-stone-100 gap-4">
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-sm font-bold text-gray-900 truncate">{p.product_name}</span>
                                <span className="text-[11px] text-gray-500 mt-0.5 truncate">Seller: {p.seller_store || p.seller_name} &bull; Qty: {p.quantity || 1}</span>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 border-t sm:border-0 border-stone-200 pt-3 sm:pt-0">
                                <span className="text-sm font-bold text-[#7C121A]">&#8369;{Number((p.price || 0) * (p.quantity || 1)).toFixed(2)}</span>
                                <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-stone-200 text-gray-800">{p.status}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Reviews Section */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{activeTab === 'sellers' ? 'Reviews Received' : 'Reviews Written'}</h3>
                    <div className="flex flex-col gap-3">
                      {!userDetails.reviews || userDetails.reviews.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 bg-stone-50 rounded-lg border border-stone-100">No reviews yet.</p>
                      ) : (
                        userDetails.reviews.map((r, idx) => (
                          <div key={idx} className="p-4 border border-stone-100 rounded-lg bg-stone-50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-sm text-gray-800">
                                {activeTab === 'sellers' ? r.buyer_name : `${r.product_name} (from ${r.seller_store || r.seller_name})`}
                              </span>
                              <span className="text-[#7C121A] font-bold text-sm">{r.rating}.0 ★</span>
                            </div>
                            <p className="text-sm text-gray-600">{r.comment || 'No comment provided.'}</p>
                            <p className="text-[10px] text-gray-400 mt-2">{new Date(r.created_at || Date.now()).toLocaleDateString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}