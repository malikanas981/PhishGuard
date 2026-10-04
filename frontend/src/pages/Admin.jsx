import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminUsers, updateAdminUserStatus } from '../services/api'

function Admin() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Loading admin panel...')
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [currentAdminId, setCurrentAdminId] = useState(null)

  useEffect(() => {
    async function checkAdmin() {
      const token = localStorage.getItem('phishguard_token')

      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || 'Admin access denied')
        }

        setMessage(data.message)
        setCurrentAdminId(data.admin_id)
        const userData = await getAdminUsers(token)
        setUsers(userData)
      } catch (err) {
        setError(err.message || 'Unable to load admin panel')
      }
    }

    checkAdmin()
  }, [navigate])


  async function handleToggleStatus(userId) {
    try {
      const token = localStorage.getItem('phishguard_token')
      if (!token) {
        navigate('/login')
        return
      }

      await updateAdminUserStatus(token, userId)
      const updatedUsers = await getAdminUsers(token)
      setUsers(updatedUsers)
    } catch (err) {
      setError(err.message || 'Unable to update user status')
    }
  }
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              PhishGuard
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Admin Panel
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-12">
          <h1 className="text-4xl font-bold">
            Admin Panel
          </h1>

          <p className="mt-3 text-slate-400">
            Manage PhishGuard security operations.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">{users.length}</p>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Users Management</h2>
          <p className="mt-2 text-sm text-slate-400">
            View registered PhishGuard users and account status.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800">
                    <td className="px-4 py-3 font-medium">{user.full_name}</td>
                    <td className="px-4 py-3 text-slate-300">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.is_verified ? 'Verified' : 'Pending'}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_admin ? 'Admin' : 'User'}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </td>
                    <td className="px-4 py-3">
                      {user.id !== currentAdminId && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {error ? (
          <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <p className="text-emerald-400 font-semibold">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin









