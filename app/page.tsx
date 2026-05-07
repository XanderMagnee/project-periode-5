import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const persons = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { transactions: true } } },
  })

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-12 mb-8">
        <h1 className="text-4xl font-bold text-black mb-3">
          💰 Budget Buddy
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Beheer eenvoudig je inkomsten en uitgaven. Krijg inzicht in je financiën
          en ontvang persoonlijk advies.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            href="/persons/new"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Nieuw Persoon
          </Link>
          <Link
            href="/categories"
            className="bg-white border border-black text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Categorieën
          </Link>
        </div>
      </section>

      {/* Persons list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Personen</h2>
          <Link
            href="/persons"
            className="text-black text-sm hover:underline"
          >
            Alle personen →
          </Link>
        </div>

        {persons.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
            <p className="text-5xl mb-3">👤</p>
            <p className="text-lg font-medium mb-1">Nog geen personen</p>
            <p className="text-sm mb-4">Voeg een persoon toe om te beginnen</p>
            <Link
              href="/persons/new"
              className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Eerste persoon aanmaken
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {persons.map((person) => (
              <Link
                key={person.id}
                href={`/persons/${person.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-400 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-black font-bold text-lg">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {person._count.transactions} transacties
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
