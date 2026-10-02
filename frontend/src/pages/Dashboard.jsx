import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats, loginUser } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const loginData = await loginUser(
          'test@example.com',
          'TestPassword123!',
        )

        const dashboardStats = await getDashboardStats(
          loginData.access_token,
        )

        setStats(dashboardStats)
      } catch (err) {
        setError(err.message || 'Unable to load dashboard statistics')
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              PhishGuard
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Cybersecurity Platform
            </p>
          </div>

          <Link
            to="/"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
          >
            Scanner
          </Link>
        </div>

        <div className="mt-12">
          <h1 className="text-4xl font-bold">
            Security Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Monitor your phishing URL scanning activity and security insights.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {!stats && !error && (
          <div className="mt-8 text-slate-400">
            Loading dashboard statistics...
          </div>
        )}

        {stats && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Total Scans</p>
              <p className="mt-2 text-3xl font-bold">{stats.total_scans}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Low Risk</p>
              <p className="mt-2 text-3xl font-bold">{stats.low_risk}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Medium Risk</p>
              <p className="mt-2 text-3xl font-bold">{stats.medium_risk}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">High Risk</p>
              <p className="mt-2 text-3xl font-bold">{stats.high_risk}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
