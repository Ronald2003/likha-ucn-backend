export default function ProductCard({ product, onViewDetails }) {
  const reviewCount = product.review_count || 0
  const displayImage = product.image || (product.image_url ? `${product.image_url}` : 'https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')

  return (
    <div 
      className={`group cursor-pointer flex flex-col ${product.stock <= 0 ? "opacity-60 grayscale-[0.2]" : ""}`} 
      onClick={() => onViewDetails && onViewDetails(product.id)}
    >
      <div className="relative bg-[#F5F5F7] rounded-2xl p-0 aspect-square flex items-center justify-center overflow-hidden mb-3">
        <button 
          className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition z-10" 
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <img 
          src={displayImage} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
        />
      </div>

      <div className="flex flex-col px-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-1 flex-1">
            {product.name}
          </h3>
          <span className="font-bold text-gray-900 text-xs sm:text-sm whitespace-nowrap">
            <span className="text-[10px] align-top relative top-[2px] pr-[1px]">&#8369;</span>
            {product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-1 mb-2">
          {product.description || "High-quality campus product"}
        </p>

        <div className="flex items-center gap-1.5">
          <div className="flex gap-[2px] items-center">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">({reviewCount})</span>
        </div>
      </div>
    </div>
  )
}