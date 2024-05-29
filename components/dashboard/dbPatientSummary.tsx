'use client'
import React from "react";
import DBPatientSelect from "./dbPatientSelect";

const DBPatientSummary = () => {

  return (
    <div className="w-full h-full flex flex-col justify-between gap-3">
      <div className="h-[50px]  w-full flex gap-3">
        <DBPatientSelect/>
      </div>
      <div className="w-full h-full gap-3 flex flex-col">
        <div className="h-4/6 w-full flex gap-3">
          <div className="w-1/2 flex flex-col  gap-3">
            <div className="h-2/4 bg-[#D9D9D91A] ">
              <h1 className="font-bold text-xl bg-red-500 w-full p-5">
                Patient Details
              </h1>
            </div>
            <div className="h-2/4 bg-[#D9D9D91A] ">
              <h1 className="font-bold text-xl bg-violet-500 w-full p-5">Medication</h1>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-3">
            <div className="h-2/4 bg-[#D9D9D91A]">
              <h1 className="font-bold text-xl bg-cyan-500 w-full p-5">Allergies</h1>
            </div>
            <div className="h-2/4 bg-[#D9D9D91A] ">
              <h1 className="font-bold text-xl bg-yellow-500 w-full p-5">Vital Signs</h1>
            </div>
          </div>
        </div>
        <div className="h-2/6  w-full flex flex-col gap-3">
          <h1 className="font-bold text-xl bg-orange-500 w-full p-5">Due Medication Graph</h1>
          <div className="w-full flex gap-3 h-full">
            <div className="w-1/2 bg-blue-500"></div>
            <div className="w-1/2 bg-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBPatientSummary;
