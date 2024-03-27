import { error } from "console";
import { useState } from "react";

interface ErrorProps {
  label: string;
  toggleModal: (isOpen: boolean) => void;
  isEdit: boolean;
  isAlertOpen: boolean;
  errorMessage: any
}

export const ErrorModal = ({ label,  toggleModal, isEdit, isAlertOpen , errorMessage }: ErrorProps) => {
  return (
    <div>
      {isAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="fixed z-50 bg-white rounded-[10px] shadow-xl w-[650px] mx-auto p-[55px] mb-[320px]">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-800 focus:outline-none"
                onClick={() => toggleModal(false)} // Close modal
              >             
              </button>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-5 text-gray-400 w-[110px] h-[110px]">
                <img src="/icons/error-icon.svg" alt="" />
              </div>
              <h1 className="text-[34px] font-bold text-lg text-gray-500 mb-4">
              {errorMessage === 'Allergy already exist' ? 'Allergy already exists!' : errorMessage === 'Patient already exist' ? 'Patient already exists!' : "There was a problem with your request." 
              }
              </h1>
              <p className="text-[24px] text-sm text-gray-400 mb-10">
                {errorMessage === 'Allergy already exist' ? 'Please check and try again.' : errorMessage === 'Patient already exist' ? 'Please check and try again.' : "There was a problem with your request." }
              </p>
              <button
                onClick={() => toggleModal(false)} // Close modal
                className="text-white bg-[#1B84FF] hover:bg-blue-800 font-medium rounded-lg text-[26px] w-[330px] px-[31px] py-[18px] me-2 mx-2 dark:bg-blue-600 dark:hover:bg-blue-700"
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