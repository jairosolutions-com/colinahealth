import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import AnimatedCounter from "./ui/animated-counter";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  total: number;
  totalDone: number;
}

const DoughnutChart = ({ total, totalDone }: DoughnutChartProps) => {
  const totalNum = parseInt(String(total));
  const totalDoneNum = parseInt(String(totalDone));
  const data = {
    datasets: [
      {
        label: "Medications",
        data: [totalDoneNum, totalNum === 0 ? 0 : totalNum , totalNum === 0 && totalDoneNum === 0  ? 1 : 0],
        backgroundColor: ["#63ABFD", "#FFA5CB", "#D7D7D7"],
      },
    ],
    labels: ["Total Done", "Total Due"],
  };

  const legendItems = data.labels.map((label, index) => {
    const value = data.datasets[0].data[index];
    const backgroundColor = data.datasets[0].backgroundColor[index];
    return (
      <div
        key={index}
        className="flex items-center mb-2 text-[12px] w-full"
      >
        <div
          className="w-8 h-4  mr-2"
          style={{ backgroundColor }}
        />
        <span >{label}: {AnimatedCounter({ amount: value })}</span>
      </div>
    );
  });

  return (
    <div className="w-[180px] mt-8 mr-10">
      <Doughnut
        data={data}
        options={{
          cutout: "60%",
          rotation: -20,
          plugins: {
            legend: {
              display: false, // Hide the legend from the chart
            },
          },
        }}
      />
      <div
        className="absolute top-14 right-6 "
      >
        {legendItems}
      </div>
    </div>
  );
};

export default DoughnutChart;