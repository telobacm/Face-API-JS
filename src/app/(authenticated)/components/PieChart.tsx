// PieChart.tsx
import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const transformData = (reports: any[], counted: string) => {
  const counts = reports.reduce((acc: any, report: any) => {
    const item = report[counted] // Use bracket notation here
    if (acc[item]) {
      acc[item]++
    } else {
      acc[item] = 1
    }
    return acc
  }, {})

  return counts
}

const prepareChartData = (counts: { [key: string]: number }) => {
  const labels = Object.keys(counts)
  const data = Object.values(counts)

  return {
    labels,
    datasets: [
      {
        label: 'jumlah',
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF6347',
          '#8A2BE2',
          '#3CB371',
          '#FFA500',
        ],
      },
    ],
  }
}

const PieChart = ({
  data,
  label,
  counted,
}: {
  data: any[]
  label: string
  counted: string
}) => {
  const counts = transformData(data, counted)
  const chartData = prepareChartData(counts)

  return (
    <div className="grid gap-1 h-64">
      <p className="text-lg font font-semibold">{label}</p>
      <Pie data={chartData} />
    </div>
  )
}

export default PieChart
