function App() {
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

      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Phishing URL Detection
          </p>

          <h2 className="text-5xl font-bold leading-tight">
            Protect yourself from
            <span className="text-cyan-400"> phishing attacks.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            PhishGuard analyzes suspicious URLs and helps users understand
            potential cybersecurity risks before they click.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
              Scan a URL
            </button>

            <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-900">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App