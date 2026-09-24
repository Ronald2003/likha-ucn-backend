export default function TermsView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">Terms & Conditions</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col gap-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-3">1. Acceptance of Terms</h3>
          <p>By accessing and using the Likha UCN Market Hub, you accept and agree to be bound by the terms and provisions of this agreement. This platform is exclusively for the University of Camarines Norte community.</p>
        </section>
        
        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-3">2. User Accounts</h3>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities occurring under your account. We reserve the right to refuse service, terminate accounts, or remove content at our discretion.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-3">3. Seller Responsibilities</h3>
          <p>Sellers must provide accurate product descriptions and fulfill orders promptly. Prohibited items, illegal goods, and academic misconduct services are strictly forbidden. Admins reserve the right to suspend sellers violating these rules.</p>
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-800 mb-3">4. Payments and Transactions</h3>
          <p>Payments processed through PayMongo are subject to their terms of service. Likha UCN Market Hub acts solely as an intermediary platform and is not liable for disputes arising from direct cash transactions between buyers and sellers.</p>
        </section>
      </div>
    </div>
  )
}