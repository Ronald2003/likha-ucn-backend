import { useState, useEffect } from 'react'

const CartIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const CloseIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function CartView({ cart, updateQuantity, removeItem, onProceed, setView }) {
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    setSelectedIds(cart.map(item => item.id))
  }, [cart.length])

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(cart.map(item => item.id))
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const selectedItems = cart.filter(item => selectedIds.includes(item.id))
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.")
      return
    }
    onProceed(selectedItems)
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 w-full text-center flex flex-col items-center">
         <div className="text-gray-300 mb-4"><CartIcon className="w-20 h-20" /></div>
         <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2 mt-4">Your Cart is Empty</h2>
         <p className="text-base text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
         <button onClick={() => setView('shop')} className="bg-[#7C121A] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-[#590e15] transition">START SHOPPING</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
      <div className="flex-1 w-full overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">Shopping Cart</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={selectedIds.length === cart.length && cart.length > 0} 
              onChange={toggleSelectAll}
              className="accent-[#7C121A] w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-700">Select All</span>
          </label>
        </div>

        <div className="sm:hidden flex flex-col gap-3">
          {cart.map((item) => {
            const displayImage = item.image || (item.image_url ? `${item.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-stone-100 p-3 flex gap-3 items-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(item.id)} 
                  onChange={() => toggleSelect(item.id)}
                  className="accent-[#7C121A] w-4 h-4 cursor-pointer"
                />
                <div className="w-16 h-16 bg-stone-50 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                  <img src={displayImage} alt={item.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">&#8369;{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 text-sm">-</button>
                      <span className="text-xs font-semibold text-center w-6">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 text-sm">+</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end h-full">
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-[#7C121A] text-sm mt-4">{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-stone-100 overflow-x-auto w-full">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-stone-50 text-gray-500 text-xs uppercase tracking-wide border-b border-stone-200">
              <tr>
                <th className="p-4 w-12 text-center"></th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold text-center">Quantity</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {cart.map((item) => {
                const displayImage = item.image || (item.image_url ? `${item.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
                return (
                  <tr key={item.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(item.id)} 
                        onChange={() => toggleSelect(item.id)}
                        className="accent-[#7C121A] w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-stone-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                          <img src={displayImage} alt={item.name} className="w-full h-full object-cover rounded" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500">&#8369;{item.price.toFixed(2)}</p>
                          <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline mt-1 font-bold">Remove</button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center border border-gray-200 rounded-md w-24 bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 w-1/3">-</button>
                          <span className="text-sm font-semibold text-center w-1/3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 w-1/3">+</button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-gray-800">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full lg:w-96">
        <div className="bg-white rounded-xl p-6 border border-stone-200 sticky top-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
          <div className="space-y-3 text-sm text-gray-600 border-b border-stone-200 pb-4 mb-4">
            <div className="flex justify-between">
              <span>Selected Items ({selectedItems.length})</span>
              <span className="font-semibold text-gray-800">&#8369;{subtotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-gray-800 text-base">Total</span>
            <span className="font-bold text-2xl text-[#7C121A]">&#8369;{total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout} 
            className="w-full bg-[#7C121A] text-white py-3 rounded-md font-bold text-sm hover:bg-[#590e15] transition shadow-md"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  )
}