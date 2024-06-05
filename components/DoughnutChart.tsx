"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  total: number;
  totalDone: number;
}

const DoughnutChart = ({ total, totalDone }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: "Medications",
        data: [totalDone, total - totalDone , total === 0 ? 1 : 0],
        backgroundColor: ["#63ABFD","#FFA5CB" ,"#D7D7D7"],
      },
    ],
    labels: ["Total Done", "Total Due"],
  };

  return (
    <div className="w-[300px] ">
      <Doughnut
        data={data}
        options={{
          cutout: "60%",
          rotation: -20,
          plugins: {
            legend: {
              display: true,
              position: "right",
              labels: {
                generateLabels: (chart) => {
                  const dataset = chart.data.datasets[0];
                  const labels = chart.data.labels || []; // Use default empty array if labels are undefined

                  const backgroundColors = Array.isArray(
                    dataset.backgroundColor
                  )
                    ? dataset.backgroundColor
                    : [];

                  return labels.map((label, index) => {
                    const value = dataset.data[index];
                    const backgroundColor = backgroundColors[index];
                    return {
                      text: `${label}: ${value}`,
                      fillStyle: backgroundColor,
                      hidden: false,
                      index,
                    };
                  });
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;
