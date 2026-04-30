import PersonForm from '@/app/components/PersonForm'

export default function NewPersonPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nieuw Persoon</h1>
      <PersonForm />
    </div>
  )
}
