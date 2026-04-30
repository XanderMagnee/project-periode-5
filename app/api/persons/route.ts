import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET() {
  const persons = await prisma.person.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { transactions: true } } },
  })
  return Response.json(persons)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, birthDate, address, phone } = body

  if (!name || !email) {
    return Response.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const person = await prisma.person.create({
    data: {
      name,
      email,
      birthDate: birthDate ? new Date(birthDate) : null,
      address: address || null,
      phone: phone || null,
    },
  })
  return Response.json(person, { status: 201 })
}
