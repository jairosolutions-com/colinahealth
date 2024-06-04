"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  total: number;
  totalDone: number;
}

const DoughnutChart = ({total,totalDone}:DoughnutChartProps) => {

  const data = {
    datasets: [
      {
        label: "Due Medications",
        data: [totalDone,total],
        backgroundColor: ["#2f91fa","#0747b6" ],
      },
    ],  
    labels: "accountNames",
  };
return (
    <Doughnut
        data={{
            ...data,
            labels: [] as unknown[],
        }}
        options={{
            cutout: "60%",
            plugins: {
                legend: {
                    display: false,
                },
            },
        }}
    />
);
};

export default DoughnutChart;
