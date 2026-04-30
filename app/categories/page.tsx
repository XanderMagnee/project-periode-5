import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'
import DeleteButton from '@/app/components/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { transactions: true } } },
  })

  const incomeCategories = categories.filter((c) => c.type === 'INCOME')
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categorieën</h1>
        <Link
          href="/categories/new"
          className="bg-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          + Nieuwe Categorie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income */}
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
            <span>💰</span> Inkomsten ({incomeCategories.length})
          </h2>
          {incomeCategories.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">
              Geen inkomstencategorieën
            </div>
          ) : (
            <div className="space-y-2">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat._count.transactions} transacties
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/categories/${cat.id}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Bewerken
                    </Link>
                    {cat._count.transactions === 0 && (
                      <DeleteButton
                        url={`/api/categories/${cat.id}`}
                        redirectTo="/categories"
                        label="✕"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense */}
        <div>
          <h2 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            <span>💸</span> Uitgaven ({expenseCategories.length})
          </h2>
          {expenseCategories.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-sm">
              Geen uitgavencategorieën
            </div>
          ) : (
            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat._count.transactions} transacties
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/categories/${cat.id}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Bewerken
                    </Link>
                    {cat._count.transactions === 0 && (
                      <DeleteButton
                        url={`/api/categories/${cat.id}`}
                        redirectTo="/categories"
                        label="✕"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
