import React from "react";

const DBDueMedicationLoader = () => {
  return (
    <div className="flex flex-col items-start border-[1px] border-[#E4E4E7] py-3 px-5 gap-5 w-full">
    <div className="h-[30px] w-[250px] rounded-full mr-2 p-title">
      Due Medications
    </div>
    <div className=" w-full font-normal text-[15px] text-[#71717A] -mt-2 ">
      Total of 0 due medication
    </div>
    <div className="animate-pulse w-full h-full gap-[23px] flex flex-col">
      <div className="flex items-center w-full ">
        <div className="min-h-[50px] min-w-[50px] bg-gray-300 rounded-full"></div>
        <div className="flex flex-row gap-2 justify-between w-full">
          <div className="flex flex-col w-full gap-2">
            <div className="h-[22px] w-[200px] bg-gray-200 rounded-full mr-2"></div>
            <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
          </div>
          <div className="gap-2 flex flex-col justify-end items-end">
            <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-[22px] w-20 bg-gray-200 rounded-full mr-2"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full">
        <div className="min-h-[50px] min-w-[50px] bg-gray-300 rounded-full "></div>
        <div className="flex flex-row gap-2 justify-between w-full ">
          <div className="flex flex-col w-full gap-2">
            <div className="h-[22px] w-[200px] bg-gray-200 rounded-full mr-2"></div>
            <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
          </div>
          <div className="gap-2 flex flex-col justify-end items-end">
            <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-[22px] w-20 bg-gray-200 rounded-full mr-2"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full">
        <div className="min-h-[50px] min-w-[50px] bg-gray-300 rounded-full "></div>
        <div className="flex flex-row gap-2 justify-between w-full">
          <div className="flex flex-col w-full gap-2">
            <div className="h-[22px] w-[200px] bg-gray-200 rounded-full mr-2"></div>
            <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
          </div>
          <div className="gap-2 flex flex-col justify-end items-end">
            <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-[22px] w-20 bg-gray-200 rounded-full mr-2"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex w-fit cursor-pointer items-center hover:text-[#007C85] font-semibold text-[15px] text-[#71717A] ">
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
          strokeWidth="2.43402"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
  );
};

export default DBDueMedicationLoader;
