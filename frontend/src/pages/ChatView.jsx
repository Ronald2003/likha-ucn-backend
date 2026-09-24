import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

export default function ChatView({ initialContact }) {
  const [conversations, setConversations] = useState([])
  const [activeContact, setActiveContact] = useState(initialContact || null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        setCurrentUserId(decoded.id)
      } catch (err) {}
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    if (initialContact) {
      setActiveContact(initialContact)
      fetchMessages(initialContact.contact_id || initialContact.user_id || initialContact.id)
    }
  }, [initialContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConversations(res.data)
      
      setActiveContact(prev => {
        if (!prev) return prev;
        const matched = res.data.find(c => String(c.contact_id) === String(prev.contact_id || prev.user_id || prev.id));
        if (matched && (!prev.logo_url && !prev.profile_image_url)) {
           return { ...prev, logo_url: matched.logo_url, profile_image_url: matched.profile_image_url, store_name: matched.store_name || prev.store_name, name: matched.name || prev.name };
        }
        return prev;
      })
    } catch (error) {
        console.error("FETCH MESSAGES ERROR", error)
    }
  }

  const fetchMessages = async (rawContactId) => {
    const contactId = rawContactId || (activeContact && (activeContact.contact_id || activeContact.user_id || activeContact.id));
    if (!contactId) return;
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get("/api/messages/" + contactId, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(res.data)
      await axios.put("/api/messages/mark-read/" + contactId, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact.contact_id || activeContact.user_id || activeContact.id)
      const interval = setInterval(() => {
        fetchMessages(activeContact.contact_id || activeContact.user_id || activeContact.id)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [activeContact])

  const handleContactClick = (contact) => {
    setActiveContact(contact)
    fetchMessages(contact.contact_id || contact.user_id || contact.id)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeContact) return

    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/messages', 
        { receiverId: activeContact.contact_id || activeContact.user_id || activeContact.id, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewMessage('')
      fetchMessages(activeContact.contact_id || activeContact.user_id || activeContact.id)
      fetchConversations()
    } catch (error) {
        console.error("SEND MESSAGE ERROR", error.response?.data || error)
        alert('Failed to send message: ' + (error.response?.data?.error || error.message))
    }
  }

  
  const getDisplayImage = (contact) => {
    if (!contact) return null;
    const url = contact.logo_url || contact.profile_image_url;
    if (url) {
       return url.startsWith('http') || url.startsWith('data:') ? url : `${url}`;
    }
    return null;
  }

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  }

  return (
    <div className="max-w-6xl mx-auto md:px-6 md:py-6 w-full h-[calc(100vh-65px)] md:h-[650px] flex flex-col md:flex-row md:gap-0 bg-white md:bg-transparent">
      
      {/* Sidebar (Chat List) */}
      <div className={`w-full md:w-[350px] bg-white md:rounded-l-xl md:shadow-sm md:border-y md:border-l border-gray-200 overflow-hidden flex-col ${activeContact ? "hidden md:flex" : "flex h-full"}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <h3 className="text-xl font-semibold text-gray-800 tracking-tight">Chats</h3>
        </div>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-12 h-12 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <p className="text-[14px]">No messages yet</p>
            </div>
          ) : (
            conversations.map(contact => {
              const displayName = contact.role === "admin" ? "Support Administrator" : (contact.store_name || contact.name || contact.contact_email?.split('@')[0] || "User");
              
              return (
                <div 
                  key={contact.contact_id} 
                  onClick={() => handleContactClick(contact)}
                  className={`flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${activeContact?.contact_id === contact.contact_id ? 'bg-gray-50' : 'bg-white'}`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg overflow-hidden shrink-0">
                      {contact.role === "admin" ? (
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                      ) : getDisplayImage(contact) ? (
                        <img src={getDisplayImage(contact)} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(displayName)
                      )}
                    </div>
                    {contact.role === 'admin' && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#7C121A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">ADMIN</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-[15px] font-semibold text-gray-900 truncate pr-2">{displayName}</h4>
                    </div>
                    {/* Dummy preview text since we don't have last_message in DB easily accessible here */}
                    <p className="text-[13px] text-gray-500 truncate">Tap to view conversation</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 bg-[#f5f5f5] md:rounded-r-xl md:shadow-sm md:border border-gray-200 flex flex-col h-full overflow-hidden ${!activeContact ? "hidden md:flex" : "flex"}`}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-white px-3 py-2.5 sm:p-4 border-b border-gray-200 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-3">
                {/* Back Button (Mobile) */}
                <button 
                  className="md:hidden text-[#7C121A] p-1.5 -ml-1.5 rounded-full hover:bg-red-50 transition" 
                  onClick={() => setActiveContact(null)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                
                {/* Header Avatar & Info */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0 border border-gray-100 overflow-hidden">
                   {activeContact.role === "admin" ? (
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                    ) : getDisplayImage(activeContact) ? (
                      <img src={getDisplayImage(activeContact)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(activeContact.role === "admin" ? "Support Administrator" : (activeContact.store_name || activeContact.name || activeContact.contact_email?.split("@")[0] || "User"))
                    )}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[15px] text-gray-900 leading-tight">
                    {activeContact.role === "admin" ? "Support Administrator" : (activeContact.store_name || activeContact.name || activeContact.contact_email?.split("@")[0] || "User")}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[11px] text-gray-500 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message Canvas */}
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto bg-[#f5f5f5]">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm mt-10">Send a message to start chatting.</div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = String(msg.sender_id) === String(currentUserId);
                  return (
                    <div 
                      key={msg.id || index} 
                      className={`px-3.5 py-2.5 rounded-2xl text-[14px] max-w-[75%] shadow-sm ${isMe ? 'self-end bg-[#e0f2f1] text-gray-800 rounded-tr-sm border border-[#b2dfdb]' : 'self-start bg-white text-gray-800 rounded-tl-sm border border-gray-200'}`}
                      style={{ wordBreak: 'break-word' }}
                    >
                      {msg.content}
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="bg-white p-2.5 sm:p-3 border-t border-gray-200 flex items-center gap-2 shrink-0">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 border border-gray-200 bg-gray-50 rounded-full px-4 py-2 sm:py-2.5 text-[14px] outline-none focus:border-gray-300 focus:bg-white transition" 
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className={`p-2 rounded-full transition flex items-center justify-center shrink-0 ${newMessage.trim() ? 'text-[#7C121A] hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
              >
                {/* Send Icon (Paper Airplane style) */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full w-full">
            <svg className="w-20 h-20 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p className="text-gray-400 text-sm font-medium">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
