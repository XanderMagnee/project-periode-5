import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const transactions = await prisma.transaction.findMany({
    where: { personId: id },
    include: { category: true },
  })

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Group expenses by category
  const expenseByCategory: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      const name = t.category.name
      expenseByCategory[name] = (expenseByCategory[name] || 0) + t.amount
    })

  // Group income by category
  const incomeByCategory: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'INCOME')
    .forEach((t) => {
      const name = t.category.name
      incomeByCategory[name] = (incomeByCategory[name] || 0) + t.amount
    })

  let advice = ''
  if (transactions.length === 0) {
    advice = 'Voeg transacties toe om een advies te ontvangen.'
  } else if (balance > 0) {
    const savings = ((balance / totalIncome) * 100).toFixed(1)
    advice = `Goed bezig! Je houdt €${balance.toFixed(2)} over. Je spaart ${savings}% van je inkomsten. Probeer dit bedrag opzij te zetten voor onverwachte uitgaven.`
  } else if (balance === 0) {
    advice = 'Je inkomsten en uitgaven zijn precies in balans. Probeer wat meer te besparen voor een buffer.'
  } else {
    advice = `Let op! Je geeft €${Math.abs(balance).toFixed(2)} meer uit dan je verdient. Bekijk je uitgaven en kijk waar je kunt bezuinigen.`
  }

  return Response.json({
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    incomeByCategory,
    advice,
    transactionCount: transactions.length,
  })
}
