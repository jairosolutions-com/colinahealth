"use client";
import React from "react";
import DBPatientSelect from "./dbPatientSelect";
import DoughnutChart from "../DoughnutChart";
interface DBPatientSummaryProps {
  totalDueMedication: number;
  totalDone: number;
}

const DBPatientSummary = ({
  totalDueMedication,
  totalDone,
}: DBPatientSummaryProps) => {
  const [patientId, setPatientId] = React.useState("");

  console.log("patientId", patientId);
  return (
    <div className="w-full h-full flex flex-col justify-between gap-3">
      <div className="h-[50px]  w-full flex gap-3">
        <DBPatientSelect patientId={patientId} setPatientId={setPatientId} />
      </div>
      <div className="w-full h-full gap-3 flex flex-col">
        <div className="h-4/6 w-full flex gap-3">
          <div className="w-1/2 flex flex-col  gap-3">
            <div className="h-full bg-[#D9D9D91A] ">
              <div className="h-[40px] rounded-t-[5px] bg-[#F4E394] w-full"></div>
              <div className="p-5">
                <h1 className="font-semibold">Patient Details</h1>
                <div className="h-full w-full flex items-center justify-center">
                  no data yet.
                </div>
              </div>
            </div>
            <div className="h-full bg-[#D9D9D91A] ">
              <div className="h-[40px] rounded-t-[5px] bg-[#93F3B9] w-full"></div>
              <div className="p-5">
                <h1 className="font-semibold">Medications</h1>
                <div className="h-full w-full flex items-center justify-center">
                  no data yet.
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-3">
            <div className="h-full bg-[#D9D9D91A] relative">
              <div className="h-[40px] rounded-t-[5px] bg-[#F3BB93] w-full"></div>
              <div className="p-5 relative">
                <h1 className="font-semibold">Allergies</h1>
                <div className="h-full w-full flex items-center justify-center">
                  no data yet.
                </div>
              </div>
            </div>
            <div className="h-full bg-[#D9D9D91A] ">
              <div className="h-[40px] rounded-t-[5px] bg-[#93F3DC] w-full"></div>
              <div className="p-5">
                <h1 className="font-semibold">Vital Signs</h1>
                <div className="h-full w-full flex items-center justify-center">
                  no data yet.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-2/4 bg-[#D9D9D91A] ">
          <div className="h-[40px] rounded-t-[5px] bg-[#93D0F3] w-full"></div>
          <div className="pt-5 px-5">
            <h1 className="font-semibold">Graph</h1>
            <div className="flex gap-3">
              <div className="h-[180px] w-full flex flex-col items-center justify-center">
                <DoughnutChart
                  total={totalDueMedication}
                  totalDone={totalDone}
                />
                <div className="flex justify-between w-full">
                  <h1 className="">All Due Med: {totalDueMedication}</h1>
                  <h1 className="">Total Done: {totalDone}</h1>
                </div>
              </div>

              <div className="h-[180px] w-full flex flex-col items-center justify-center">
                <DoughnutChart
                  total={totalDueMedication}
                  totalDone={totalDone}
                />
                <div className="flex justify-between w-full">
                  <h1 className="">All Due Med: {totalDueMedication}</h1>
                  <h1 className="">Total Done: {totalDone}</h1>
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
