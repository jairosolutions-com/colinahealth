"use client";

import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";

export default function PatientPage() {
  const router = useRouter();
  return (
    <div className="text-center flex flex-col gap-[20px]">
      <p>Patient List Page</p>
      <div
        className="cursor-pointer hover:underline"
        onClick={() => onNavigate(router, "/medical-history")}
      >
        Click here to Redirect to Patient Overview Medical Tab
      </div>
    </div>
  );
}
