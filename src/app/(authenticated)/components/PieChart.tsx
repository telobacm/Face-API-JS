import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useGetList } from '~/services/dashboard'
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

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
  const total = data.reduce((acc, val) => acc + val, 0)

  // const percentages = data.map((val) => ((val / total) * 100).toFixed(2) + '%')

  return {
    labels,
    datasets: [
      {
        label: 'count',
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#0AAD6C',
          '#FF6347',
          '#8A2BE2',
          '#7678ed',
          '#ff7d00',
        ],
      },
    ],
  }
}

const PieChart = ({ label, counted }: { label: string; counted: string }) => {
  const { data: datas } = useGetList('reports/chart')
  const data = datas?.data || []
  const counts = transformData(data, counted)
  const chartData = prepareChartData(counts)

  return (
    <div className="grid gap-1 w-96">
      <p className="text-lg font font-semibold">{label}</p>
      <Pie
        data={chartData}
        options={{
          plugins: {
            datalabels: {
              color: '#f8ffdb',
              labels: {
                value: {
                  font: {
                    weight: 'bold',
                  },
                },
              },
              formatter: (value: any, ctx: any) => {
                const percentage =
                  (
                    (value /
                      ctx.chart.data.datasets[0].data.reduce(
                        (a: any, b: any) => a + b,
                        0,
                      )) *
                    100
                  ).toFixed(2) + '%'
                return percentage
              },
            },
          },
        }}
      />
    </div>
  )
}

export default PieChart
