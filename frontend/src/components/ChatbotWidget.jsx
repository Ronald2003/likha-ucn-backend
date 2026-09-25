import { useState, useRef, useEffect } from 'react'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
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

  const faqs = [
    { q: 'How do I order?', a: 'Add items to your cart, proceed to checkout, and select QRPh or Cash-on-Pickup.' },
    { q: 'How do I become a seller?', a: 'Register a new account and select the Seller option. Wait for admin approval.' },
    { q: 'Where do I pick up orders?', a: 'Sellers will update your order status to Ready for Pickup. Coordinate directly via the messaging feature.' }
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
        <div className="bg-white w-80 rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-96">
          <div className="bg-[#7C121A] text-white p-4 flex justify-between items-center">
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
            {faqs.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleFaqClick(faq.q, faq.a)}
                className="text-left text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 p-2 rounded-md transition text-gray-700 font-semibold"
              >
                {faq.q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}