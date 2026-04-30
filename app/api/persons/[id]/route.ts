import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      transactions: {
        include: { category: true },
        orderBy: { date: 'desc' },
      },
    },
  })
  if (!person) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(person)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { name, email, birthDate, address, phone } = await request.json()

  const person = await prisma.person.update({
    where: { id },
    data: {
      name,
      email,
      birthDate: birthDate ? new Date(birthDate) : null,
      address: address || null,
      phone: phone || null,
    },
  })
  return Response.json(person)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.person.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
