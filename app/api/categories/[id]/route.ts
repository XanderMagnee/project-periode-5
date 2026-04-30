import { prisma } from '@/src/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(category)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { name, description, type } = await request.json()

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      description: description || null,
      type,
    },
  })
  return Response.json(category)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.category.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
