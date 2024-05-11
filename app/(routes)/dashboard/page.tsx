import React, { Suspense, useEffect, useState } from "react";
import NurseDrawer from "@/components/nurse-drawer";
import DBUpcomingAppointments from "@/components/dbUpcomingAppointments";
import DBDueMedication from "@/components/dbDueMedications";
import Loading from "../loading";
import UpcomingAppointmentLoader from "@/components/upcomingAppointmentLoader";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="justify-center items-center mx-[154px] mt-[90px] overflow-hidden">
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
          <div className="">
            <NurseDrawer />
          </div>
        </div>
        <div className="flex justify-between gap-[28px]">
          <Suspense fallback={<UpcomingAppointmentLoader />}>
            <DBUpcomingAppointments />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <DBDueMedication />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
