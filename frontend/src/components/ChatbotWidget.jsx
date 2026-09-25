import { useState, useRef, useEffect } from 'react'

export default function ChatbotWidget({ setView, setInitialChat }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFaqTab, setActiveFaqTab] = useState('buyer')
  const [messages, setMessages] = useState([
    { text: 'Hello! I am the Likha UCN automated assistant. How do you need help today?', isBot: true }
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFaqClick = (question, answer) => {
    setMessages(prev => [...prev, { text: question, isBot: false }])
    setTimeout(() => {
      setMessages(prev => [...prev, { text: answer, isBot: true }])
    }, 500)
  }

  const handleChatAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessages(prev => [...prev, { text: 'You need to be logged in to chat with the admin.', isBot: true }]);
        return;
      }
      
      const res = await fetch('/api/users/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const admin = await res.json();
      
      if (admin && admin.id) {
        if (setInitialChat && setView) {
          setInitialChat({ contact_id: admin.id, name: admin.name || 'Admin Support', role: 'admin' });
          setView('chat');
          setIsOpen(false);
        }
      } else {
        setMessages(prev => [...prev, { text: 'Admin is currently unavailable.', isBot: true }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { text: 'Failed to connect to Admin.', isBot: true }]);
    }
  }

  const buyerFaqs = [
    { q: 'How do I order?', a: 'Add items to your cart, proceed to checkout, and select QRPh or Cash-on-Pickup.' },
    { q: 'Where do I pick up orders?', a: 'Sellers will update your order status to Ready for Pickup. Coordinate directly via the messaging feature.' },
    { q: 'What payment methods can I use?', a: 'Cash-on-Pickup (order goes through instantly) or QRPh/Bank Transfer via the PayMongo gateway — you\'ll be redirected back to Likha Hub once payment succeeds.' },
    { q: 'How do I track my order?', a: 'Go to My Account > Purchase History. Status moves from Pending to Ready for Pickup to Completed.' },
    { q: 'How do I leave a review?', a: 'Once the seller marks your order Completed, a Rate button appears — give 1 to 5 stars plus a comment, and it shows on the shop page right away.' },
    { q: 'How do I create an account?', a: 'Click LOGIN > Register > select Buyer, then verify with the 6-digit OTP code sent to you.' },
    { q: 'How do I add items to my cart?', a: 'Browse SHOP and click Add to Cart on any listed product. Only admin-approved products appear here.' }
  ]

  const sellerFaqs = [
    { q: 'How do I become a seller?', a: 'Register a new account and select the Seller option. Wait for admin approval.' },
    { q: 'Why is my account still pending?', a: 'New seller accounts need Admin approval before you can start selling — this is expected, not an error.' },
    { q: 'Why isn\'t my product showing in the shop?', a: 'Every new product starts hidden and needs Admin approval before buyers can see it.' },
    { q: 'How do I add a product?', a: 'Once approved, go to My Account > Add Product, fill in the details and upload an image, then submit.' },
    { q: 'How do I change my store name or logo?', a: 'My Account > Store Settings. Logo uploads directly; a store name change is a request that Admin has to approve.' },
    { q: 'How do I manage incoming orders?', a: 'Go to the Orders tab, update status from Pending to Ready for Pickup to Completed, and use "Mark as Paid" for Cash-on-Pickup orders once you\'ve collected payment in person.' }
  ]

  return (
    <div className="fixed bottom-[80px] md:bottom-6 right-4 md:right-6 z-[90]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#7C121A] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-red-900 transition text-2xl font-bold"
        >
          ?
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-[#7C121A] text-white p-4 flex justify-between items-center shadow-md z-10">
            <span className="font-bold text-sm">Likha Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 font-bold">X</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.isBot ? 'bg-white border border-gray-200 text-gray-800 self-start' : 'bg-[#7C121A] text-white self-end'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-500 mb-1">Frequently Asked Questions:</span>
            
            <div className="flex gap-2 mb-1">
              <button onClick={() => setActiveFaqTab('buyer')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-sm transition ${activeFaqTab === 'buyer' ? 'bg-[#7C121A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Buyer FAQs</button>
              <button onClick={() => setActiveFaqTab('seller')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-sm transition ${activeFaqTab === 'seller' ? 'bg-[#7C121A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Seller FAQs</button>
            </div>
            
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
              {(activeFaqTab === 'buyer' ? buyerFaqs : sellerFaqs).map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFaqClick(faq.q, faq.a)}
                  className="text-left text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 p-2 rounded-md transition text-gray-700 font-semibold"
                >
                  {faq.q}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleChatAdmin}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-md text-xs font-bold hover:bg-gray-900 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Chat with Admin
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
