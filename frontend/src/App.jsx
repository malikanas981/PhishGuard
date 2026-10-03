import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { loginUser, scanUrl as scanUrlApi } from './services/api'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'

function Scanner() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function scanUrl() {
    if (!url.trim()) {
      setError('Please enter a URL.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const token = localStorage.getItem('phishguard_token')

      if (!token) {
        setError('Please sign in before scanning a URL.')
        return
      }

      const scanData = await scanUrlApi(
        token,
        url.trim(),
      )

      setResult(scanData)
    } catch (err) {
      setError(err.message || 'Unable to scan URL.')
    } finally {
      setLoading(false)
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
              Cybersecurity Platform
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Phishing URL Detection
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Check a URL before you click.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            PhishGuard analyzes suspicious URLs and explains potential
            cybersecurity risks.
          </p>

          <div className="mt-10 flex max-w-3xl gap-3">
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            <button
              onClick={scanUrl}
              disabled={loading}
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan URL'}
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">Scan Result</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-400">Risk Score</p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.risk_score}/100
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Risk Level</p>
                  <p className="mt-1 text-3xl font-bold">
                    {result.risk_level}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Scanned URL</p>
                  <p className="mt-1 break-all text-sm text-slate-200">
                    {result.url}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-300">
                  Analysis
                </p>

                <p className="mt-2 text-slate-400">
                  {result.reasons}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("phishguard_token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App





