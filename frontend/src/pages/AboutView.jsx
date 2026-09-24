export default function AboutView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full text-center">
      <h2 className="text-4xl font-serif font-bold text-[#7C121A] mb-6">About Likha UCN Market Hub</h2>
      <p className="text-gray-600 mb-12 leading-relaxed">
        We created this platform to empower Camarines Norte State College students. Buy, sell, and trade within a secure campus community.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h3>
          <p className="text-gray-600">
            Provide a reliable digital marketplace for CNSC students. Make campus commerce safe, fast, and accessible for everyone.
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Our Vision</h3>
          <p className="text-gray-600">
            Become the primary e-commerce ecosystem for student entrepreneurs across all Camarines Norte State College campuses.
          </p>
        </div>
      </div>
    </div>
  )
}