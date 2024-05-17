import DueMedication from "@/components/dueMedication";
import DueMedicationLoader from "@/components/loaders/DueMedicationLoader";
import { Suspense } from "react";

export default function DueMedicationPage() {
  return (
    <div className="h-full">
      <Suspense fallback={<DueMedicationLoader />}>
        <DueMedication />
      </Suspense>
    </div>
  );
}
