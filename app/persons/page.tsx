import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function PersonsPage() {
  const persons = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { transactions: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Personen</h1>
        <Link
          href="/persons/new"
          className="bg-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          + Nieuw Persoon
        </Link>
      </div>

      {persons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          <p className="text-5xl mb-3">👤</p>
          <p className="text-lg font-medium">Nog geen personen</p>
          <p className="text-sm mt-1 mb-4">Voeg een persoon toe om te beginnen</p>
          <Link
            href="/persons/new"
            className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            Persoon aanmaken
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {persons.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.email}</p>
                </div>
              </div>
              {person.address && (
                <p className="text-sm text-gray-500 mb-1">📍 {person.address}</p>
              )}
              {person.phone && (
                <p className="text-sm text-gray-500 mb-1">📞 {person.phone}</p>
              )}
              <p className="text-sm text-gray-400 mb-4">
                {person._count.transactions} transacties
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/persons/${person.id}`}
                  className="flex-1 text-center bg-blue-700 text-white text-sm py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Details
                </Link>
                <Link
                  href={`/persons/${person.id}/report`}
                  className="flex-1 text-center bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Rapport
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
