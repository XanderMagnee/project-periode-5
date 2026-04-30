'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  url: string
  redirectTo: string
  label?: string
}

export default function DeleteButton({ url, redirectTo, label = 'Verwijderen' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je dit wilt verwijderen?')) return
    setLoading(true)
    await fetch(url, { method: 'DELETE' })
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Bezig...' : label}
    </button>
  )
}
