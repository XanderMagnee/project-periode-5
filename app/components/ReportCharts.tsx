'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

type ReportData = {
  totalIncome: number
  totalExpense: number
  balance: number
  expenseByCategory: Record<string, number>
  incomeByCategory: Record<string, number>
  advice: string
  transactionCount: number
}

export default function ReportCharts({ data }: { data: ReportData }) {
  const barData = {
    labels: ['Inkomsten', 'Uitgaven'],
    datasets: [
      {
        label: 'Bedrag (€)',
        data: [data.totalIncome, data.totalExpense],
        backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
        borderColor: ['rgb(22, 163, 74)', 'rgb(220, 38, 38)'],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  const expenseCategories = Object.keys(data.expenseByCategory)
  const expenseValues = Object.values(data.expenseByCategory)

  const pieColors = [
    'rgba(59, 130, 246, 0.7)',
    'rgba(239, 68, 68, 0.7)',
    'rgba(245, 158, 11, 0.7)',
    'rgba(16, 185, 129, 0.7)',
    'rgba(139, 92, 246, 0.7)',
    'rgba(236, 72, 153, 0.7)',
    'rgba(20, 184, 166, 0.7)',
    'rgba(251, 146, 60, 0.7)',
  ]

  const pieData = {
    labels: expenseCategories,
    datasets: [
      {
        data: expenseValues,
        backgroundColor: pieColors.slice(0, expenseCategories.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Inkomsten vs Uitgaven</h3>
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `€${value}`,
                },
              },
            },
          }}
        />
      </div>

      {expenseCategories.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Uitgaven per categorie</h3>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                  callbacks: {
                    label: (ctx) => ` €${(ctx.raw as number).toFixed(2)}`,
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-center text-gray-400">
          <p>Geen uitgaven beschikbaar voor diagram</p>
        </div>
      )}
    </div>
  )
}
