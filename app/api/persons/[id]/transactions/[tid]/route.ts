import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; tid: string }> }
) {
  const { tid } = await params
  const transaction = await prisma.transaction.findUnique({
    where: { id: tid },
    include: { category: true },
  })
  if (!transaction) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(transaction)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tid: string }> }
) {
  const { tid } = await params
  const { categoryId, amount, description, date, type, frequency } =
    await request.json()

  const transaction = await prisma.transaction.update({
    where: { id: tid },
    data: {
      categoryId,
      amount: parseFloat(amount),
      description: description || null,
      date: date ? new Date(date) : undefined,
      type,
      frequency,
    },
    include: { category: true },
  })
  return Response.json(transaction)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; tid: string }> }
) {
  const { tid } = await params
  await prisma.transaction.delete({ where: { id: tid } })
  return new Response(null, { status: 204 })
}
