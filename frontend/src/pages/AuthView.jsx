import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AuthView({ setView, setUser, initialEmail = '', initialIsSeller = false, setWelcomeRole }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isSeller, setIsSeller] = useState(initialIsSeller)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [phone, setPhone] = useState('')
  
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (initialEmail) {
      setIsLogin(false)
      setEmail(initialEmail)
    }
  }, [initialEmail])

  const handleSendOtp = async () => {
    if (!email) return alert('Please enter an email first.')
    if (countdown > 0) return;
    setCountdown(60);
    try {
      const res = await axios.post('/api/auth/send-otp', { email })
      alert('A 6-digit verification code has been sent to your email.')
      setOtpSent(true)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send OTP')
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter the OTP.')
    try {
      await axios.post('/api/auth/verify-otp', { email, otp })
      alert('Email verified successfully!')
      setOtpVerified(true)
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid OTP')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isLogin) {
        const res = await axios.post('/api/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        setUser({ role: res.data.role })
        alert('Login successful')
        setView(res.data.role === 'admin' ? 'admin' : res.data.role === 'seller' ? 'sellerDashboard' : 'profile')
      } else {
        if (!otpVerified) return alert('Please verify your email first.')
        if (!agreedToTerms) return alert('You must agree to the Terms of Service and Data Privacy Policy to register.')
        const role = isSeller ? 'seller' : 'buyer'
        const res = await axios.post('/api/auth/register', { 
          email, password, role, storeName, name: fullName, phone 
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        localStorage.setItem('showWelcome', res.data.role)
        window.dispatchEvent(new CustomEvent('showWelcome', { detail: res.data.role }));
        if (setWelcomeRole) setWelcomeRole(res.data.role);
        setUser({ role: res.data.role })
        alert('Registration successful!')
        setView('home')
      }
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || 'An error occurred')
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 w-full">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        
        {!isLogin && (
          <div className="flex gap-2 mb-6 p-1 bg-gray-50 rounded-lg border border-gray-200">
            <button type="button" onClick={() => setIsSeller(false)} className={`flex-1 py-2 text-sm font-bold rounded-md transition ${!isSeller ? 'bg-white shadow-sm text-[#7C121A]' : 'text-gray-500'}`}>Buyer</button>
            <button type="button" onClick={() => setIsSeller(true)} className={`flex-1 py-2 text-sm font-bold rounded-md transition ${isSeller ? 'bg-white shadow-sm text-[#7C121A]' : 'text-gray-500'}`}>Seller</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
            </div>
          )}
          
          {!isLogin && !isSeller && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mobile Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
            </div>
          )}

          {!isLogin && isSeller && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Shop Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
            <div className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!isLogin && otpVerified} required className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
              {!isLogin && !otpVerified && (
                <button type="button" onClick={handleSendOtp} disabled={countdown > 0} className={`${countdown > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-black'} text-white px-3 py-2 rounded-md text-xs font-bold transition whitespace-nowrap`}>
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Send Code'}
                  </button>
              )}
            </div>
          </div>
          
          {!isLogin && otpSent && !otpVerified && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">6-Digit Verification Code</label>
              <div className="flex gap-2">
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" maxLength="6" className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] text-center tracking-widest font-bold" />
                <button type="button" onClick={handleVerifyOtp} className="bg-green-600 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-green-700 transition">
                  Verify
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-200 rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A]" />
          </div>

                      {!isLogin && (
              <div className="flex items-start gap-2 mt-4 text-sm">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 accent-[#7C121A] cursor-pointer"
                />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-[#7C121A] font-bold hover:underline">Terms of Service and Data Privacy Policy</button>.
                </label>
              </div>
            )}
            <button type="submit" disabled={!isLogin && (!otpVerified || !agreedToTerms)} className={`w-full text-white py-3 rounded-md font-bold text-sm transition mt-4 ${(!isLogin && (!otpVerified || !agreedToTerms)) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7C121A] hover:bg-red-900'}`}>
              {isLogin ? 'LOG IN' : 'REGISTER'}
            </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#7C121A] font-bold hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-xl text-gray-800">Terms & Data Privacy Policy</h3>
              <button type="button" onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-gray-700 space-y-4">
              <h4 className="font-bold text-base">1. Data Privacy Policy</h4>
              <p>We are committed to protecting your personal information. By registering on Likha UCN Online Market Hub, you consent to the collection, use, and processing of your data (such as your name, email, phone number, and address) solely for the purpose of facilitating transactions, account management, and providing delivery services. We will never sell your data to third parties.</p>
              
              <h4 className="font-bold text-base">2. Terms of Service</h4>
              <p>As a user, you agree to provide accurate information during registration. Buyers are expected to honor their purchases, particularly Cash-on-Delivery orders. Sellers must accurately represent their products and manage their inventory.</p>
              
              <h4 className="font-bold text-base">3. Account Termination</h4>
              <p>We reserve the right to suspend or terminate accounts that violate our community guidelines, engage in fraudulent transactions, or repeatedly fail to complete Cash-on-Delivery payments.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button type="button" onClick={() => { setAgreedToTerms(true); setShowTermsModal(false); }} className="bg-[#7C121A] text-white px-6 py-2 rounded font-bold hover:bg-red-900 transition">Accept & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

