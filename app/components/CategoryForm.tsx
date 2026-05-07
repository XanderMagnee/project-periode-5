'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type CategoryFormProps = {
  initialData?: {
    id: string
    name: string
    description: string | null
    type: 'INCOME' | 'EXPENSE'
  }
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description:
        (form.elements.namedItem('description') as HTMLInputElement).value || null,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
    }

    const url = initialData
      ? `/api/categories/${initialData.id}`
      : '/api/categories'
    const method = initialData ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      setError(json.error || 'Er is iets misgegaan')
      setLoading(false)
      return
    }

    router.push('/categories')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Naam <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialData?.name}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="bijv. Salaris"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          required
          defaultValue={initialData?.type ?? 'EXPENSE'}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="INCOME">💰 Inkomst</option>
          <option value="EXPENSE">💸 Uitgave</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Beschrijving
        </label>
        <input
          name="description"
          type="text"
          defaultValue={initialData?.description ?? ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Optionele omschrijving"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading
            ? 'Opslaan...'
            : initialData
            ? 'Wijzigingen opslaan'
            : 'Categorie aanmaken'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  )
}
