import React, { useEffect, useState } from "react";

import { PRNMedModal } from "./modals/prn-medication.modal";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const PatientCard = ({
  patientWithMedicationLogsToday,setPatientUuid,isModalOpen
}: {
  patientWithMedicationLogsToday: any;setPatientUuid:any; isModalOpen:any
}) => {


  console.log(patientWithMedicationLogsToday, "patientCard");
  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full flex-col items-center gap-6 pt-12 py-10 pb-10 px-3 right-0 justify-end">
        {patientWithMedicationLogsToday.map((patient: any, index: number) => (
          <div className="flex flex-row items-center bg-white h-[13rem] w-full rounded-lg shadow-lg border-2 border-solid justify-end right-0">
            <div className="flex flex-col w-5/6">
              <img
                className="w-24 h-24 rounded-full"
                src="https://randomuser.me/api/portraits"
                alt="Patient"
              />
              <p>
                {patient.firstName} {patient.lastName} {patient.uuid}
              </p>
            </div>

            <div className="h-full w-1/6 border-l-2 border-solid flex justify-between items-center flex-col">
              <div className="border-b-2 h-full w-full">s</div>
              <div className="border-b-2 h-full w-full">s</div>
              <div
                className="border-b-2 h-full w-full font-semibold items-center justify-center flex cursor-pointer"
                onClick={() => {
               setPatientUuid(patient.uuid);
               isModalOpen(true);
                }}
              >
                PRN
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default PatientCard;
