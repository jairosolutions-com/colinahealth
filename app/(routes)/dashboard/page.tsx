import React, { Suspense, useEffect, useState } from "react";
import NurseDrawer from "@/components/nurse-drawer";
import { SuccessModal } from "@/components/shared/success";
import DBDueMedication from "@/components/dashboard/dbDueMedications";
import DBUpcomingAppointments from "@/components/dashboard/dbUpcomingAppointments";
import DBDueMedicationLoader from "@/components/loaders/DBDueMedicationLoader";
import DBUpcomingLoader from "@/components/loaders/DBUpcomingLoader";
import UserDetail from "@/components/userDetails";
import DBUserDetailLoader from "@/components/loaders/DBUserDetailLoader";
import DBPatientSummary from "@/components/dashboard/dbPatientSummary";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="justify-center h-full items-center mx-[154px] mt-[90px] overflow-hidden">
        <div className="w-full flex justify-between items-center">
          <div className="w-full">
            <p className="p-title select-none mb-1">WELCOME TO DASHBOARD!</p>
            <div className="font-bold text-[15px] flex mb-4 select-none">
              Hey,{" "}
              <Suspense fallback={<DBUserDetailLoader />}>
                <UserDetail />{" "}
              </Suspense>
              -
              <p className="sub-title pl-1 select-none">
                here's what's happening with your clinic today!
              </p>
            </div>
          </div>
          <NurseDrawer />
        </div>
        <div className="w-full h-full flex gap-5">
          <div className="w-4/6 ">
            <DBPatientSummary />
          </div>
          <div className="w-2/6 h-full flex flex-col gap-3">
            <div className="w-full h-1/2">
              <Suspense fallback={<DBDueMedicationLoader />}>
                <DBDueMedication />
              </Suspense>
            </div>

            <Suspense fallback={<DBUpcomingLoader />}>
              <div className="w-full h-1/2">
                <DBUpcomingAppointments />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
