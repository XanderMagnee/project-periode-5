import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import TransactionForm from '@/app/components/TransactionForm'

export const dynamic = 'force-dynamic'

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string; tid: string }>
}) {
  const { id, tid } = await params

  const [person, transaction, categories] = await Promise.all([
    prisma.person.findUnique({ where: { id } }),
    prisma.transaction.findUnique({ where: { id: tid } }),
    prisma.category.findMany({ orderBy: [{ type: 'asc' }, { name: 'asc' }] }),
  ])

  if (!person || !transaction) notFound()

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/persons" className="hover:underline">Personen</Link>
        {' / '}
        <Link href={`/persons/${id}`} className="hover:underline">{person.name}</Link>
        {' / '}
        <Link href={`/persons/${id}/transactions`} className="hover:underline">Transacties</Link>
        {' / '}
        <span>Bewerken</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Transactie bewerken
      </h1>
      <TransactionForm
        personId={id}
        categories={categories}
        initialData={{
          id: transaction.id,
          categoryId: transaction.categoryId,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date.toISOString(),
          type: transaction.type,
          frequency: transaction.frequency,
        }}
      />
    </div>
  )
}
