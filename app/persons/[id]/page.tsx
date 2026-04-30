import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import DeleteButton from '@/app/components/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      transactions: {
        include: { category: true },
        orderBy: { date: 'desc' },
        take: 5,
      },
      _count: { select: { transactions: true } },
    },
  })

  if (!person) notFound()

  const totalIncome = person.transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = person.transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl">
            {person.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{person.name}</h1>
            <p className="text-gray-500">{person.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/persons/${id}/edit`}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Bewerken
          </Link>
          <DeleteButton
            url={`/api/persons/${id}`}
            redirectTo="/persons"
            label="Verwijderen"
          />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-700 font-medium uppercase mb-1">Inkomsten</p>
          <p className="text-2xl font-bold text-green-700">
            €{totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-700 font-medium uppercase mb-1">Uitgaven</p>
          <p className="text-2xl font-bold text-red-700">
            €{totalExpense.toFixed(2)}
          </p>
        </div>
        <div
          className={`${
            totalIncome - totalExpense >= 0
              ? 'bg-blue-50 border-blue-200'
              : 'bg-orange-50 border-orange-200'
          } border rounded-xl p-4`}
        >
          <p className="text-xs text-gray-600 font-medium uppercase mb-1">Saldo</p>
          <p
            className={`text-2xl font-bold ${
              totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-orange-600'
            }`}
          >
            €{(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Persoonlijke gegevens</h2>
          <dl className="space-y-2 text-sm">
            {person.birthDate && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-32">Geboortedatum</dt>
                <dd className="text-gray-800">
                  {new Date(person.birthDate).toLocaleDateString('nl-NL')}
                </dd>
              </div>
            )}
            {person.address && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-32">Adres</dt>
                <dd className="text-gray-800">{person.address}</dd>
              </div>
            )}
            {person.phone && (
              <div className="flex gap-2">
                <dt className="text-gray-500 w-32">Telefoon</dt>
                <dd className="text-gray-800">{person.phone}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-gray-500 w-32">Aangemaakt</dt>
              <dd className="text-gray-800">
                {new Date(person.createdAt).toLocaleDateString('nl-NL')}
              </dd>
            </div>
          </dl>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Acties</h2>
          <div className="flex flex-col gap-2">
            <Link
              href={`/persons/${id}/transactions/new`}
              className="bg-blue-700 text-white text-sm text-center py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              + Transactie toevoegen
            </Link>
            <Link
              href={`/persons/${id}/transactions`}
              className="bg-gray-100 text-gray-700 text-sm text-center py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Alle transacties ({person._count.transactions})
            </Link>
            <Link
              href={`/persons/${id}/report`}
              className="bg-green-600 text-white text-sm text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Rapport bekijken
            </Link>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Recente transacties</h2>
          <Link
            href={`/persons/${id}/transactions`}
            className="text-blue-600 text-sm hover:underline"
          >
            Alle transacties →
          </Link>
        </div>

        {person.transactions.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            Nog geen transacties
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {person.transactions.map((t) => (
              <li key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {t.category.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(t.date).toLocaleDateString('nl-NL')}
                    {t.description && ` · ${t.description}`}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {t.type === 'INCOME' ? '+' : '-'}€{t.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
