import { notFound } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import CategoryForm from '@/app/components/CategoryForm'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) notFound()

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Categorie bewerken
      </h1>
      <CategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          description: category.description,
          type: category.type,
        }}
      />
    </div>
  )
}
