"use client";
import React, { useEffect, useState } from "react";
import DBPatientSelect from "./dbPatientSelect";
import DoughnutChart from "../DoughnutChart";
import { useRouter } from "next/navigation";
import { fetchPatientRecentInfo } from "@/app/api/patients-api/patientRecentInfo.api";
import ResuableTooltip from "../reusable/tooltip";
import { formatDate } from "@/lib/utils";
interface DBPatientSummaryProps {
  totalDueMedication: number;
  totalDone: number;
}

const DBPatientSummary = ({
  totalDueMedication,
  totalDone,
}: DBPatientSummaryProps) => {
  const router = useRouter();
  const [patientId, setPatientId] = React.useState("");
  const [patientRecentInfo, setPatientRecentInfo] = useState<any>();
  const pri = patientRecentInfo!;
  const totalPatientDue =
    pri === undefined ? 0 : pri?.totalMedicationDue?.medicationCount;
  const totalPatientDone =
    pri === undefined ? 0 : pri?.totalMedicationDone?.medicationCount;

  const allergens = pri?.patientAllergies[0]?.allergens
    ? pri.patientAllergies[0].allergens
        .split(",")
        .map((allergen: string) => allergen.trim())
    : ["No Allergens"];
  console.log("totalPatientDue", totalPatientDue);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPatientRecentInfo(patientId, router);
        setPatientRecentInfo(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, [patientId]);
  console.log("patientId", patientId);
  console.log(patientRecentInfo, "patientRecentInfo");
  return (
    <div className="w-full h-full flex flex-col justify-between gap-3">
      <div className="h-[50px]  w-1/2 flex pr-[6px]">
        <DBPatientSelect patientId={patientId} setPatientId={setPatientId} />
      </div>
      <div className="w-full h-full gap-3 flex flex-col">
        <div className="h-4/6 w-full gap-3">
          <div className="h-1/2 w-full flex   gap-3 relative">
            <div className="h-full bg-[#D9D9D91A] w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#F4E394] w-full"></div>
              <div className="pt-5 px-5">
                <h1 className="text-[15px] font-medium">Patient Details</h1>
                <div className="h-full w-full flex items-center mt-2 sub-title ">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex w-full">
                        Name:
                        <div className="w-full  flex ">
                          <p className="max-w-9/12 truncate">
                            <ResuableTooltip
                              text={`${pri?.data[0]?.patient_firstName}${" "}
                            ${pri?.data[0]?.patient_middleName}${" "}
                          ${pri?.data[0]?.patient_lastName} ${" "}`}
                            />
                          </p>
                          <span className="w-3/12">
                            - {pri?.data[0]?.patient_age}{" "}
                            {pri?.data[0]?.patient_gender}
                          </span>
                        </div>
                      </div>
                      <h1>
                        Date of Birth:{" "}
                        {formatDate(pri?.data[0]?.patient_dateOfBirth)}
                      </h1>
                      <h1 className="w-full truncate flex">
                        Address:
                        <ResuableTooltip
                          text={`${pri?.data[0]?.patient_address1}`}
                        />
                      </h1>
                      <h1>Phone Number: {pri?.data[0]?.patient_phoneNo}</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full bg-[#D9D9D91A] relative w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#F3BB93] w-full"></div>
              <div className="pt-5 px-5 relative">
                <h1 className="text-[15px] font-medium ">Vital Signs</h1>
                <div className="h-full w-full flex items-center mt-2 sub-title ">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <h1>Blood Pressure: {pri?.data[0]?.bloodPressure}</h1>
                      <h1>Heart Rate: {pri?.data[0]?.heartRate}</h1>
                      <h1>Temperature: {pri?.data[0]?.temperature}</h1>
                      <h1>Respiratory: {pri?.data[0]?.respiratoryRate}</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="h-[200px] w-full flex flex-row gap-3">
            <div className="h-full bg-[#D9D9D91A] w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#93F3B9] w-full"></div>
              <div className="pt-5 px-5">
                <h1 className="text-[15px] font-medium ">Medications</h1>
                <div className="h-full w-full flex items-center sub-title ">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div>
                      <h1>{pri?.data[0]?.medicationLogsName}</h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-full bg-[#D9D9D91A] w-1/2">
              <div className="h-[40px] rounded-t-[5px] bg-[#93F3DC] w-full"></div>
              <div className="pt-5 pl-5">
                <h1 className="text-[15px] font-medium">Allergies</h1>
                <div className="h-full w-full flex items-center sub-title">
                  {pri == undefined ? (
                    <h1 className="text-center w-full">no data yet</h1>
                  ) : (
                    <div className="max-h-[100px] w-full overflow-auto">
                      <div className="h-full mt-[2px]">
                        {allergens.map(
                          (
                            allergen:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | React.PromiseLikeOfReactNode
                              | null
                              | undefined,
                            index: React.Key | null | undefined
                          ) => (
                            <div key={index}>{allergen}</div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-2/4 bg-[#D9D9D91A] ">
          <div className="h-[40px] rounded-t-[5px] bg-[#93D0F3] w-full"></div>
          <div className="pt-5 px-5">
            <div className="flex gap-3 w-full relative">
              <div className="w-1/2 relative">
                <h1 className="absolute text-[15px] font-medium  truncate w-full">
                  {pri === undefined
                    ? "[Patient Name]"
                    : pri?.data[0]?.patient_firstName}'s Due Medication
                </h1>
                <div className="h-full w-full flex  items-center justify-center ">
                  <DoughnutChart
                    total={totalPatientDue}
                    totalDone={totalPatientDone}
                  />
                </div>
              </div>
              <div className=" w-[1px]  bg-[#DDDDDD]"></div>
              <div className="w-1/2 relative">
                <h1 className="absolute text-[15px] font-medium ">
                  Total Due Meds of All Patients
                </h1>
                <div className="h-full w-full flex  items-center justify-center ">
                  <DoughnutChart
                    total={totalDueMedication}
                    totalDone={totalDone}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBPatientSummary;
