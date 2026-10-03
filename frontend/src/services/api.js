const API_BASE_URL = 'http://127.0.0.1:8000/api'

export async function registerUser(email, fullName, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      full_name: fullName,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail?.[0]?.msg ||
        data.detail ||
        'Registration failed',
    )
  }

  return data
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed')
  }

  return data
}

export async function scanUrl(token, url) {
  const response = await fetch(`${API_BASE_URL}/scans/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail?.[0]?.msg ||
        data.detail ||
        'Unable to scan URL',
    )
  }

  return data
}

export async function getDashboardStats(token) {
  const response = await fetch(`${API_BASE_URL}/scans/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Unable to load dashboard statistics')
  }

  return data
}

export async function getScanHistory(token) {
  const response = await fetch(`${API_BASE_URL}/scans/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Unable to load scan history')
  }

  return data
}

export default API_BASE_URL
