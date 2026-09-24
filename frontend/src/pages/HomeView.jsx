import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const ShieldIcon = ({ className = "w-8 h-8" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-red-800 ${className}`}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const MeetupIcon = ({ className = "w-8 h-8" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-red-800 ${className}`}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const WalletIcon = ({ className = "w-8 h-8" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-red-800 ${className}`}><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
const ChatIcon = ({ className = "w-8 h-8" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-red-800 ${className}`}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

export default function HomeView({ setView, onViewDetails, setSignupEmail, setSignupIsSeller }) {
  const [joinEmail, setJoinEmail] = useState('');
  const handleJoin = () => {
    if (joinEmail && setSignupEmail) {
      setSignupEmail(joinEmail);
      setSignupIsSeller(true);
      setView('auth');
    }
  };

  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const resProd = await axios.get('/api/products/public')
      const resCat = await axios.get('/api/categories')
      
      const productsWithImages = resProd.data.map(item => ({
        ...item,
        image: item.image_url ? `${item.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
      }))
      
      setFeaturedProducts(productsWithImages.slice(0, 4))
      setCategories(resCat.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-[#7C121A] text-[#FDF9F1] flex flex-col md:flex-row pb-24 relative overflow-hidden">
        <div className="w-full md:w-1/2 px-6 md:px-16 lg:px-24 pt-16 pb-12 flex flex-col justify-center z-10">
          <p className="text-sm tracking-[0.3em] mb-4 text-red-200">EXCLUSIVE CAMPUS MARKET</p>
          <h2 className="text-4xl lg:text-6xl font-serif leading-tight mb-6">
            Likha UCN <br/>Market Hub.
          </h2>
          <p className="text-red-100 max-w-md mb-8 text-sm md:text-base leading-relaxed">
            The exclusive marketplace for University of Camarines Norte students. Buy and sell campus essentials safely.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setView('shop')}
              className="bg-[#FDF9F1] text-[#7C121A] px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-white hover:shadow-lg transition flex items-center gap-2"
            >
              SHOP NOW <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[600px]">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80" 
            alt="Campus Students" 
            className="absolute inset-0 w-full h-full object-cover md:rounded-bl-[100px] shadow-2xl z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#7C121A] via-[#7C121A]/40 to-transparent md:w-1/2 z-10 pointer-events-none"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full -mt-16 relative z-20">
        <div className="bg-[#FDF9F1] rounded-2xl shadow-xl p-8 flex flex-wrap lg:flex-nowrap lg:justify-between items-center gap-6 border border-stone-100">
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="shrink-0"><ShieldIcon className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm leading-tight">Verified Students</h4>
              <p className="text-xs text-gray-500 mt-1">Safe community</p>
            </div>
          </div>
          <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="shrink-0"><MeetupIcon className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm leading-tight">Campus Meetups</h4>
              <p className="text-xs text-gray-500 mt-1">Easy local delivery</p>
            </div>
          </div>
          <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="shrink-0"><WalletIcon className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm leading-tight">Secure Payments</h4>
              <p className="text-xs text-gray-500 mt-1">QRPh & Cash accepted</p>
            </div>
          </div>
          <div className="hidden lg:block w-px h-12 bg-gray-200"></div>
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="shrink-0"><ChatIcon className="w-8 h-8" /></div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm leading-tight">Live Chat</h4>
              <p className="text-xs text-gray-500 mt-1">Directly contact sellers</p>
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20 w-full text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px bg-gray-300 w-16 md:w-32"></div>
          <h3 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Shop By Category</h3>
          <div className="h-px bg-gray-300 w-16 md:w-32"></div>
        </div>
        
        {categories.length === 0 ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
            {categories.map((cat, idx) => (
              <div key={idx} onClick={() => setView('shop')} className="flex flex-col items-center cursor-pointer group w-full">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 bg-stone-100 p-2 shadow-sm border border-stone-200 group-hover:shadow-md transition-all group-hover:border-red-200">
                  <img src="https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-500" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{cat.name}</h4>
                <p className="text-xs text-gray-500 group-hover:text-red-700 transition">Explore</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 w-full">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800">FEATURED PRODUCTS</h3>
          <button onClick={() => setView('shop')} className="text-xs font-bold border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition uppercase tracking-wide">View All</button>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="text-gray-500">Loading featured products...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-[1200px] mx-auto px-6 pb-20 w-full">
        <div className="bg-[#8A1A22] rounded-[32px] overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-10">
          <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[8px] border-white overflow-hidden shadow-xl bg-white">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" alt="Join Community" className="w-full h-full object-cover" />
              </div>
          </div>
          
          <div className="w-full md:w-auto text-center md:text-left text-[#FDF9F1] flex-1 md:px-8 border-t md:border-t-0 md:border-r border-red-900/30 pt-8 md:pt-0">
              <p className="text-sm tracking-[0.2em] text-red-200 mb-3 font-semibold uppercase">UCN Community</p>
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 leading-[1.1] tracking-tight">
                Start <br/>Selling <br/>On Campus <br/>Today
              </h3>
              <p className="text-sm md:text-base text-red-100 max-w-[280px] mx-auto md:mx-0">
                Turn your pre-loved items and local creations into cash within the university.
              </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[#FDF9F1] font-bold mb-3 uppercase tracking-widest text-lg">Apply Now</h4>
              <p className="text-sm text-red-100 mb-6 max-w-[220px]">
                Enter your student email to begin the seller verification process.
              </p>
              <div className="flex w-full max-w-[320px] rounded-md overflow-hidden shadow-lg">
                <input type="email" value={joinEmail} onChange={(e) => setJoinEmail(e.target.value)} placeholder="Student Email" className="px-4 py-3 w-full text-sm text-gray-800 outline-none bg-white" />
                <button onClick={handleJoin} className="bg-[#0B132B] text-white px-8 py-3 text-sm font-bold hover:bg-black transition-colors whitespace-nowrap">JOIN</button>
              </div>
          </div>
        </div>
      </section>
    </div>
  )
}