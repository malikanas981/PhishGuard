function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          PhishGuard
        </p>
<button
  onClick={() => window.location.href = '/'}
  className="mt-8 rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
>
  Back to Scanner
</button>
        <h1 className="mt-3 text-4xl font-bold">
          Security Dashboard
        </h1>

        <p className="mt-3 text-slate-400">
          Monitor your phishing URL scanning activity and security insights.
        </p>
      </div>
    </div>
  )
}

export default Dashboard