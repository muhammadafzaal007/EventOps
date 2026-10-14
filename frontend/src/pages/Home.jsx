import { useEffect, useState } from 'react'
import { getHealth } from '../services/health.service'

function Home() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold text-slate-900">EventOps</h1>
      <p className="mt-1 text-sm text-slate-500">Event Operations &amp; Management Platform</p>

      <div className="mt-6 text-sm">
        <p className="font-medium text-slate-700">Backend status</p>
        {!health && !error && <p className="text-slate-500">Checking...</p>}
        {error && <p className="text-red-600">Not reachable: {error}</p>}
        {health && (
          <div className="mt-1 text-green-700">
            <p>{health.message}</p>
            <p className="text-slate-500">Database: {health.database}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
