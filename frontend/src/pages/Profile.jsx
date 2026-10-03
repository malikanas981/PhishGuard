import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyProfile } from '../services/api'

function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('phishguard_token')

        if (!token) {
          navigate('/login')
          return
        }

        const data = await getMyProfile(token)
        setProfile(data)
      } catch (err) {
        setError(err.message || 'Unable to load profile')
      }
    }

    loadProfile()
  }, [navigate])

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              PhishGuard
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Cybersecurity Platform
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
            >
              Dashboard
            </Link>

            <Link
              to="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
            >
              Scanner
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="mt-3 text-slate-400">
            View your PhishGuard account information.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!profile && !error && (
          <div className="mt-8 text-slate-400">
            Loading profile...
          </div>
        )}

        {profile && (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex items-center gap-5 border-b border-slate-800 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-slate-950">
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {profile.full_name}
                </h2>

                <p className="mt-1 text-slate-400">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">
                  Full Name
                </p>

                <p className="mt-2 font-semibold">
                  {profile.full_name}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">
                  Email Address
                </p>

                <p className="mt-2 break-all font-semibold">
                  {profile.email}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">
                  Email Verification
                </p>

                <p className="mt-2 font-semibold text-emerald-400">
                  {profile.is_verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-sm text-slate-400">
                  Account Status
                </p>

                <p className="mt-2 font-semibold text-emerald-400">
                  {profile.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
