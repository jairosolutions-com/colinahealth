import React, { useEffect, useState } from "react";

import { PRNMedModal } from "./modals/prn-medication.modal";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { onNavigate } from "@/actions/navigation";

const PatientCard = ({
  patientWithMedicationLogsToday,
  setPatientUuid,
  isModalOpen,
}: {
  patientWithMedicationLogsToday: any;
  setPatientUuid: any;
  isModalOpen: any;
}) => {
  const router = useRouter();
  // Function to get distinct allergy types
  const getDistinctAllergyTypes = (allergies: any[]) => {
    const distinctTypes: string[] = [];
    allergies.forEach((allergy: any) => {
      if (!distinctTypes.includes(allergy.type)) {
        distinctTypes.push(allergy.type);
      }
    });
    return distinctTypes.join(", ");
  };
  // Function to get medication types and their counts
  const getPRNCount = (medicationLogs: any[]) => {
    const medicationTypes: { [key: string]: number } = {};

    // Count the occurrences of each medication type
    medicationLogs.forEach((log: any) => {
      if (log.medicationType === "PRN") {
        if (!medicationTypes[log.medicationType]) {
          medicationTypes[log.medicationType] = 1;
        } else {
          medicationTypes[log.medicationType]++;
        }
      }
    });

    return medicationTypes;
  };
  const handlePatientClick = (patientId: any) => {
    const lowercasePatientId = patientId.toLowerCase();

    onNavigate(
      router,
      `/patient-overview/${lowercasePatientId}/medical-history/allergies`
    );
  };

  console.log(patientWithMedicationLogsToday, "patientCard");
  return (
    <div className="w-full h-full pt-8 pb-4">
      <div className="flex w-full h-full flex-col bg-[#F4F4F4] items-center  border-dashed border-r border-r-black   right-0 justify-end">
        <p className="absolute top-2 right-7 text-lg text-gray-500 font-light ">
          Prior
        </p>
        {patientWithMedicationLogsToday.map((patient: any, index: number) => (
          <div
            key={index}
            className="flex flex-row  bg-white border-2 border-b-8 border-l-8  h-[10rem] w-full rounded-lg border-[#F4F4F4] right-0"
          >
            <div
              className="w-4/6 h-full cursor-pointer"
              onClick={() => handlePatientClick(patient.uuid)}
            >
              <div className="flex p-2 pl-5 flex-row w-full">
                <div className="rounded-full max-h-[60px] max-w-[60px] p-2 bg-[#007C854D]">
                  <img
                    className="rounded-full"
                    src="/imgs/tao1.svg"
                    alt="Patient"
                    width={50}
                  />
                </div>
                <div className="ml-5 flex flex-col  ">
                  <p className="font-semibold text-lg justify-start items-start flex truncate text-ellipsis">
                    {patient.firstName} {patient.middleName} {patient.lastName}
                  </p>
                  <p className="flex text-sm justify-start">
                    {patient.age} years old - {patient.gender}
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-start items-start ml-5 pr-5 pb-5">
                <p>
                  Attending - <span className="text-gray-400">Nurse Name</span>
                </p>
                <p className="truncate text-ellipsis w-full flex justify-start items-start">
                  Allergies -{" "}
                  <span className="w-full flex justify-start items-start text-gray-400">
                    {getDistinctAllergyTypes(patient.allergies)}
                  </span>
                </p>
                <p>
                  Code -{" "}
                  <span
                    className={`${
                      patient.codeStatus == "DNR"
                        ? "text-red-600"
                        : "text-blue-400"
                    }`}
                  >
                    {patient.codeStatus}
                  </span>
                </p>
              </div>
            </div>

            <div className="h-full w-1/6 border-[#F4F4F4] border-l-4 border-solid flex justify-between items-center flex-col">
              <div className="h-full w-full flex flex-col border-[#F4F4F4] border-b-4 text-xs items-center justify-center  cursor-pointer">
                <img src="/icons/chart-order.svg" alt="order" width={20} />
                Orders
                <span
                  className={`absolute h-4 w-4 text-white bg-red-500 text-xs -mt-7 -mr-7 rounded-full ${
                    patient.medicationlogs.length === 0 ? "hidden" : ""
                  }`}
                >
                  {patient.medicationlogs.length}
                </span>
              </div>

              <div
                className="h-full w-full flex flex-col border-[#F4F4F4] border-b-4 text-xs items-center justify-center  cursor-pointer"
                onClick={() => {
                  setPatientUuid(patient.uuid);
                  isModalOpen(true);
                }}
              >
                <img src="/icons/chart-prn.svg" alt="prn" width={20} />
                PRN
                {Object.entries(getPRNCount(patient.medicationlogs)).map(
                  ([type, count]) => (
                    <span
                      key={type}
                      className={`absolute h-4 w-4 text-white bg-red-500 text-xs -mt-7 -mr-7 rounded-full ${
                        count === 0 ? "hidden" : ""
                      }`}
                    >
                      {count}
                    </span>
                  )
                )}
              </div>
              <div className="h-full w-full flex flex-row border-[#F4F4F4] text-xs items-center gap-1 justify-center  cursor-pointer">
                <div>
                  <img src="/icons/chart-status.svg" alt="status" width={15} />A
                </div>
                <div>
                  <img src="/icons/chart-status.svg" alt="status" width={15} />S
                </div>
                <div>
                  <img src="/icons/chart-status.svg" alt="status" width={15} />D
                </div>
              </div>
            </div>

            <div className="h-full w-1/6 border-[#F4F4F4] border-l-2 border-solid flex justify-between items-center flex-col bg-[#007C851A]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientCard;
