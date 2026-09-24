import { useState, useEffect } from 'react'
import axios from 'axios'

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
    markAllAsRead()
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full min-h-[60vh]">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8">Notifications</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">You have no notifications.</p>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition last:border-0">
              <h4 className="font-bold text-gray-800 text-sm">{notif.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
              <span className="text-[10px] text-gray-400 mt-2 block font-bold">{new Date(notif.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
