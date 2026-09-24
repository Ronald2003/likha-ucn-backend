import { useState } from 'react'

export default function CheckoutView({ checkoutItems, setView, onPlaceOrder }) {
  const [paymentMethod, setPaymentMethod] = useState('qrph')

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal

  const handleCompleteOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to place an order.');
        return;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cart: checkoutItems,
          paymentMethod: paymentMethod,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Order Failed: ${data.error}`);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(`Order successfully placed using ${paymentMethod}!`);
        onPlaceOrder(checkoutItems.map(item => item.id));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order. Please try again.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-6">Checkout</h2>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Payment Method</h3>
            <div className="flex flex-col gap-3">
              {[
                { id: 'qrph', label: 'QRPh' },
                { id: 'bank', label: 'Bank Transfer' },
                { id: 'cop', label: 'Cash-on-Pickup' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition ${paymentMethod === method.id ? 'border-[#7C121A] bg-red-50' : 'border-gray-200 hover:bg-stone-50'}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-[#7C121A] w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Items</h3>
            <div className="flex flex-col gap-4">
              {checkoutItems.map(item => {
                const displayImage = item.image || (item.image_url ? `${item.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-stone-100 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      <img src={displayImage} alt={item.name} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty {item.quantity} &times; ,{item.price.toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-gray-800 text-sm shrink-0">{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white rounded-xl p-6 border border-stone-200 sticky top-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600 border-b border-stone-200 pb-4 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold text-gray-800">&#8369;{subtotal.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-800 text-base">Total</span><span className="font-bold text-2xl text-[#7C121A]">&#8369;{total.toFixed(2)}</span>
            </div>
            <button onClick={handleCompleteOrder} className="w-full bg-[#7C121A] text-white py-3 rounded-md font-bold text-sm tracking-wide hover:bg-[#590e15] transition shadow-md">
              PLACE ORDER
            </button>
            <button onClick={() => setView('cart')} className="w-full text-center text-xs text-gray-500 hover:text-gray-700 mt-4 font-bold uppercase tracking-wide">
              &larr; Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}