import { useState } from 'react'
import { loginUser, scanUrl as scanUrlApi } from './services/api'

function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const scanUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const loginData = await loginUser(
  'test@example.com',
  'TestPassword123!',
)
      

      const scanData = await scanUrlApi(
  loginData.access_token,
  url.trim(),
)

      setResult(scanData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">
            Phish<span className="text-cyan-400">Guard</span>
          </h1>

          <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-400">
            Cybersecurity Platform
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Phishing URL Detection
          </p>

          <h2 className="mt-4 text-5xl font-bold leading-tight">
            Check a URL before
            <span className="text-cyan-400"> you click.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            PhishGuard analyzes suspicious URLs and explains potential
            cybersecurity risks.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  scanUrl()
                }
              }}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

            <button
              onClick={scanUrl}
              disabled={loading}
              className="rounded-lg bg-cyan-500 px-7 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan URL'}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Risk Score</p>
                  <p className="mt-1 text-4xl font-bold">
                    {result.risk_score}
                    <span className="text-lg text-slate-500">/100</span>
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    result.risk_level === 'HIGH'
                      ? 'bg-red-500/10 text-red-400'
                      : result.risk_level === 'MEDIUM'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-green-500/10 text-green-400'
                  }`}
                >
                  {result.risk_level}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-300">
                  Analysis
                </p>

                <p className="mt-2 leading-7 text-slate-400">
                  {result.reasons}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-800 pt-5">
                <p className="break-all text-sm text-slate-500">
                  {result.url}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App