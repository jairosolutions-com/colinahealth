"use client";

import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const tabs = [
    {
      label: "Medical History",
      url: "/medical-history",
    },
    {
      label: "Medication",
      url: "/medication",
    },
    {
      label: "Prescription",
      url: "/prescription",
    },
    {
      label: "Vital Signs",
      url: "/vital-signs",
    },
    {
      label: "Laboratory Results",
      url: "/lab-results",
    },
    {
      label: "Appointment",
      url: "/patient-appointment",
    },
    {
      label: "Notes",
      url: "/notes",
    },
  ];
  return (
    <div className="flex flex-col gap-[150px]">
      <div className="flex flex-col gap-[20px]">
        <div>Patient Overview</div>
        <div className="flex gap-[20px]">
          {tabs.map((tab, index) => (
            <p
              className="cursor-pointer hover:underline"
              key={index}
              onClick={() => onNavigate(router, tab.url)}
            >
              {tab.label}
            </p>
          ))}
        </div>
      </div>
      <div className="h-full w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
