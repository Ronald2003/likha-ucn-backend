import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

export default function ShopView({ onViewDetails }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  
  const locations = ['All', 'Basud', 'Capalonga', 'Daet', 'Jose Panganiban', 'Labo', 'Mercedes', 'Paracale', 'San Lorenzo Ruiz', 'San Vicente', 'Santa Elena', 'Talisay', 'Vinzons']

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products/public')
      const productsWithImages = res.data.map(item => ({
        ...item,
        image: item.image_url ? `${item.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
      }))
      setProducts(productsWithImages)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories')
      setCategories([{ id: 'all', name: 'All' }, ...res.data])
    } catch (error) {
      console.error(error)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesLocation = selectedLocation === 'All' || product.location === selectedLocation
    
    let matchesPrice = true;
    if (minPrice !== '') {
      matchesPrice = matchesPrice && product.price >= parseFloat(minPrice)
    }
    if (maxPrice !== '') {
      matchesPrice = matchesPrice && product.price <= parseFloat(maxPrice)
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-serif font-bold text-gray-800">Browse Products</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] w-full md:w-64"
          />
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-[#7C121A] text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-[#590e15] transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Filter Products</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id || cat.name} value={cat.name}>{cat.name === 'All' ? 'All Categories' : cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] bg-white"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">&#8369;</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice} 
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-gray-200 rounded-md pl-7 pr-4 py-2 text-sm outline-none focus:border-[#7C121A]"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">&#8369;</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-gray-200 rounded-md pl-7 pr-4 py-2 text-sm outline-none focus:border-[#7C121A]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setMinPrice('');
                  setMaxPrice('');
                }} 
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm font-bold hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsFilterModalOpen(false)} 
                className="flex-1 bg-[#7C121A] text-white py-2 rounded-md text-sm font-bold hover:bg-[#590e15] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
