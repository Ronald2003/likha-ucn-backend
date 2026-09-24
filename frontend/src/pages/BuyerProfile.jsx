import { useState, useEffect } from 'react'
import axios from 'axios'

export default function BuyerProfile({ initialTab = "purchases", setView, setSelectedSeller, setInitialChat, addToCart, setCheckoutItems }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [notifications, setNotifications] = useState([])
  const [reviewingOrderId, setReviewingOrderId] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    fetchOrders()
    fetchNotifications()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/orders/buyer', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotifications()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitReview = async (orderId, productId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/reviews', 
        { orderId, productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Review submitted successfully')
      setReviewingOrderId(null)
      setRating(5)
      setComment('')
      fetchOrders()
    } catch (error) {
      alert('Failed to submit review')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2 sticky top-28 z-10">
        <button 
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-3 font-bold text-sm p-3 rounded-md transition ${activeTab === 'purchases' ? 'bg-red-50 text-[#7C121A]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          My Purchase
        </button>
        <button 
          onClick={() => { setActiveTab('notifications'); markAllAsRead(); }}
          className={`flex items-center gap-3 font-bold text-sm p-3 rounded-md transition relative ${activeTab === 'notifications' ? 'bg-red-50 text-[#7C121A]' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          Notifications
          {notifications.filter(n => n.is_read === 0).length > 0 && (
            <span className="absolute right-3 top-3.5 w-2 h-2 bg-[#7C121A] rounded-full"></span>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {activeTab === 'purchases' && (
          orders.length === 0 ? (
            <div className="bg-white text-center py-20 text-gray-500 rounded-sm shadow-sm border border-gray-100">
              You have no recent orders.
            </div>
          ) : (
            orders.map(order => {
              const displayImage = order.image_url ? `${order.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              
              return (
                <div key={order.id} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800 text-sm">{order.store_name || 'UCN Seller'}</span>
                      <button onClick={(e) => { e.stopPropagation(); setInitialChat({ contact_id: order.seller_id, name: order.store_name || 'UCN Seller', role: 'seller' }); setView('chat'); }} className="bg-[#7C121A] text-white px-3 py-1.5 rounded text-[10px] font-bold tracking-wide hover:bg-[#590e15] transition z-10 relative">Chat</button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedSeller(order.seller_id); setView('sellerProfile'); }} className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold bg-white hover:bg-gray-50 transition z-10 relative">View Shop</button>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-[#7C121A] font-bold uppercase">{order.status}</span>
                    </div>
                  </div>

                  <div className="p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition" onClick={() => setSelectedOrder(order)}>
                    <img src={displayImage} alt={order.product_name} className="w-20 h-20 object-cover border border-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{order.product_name || 'Product item'}</h3>
                        <p className="text-xs text-gray-500 mt-1">x{order.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-800 font-bold">&#8369;{order.total_amount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-orange-50/20 flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Item Total:</span>
                      <span className="text-2xl font-bold text-[#7C121A]">&#8369;{order.total_amount?.toFixed(2)}</span>
                    </div>
                    {order.status === 'completed' && String(order.has_reviewed) === '0' && reviewingOrderId !== order.id && (
                      <div className="flex gap-2">
                        <button onClick={() => setReviewingOrderId(order.id)} className="bg-[#7C121A] text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-red-900 transition">
                          Leave Review
                        </button>
                      </div>
                    )}
                  </div>

                  {reviewingOrderId === order.id && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <h4 className="text-sm font-bold text-gray-800 mb-3">Rate your purchase</h4>
                      <div className="flex flex-col gap-3">
                        <select 
                          value={rating} 
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none w-48 focus:border-[#7C121A] bg-white"
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Good</option>
                          <option value="3">3 - Average</option>
                          <option value="2">2 - Poor</option>
                          <option value="1">1 - Terrible</option>
                        </select>
                        <textarea 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience (optional)"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none resize-none h-24 focus:border-[#7C121A] bg-white"
                        />
                        <div className="flex gap-3 mt-2">
                          <button 
                            onClick={() => handleSubmitReview(order.order_id, order.product_id)}
                            className="bg-[#7C121A] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-red-900 transition"
                          >
                            Submit Review
                          </button>
                          <button 
                            onClick={() => setReviewingOrderId(null)}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm font-bold hover:bg-gray-300 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Your Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">You have no notifications.</p>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition">
                  <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block font-bold">{new Date(notif.created_at).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <button onClick={() => setSelectedOrder(null)} className="flex items-center text-gray-500 hover:text-[#7C121A] transition text-sm font-bold uppercase tracking-wide gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                BACK
              </button>
              <div className="flex items-center gap-4 text-sm font-bold uppercase">
                <span className="text-gray-800">ORDER ID. {selectedOrder.order_id}</span>
                <span className="text-gray-300">|</span>
                <span className="text-[#7C121A]">ORDER {selectedOrder.status}</span>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-gray-50 flex-1">
              {/* Timeline */}
              <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
                <div className="absolute top-6 left-16 right-16 h-1 bg-green-500 z-0"></div>
                
                <div className="flex flex-col items-center gap-2 z-10 w-32">
                  <div className="w-12 h-12 rounded-full border-4 border-green-500 bg-white flex items-center justify-center text-green-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-800 text-center flex flex-col items-center">
                    Order Placed
                    {selectedOrder.created_at && <span className="text-[10px] text-gray-500 font-normal mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</span>}
                  </span>
                </div>
                
                <div className="flex flex-col items-center gap-2 z-10 w-32">
                  <div className={"w-12 h-12 rounded-full border-4 flex items-center justify-center " + (['ready for pickup', 'completed'].includes(selectedOrder.status) ? 'border-green-500 text-green-500 bg-white' : 'border-gray-300 text-gray-300 bg-gray-50')}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <span className={"text-sm font-bold text-center flex flex-col items-center " + (['ready for pickup', 'completed'].includes(selectedOrder.status) ? 'text-gray-800' : 'text-gray-400')}>
                    Ready for Pickup
                    {selectedOrder.ready_at && <span className="text-[10px] text-gray-500 font-normal mt-1">{new Date(selectedOrder.ready_at).toLocaleString()}</span>}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2 z-10 w-32">
                  <div className={"w-12 h-12 rounded-full border-4 flex items-center justify-center " + (selectedOrder.status === 'completed' ? 'border-green-500 text-green-500 bg-white' : 'border-gray-300 text-gray-300 bg-gray-50')}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <span className={"text-sm font-bold text-center flex flex-col items-center " + (selectedOrder.status === 'completed' ? 'text-gray-800' : 'text-gray-400')}>
                    Order Completed
                    {selectedOrder.completed_at && <span className="text-[10px] text-gray-500 font-normal mt-1">{new Date(selectedOrder.completed_at).toLocaleString()}</span>}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden mb-6">
                <div className="p-4 bg-[#7C121A]/5 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-800 cursor-pointer hover:underline flex items-center gap-2" onClick={() => {
                    setSelectedSeller(selectedOrder.seller_id)
                    setView('sellerProfile')
                    setSelectedOrder(null)
                  }}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {selectedOrder.store_name || 'UCN Seller'}
                  </span>
                  <button onClick={() => {
                    setInitialChat({ contact_id: selectedOrder.seller_id, name: selectedOrder.store_name, role: 'seller' })
                    setView('chat')
                    setSelectedOrder(null)
                  }} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-sm text-xs font-bold hover:bg-gray-50 transition flex items-center gap-2 bg-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Contact Seller
                  </button>
                </div>
                
                <div className="p-6 flex gap-6 border-b border-gray-100">
                  <img src={selectedOrder.image_url ? ("" + selectedOrder.image_url) : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop'} alt={selectedOrder.product_name} className="w-24 h-24 object-cover border border-gray-200 rounded-sm shadow-sm" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedOrder.product_name}</h3>
                      <p className="text-sm text-gray-500 mt-1">x{selectedOrder.quantity}</p>
                    </div>
                    <div className="text-right flex items-center justify-end gap-3">
                      <span className="text-gray-500 line-through text-sm">&#8369;{(selectedOrder.price * 1.2).toFixed(2)}</span>
                      <span className="text-xl font-bold text-[#7C121A]">&#8369;{selectedOrder.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="flex justify-end mb-6">
                <div className="bg-white border border-gray-200 rounded-sm p-4 w-96">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-500 text-sm">Payment Method</span>
                    <span className="font-bold text-gray-800 text-sm uppercase">{selectedOrder.payment_method === 'qrph' ? 'QRPH' : selectedOrder.payment_method === 'bank' ? 'Bank Transfer' : 'Cash-On-Pickup'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-500 text-sm">Payment Status</span>
                    <span className={"font-bold text-sm uppercase " + (selectedOrder.payment_status === 'paid' ? 'text-green-600' : 'text-gray-800')}>{selectedOrder.payment_status === 'paid' ? 'Paid' : 'Unpaid'}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <span className="text-gray-800 font-bold text-sm">Order Total</span>
                    <span className="text-2xl font-bold text-[#7C121A]">&#8369;{selectedOrder.total_amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-center">
              <span className="text-gray-500 text-sm italic">Thank you for shopping at Likha UCN Market Hub!</span>
              {selectedOrder.status === 'completed' && (
                <button onClick={() => {
                    setCheckoutItems([{
                      id: selectedOrder.product_id,
                      name: selectedOrder.product_name,
                      price: selectedOrder.price,
                      seller_id: selectedOrder.seller_id,
                      store_name: selectedOrder.store_name,
                      image_url: selectedOrder.image_url,
                      quantity: 1
                    }])
                    setView('checkout')
                    setSelectedOrder(null)
                  }} disabled={selectedOrder.current_stock <= 0} className="bg-[#7C121A] text-white px-8 py-3 rounded-sm text-sm font-bold hover:bg-red-900 transition shadow-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400">
                    {selectedOrder.current_stock <= 0 ? 'Unavailable' : 'Buy Again'}
                  </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

