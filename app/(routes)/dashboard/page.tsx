"use client";

import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { Edit, View } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  if(!getAccessToken()){
    onNavigate(router, "/dashboard");
  }

  return (
    <div className="mt-20 w-full justify-center items-center  mx-28">
      <div>
        <p className="font-bold text-[24px] select-none">Dashboard</p>
        <div className="font-bold text-[17px] flex mb-4 select-none">
          Hey Alexa Dramos -{" "}
          <p className="font-normal text-[17px] pl-1 text-[#71717A] select-none">
            here's what's happening with your clinic today!
          </p>
        </div>
      </div>
      <div className="flex gap-[28px] w-full">
        {/* {/ {/ Start of Upcoming Appointments /} /} */}

        <div className="w-[998px] select-none">
          <div className="border-[1px] h-[95px] px-18">
            <p className="font-bold text-[24px] py-3 px-[40px]">
              Upcoming Appointments
            </p>
            <p className="font-normal text-[17px] text-[#71717A] px-[40px]">
              Total of 3 Appointment
            </p>
          </div>
          {/* {/ {/ content /} /} */}
          <div className="border-t-0 border-[1px]">
            <div className="divide-y">
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Dennis Albite
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Kent Liloc
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Francheska Monique Palma Gil
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Eugene Lingatong
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Ree Dignos
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Jazmine Villanueva
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Pamela Lamela
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Painitan ni Owa
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
              <div className="h-[70px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                <div className="flex bg-[#FEF9C3] px-2 rounded-full me-2 py-0.5">
                  <p className="text-[#FACC15] mr-2">●</p>
                  <span className="pr-1 text-[#713F12] font-medium ">
                    Pending
                  </span>
                </div>
                <p className="font-bold w-1/4 truncate hover:text-wrap">
                  Maruya ni Coleen
                </p>
                <div className=" items-center flex flex-col w-1/4">
                  <p className="font-semibold">September 26, 2024</p>
                  <p className="font-normal text-[#71717A]">8:00-9:00am</p>
                </div>
                <p className="text-[#71717A] font-light w-1/4 text-center">
                  New Patient
                </p>
              </div>
            </div>
          </div>
          {/* {/ {/ content /} /} */}
        </div>
        {/* {/ End of Upcoming Appointments /}
        {/ Start of Due Medications /} */}
        <div className="w-[661px] border-[1px] border-[#E4E4E7] py-3 select-none px-[40px]">
          <p className="text-[24px] font-bold">Due Medications</p>
          <p className="font-normal text-[17px] text-[#71717A] mb-3">
            Total of 10 due
          </p>
          <div className="w-full flex flex-row h-[77px] mb-3 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Dennis Albite
                </p>
                <p className="text-[#71717A] font-normal text-xl">
                  Bisphosphonates
                </p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row h-[70px] mb-3 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Kent Liloc
                </p>
                <p className="text-[#71717A] font-normal text-xl">
                  Bisphosphonates
                </p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row h-[70px] mb-3 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Francheska Monique Palma Gil
                </p>
                <p className="text-[#71717A] font-normal text-xl">
                  Bisphosphonates
                </p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row h-[70px] mb-3 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Eugene Lingatong
                </p>
                <p className="text-[#71717A] font-normal text-xl">
                  Bisphosphonates
                </p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row h-[70px] mb-3 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Ree Dignos
                </p>
                <p className="text-[#71717A] font-normal text-xl">
                  Bisphosphonates
                </p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row h-[70px] mb-3 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Jasmine Villanueva
                </p>
                <p className="text-[#71717A] font-normal text-xl">Cetirizine</p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row h-[70px] mb-7 hover:bg-slate-50">
            <div className="flex items-center mr-5">
              <img src="/imgs/jenny-wilson.png" alt="" width={58} height={58} />
            </div>
            <div className="flex w-full justify-between">
              <div className="flex flex-col justify-center">
                <p className="font-bold text-xl truncate hover:text-wrap">
                  Pamela Lamela
                </p>
                <p className="text-[#71717A] font-normal text-xl">
                  Bisphosphonates
                </p>
              </div>
              <div className="mx-5 flex flex-col justify-center items-center">
                <p className="font-medium text-xl">September 21</p>
                <p className="text-[#71717A] font-normal text-xl">7:00am</p>
              </div>
            </div>
          </div>
          <div className="group flex w-fit cursor-pointer items-center hover:text-[#007C85] font-normal text-[17px] text-[#71717A] mb-3">
            SEE ALL DUE{" "}
            <svg
              className="text-[#71717A] ml-2 group-hover:text-[#007C85]"
              width="10"
              height="17"
              viewBox="0 0 10 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.14795 2.15826L8.7739 8.78421L2.14795 15.4102"
                stroke="currentColor"
                stroke-width="2.43402"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        {/* {/ End of Due Medications /} */}
      </div>
    </div>
  );
};

export default Dashboard;
