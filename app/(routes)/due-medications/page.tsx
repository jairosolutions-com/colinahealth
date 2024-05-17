import DueMedication from "@/components/dueMedication";
import DueMedicationLoader from "@/components/loaders/dueMedicationLoader";
import { Suspense } from "react";

export default function DueMedicationPage() {
  return (
    <div className="h-full">
      <DueMedication />
    </div>
  );
}
