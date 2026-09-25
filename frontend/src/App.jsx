import NotificationsView from './pages/NotificationsView'
import { useState, useEffect } from 'react'
import HomeView from './pages/HomeView'
import AuthView from './pages/AuthView'
import ShopView from './pages/ShopView'
import CartView from './pages/CartView'
import CheckoutView from './pages/CheckoutView'
import BuyerProfile from './pages/BuyerProfile'
import SellerDashboard from './pages/SellerDashboard'
import AdminPanel from './pages/AdminPanel'
import SellersDirectory from './pages/SellersDirectory'
import ChatView from './pages/ChatView'
import SellerProfile from './pages/SellerProfile'
import ProductDetailsView from './pages/ProductDetailsView'
import SettingsView from './pages/SettingsView'
import ChatbotWidget from './components/ChatbotWidget'
import FAQView from './pages/FAQView'
import TermsView from './pages/TermsView'
import AboutUsView from './pages/AboutUsView'

const SearchIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CartIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const TruckIcon = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;


const HomeIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const StoreIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3h18v4H3z"></path><path d="M4 7v14h16V7"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>;
const UsersIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const InfoIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const ChatIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const DashboardIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const UserIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const AdminIcon = ({ className = "w-5 h-5" }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;

export default function App() {
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    window.alert = (msg) => {
      const msgStr = String(msg);
      const lower = msgStr.toLowerCase();
      let type = 'yellow';
      if (lower.includes('success') || lower.includes('verified') || lower.includes('added') || lower.includes('updated') || lower.includes('submitted')) {
        type = 'green';
      } else if (lower.includes('fail') || lower.includes('error') || lower.includes('invalid') || lower.includes('already') || lower.includes('required') || lower.includes('not found') || lower.includes('occurred')) {
        type = 'red';
      }
      
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message: msgStr, type }]);
      
      setTimeout(() => {
          setToasts((prev) => prev.filter(t => t.id !== id));
        }, 8000);
    };
  }, []);

  const [profileTab, setProfileTab] = useState('purchases');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupIsSeller, setSignupIsSeller] = useState(false);
  const [view, setView] = useState(() => {
    return window.location.hash.replace('#', '') || 'home'
  })

  useEffect(() => {
    window.location.hash = view
  }, [view])

  useEffect(() => {
    const handleHashChange = () => setView(window.location.hash.replace('#', '') || 'home')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem('role')
    return role ? { role } : null
  })
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])
  const [checkoutItems, setCheckoutItems] = useState([])
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [initialChat, setInitialChat] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)
  
  // Chat indicator state
  const [unreadChats, setUnreadChats] = useState(0)

  useEffect(() => {
    const fetchUnread = () => {
      if (!user) return
      const token = localStorage.getItem('token')
      fetch('/api/messages/unread-count', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUnreadChats(data.count || 0))
      .catch(console.error)
    }
    
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
      setUser({ role })
      
      fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setUser(null);
            throw new Error('Unauthorized');
          }
          return res.json();
        })
        .then(data => {
          if (data.email) setUserEmail(data.email)
          if (data.name) setUserName(data.name)
        })
      .catch(err => console.error(err))
    }

    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get('payment')
    const orderId = params.get('order_id')

    if (paymentStatus === 'success' && orderId && token) {
      fetch(`/api/orders/${orderId}/paid`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.productIds) {
          setCart(prev => prev.filter(item => !data.productIds.includes(item.id)))
        }
        alert('Payment successful! Your order has been marked as paid.')
        setView('profile')
        window.history.replaceState(null, '', window.location.pathname)
      })
    } else if (paymentStatus === 'cancelled') {
      alert('Payment cancelled.')
      setView('cart')
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setUser(null)
    setUserEmail('')
    setUserName('')
    setView('home')
    setDropdownOpen(false)
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item)
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }]
    })
    alert('Added to cart')
  }

  const updateQuantity = (id, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id))

  const handlePlaceOrder = (purchasedItemIds) => {
    setCart(prev => prev.filter(item => !purchasedItemIds.includes(item.id)))
    setView('profile')
  }

  const handleViewProduct = (id) => {
    setSelectedProductId(id)
    setView('productDetails')
  }

  const handleLogoClick = () => {
    if (user?.role === 'seller') setView('sellerDashboard')
    else if (user?.role === 'admin') setView('admin')
    else setView('home')
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#FDF9F1] font-sans flex flex-col relative selection:bg-red-200 text-gray-800 overflow-x-hidden pb-[calc(70px+env(safe-area-inset-bottom))] md:pb-0">
      
      <header className={`w-full sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-md" : ""}`}>
        <div className="bg-[#590e15] text-[#FDF9F1] text-[9px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-4 h-4" />
            Reliable Campus Meetups & Delivery
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('terms')} className="hover:text-red-200 transition">Terms</button>
            
            {!user && (
              <button onClick={() => setView('faq')} className="hover:text-red-200 transition">Help Center</button>
            )}
            
            {user?.role === 'buyer' && (
              <>
                <button onClick={() => setView('faq')} className="hover:text-red-200 transition">Help Center</button>
                <button onClick={() => { setProfileTab('notifications'); setView('profile'); }} className="hover:text-red-200 transition">Notifications</button>
              </>
            )}

            {user?.role === 'seller' && (
              <>
                <button onClick={() => setView('faq')} className="hover:text-red-200 transition">Help Center</button>
                <button onClick={() => { setView('notifications'); }} className="hover:text-red-200 transition">Notifications</button>
              </>
            )}
          </div>
        </div>

        <div className={`transition-colors duration-300 ${view === 'home' ? 'bg-[#7C121A] text-[#FDF9F1]' : 'bg-[#FDF9F1] text-gray-800 shadow-sm border-b border-stone-100'} px-4 md:px-8 py-3 sm:py-5 flex justify-between items-center relative`}>
          
          
            <div className="flex items-center gap-1 sm:gap-4">
              
              <div onClick={handleLogoClick} className="cursor-pointer flex items-center gap-3">
            <div className={`p-2 rounded-full ${view === 'home' ? 'bg-[#FDF9F1] text-[#7C121A]' : 'bg-[#7C121A] text-[#FDF9F1]'}`}>
              <div className="w-5 h-5 flex items-center justify-center font-bold text-lg leading-none">L</div>
            </div>
            <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-serif font-bold tracking-widest leading-none">Likha UCN</h1>
                <p className="text-[0.55rem] md:text-[0.65rem] tracking-[0.2em] uppercase opacity-80 mt-1 leading-none">Market Hub</p>
              </div>
          </div>
            </div>

            <nav className="hidden md:flex gap-3 lg:gap-10 text-xs lg:text-sm font-medium tracking-wide">
            {user?.role === 'seller' ? (
              <>
                <button onClick={() => setView('sellerDashboard')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'sellerDashboard' ? 'border-current' : 'border-transparent'}`}>DASHBOARD</button>
                <button onClick={() => setView('about')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'about' ? 'border-current' : 'border-transparent'}`}>ABOUT US</button>
                <button onClick={() => { setView('chat'); setUnreadChats(0); }} className={`relative hover:opacity-70 transition pb-1 border-b-2 ${view === 'chat' ? 'border-current' : 'border-transparent'}`}>
                  CHAT
                  {unreadChats > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>}
                </button>
              </>
            ) : user?.role === 'admin' ? (
              <>
                <button onClick={() => setView('admin')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'admin' ? 'border-current' : 'border-transparent'}`}>ADMIN PANEL</button>
                <button onClick={() => { setView('chat'); setUnreadChats(0); }} className={`relative hover:opacity-70 transition pb-1 border-b-2 ${view === 'chat' ? 'border-current' : 'border-transparent'}`}>
                  CHAT
                  {unreadChats > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setView('home')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'home' ? 'border-current' : 'border-transparent'}`}>HOME</button>
                <button onClick={() => setView('shop')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'shop' ? 'border-current' : 'border-transparent'}`}>SHOP</button>
                <button onClick={() => setView('sellers')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'sellers' ? 'border-current' : 'border-transparent'}`}>SELLERS</button>
                <button onClick={() => setView('about')} className={`hover:opacity-70 transition pb-1 border-b-2 ${view === 'about' ? 'border-current' : 'border-transparent'}`}>ABOUT US</button>
                <button onClick={() => { setView('chat'); setUnreadChats(0); }} className={`relative hover:opacity-70 transition pb-1 border-b-2 ${view === 'chat' ? 'border-current' : 'border-transparent'}`}>
                  CHAT
                  {unreadChats > 0 && <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full shadow-sm"></span>}
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5 z-10">
            {(!user || user.role === 'buyer') && (
              <button onClick={() => setView('shop')} className="hover:opacity-70 transition"><SearchIcon className="w-5 h-5" /></button>
            )}
            
            <div className="relative">
              {user ? (
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-xs md:text-sm font-bold tracking-wide hover:opacity-70 transition flex items-center gap-1 uppercase">
                  {userName || userEmail || 'MY ACCOUNT'} <span className="text-[10px]">&#9660;</span>
                </button>
              ) : (
                <button onClick={() => setView('auth')} className="text-xs md:text-sm font-bold tracking-wide hover:opacity-70 transition flex items-center gap-1 uppercase">
                  <UserIcon className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:inline">LOGIN</span>
                </button>
              )}
              
              {dropdownOpen && user && (
                <div className="absolute right-0 mt-4 w-48 bg-white text-gray-800 rounded-md shadow-xl py-2 border border-stone-100 z-50">
                  {user.role === 'buyer' && (
                    <>
                      <button onClick={() => { setView('profile'); setDropdownOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 font-semibold">My Purchases</button>
                      <button onClick={() => { setView('settings'); setDropdownOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 font-semibold">Settings</button>
                      <button onClick={() => { setView('terms'); setDropdownOpen(false) }} className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 font-semibold">Terms & Conditions</button>
                      <hr className="my-2 border-stone-100" />
                    </>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">Log out</button>
                </div>
              )}
            </div>

            {(!user || user.role === 'buyer') && (
              <button onClick={() => setView('cart')} className="hover:opacity-70 transition relative">
                <CartIcon className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {view === 'home' && <HomeView setView={setView} onViewDetails={handleViewProduct} setSignupEmail={setSignupEmail} setSignupIsSeller={setSignupIsSeller} />}
        {view === 'auth' && <AuthView setView={setView} setUser={setUser} initialEmail={signupEmail} initialIsSeller={signupIsSeller} />}
        {view === 'shop' && <ShopView onViewDetails={handleViewProduct} />}
        
        {view === 'cart' && (
          <CartView 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeItem={removeItem} 
            onProceed={(items) => { setCheckoutItems(items); setView('checkout'); }} 
            setView={setView} 
          />
        )}
        
        {view === 'checkout' && (
          <CheckoutView 
            checkoutItems={checkoutItems} 
            setView={setView} 
            onPlaceOrder={handlePlaceOrder} 
          />
        )}
        
        {view === 'profile' && <BuyerProfile initialTab={profileTab} setView={setView} setSelectedSeller={setSelectedSeller} setInitialChat={setInitialChat} setCheckoutItems={setCheckoutItems} />}
        {view === 'sellerDashboard' && <SellerDashboard />}
        {view === 'admin' && <AdminPanel setView={setView} setInitialChat={setInitialChat} />}
        {view === 'sellers' && <SellersDirectory setView={setView} setSelectedSeller={setSelectedSeller} />}
        {view === 'sellerProfile' && <SellerProfile sellerId={selectedSeller} setView={setView} setInitialChat={setInitialChat} addToCart={addToCart} onViewDetails={handleViewProduct} />}
        {view === 'chat' && <ChatView initialContact={initialChat} />}
        {view === 'productDetails' && <ProductDetailsView productId={selectedProductId} setView={setView} addToCart={addToCart} setSelectedSeller={setSelectedSeller} setInitialChat={setInitialChat} onViewDetails={handleViewProduct} setCheckoutItems={setCheckoutItems} />}
        {view === 'settings' && <SettingsView setUserName={setUserName} />}
                  {view === 'faq' && <FAQView user={user} setView={setView} setInitialChat={setInitialChat} />}
        {view === 'notifications' && <NotificationsView />}
        {view === 'terms' && <TermsView />}
        {view === 'about' && <AboutUsView />}
      </main>

      <footer className="w-full bg-[#FDF9F1] border-t border-stone-200 pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 border-b border-stone-200 pb-10 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-[#7C121A] rounded-full shrink-0"><TruckIcon className="w-5 h-5" /></div>
              <div><h5 className="font-bold text-gray-900 text-sm leading-tight">CAMPUS DELIVERY</h5><p className="text-xs text-gray-500 mt-1">Easy meetup options</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-[#7C121A] rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <div><h5 className="font-bold text-gray-900 text-sm leading-tight">SECURE PAYMENT</h5><p className="text-xs text-gray-500 mt-1">PayMongo QRPh ready</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-[#7C121A] rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              </div>
              <div><h5 className="font-bold text-gray-900 text-sm leading-tight">UCN SELLERS</h5><p className="text-xs text-gray-500 mt-1">Verified UCN accounts</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-[#7C121A] rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
              </div>
              <div><h5 className="font-bold text-gray-900 text-sm leading-tight">LIVE CHAT</h5><p className="text-xs text-gray-500 mt-1">Direct communication</p></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Likha UCN Market Hub. All rights reserved.</p>
        </div>
      </footer>

      
      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 flex justify-around items-center z-[100] pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {user?.role === 'seller' ? (
          <>
            <button onClick={() => setView('sellerDashboard')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'sellerDashboard' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <DashboardIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Dashboard</span>
            </button>
            <button onClick={() => setView('about')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'about' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <InfoIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">About Us</span>
            </button>
            <button onClick={() => { setView('chat'); setUnreadChats(0); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${view === 'chat' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <ChatIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Chat</span>
              {unreadChats > 0 && <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          </>
        ) : user?.role === 'admin' ? (
          <>
            <button onClick={() => setView('admin')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'admin' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <AdminIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Admin</span>
            </button>
            <button onClick={() => { setView('chat'); setUnreadChats(0); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${view === 'chat' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <ChatIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Chat</span>
              {unreadChats > 0 && <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setView('home')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'home' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <HomeIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button onClick={() => setView('shop')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'shop' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <StoreIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Shop</span>
            </button>
            <button onClick={() => setView('sellers')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'sellers' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <UsersIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Sellers</span>
            </button>
            <button onClick={() => setView('about')} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${view === 'about' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <InfoIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">About Us</span>
            </button>
            <button onClick={() => { setView('chat'); setUnreadChats(0); }} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${view === 'chat' ? 'text-[#7C121A]' : 'text-gray-500 hover:text-gray-800'}`}>
              <ChatIcon className="w-5 h-5" />
              <span className="text-[10px] font-bold">Chat</span>
              {unreadChats > 0 && <span className="absolute top-2 right-[15%] w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          </>
        )}
      </div>

      <ChatbotWidget setView={setView} setInitialChat={setInitialChat} />

      
      <div className="fixed top-16 md:top-auto md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-[90%] md:w-auto">
        {toasts.map(toast => {
          const bgColors = {
            green: 'bg-green-50 border-green-200 text-green-800',
            red: 'bg-red-50 border-red-200 text-red-800',
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
          };
          const iconColors = {
            green: 'text-green-600',
            red: 'text-red-600',
            yellow: 'text-yellow-600'
          };
          
          return (
            <div key={toast.id} className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:p-4 rounded-xl shadow-lg border animate-in slide-in-from-top-5 md:slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto w-full max-w-md md:w-max ${bgColors[toast.type]}`}>
              <div className="flex-shrink-0">
                {toast.type === 'green' && (
                  <svg className={`w-5 h-5 ${iconColors.green}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
                {toast.type === 'red' && (
                  <svg className={`w-5 h-5 ${iconColors.red}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
                {toast.type === 'yellow' && (
                  <svg className={`w-5 h-5 ${iconColors.yellow}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                )}
              </div>
              <p className="text-sm font-semibold">{toast.message}</p>
              <button 
                onClick={() => setToasts((prev) => prev.filter(t => t.id !== toast.id))}
                className="ml-3 opacity-60 hover:opacity-100 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
