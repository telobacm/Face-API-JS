// PieChart.tsx
import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const transformData = (reports: any[]) => {
  const ekspresiCounts = reports.reduce((acc: any, report: any) => {
    const ekspresi = report.ekspresi
    if (acc[ekspresi]) {
      acc[ekspresi]++
    } else {
      acc[ekspresi] = 1
    }
    return acc
  }, {})

  return ekspresiCounts
}

const prepareChartData = (ekspresiCounts: { [key: string]: number }) => {
  const labels = Object.keys(ekspresiCounts)
  const data = Object.values(ekspresiCounts)

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

const PieChart = ({ data, label }: { data: any[]; label: string }) => {
  const ekspresiCounts = transformData(data)
  const chartData = prepareChartData(ekspresiCounts)

  return (
    <div className="grid gap-1 h-64">
      <p className="text-lg font font-semibold">{label}</p>
      <Pie data={chartData} />
    </div>
  )
}

export default PieChart
