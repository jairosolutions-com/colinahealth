"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  
  return (
    

       <div
        className={`absolute left-0 top-0 w-full h-full bg-[#76898A99] flex items-center justify-center `}
      >
        <div className="max-w-[800px] w-full">
          <div className="bg-[#007C85] w-full h-[50px] flex items-center justify-end px-[50px]">
            <X
              onClick={() => isModalOpen(false)}
              className="w-5 h-5 text-white"
            />
          </div>

          <div className="bg-white">
            <div className="grid grid-rows-1 max-w-[736px] w-full pl-[73px]">
            <div className="mt-12 flex items-center">
              <label className=" font-bold text-lg mr-[87px] text-nowrap pt-4">
                Type
              </label>
                <input
                  type="text"
                  className="h-12 w-[500px]  px-3 py-2 text-sm text-normal rounded-lg border border-gray-200"
                  placeholder="input type of allergy"
                />
            </div>
            
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px]">
            <div className="mt-10 flex items-center">
              <label className=" font-bold text-lg mr-[92px] text-nowrap pt-4">
                Date
              </label>
                <input
                  type="text"
                  className="h-12 w-[500px]  px-3 py-2 text-sm text-normal rounded-lg border border-gray-200"
                  placeholder="input severity"
                />
            </div>
            
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px]">
            <div className="mt-10 flex items-center">
              <label className=" font-bold text-lg mr-[70px] text-nowrap pt-4">
                Sugery
              </label>
                <input
                  type="text"
                  className="h-12 w-[500px]  px-3 py-2 text-sm text-normal rounded-lg border border-gray-200"
                  placeholder="input severity"
                />
            </div>
            
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px] pb-9">
            <div className="mt-10 flex items-center">
              <label className=" font-bold text-lg mr-[80px] text-nowrap pb-[100px]">
                Notes 
              </label>
                <input
                  type="text"
                  className="pb-[100px]   w-[500px]  px-3 py-2 text-sm text-normal rounded-lg border border-gray-200"
                  placeholder="input notes"
                />
            </div>
          </div>
          <div className="justify-end flex pb-6 pr-[86px]">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-[#ffff] font-semibold font-manrope py-1 px-4 rounded w-24 h-8 mr-3"
             >Submit
            </button>


          </div>  
          
          </div>
        </div>
      </div>
    
  );
};
