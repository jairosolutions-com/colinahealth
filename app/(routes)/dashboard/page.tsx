import React, { Suspense, useEffect, useState } from "react";
import NurseDrawer from "@/components/nurse-drawer";
import { SuccessModal } from "@/components/shared/success";
import DBDueMedication from "@/components/dbDueMedications";
import DBUpcomingAppointments from "@/components/dbUpcomingAppointments";
import DBDueMedicationLoader from "@/components/loaders/DBDueMedicationLoader";
import DBUpcomingLoader from "@/components/loaders/DBUpcomingLoader";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="justify-center h-full items-center mx-[154px] mt-[90px] overflow-hidden">
        <div className="w-full flex justify-between items-center">
          <div className="w-full">
            <p className="p-title select-none mb-1">WELCOME TO DASHBOARD!</p>
            <div className="font-bold text-[15px] flex mb-4 select-none">
              Hey Alexa Dramos -
              <p className="font-normal text-[15px] pl-1 text-[#71717A] select-none">
                here's what's happening with your clinic today!
              </p>
            </div>
          </div>
          <NurseDrawer />
        </div>
        <div className="w-full h-full flex gap-5">
          <div className="w-4/6 flex flex-col justify-between gap-3">
            <div className="h-4/6 bg-red-200 w-full flex gap-3">
              <div className="w-1/2 flex flex-col  gap-3">
                <div className="h-3/4 bg-slate-300"></div>
                <div className="h-1/4 bg-yellow-400"></div>
              </div>
              <div className="w-1/2 flex flex-col gap-3">
                <div className="h-2/6 bg-orange-400"></div>
                <div className="h-2/6 bg-violet-500"></div>
                <div className="h-2/6 bg-pink-600"></div>
              </div>
            </div>
            <div className="h-2/6  w-full flex gap-3">
              <div className="w-1/2 bg-blue-500"></div>
              <div className="w-1/2 bg-green-500"></div>
            </div>
          </div>
          <div className="w-2/6 h-full flex flex-col gap-3">
            <Suspense fallback={<DBDueMedicationLoader />}>
              <DBDueMedication />
            </Suspense>
            <Suspense fallback={<DBUpcomingLoader />}>
            <DBUpcomingAppointments />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
