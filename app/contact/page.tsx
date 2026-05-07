export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact</h1>
      <p className="text-gray-500 mb-8">
        Neem contact op met Stichting KlikJongeren
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Contact info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Contactgegevens</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3 items-start">
              <span className="text-xl">🏢</span>
              <div>
                <p className="font-medium text-gray-800">Stichting KlikJongeren</p>
                <p>Koningin Julianaplein 10</p>
                <p>2595 AA Den Haag</p>
              </div>
            </li>
            <li className="flex gap-3 items-center">
              <span className="text-xl">📧</span>
              <span>info@klikjongeren.nl</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="text-xl">📞</span>
              <span>070 – 123 45 67</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="text-xl">🌐</span>
              <span>www.klikjongeren.nl</span>
            </li>
          </ul>
        </div>

        {/* Opening hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Openingstijden</h2>
          <ul className="space-y-2 text-sm">
            {[
              { day: 'Maandag', hours: '09:00 – 17:00' },
              { day: 'Dinsdag', hours: '09:00 – 17:00' },
              { day: 'Woensdag', hours: '09:00 – 17:00' },
              { day: 'Donderdag', hours: '09:00 – 17:00' },
              { day: 'Vrijdag', hours: '09:00 – 16:00' },
              { day: 'Zaterdag', hours: 'Gesloten' },
              { day: 'Zondag', hours: 'Gesloten' },
            ].map(({ day, hours }) => (
              <li key={day} className="flex justify-between">
                <span className="text-gray-600">{day}</span>
                <span
                  className={`font-medium ${
                    hours === 'Gesloten' ? 'text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {hours}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Locatie</h2>
          <p className="text-sm text-gray-500">Koningin Julianaplein 10, Den Haag</p>
        </div>
        <iframe
          title="Locatie Stichting KlikJongeren"
          src="https://www.openstreetmap.org/export/embed.html?bbox=4.290000%2C52.070000%2C4.310000%2C52.080000&layer=mapnik&marker=52.0757%2C4.3007"
          width="100%"
          height="350"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        />
      </div>
    </div>
  )
}
