"use client";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { fetchPatientForTimeGraph } from "@/app/api/patients-api/patientTimeGraph";
import PatientCard from "@/components/patientCard";
import TimeGraph from "@/components/timeGraph";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const router = useRouter();
  if (!getAccessToken()) {
    onNavigate(router, "/login");
  }
  const [patientList, setPatientList] = useState<any[]>([]);

  const patientWithMedicationLogsToday = patientList?.filter((patient) => {
    // Assuming medicationlogs is an array and you want to check if any of the logs were created today
    return patient.medicationlogs.some((log: any) => { // Explicitly define the type of 'log' as 'any'
      // Check if the createdAt of any medication log is today's date
      const createdAtDate = new Date(log.createdAt);
      const today = new Date();
      return createdAtDate.toDateString() === today.toDateString();
    });
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientListWithPrescription = await fetchPatientForTimeGraph(
          router
        );
        setPatientList(patientListWithPrescription);
      } catch (error) {
        console.error("Error fetching patientListWithPrescription list:");
      }
    };

    fetchData();
  }, []);
  console.log(new Date().toISOString(), "DATE")
  console.log(patientList, " PATIENT LIST");
  console.log(patientWithMedicationLogsToday, "patientWithMedicationLogsToday");

  return (
    <div className="App w-full h-full pt-20 overflow-x-auto">
      <div className="w-full h-full flex">
        <div className="w-1/4 h-full">
          {/* Both components within the same scrolling container */}
          <PatientCard />
        </div>
        <p className="h-full ring-1 ring-black mr-2 -mt-2"></p>
        <div className="w-full overflow-x-auto">
          {/* Only the TimeGraph component has vertical scrolling */}
          <div className=" h-full">
            <TimeGraph patientWithMedicationLogsToday={patientWithMedicationLogsToday} patientList={patientList}/>
          </div>
        </div>
      </div>
    </div>
  );
}
