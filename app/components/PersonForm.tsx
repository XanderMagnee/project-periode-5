'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type PersonFormProps = {
  initialData?: {
    id: string
    name: string
    email: string
    birthDate: string | null
    address: string | null
    phone: string | null
  }
}

export default function PersonForm({ initialData }: PersonFormProps) {
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
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      birthDate:
        (form.elements.namedItem('birthDate') as HTMLInputElement).value || null,
      address:
        (form.elements.namedItem('address') as HTMLInputElement).value || null,
      phone:
        (form.elements.namedItem('phone') as HTMLInputElement).value || null,
    }

    const url = initialData
      ? `/api/persons/${initialData.id}`
      : '/api/persons'
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

    const person = await res.json()
    router.push(`/persons/${person.id}`)
    router.refresh()
  }

  const birthDateValue = initialData?.birthDate
    ? new Date(initialData.birthDate).toISOString().split('T')[0]
    : ''

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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Jan Jansen"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          E-mailadres <span className="text-red-500">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          defaultValue={initialData?.email}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="jan@voorbeeld.nl"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Geboortedatum
        </label>
        <input
          name="birthDate"
          type="date"
          defaultValue={birthDateValue}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adres
        </label>
        <input
          name="address"
          type="text"
          defaultValue={initialData?.address ?? ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Straat 1, 1234AB Stad"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefoonnummer
        </label>
        <input
          name="phone"
          type="tel"
          defaultValue={initialData?.phone ?? ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="06-12345678"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-700 text-white py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Opslaan...' : initialData ? 'Wijzigingen opslaan' : 'Persoon aanmaken'}
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
