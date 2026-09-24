export default function HelpCenter() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Help Center & FAQ</h2>
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">How do I sell my items?</h3>
          <p className="text-sm text-gray-600">Register as a seller and provide your CNSC student ID. Wait for admin approval. Once approved, use your dashboard to add products.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-2">What is the platform fee?</h3>
          <p className="text-sm text-gray-600">Likha UCN Market Hub charges a 5% commission on all completed transactions. We do not charge listing fees.</p>
        </div>
      </div>
    </div>
  )
}