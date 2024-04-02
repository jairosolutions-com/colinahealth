"use client";

import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  if(!getAccessToken()){
    onNavigate(router, "/login");
  }
  return (
    <main className="overflow-x-hidden w-full h-full">
      <div className="absolute flex w-full h-full justify-center items-center -z-50">
        <img
          src="/imgs/colinahealthlogo3.png"
          alt="logo"
          width={500}
          className="opacity-15 items-center"
        />
      </div>
      <div className="mt-20 w-full justify-center items-center  px-28">
        <div>
          <p className="font-bold text-[24px]">Dashboard</p>
          <div className="font-bold text-[17px] flex ">
            Hey Alexa Dramos -{" "}
            <p className="font-normal text-[17px] pl-1 text-[#71717A]">
              here's what's happening with your clinic today!
            </p>
          </div>
          {/* {/ {/ {/ Start of content /} /} /} */}
          <div className=" flex flex-row gap-3 h-[162px]">
            <div className=" w-full bg-white rounded-xl border-[2px] border-[#E4E4E7]">
              <div className="px-5">
                <div className="text-[#71717A] font-medium text-[20px] mt-5 mb-10">
                  Total Patients
                </div>
              </div>
              <div className="flex justify-between mx-5 items-center">
                <div className="font-bold text-[37px]">12,426</div>
                <div className="text-[#22C55E] font-medium text-[23px]">
                  +36%
                </div>
              </div>
            </div>
            <div className=" w-full bg-white rounded-xl border-[2px] border-[#E4E4E7]">
              <div className="px-5">
                <div className="text-[#71717A] font-medium text-[20px] mt-5 mb-10">
                  New Patients
                </div>
              </div>
              <div className="flex justify-between mx-5 items-center ">
                <div className="font-bold text-[37px] ">2,380</div>
                <div className="text-[#EF4444] font-medium text-[23px]">
                  +14%
                </div>
              </div>
            </div>
            <div className=" w-full bg-white rounded-xl border-[2px] border-[#E4E4E7]">
              <div className="px-5">
                <div className="text-[#71717A] font-medium text-[20px] mt-5 mb-10">
                  Average Daily Visit
                </div>
              </div>
              <div className="flex justify-between mx-5">
                <div className="font-bold text-[37px]">201</div>
                <div className="text-[#22C55E] font-medium text-[23px]">
                  +36%
                </div>
              </div>
            </div>
          </div>
          {/* {/ {/ {/ end of content /} /} /} */}
          <div className="flex w-full justify-between gap-3 my-3">
            <div className="flex flex-col w-[1000px] gap-3">
              {/* {/ {/ {/ Start of Appointments /} /} /} */}
              <div className="  rounded-xl border-[2px] bg-white border-[#E4E4E7]">
                <div className="mt-2">
                  <div className="font-bold text-[20px] px-5">
                    Upcoming Appointments
                  </div>
                  <div className="px-5">Total of 3 Appointments</div>
                  <div className="flex flex-col h-auto pb-2 border-b-1 border-b-gray-950">
                    <div className="flex justify-evenly items-center h-[60px]">
                      <div className="px-6 py-4">
                        <p className="bg-[#FEF9C3] text-[#713F12] font-medium text-[14px] me-2 px-2.5 py-0.5 rounded-full flex items-center">
                          <span className="pr-1 text-[#FACC15]">●</span>
                          Pending
                        </p>
                      </div>
                      <div className="px-6 py-4 font-bold text-[18px] items-center justify-center">
                        Drake Ramos
                      </div>
                      <div className="px-6 py-4 ">
                        <p>March 26, 2024</p>
                        <p className="text-gray-400">8:00 - 9:00 PM</p>
                      </div>
                      <div className="px-6 py-4">New Patient</div>
                      <div className="px-6 py-4 cursor-pointer">●●●</div>
                    </div>
                    <div className="flex justify-evenly items-center h-[60px]">
                      <div className="px-6 py-4">
                        <p className="bg-[#FEF9C3] text-[#713F12] font-medium text-[14px] me-2 px-2.5 py-0.5 rounded-full flex items-center">
                          <span className="pr-1 text-[#FACC15]">●</span>
                          Pending
                        </p>
                      </div>
                      <div className="px-6 py-4 font-bold text-[18px] items-center justify-center">
                        Jenny Wilson
                      </div>
                      <div className="px-6 py-4 ">
                        <p>March 26, 2024</p>
                        <p className="text-gray-400">8:00 - 9:00 PM</p>
                      </div>
                      <div className="px-6 py-4">New Patient</div>
                      <div className="px-6 py-4 cursor-pointer">●●●</div>
                    </div>
                    <div className="flex justify-evenly items-center h-[60px]">
                      <div className="px-6 py-4">
                        <p className="bg-[#FEF9C3] text-[#713F12] font-medium text-[14px] me-2 px-2.5 py-0.5 rounded-full flex items-center">
                          <span className="pr-1 text-[#FACC15]">●</span>
                          Pending
                        </p>
                      </div>
                      <div className="px-6 py-4 font-bold text-[18px] items-center justify-center">
                        Guy Hawkins
                      </div>
                      <div className="px-6 py-4 ">
                        <p>March 26, 2024</p>
                        <p className="text-gray-400">8:00 - 9:00 PM</p>
                      </div>
                      <div className="px-6 py-4">New Patient</div>
                      <div className="px-6 py-4 cursor-pointer">●●●</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {/ {/ End of Appointments /} /}
            {/ {/ Start of Average Patient List /} /} */}
              <div className=" bg-slate-500 rounded-xl flex">
                <div className="font-bold text-[20px] px-5">
                  Monthly Patient List
                </div>
              </div>
              {/* {/ {/ {/ End of Average Patient List /} /} /} */}
            </div>
            {/* {/ {/ {/ Start of Due Medicaitons /} /} /} */}
            <div className="w-[700px] bg-white rounded-xl border-[2px] py-5 px-2 border-[#E4E4E7]">
              <div className="font-bold text-[20px] px-5">Due Medications</div>
              <div className="px-5 mb-5">Total of 10 Due</div>
              <div className="w-full items-center">
                <div className=" w-full  flex flex-row mb-5">
                  <div className="mx-5 pt-1">
                    <img src="/imgs/tao1.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h1 className="font-bold">Jenny Wilson</h1>
                      <p className="font-normal text-[#71717A]">
                        Bisphosphonates
                      </p>
                    </div>
                    <div className="mx-5">
                      <h1 className="font-medium">March 21</h1>
                      <p className="font-normal text-[#71717A]">7:00am</p>
                    </div>
                  </div>
                </div>
                <div className=" w-full  flex flex-row mb-5">
                  <div className="mx-5 pt-1">
                    <img src="/imgs/tao2.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h1 className="font-bold">Devone Lane</h1>
                      <p className="font-normal text-[#71717A]">
                        Bisphosphonates
                      </p>
                    </div>
                    <div className="mx-5">
                      <h1 className="font-medium">March 21</h1>
                      <p className="font-normal text-[#71717A]">7:00am</p>
                    </div>
                  </div>
                </div>
                <div className=" w-full  flex flex-row mb-5">
                  <div className="mx-5 pt-1">
                    <img src="/imgs/tao3.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h1 className="font-bold">Jane Cooper</h1>
                      <p className="font-normal text-[#71717A]">
                        Bisphosphonates
                      </p>
                    </div>
                    <div className="mx-5">
                      <h1 className="font-medium">March 21</h1>
                      <p className="font-normal text-[#71717A]">7:00am</p>
                    </div>
                  </div>
                </div>
                <div className=" w-full  flex flex-row mb-5">
                  <div className="mx-5 pt-1">
                    <img src="/imgs/tao4.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h1 className="font-bold">Dianne Russel</h1>
                      <p className="font-normal text-[#71717A]">
                        Bisphosphonates
                      </p>
                    </div>
                    <div className="mx-5">
                      <h1 className="font-medium">March 21</h1>
                      <p className="font-normal text-[#71717A]">7:00am</p>
                    </div>
                  </div>
                </div>
                <div className=" w-full  flex flex-row mb-5">
                  <div className="mx-5 pt-1">
                    <img src="/imgs/tao1.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h1 className="font-bold">Painitan ni Owa</h1>
                      <p className="font-normal text-[#71717A]">
                        Bisphosphonates
                      </p>
                    </div>
                    <div className="mx-5">
                      <h1 className="font-medium">March 21</h1>
                      <p className="font-normal text-[#71717A]">7:00am</p>
                    </div>
                  </div>
                </div>
                <div className=" w-full  flex flex-row mb-5">
                  <div className="mx-5 pt-1">
                    <img src="/imgs/tao1.svg" alt="" width={48} height={48} />
                  </div>
                  <div className="flex w-full justify-between">
                    <div>
                      <h1 className="font-bold">Maruya ni Coleen</h1>
                      <p className="font-normal text-[#71717A]">
                        Bisphosphonates
                      </p>
                    </div>
                    <div className="mx-5">
                      <h1 className="font-medium">March 21</h1>
                      <p className="font-normal text-[#71717A]">7:00am</p>
                    </div>
                  </div>
                </div>
                <div className="flex text-[#71717A] font-bold mx-5 mb-5">
                  <p className="cursor-pointer ">SEE ALL DUE</p>
                  <span className="mx-3 items-center pt-[3px]">
                    <img
                      className="cursor-pointer"
                      src="/imgs/cheveron-right.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* {/ {/ {/ End of Due Medicaitons /} /} /} */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
