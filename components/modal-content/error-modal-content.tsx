import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const ErrorModalContent = ({ isModalOpen }: Modalprops) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <div>
      <div className=" z-50 flex items-center justify-center outline-none focus:outline-none">
        <div className=" bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="z-50 bg-white rounded-[10px] shadow-xl w-[670px] h-[326px] mx-auto top-[80px]">
          <div className="text-center pt-[30px]">
            <div className="mx-auto mb-5 text-gray-400 w-[110px] h-[110px] ">
              <Image
                src="/svgs/successful.svg"
                alt=""
                width={110}
                height={110}
              />
            </div>
            <h1 className="text-[25px] font-bold text-md text-[#101828] mb-2">
              Uh oh! Something went wrong!
            </h1>
            <p className="text-[22px] text-sm text-[#667085] mb-[40px] ">
              There was a problem with your request.
            </p>
          </div>
          <div>
            <button
              className="text-white bg-[#1B84FF] hover:bg-blue-800 font-medium 
                 rounded-b-md text-[21px] w-[670px] py-[15px] dark:bg-blue-600 dark:hover:bg-blue-700
                "
              onClick={() => isModalOpen(false)} // Close modal
            >
              Try Again!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
