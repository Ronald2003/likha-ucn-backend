import { useState } from 'react'

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

export default function Header({ currentView, setView, cartCount = 0, user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="w-full relative z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 md:px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <button
          className="md:hidden p-1 text-gray-700 hover:text-red-800 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <div
          className="flex flex-col items-center md:items-start cursor-pointer"
          onClick={() => [setView('home'), setIsMobileMenuOpen(false)]}
        >
          <h1 className="text-xl md:text-3xl font-serif font-bold text-[#7C121A] leading-none">LIKHA UCN</h1>
          <p className="text-[0.6rem] md:text-xs tracking-[0.2em] uppercase text-gray-500 mt-1">Market Hub</p>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-700">
          <button onClick={() => setView('home')} className={`hover:text-[#7C121A] transition ${currentView === 'home' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>HOME</button>
          <button onClick={() => setView('shop')} className={`hover:text-[#7C121A] transition ${currentView === 'shop' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>SHOP</button>
          <button onClick={() => setView('sellers')} className={`hover:text-[#7C121A] transition ${currentView === 'sellers' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>SELLERS</button>
          
          {user?.role === 'buyer' && <button onClick={() => setView('profile')} className={`hover:text-[#7C121A] transition ${currentView === 'profile' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>PROFILE</button>}
          {user?.role === 'seller' && <button onClick={() => setView('dashboard')} className={`hover:text-[#7C121A] transition ${currentView === 'dashboard' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>DASHBOARD</button>}
          {user?.role === 'admin' && <button onClick={() => setView('admin')} className={`hover:text-[#7C121A] transition ${currentView === 'admin' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>ADMIN</button>}
          
          <button onClick={() => setView('help')} className={`hover:text-[#7C121A] transition ${currentView === 'help' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>HELP</button>
          <button onClick={() => setView('terms')} className={`hover:text-[#7C121A] transition ${currentView === 'terms' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>TERMS</button>
          <button onClick={() => setView('chat')} className={`hover:text-[#7C121A] transition ${currentView === 'chat' ? 'text-[#7C121A] border-b-2 border-[#7C121A]' : ''}`}>CHAT</button>
        </nav>

        <div className="flex items-center gap-4 text-gray-700">
          <button className="hidden sm:block hover:text-[#7C121A] transition"><SearchIcon /></button>
          
          {!user ? (
            <button onClick={() => [setView('auth'), setIsMobileMenuOpen(false)]} className="hidden sm:block hover:text-[#7C121A] transition"><UserIcon /></button>
          ) : (
            <button onClick={onLogout} className="hidden sm:block hover:text-[#7C121A] text-xs font-bold transition">LOGOUT</button>
          )}

          <button
            className="hover:text-[#7C121A] transition relative"
            onClick={() => [setView('cart'), setIsMobileMenuOpen(false)]}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7C121A] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-6 flex flex-col gap-4 text-sm font-semibold text-gray-700 z-50">
          <button onClick={() => [setView('home'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">HOME</button>
          <button onClick={() => [setView('shop'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">SHOP</button>
          <button onClick={() => [setView('sellers'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">SELLERS</button>
          
          {user?.role === 'buyer' && <button onClick={() => [setView('profile'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">PROFILE</button>}
          {user?.role === 'seller' && <button onClick={() => [setView('dashboard'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">DASHBOARD</button>}
          {user?.role === 'admin' && <button onClick={() => [setView('admin'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">ADMIN</button>}
          
          <button onClick={() => [setView('help'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">HELP</button>
          <button onClick={() => [setView('terms'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">TERMS</button>
          <button onClick={() => [setView('chat'), setIsMobileMenuOpen(false)]} className="text-left py-2 border-b border-gray-100">CHAT</button>
        </div>
      )}
    </header>
  )
}