import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type')

  const categories = await prisma.category.findMany({
    where: type ? { type: type as 'INCOME' | 'EXPENSE' } : undefined,
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { transactions: true } } },
  })
  return Response.json(categories)
}

export async function POST(request: NextRequest) {
  const { name, description, type } = await request.json()

  if (!name || !type) {
    return Response.json({ error: 'Name and type are required' }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: {
      name,
      description: description || null,
      type,
    },
  })
  return Response.json(category, { status: 201 })
}
