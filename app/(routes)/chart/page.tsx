import Chart from "@/components/chart";
import ChartLoader from "@/components/loaders/ChartLoader";
import { Suspense } from "react";
export default function ChartPage() {
  return (
    // <Suspense fallback={<ChartLoader />}>
    <Chart />
    // </Suspense>
  );
}
