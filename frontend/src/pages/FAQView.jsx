import axios from 'axios';
export default function FAQView({ user, setView, setInitialChat }) {
  const handleChatAdmin = async () => {
    try {
      const res = await axios.get("/api/users/admin");
      if(res.data && res.data.id) {
        setInitialChat({ contact_id: res.data.id, store_name: res.data.name || "Administrator", role: "admin" });
        setView("chat");
      } else {
        alert("Administrator not found.");
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting administrator.");
    }
  };

  const faqs = [
    {
      question: "Who is allowed to buy and sell on Likha UCN Market Hub?",
      answer: "Only verified students and staff of the University of Camarines Norte are allowed to sell products. Anyone with an account is allowed to buy."
    },
    {
      question: "How do I pay for my orders?",
      answer: "Pay securely using the QRPh integration via PayMongo during checkout, or arrange Cash on Delivery directly with the seller if they offer it."
    },
    {
      question: "How do I become a seller?",
      answer: "Create an account, switch to the seller profile, and submit your store details. An admin will review and approve your request."
    },
    {
      question: "Where do I pick up my orders?",
      answer: "Sellers dictate their shipping or meetup locations within the campus or nearby Camarines Norte areas. Check the product details or chat with the seller to coordinate."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 w-full">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2 text-center">Frequently Asked Questions</h2>
      <p className="text-gray-500 text-center mb-10 text-sm">Find answers to common questions about using our campus marketplace.</p>
      
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {(user?.role === 'buyer' || user?.role === 'seller') && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#7C121A]">Need more help?</h3>
              <p className="text-sm text-red-900">Get directly in touch with a platform administrator.</p>
            </div>
            <button onClick={handleChatAdmin} className="bg-[#7C121A] text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-red-900 transition">
              Chat with Administrator
            </button>
          </div>
        )}
        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <h3 className="text-base font-bold text-[#7C121A] mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}