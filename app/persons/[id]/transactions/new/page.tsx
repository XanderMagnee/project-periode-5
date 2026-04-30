import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import TransactionForm from '@/app/components/TransactionForm'

export const dynamic = 'force-dynamic'

export default async function NewTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const person = await prisma.person.findUnique({ where: { id } })
  if (!person) notFound()

  const categories = await prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/persons" className="hover:underline">Personen</Link>
        {' / '}
        <Link href={`/persons/${id}`} className="hover:underline">{person.name}</Link>
        {' / '}
        <Link href={`/persons/${id}/transactions`} className="hover:underline">Transacties</Link>
        {' / '}
        <span>Nieuw</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Transactie toevoegen
      </h1>
      <TransactionForm personId={id} categories={categories} />
    </div>
  )
}
