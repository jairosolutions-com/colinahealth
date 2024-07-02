import Sidebar from "@/components/Sidebar";
import { EditProvider } from "./editContext";
import PatientOverviewComponent from "@/components/patientOverview";
import Footer from "@/components/footer";

export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex h-full flex-col w-full">
        <div className="flex h-full w-full flex-col px-[150px] pt-[90px]">
          <EditProvider>
            <PatientOverviewComponent />
            <div className="mt-4 flex h-full w-full items-center justify-center">
              {children}
            </div>
          </EditProvider>
        </div>
        <Footer />
      </div>
    </div>
  );
}
