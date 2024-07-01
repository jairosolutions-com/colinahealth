import React, { Suspense, useEffect, useState } from "react";
import NurseDrawer from "@/components/nurse-drawer";
import UserDetail from "@/components/userDetails";
import DBUserDetailLoader from "@/components/loaders/DBUserDetailLoader";
import DBBody from "@/components/dashboard/dbBody";

const Dashboard = () => {
  return (
    <div className="w-full">
      <div className="mx-[154px] mt-[90px] h-full items-center justify-center overflow-hidden">
        <div className="flex w-full items-center justify-between">
          <div className="w-full">
            <p className="p-title mb-1 select-none">WELCOME TO DASHBOARD!</p>
            <div className="mb-4 flex select-none text-[15px] font-bold">
              Hey,{" "}
              <Suspense fallback={<DBUserDetailLoader />}>
                <UserDetail />{" "}
              </Suspense>
              -
              <p className="sub-title select-none pl-1">
                here's what's happening with your clinic today!
              </p>
            </div>
          </div>
          <NurseDrawer />
        </div>
        <DBBody />
      </div>
    </div>
  );
};

export default Dashboard;
