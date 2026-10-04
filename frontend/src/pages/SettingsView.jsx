import { useState, useEffect } from 'react'
import axios from 'axios'

export default function SettingsView({ setUserName }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [editMode, setEditMode] = useState({ name: false, email: false, phone: false, password: false })
  const [showConfirm, setShowConfirm] = useState(false)
  
  // Custom toast state in case they don't have a global one mapped correctly here
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/users/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      setName(res.data.name || '')
      setEmail(res.data.email || '')
      setPhone(res.data.phone || '')
      if (res.data.profile_image_url) {
        setImagePreview(`${res.data.profile_image_url}`)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is larger than 10MB (10485760 bytes)
      if (file.size > 10485760) {
        setToast({ message: 'File is too large. Please select an image under 10MB.', type: 'red' })
        e.target.value = '' // clear the input
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleDiscard = () => {
    setEditMode({ name: false, email: false, phone: false, password: false })
    setPassword('')
    setImageFile(null)
    fetchProfile()
  }

  const handleSaveInit = (e) => {
    e.preventDefault()
    // Check if anything was edited
    const isEdited = editMode.name || editMode.email || editMode.phone || editMode.password || imageFile
    if (!isEdited) {
      setToast({ message: 'No changes to save.', type: 'yellow' })
      setTimeout(() => setToast(null), 3000)
      return
    }
    setShowConfirm(true)
  }

  const confirmAndSave = async () => {
    setShowConfirm(false)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', phone)
      if (password) formData.append('password', password)
      if (imageFile) formData.append('image', imageFile)

      await axios.put('/api/users/profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setEditMode({ name: false, email: false, phone: false, password: false })
      setPassword('')
      fetchProfile()
      
      if (setUserName) setUserName(name)
      
      // Automatically go back as requested
      window.history.back()
    } catch (error) {
      const msg = error.response?.data?.error || error.message
      setToast({ message: `Failed to save settings: ${msg}`, type: 'red' })
      setTimeout(() => setToast(null), 4000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in ${toast.type === 'red' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {toast.type === 'red' ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
          </svg>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Changes</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to save these changes to your profile?</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowConfirm(false)} 
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAndSave} 
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#7C121A] hover:bg-red-900 transition shadow-md"
              >
                Yes, Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Account Settings</h2>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSaveInit} className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm font-bold">No Image</span>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <label className="text-sm font-bold text-gray-700">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#7C121A] hover:file:bg-red-100 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <button type="button" onClick={() => toggleEdit('name')} className="text-xs text-[#7C121A] font-bold hover:underline">{editMode.name ? 'Lock' : 'Edit'}</button>
              </div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!editMode.name} placeholder="Enter your name" className={`border rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] ${!editMode.name ? 'bg-gray-50 border-gray-100 text-gray-500' : 'bg-white border-gray-300'}`} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <button type="button" onClick={() => toggleEdit('email')} className="text-xs text-[#7C121A] font-bold hover:underline">{editMode.email ? 'Lock' : 'Edit'}</button>
              </div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editMode.email} placeholder="Enter your email" className={`border rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] ${!editMode.email ? 'bg-gray-50 border-gray-100 text-gray-500' : 'bg-white border-gray-300'}`} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <button type="button" onClick={() => toggleEdit('phone')} className="text-xs text-[#7C121A] font-bold hover:underline">{editMode.phone ? 'Lock' : 'Edit'}</button>
              </div>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editMode.phone} placeholder="Enter your phone number" className={`border rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] ${!editMode.phone ? 'bg-gray-50 border-gray-100 text-gray-500' : 'bg-white border-gray-300'}`} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">New Password</label>
                <button type="button" onClick={() => toggleEdit('password')} className="text-xs text-[#7C121A] font-bold hover:underline">{editMode.password ? 'Lock' : 'Edit'}</button>
              </div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!editMode.password} placeholder="Leave blank to keep current" className={`border rounded-md px-4 py-2 text-sm outline-none focus:border-[#7C121A] ${!editMode.password ? 'bg-gray-50 border-gray-100 text-gray-500' : 'bg-white border-gray-300'}`} />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={handleDiscard}
              className="px-8 py-3 rounded-md font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              className="bg-[#7C121A] text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-red-900 transition shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
