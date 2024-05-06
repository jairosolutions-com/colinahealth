import { useState } from "react";
import Image from "next/image";

interface AlertProps {
  label: string;
  isAlertOpen: boolean;
  toggleModal: (isOpen: boolean) => void;
  isUpdated: any;
  setIsUpdated: any;
}

export const SuccessModal = ({
  label,
  isAlertOpen,
  toggleModal,
  isUpdated,
  setIsUpdated,
}: AlertProps) => {
  console.log(label, "label");
  console.log(isUpdated, "success is edit");
  return (
    <div>
      {isAlertOpen && (
        <div className=" bg-white rounded-[10px] shadow-xl w-[670px] h-[326px]">
          <div className="text-center pt-[30px]">
            <div className="mx-auto mb-5 text-gray-400 w-[110px] h-[110px]">
              <Image
                src="/svgs/successful.svg"
                alt=""
                width={110}
                height={110}
              />
            </div>
            <h1 className="text-[20px] font-bold text-md text-[#101828] mb-2">
              {isUpdated ? "Updated" : "Submitted"} Successfully!
            </h1>
            <p className="text-[15px] text-sm text-[#667085] mb-[40px]">
              Your data has been successfully {isUpdated ? "updated" : "added"}.
            </p>
            <button
              onClick={() => {
                toggleModal(false);
                if (setIsUpdated !== "") {
                  setIsUpdated(false);
                }
              }}
              className="text-white bg-[#1B84FF] hover:bg-[#2267B9] font-medium 
                rounded-b-[10px] text-[15px] w-[670px] py-[20px] mt-5 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Okay, Thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
