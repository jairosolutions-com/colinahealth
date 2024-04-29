import React, { useEffect, useState } from "react";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const DelpromptsModalContent = ({ isModalOpen }: Modalprops) => {
  return (
    <div>
      <div className="bg-white max-w-lg rounded-md w-[600px] h-[146px]">
        <div className="flex justify-center items-center pt-6 pb-6">
          <h2 className="font-semibold text-[20px] text-[#667085]">
            Are you sure to archive this?
          </h2>
        </div>
        <div className="flex justify-center items-center gap-2">
          <button
            type="button"
            className="w-[160px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black rounded-sm"
          >
            No
          </button>
          <button
            type="button"
            className="w-[160px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium rounded-sm"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};
