import CategoryForm from '@/app/components/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nieuwe Categorie</h1>
      <CategoryForm />
    </div>
  )
}
