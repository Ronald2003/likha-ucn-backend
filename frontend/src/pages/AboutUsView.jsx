export default function AboutUsView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">About Likha UCN</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col gap-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h3 className="font-bold text-xl text-[#7C121A] mb-3">Our Purpose</h3>
          <p>Bridging the gap between student entrepreneurs, local sellers, and buyers.</p>
        </section>

        <section>
          <h3 className="font-bold text-xl text-[#7C121A] mb-3">Vision</h3>
          <p>Likha UCN Online Market Hub as the most trusted and accessible digital marketplace in Camarines Norte that supports products, goods, and services as well as innovation, and skills of local entrepreneurs and students, while expanding market reach and aid in building a sustainable local economy.</p>
        </section>
        
        <section>
          <h3 className="font-bold text-xl text-[#7C121A] mb-3">Mission</h3>
          <p>To nurture the student entrepreneurs and local sellers through an accessible digital marketplace that elevates their local products, handmade goods, and services at the University of Camarines Norte and its extensions. By providing a centralized and user-friendly online platform offering digital selling, product promotion, secured payment channels, and coordinated with delivery assistance while supporting business growth of local entrepreneurs within the UCN community.</p>
        </section>
      </div>
    </div>
  )
}
