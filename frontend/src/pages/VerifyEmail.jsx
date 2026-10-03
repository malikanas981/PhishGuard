import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { resendVerificationCode, verifyEmail } from '../services/api'

function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()

  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) {
      return
    }

    const timer = setInterval(() => {
      setCooldown((current) => current - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  async function handleVerify(event) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    try {
      await verifyEmail(email, otp)
      setMessage('Email verified successfully. Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(err.message || 'Email verification failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (cooldown > 0 || !email) {
      return
    }

    setResending(true)
    setError('')
    setMessage('')

    try {
      const data = await resendVerificationCode(email)
      setMessage(data.message || 'A new verification code has been sent to your email.')
      setCooldown(60)
    } catch (err) {
      setError(err.message || 'Unable to resend verification code')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              PhishGuard
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Verify Your Email
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Enter the 6-digit verification code sent to your email.
            </p>
          </div>

          <form onSubmit={handleVerify} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter 6-digit code"
                required
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center text-xl tracking-[0.4em] text-white outline-none focus:border-cyan-400"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? 'Sending...'
                : cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : 'Resend verification code'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-400 hover:text-cyan-400"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
