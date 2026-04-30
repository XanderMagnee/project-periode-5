import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const type = request.nextUrl.searchParams.get('type')

  const transactions = await prisma.transaction.findMany({
    where: {
      personId: id,
      ...(type ? { type: type as 'INCOME' | 'EXPENSE' } : {}),
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  })
  return Response.json(transactions)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { categoryId, amount, description, date, type, frequency } =
    await request.json()

  if (!categoryId || !amount || !type) {
    return Response.json(
      { error: 'categoryId, amount and type are required' },
      { status: 400 }
    )
  }

  const transaction = await prisma.transaction.create({
    data: {
      personId: id,
      categoryId,
      amount: parseFloat(amount),
      description: description || null,
      date: date ? new Date(date) : new Date(),
      type,
      frequency: frequency || 'MONTHLY',
    },
    include: { category: true },
  })
  return Response.json(transaction, { status: 201 })
}
