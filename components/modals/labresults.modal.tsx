"use client";

import React, { useEffect } from "react";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  
  return (
    

    <div className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-60`}>
    <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
      <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
        <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
        Add Labaratory Result
        </h2>
        <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">Submit your log details.</p>
      </div>
      <div className=" mb-9 pt-4">
      <div className="h-[600px] max-h-[320px] md:px-10 mt-5" >
        <form className="">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
            HEMOGLOBIN A1c
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
            FASTING BLOOD GLUCOSE
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
            TOTAL CHOLESTEROL
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
              LDL CHOLESTEROL
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
            HDL CHOLESTEROL
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
            TRIGLYCERIDES
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="mt-5 pb-3 ">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200"
                  >
                    Cancel
                  </button>
                  </div>
                  <div className="mt-5 pb-3  ">        
                  <button
                    type="button"
                    className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                  >
                    Submit
                  </button>
                </div>
          </div>
          </form>
          </div>
        </div>
        </div>
      </div>
    

  );
};