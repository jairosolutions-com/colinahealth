"use client";

import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  return (
    <div className="mt-20 w-full h-full justify-center items-center">
      <div className="">Dashboard</div>
      <div
        className="cursor-pointer"
        onClick={() => onNavigate(router, "/patient-list")}
      >
        TO PATIENT LIST
      </div>
    </div>
  );
};

export default Dashboard;
