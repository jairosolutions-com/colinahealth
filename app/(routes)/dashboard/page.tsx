"use client";

import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { Edit, View } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  if(!getAccessToken()){
    onNavigate(router, "/login");
  }

  return (
    <div className="w-full">
      <div className="justify-center items-center mx-[154px] mt-[90px] overflow-hidden">
        <div className="w-full">
          <p className="p-title select-none mb-1">WELCOME TO DASHBOARD!</p>
          <div className="font-bold text-[15px] flex mb-4 select-none">
            Hey Alexa Dramos -
            <p className="font-normal text-[15px] pl-1 text-[#71717A] select-none">
              here's what's happening with your clinic today!
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-[28px]">
          {/* {/ Start of Upcoming Appointments /} */}

          <div className="w-[930px] min-w-max-[930px] max-h-[670px] h-[670px] min-h-max-[670px]">
            <div className="border-[1px] h-[95px] px-18 pt-3">
              <p className="p-title mx-[30px] pt-2">Upcoming Appointments</p>
              <p className="font-normal text-[15px] text-[#71717A] mx-[30px] pt-3">
                Total of 3 Appointments
              </p>
            </div>
            {/* {/ content /} */}
            <div className="border-t-0 border-[1px]">
              <div className="divide-y">
                <div className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                  <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center">
                    <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                    <span className="pr-1 text-[#713F12] font-medium text-[15px]">
                      Pending
                    </span>
                  </div>
                  <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                    Pamela May H. Lamela
                  </p>
                  <div className=" items-center flex flex-col w-1/4">
                    <p className="font-bold text-[15px]">September 26, 2024</p>
                    <p className="font-medium text-[15px] text-[#71717A]">
                      08:00
                    </p>
                  </div>
                  <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                    New Patient
                  </p>
                </div>
                <div className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                  <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center">
                    <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                    <span className="pr-1 text-[#713F12] font-medium text-[15px]">
                      Pending
                    </span>
                  </div>
                  <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                    Dennis Albite
                  </p>
                  <div className=" items-center flex flex-col w-1/4">
                    <p className="font-bold text-[15px]">September 26, 2024</p>
                    <p className="font-medium text-[15px] text-[#71717A]">
                      08:00
                    </p>
                  </div>
                  <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                    New Patient
                  </p>
                </div>
                <div className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                  <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center">
                    <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                    <span className="pr-1 text-[#713F12] font-medium text-[15px]">
                      Pending
                    </span>
                  </div>
                  <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                    Dennis Albite
                  </p>
                  <div className=" items-center flex flex-col w-1/4">
                    <p className="font-bold text-[15px]">September 26, 2024</p>
                    <p className="font-medium text-[15px] text-[#71717A]">
                      08:00
                    </p>
                  </div>
                  <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                    New Patient
                  </p>
                </div>
                <div className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                  <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center">
                    <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                    <span className="pr-1 text-[#713F12] font-medium text-[15px]">
                      Pending
                    </span>
                  </div>
                  <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                    Dennis Albite
                  </p>
                  <div className=" items-center flex flex-col w-1/4">
                    <p className="font-bold text-[15px]">September 26, 2024</p>
                    <p className="font-medium text-[15px] text-[#71717A]">
                      08:00
                    </p>
                  </div>
                  <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                    New Patient
                  </p>
                </div>
                <div className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                  <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center">
                    <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                    <span className="pr-1 text-[#713F12] font-medium text-[15px]">
                      Pending
                    </span>
                  </div>
                  <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                    Dennis Albite
                  </p>
                  <div className=" items-center flex flex-col w-1/4">
                    <p className="font-bold text-[15px]">September 26, 2024</p>
                    <p className="font-medium text-[15px] text-[#71717A]">
                      08:00
                    </p>
                  </div>
                  <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                    New Patient
                  </p>
                </div>
                <div className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max">
                  <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center">
                    <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                    <span className="pr-1 text-[#713F12] font-medium text-[15px]">
                      Pending
                    </span>
                  </div>
                  <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                    Dennis Albite
                  </p>
                  <div className=" items-center flex flex-col w-1/4">
                    <p className="font-bold text-[15px]">September 26, 2024</p>
                    <p className="font-medium text-[15px] text-[#71717A]">
                      08:00
                    </p>
                  </div>
                  <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                    New Patient
                  </p>
                </div>
              </div>
            </div>
            {/* {/ content /} */}
          </div>
          {/* {/ End of Upcoming Appointments /}
      {/ Start of Due Medications /} */}
          <div className="w-[621px] h-[666px] border-[1px] border-[#E4E4E7] py-3 select-none px-[40px]">
            <div className="">
              <p className="p-title pt-2">Due Medications</p>
              <p className="font-normal text-[15px] text-[#71717A] pt-3 mb-3">
                Total of 3 Due Medication
              </p>
            </div>
            <div className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100">
              <div className="flex w-1/6 items-center ">
                <img src="/imgs/tao1.svg" alt="" width={58} height={58} />
              </div>
              <div className="flex w-4/6">
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] truncate hover:text-wrap">
                    Pamela May H. Lamela
                  </p>
                  <p className="text-[#71717A] font-normal text-[15px]">
                    Losartan
                  </p>
                </div>
              </div>
              <div className="w-1/6  flex flex-col justify-center items-start ">
                <p className="font-bold text-[15px] flex">January 21</p>
                <p className="text-[#71717A] font-medium text-[15px]">24:00</p>
              </div>
            </div>
            <div className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100">
              <div className="flex w-1/6 items-center ">
                <img src="/imgs/tao1.svg" alt="" width={58} height={58} />
              </div>
              <div className="flex w-4/6">
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] truncate hover:text-wrap">
                    Jaszmeine Villanueva
                  </p>
                  <p className="text-[#71717A] font-normal text-[15px]">
                    Metformin
                  </p>
                </div>
              </div>
              <div className="w-1/6  flex flex-col justify-center items-start ">
                <p className="font-bold text-[15px] flex">May 21</p>
                <p className="text-[#71717A] font-medium text-[15px]">24:00</p>
              </div>
            </div>
            <div className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100">
              <div className="flex w-1/6 items-center ">
                <img src="/imgs/tao1.svg" alt="" width={58} height={58} />
              </div>
              <div className="flex w-4/6">
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] truncate hover:text-wrap">
                    Ree Dignos
                  </p>
                  <p className="text-[#71717A] font-normal text-[15px]">
                    Bisphosphonates
                  </p>
                </div>
              </div>
              <div className="w-1/6  flex flex-col justify-center items-start ">
                <p className="font-bold text-[15px] flex">May 21</p>
                <p className="text-[#71717A] font-medium text-[15px]">24:00</p>
              </div>
            </div>
            <div className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100">
              <div className="flex w-1/6 items-center ">
                <img src="/imgs/tao1.svg" alt="" width={58} height={58} />
              </div>
              <div className="flex w-4/6">
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] truncate hover:text-wrap">
                    Eugene Lingatong
                  </p>
                  <p className="text-[#71717A] font-normal text-[15px]">
                    Atorvastatin
                  </p>
                </div>
              </div>
              <div className="w-1/6  flex flex-col justify-center items-start ">
                <p className="font-bold text-[15px] flex">May 21</p>
                <p className="text-[#71717A] font-medium text-[15px]">24:00</p>
              </div>
            </div>
            <div className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100">
              <div className="flex w-1/6 items-center ">
                <img src="/imgs/tao1.svg" alt="" width={58} height={58} />
              </div>
              <div className="flex w-4/6">
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] truncate hover:text-wrap">
                    Kent Liloc
                  </p>
                  <p className="text-[#71717A] font-normal text-[15px]">
                    Bisphosphonates
                  </p>
                </div>
              </div>
              <div className="w-1/6  flex flex-col justify-center items-start ">
                <p className="font-bold text-[15px] flex">May 21</p>
                <p className="text-[#71717A] font-medium text-[15px]">24:00</p>
              </div>
            </div>
            <div className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100">
              <div className="flex w-1/6 items-center ">
                <img src="/imgs/tao1.svg" alt="" width={58} height={58} />
              </div>
              <div className="flex w-4/6">
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[15px] truncate hover:text-wrap">
                    Francheska Palma Gil
                  </p>
                  <p className="text-[#71717A] font-normal text-[15px]">
                    Gliclazide
                  </p>
                </div>
              </div>
              <div className="w-1/6  flex flex-col justify-center items-start ">
                <p className="font-bold text-[15px] flex">May 21</p>
                <p className="text-[#71717A] font-medium text-[15px]">24:00</p>
              </div>
            </div>
            <div className="group flex w-fit cursor-pointer items-center hover:text-[#007C85] font-semibold text-[15px] text-[#71717A] py-[40px]">
              SEE ALL DUE
              <svg
                className="text-[#71717A] ml-2 group-hover:text-[#007C85]"
                width="17"
                height="14"
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
          {/* End of Due Medications */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;