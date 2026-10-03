import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getDashboardStats,
  getScanHistory,
} from '../services/api'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} 
from 'recharts'
function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [scans, setScans] = useState([])
  const [error, setError] = useState('')
    const riskData = stats
    ? [
        { name: 'Low Risk', value: stats.low_risk },
        { name: 'Medium Risk', value: stats.medium_risk },
        { name: 'High Risk', value: stats.high_risk },
      ]
    : []
  const riskColors = ['#22c55e', '#eab308', '#ef4444']
  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem('phishguard_token')

        if (!token) {
          throw new Error('Please sign in first')
        }

        const [dashboardStats, scanHistory] = await Promise.all([
          getDashboardStats(token),
          getScanHistory(token),
        ])

        setStats(dashboardStats)
        setScans(scanHistory)
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data')
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

          <div className="flex items-center gap-3">
          <Link
  to="/profile"
  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
>
  Profile
</Link>
            <Link
              to="/"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
            >
              Scanner
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("phishguard_token")
                navigate("/login")
              }}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 hover:border-red-400 hover:text-red-200"
            >
              Logout
            </button>
          </div>
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
            Loading dashboard data...
          </div>
        )}

        {stats && (
          <>
                     <h2 className="text-2xl font-bold mb-5">
  Security Overview
</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
<div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Total Scans</p>
<p className="mt-2 text-3xl font-bold text-cyan-400">{stats.total_scans}</p>
              </div>

<div className="rounded-xl border border-emerald-500/30 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Low Risk</p>
<p className="mt-2 text-3xl font-bold text-emerald-400">{stats.low_risk}</p>
              </div>

<div className="rounded-xl border border-yellow-500/30 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">Medium Risk</p>
<p className="mt-2 text-3xl font-bold text-yellow-400">{stats.medium_risk}</p>
              </div>

<div className="rounded-xl border border-red-500/30 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">High Risk</p>
<p className="mt-2 text-3xl font-bold text-red-400">{stats.high_risk}</p>
              </div>
            </div>
       
                        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Risk Distribution
              </h2>
<p className="mt-2 text-sm text-slate-400">
  Breakdown of your scanned URLs by risk level.
</p>
              <div className="mt-8 flex justify-center">
                <PieChart width={450} height={320}>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                                        label={({ name, value }) => `${name}: ${value}`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={riskColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
            <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900">
               <div className="border-b border-slate-800 p-6">
                <h2 className="text-2xl font-bold">
                  Recent Scan History
                </h2>
<p className="mt-2 text-sm text-slate-400">
  Review your latest URL security analysis results.
</p>
                
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="px-6 py-4">URL</th>
                      <th className="px-6 py-4">Risk Score</th>
                      <th className="px-6 py-4">Risk Level</th>
                      <th className="px-6 py-4">Scanned At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {scans.map((scan) => (
                      <tr
                        key={scan.id}
                        className="border-b border-slate-800 last:border-b-0"
                      >
                        <td className="max-w-md px-6 py-4 break-all text-slate-200">
                          {scan.url}
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          {scan.risk_score}/100
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          {scan.risk_level}
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {new Date(scan.scanned_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {scans.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-slate-400"
                        >
                          No scans found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard








