'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Category = {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
}

type TransactionFormProps = {
  personId: string
  categories: Category[]
  initialData?: {
    id: string
    categoryId: string
    amount: number
    description: string | null
    date: string
    type: 'INCOME' | 'EXPENSE'
    frequency: string
  }
}

const FREQUENCIES = [
  { value: 'ONCE', label: 'Eenmalig' },
  { value: 'WEEKLY', label: 'Wekelijks' },
  { value: 'MONTHLY', label: 'Maandelijks' },
  { value: 'YEARLY', label: 'Jaarlijks' },
]

export default function TransactionForm({
  personId,
  categories,
  initialData,
}: TransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedType, setSelectedType] = useState<'INCOME' | 'EXPENSE'>(
    initialData?.type ?? 'EXPENSE'
  )

  const filteredCategories = categories.filter((c) => c.type === selectedType)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = {
      categoryId: (form.elements.namedItem('categoryId') as HTMLSelectElement).value,
      amount: (form.elements.namedItem('amount') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
      date: (form.elements.namedItem('date') as HTMLInputElement).value,
      type: selectedType,
      frequency: (form.elements.namedItem('frequency') as HTMLSelectElement).value,
    }

    const url = initialData
      ? `/api/persons/${personId}/transactions/${initialData.id}`
      : `/api/persons/${personId}/transactions`
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

    router.push(`/persons/${personId}/transactions`)
    router.refresh()
  }

  const dateValue = initialData?.date
    ? new Date(initialData.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

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

      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {(['INCOME', 'EXPENSE'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === t
                  ? t === 'INCOME'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'INCOME' ? '💰 Inkomst' : '💸 Uitgave'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categorie <span className="text-red-500">*</span>
        </label>
        <select
          name="categoryId"
          required
          defaultValue={initialData?.categoryId}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Kies een categorie --</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {filteredCategories.length === 0 && (
          <p className="text-xs text-orange-600 mt-1">
            Geen categorieën beschikbaar voor dit type.{' '}
            <a href="/categories/new" className="underline">
              Categorie aanmaken
            </a>
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bedrag (€) <span className="text-red-500">*</span>
        </label>
        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          defaultValue={initialData?.amount}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Datum
        </label>
        <input
          name="date"
          type="date"
          defaultValue={dateValue}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frequentie
        </label>
        <select
          name="frequency"
          defaultValue={initialData?.frequency ?? 'MONTHLY'}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {FREQUENCIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Omschrijving
        </label>
        <input
          name="description"
          type="text"
          defaultValue={initialData?.description ?? ''}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optionele omschrijving"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-700 text-white py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Opslaan...' : initialData ? 'Wijzigingen opslaan' : 'Transactie toevoegen'}
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
