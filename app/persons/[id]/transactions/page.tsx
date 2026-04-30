import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import DeleteButton from '@/app/components/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { id } = await params
  const { type } = await searchParams

  const person = await prisma.person.findUnique({ where: { id } })
  if (!person) notFound()

  const transactions = await prisma.transaction.findMany({
    where: {
      personId: id,
      ...(type === 'INCOME' || type === 'EXPENSE' ? { type } : {}),
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  })

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/persons" className="hover:underline">Personen</Link>
        {' / '}
        <Link href={`/persons/${id}`} className="hover:underline">{person.name}</Link>
        {' / '}
        <span>Transacties</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transacties</h1>
        <Link
          href={`/persons/${id}/transactions/new`}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          + Nieuwe Transactie
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-700 font-medium uppercase mb-1">Inkomsten</p>
          <p className="text-2xl font-bold text-green-700">€{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-700 font-medium uppercase mb-1">Uitgaven</p>
          <p className="text-2xl font-bold text-red-700">€{totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-700 font-medium uppercase mb-1">Saldo</p>
          <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-orange-600'}`}>
            €{(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { label: 'Alles', value: '' },
          { label: 'Inkomsten', value: 'INCOME' },
          { label: 'Uitgaven', value: 'EXPENSE' },
        ].map(({ label, value }) => (
          <Link
            key={value}
            href={value ? `?type=${value}` : `?`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (type ?? '') === value
                ? 'bg-blue-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Transactions list */}
      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          <p className="text-5xl mb-3">📋</p>
          <p className="text-lg font-medium">Geen transacties gevonden</p>
          <p className="text-sm mt-1 mb-4">Voeg een transactie toe om te beginnen</p>
          <Link
            href={`/persons/${id}/transactions/new`}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            Transactie toevoegen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Datum</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Categorie</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Omschrijving</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Frequentie</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">Bedrag</th>
                <th className="text-right px-4 py-3 text-gray-600 font-medium">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(t.date).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.type === 'INCOME'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {t.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.description || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">
                    {t.frequency.toLowerCase()}
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}€{t.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/persons/${id}/transactions/${t.id}/edit`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Bewerken
                      </Link>
                      <DeleteButton
                        url={`/api/persons/${id}/transactions/${t.id}`}
                        redirectTo={`/persons/${id}/transactions`}
                        label="✕"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
