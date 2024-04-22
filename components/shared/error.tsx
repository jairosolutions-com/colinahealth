import { error } from "console";
import { useState } from "react";

interface ErrorProps {
  label: string;
  toggleModal: (isOpen: boolean) => void;
  isEdit: boolean;
  isAlertOpen: boolean;
  errorMessage: any;
}

export const ErrorModal = ({
  label,
  toggleModal,
  isEdit,
  isAlertOpen,
  errorMessage,
}: ErrorProps) => {
  return (
    <div>
      {isAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed z-50 bg-white rounded-[10px] shadow-xl w-[670px] h-[326px] mx-auto">
            <div className="text-center pt-[30px]">
              <div className="mx-auto mb-5 text-gray-400 w-[110px] h-[110px]">
                <img src="/svgs/error-icon.svg" alt="" />
              </div>
              <h1 className="text-[20px] font-bold text-gray-500 mb-4">
                {label === "Allergy already exist"
                  ? "Allergy already exists!"
                  : label === "Surgery already exist"
                  ? "Surgery already exists!"
                  : label === "Scheduled Log already exist"
                  ? "Scheduled Log already exist!"
                  : label === "PRN Log already exist"
                  ? "PRN Log already exist!"
                  : label === "Patient already exist"
                  ? "Patient already exists!"
                  : label === "prescriptionFailed"
                  ? "Prescription already exists!"
                  : "There was a problem with your request."}
              </h1>
              <p className="text-[24px] text-sm text-gray-400 mb-10">
                {label === "Allergy already exist"
                  ? "Please check and try again."
                  : label === "Surgery already exist"
                  ? "Please check and try again."
                  : label === "Patient already exist"
                  ? "Please check and try again."
                  : label === "Scheduled Log already exist"
                  ? "Please check and try again."
                  : label === "PRN Log already exist"
                  ? "Please check and try again."
                  : label === "prescriptionFailed"
                  ? "Please check and try again."
                  : "There was a problem with your request."}
              </p>
              <button
                onClick={() => toggleModal(false)} // Close modal
                className="text-white bg-[#1B84FF] hover:bg-blue-800 font-medium 
                rounded-b-[10px] text-[15px] mt-2 w-[670px] py-[15px] dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
