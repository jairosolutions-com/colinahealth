import { EditProvider } from "./editContext";
import PatientOverviewComponent from "@/components/patientOverview";

export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full px-[150px] pt-[90px] h-full">
      <EditProvider>
        <PatientOverviewComponent />
        <div className="w-full flex items-center justify-center mt-4 h-full">
          {children}
        </div>
      </EditProvider>
    </div>
  );
}
