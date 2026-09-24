import { useState, useEffect } from 'react'
import axios from 'axios'

export default function SettingsView() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const [editMode, setEditMode] = useState({ name: false, email: false, phone: false, password: false })

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
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    const confirmSave = window.confirm('Are you sure you want to save these changes?')
    if (!confirmSave) return

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
      alert('Settings saved successfully.')
      setEditMode({ name: false, email: false, phone: false, password: false })
      setPassword('')
      fetchProfile()
    } catch (error) {
      alert('Failed to save settings.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 w-full">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Account Settings</h2>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
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

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-[#7C121A] text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-red-900 transition shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}