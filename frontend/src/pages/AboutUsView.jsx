export default function AboutUsView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">About Likha UCN</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col gap-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h3 className="font-bold text-xl text-[#7C121A] mb-3">Our Purpose</h3>
          <p>Likha UCN Market Hub exists to bridge the gap between student sellers and buyers at the University of Camarines Norte. We provide a secure, localized platform making it easy to trade campus essentials, academic tools, and local creations within a trusted community.</p>
        </section>
        
        <section>
          <h3 className="font-bold text-xl text-[#7C121A] mb-3">Our Mission</h3>
          <p>To empower UCN students by providing a seamless and secure digital marketplace fostering entrepreneurial spirit, encouraging peer-to-peer support, and driving economic growth within the campus.</p>
        </section>

        <section>
          <h3 className="font-bold text-xl text-[#7C121A] mb-3">Our Vision</h3>
          <p>To become the central digital hub for campus commerce, innovation, and student collaboration at the University of Camarines Norte, setting a standard for university-based e-commerce platforms.</p>
        </section>
      </div>
    </div>
  )
}