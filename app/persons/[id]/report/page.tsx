import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import ReportCharts from '@/app/components/ReportCharts'

export const dynamic = 'force-dynamic'

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const person = await prisma.person.findUnique({ where: { id } })
  if (!person) notFound()

  const transactions = await prisma.transaction.findMany({
    where: { personId: id },
    include: { category: true },
  })

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0)

  const balance = totalIncome - totalExpense

  const expenseByCategory: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      expenseByCategory[t.category.name] =
        (expenseByCategory[t.category.name] || 0) + t.amount
    })

  const incomeByCategory: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'INCOME')
    .forEach((t) => {
      incomeByCategory[t.category.name] =
        (incomeByCategory[t.category.name] || 0) + t.amount
    })

  let advice = ''
  if (transactions.length === 0) {
    advice = 'Voeg transacties toe om een advies te ontvangen.'
  } else if (balance > 0) {
    const savings = ((balance / totalIncome) * 100).toFixed(1)
    advice = `Goed bezig! Je houdt €${balance.toFixed(2)} over. Je spaart ${savings}% van je inkomsten. Probeer dit bedrag opzij te zetten voor onverwachte uitgaven of je spaardoel.`
  } else if (balance === 0) {
    advice =
      'Je inkomsten en uitgaven zijn precies in balans. Probeer wat meer te besparen voor een financiële buffer.'
  } else {
    advice = `Let op! Je geeft €${Math.abs(balance).toFixed(2)} meer uit dan je verdient. Bekijk je uitgaven en kijk waar je kunt bezuinigen om schulden te voorkomen.`
  }

  const reportData = {
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    incomeByCategory,
    advice,
    transactionCount: transactions.length,
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/persons" className="hover:underline">Personen</Link>
        {' / '}
        <Link href={`/persons/${id}`} className="hover:underline">{person.name}</Link>
        {' / '}
        <span>Rapport</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Financieel Rapport
        </h1>
        <p className="text-gray-500 text-sm">{person.name}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-700 font-medium uppercase mb-1">Inkomsten</p>
          <p className="text-2xl font-bold text-green-700">€{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-700 font-medium uppercase mb-1">Uitgaven</p>
          <p className="text-2xl font-bold text-red-700">€{totalExpense.toFixed(2)}</p>
        </div>
        <div
          className={`border rounded-xl p-4 ${
            balance >= 0
              ? 'bg-gray-50 border-gray-200'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          <p className="text-xs font-medium uppercase mb-1 text-gray-600">Saldo</p>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? 'text-gray-800' : 'text-orange-600'
            }`}
          >
            €{balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-600 font-medium uppercase mb-1">Transacties</p>
          <p className="text-2xl font-bold text-gray-700">{transactions.length}</p>
        </div>
      </div>

      {/* Advice box */}
      <div
        className={`rounded-xl border p-5 mb-6 ${
          balance > 0
            ? 'bg-green-50 border-green-200'
            : balance < 0
            ? 'bg-orange-50 border-orange-200'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <h2 className="font-semibold text-gray-800 mb-2">
          {balance > 0 ? '✅' : balance < 0 ? '⚠️' : 'ℹ️'} Advies
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">{advice}</p>
      </div>

      {/* Charts */}
      {transactions.length > 0 ? (
        <ReportCharts data={reportData} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          <p className="text-5xl mb-3">📊</p>
          <p className="font-medium">Nog geen gegevens voor grafieken</p>
          <p className="text-sm mt-1 mb-4">Voeg transacties toe om grafieken te zien</p>
          <Link
            href={`/persons/${id}/transactions/new`}
            className="bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Transactie toevoegen
          </Link>
        </div>
      )}

      {/* Category breakdown tables */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Income by category */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-700 mb-3">Inkomsten per categorie</h3>
            {Object.keys(incomeByCategory).length === 0 ? (
              <p className="text-gray-400 text-sm">Geen inkomsten</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(incomeByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, amount]) => (
                    <li key={name} className="flex justify-between text-sm">
                      <span className="text-gray-600">{name}</span>
                      <span className="font-semibold text-green-600">
                        €{amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Expense by category */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-700 mb-3">Uitgaven per categorie</h3>
            {Object.keys(expenseByCategory).length === 0 ? (
              <p className="text-gray-400 text-sm">Geen uitgaven</p>
            ) : (
              <ul className="space-y-2">
                {Object.entries(expenseByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, amount]) => (
                    <li key={name} className="flex justify-between text-sm">
                      <span className="text-gray-600">{name}</span>
                      <span className="font-semibold text-red-600">
                        €{amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
