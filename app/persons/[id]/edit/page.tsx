import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import PersonForm from '@/app/components/PersonForm'

export const dynamic = 'force-dynamic'

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const person = await prisma.person.findUnique({ where: { id } })
  if (!person) notFound()

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {person.name} bewerken
      </h1>
      <PersonForm
        initialData={{
          id: person.id,
          name: person.name,
          email: person.email,
          birthDate: person.birthDate?.toISOString() ?? null,
          address: person.address,
          phone: person.phone,
        }}
      />
    </div>
  )
}
