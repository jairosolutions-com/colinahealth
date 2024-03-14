"use client";

import { X } from "lucide-react";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  return (
    <>
      <div
        className={`absolute left-0 top-0 w-full h-screen bg-[#76898A99] flex items-center justify-center`}
      >
        <div className="max-w-[1018px] w-full">
          <div className="bg-[#007C85] w-full h-[50px] flex items-center justify-end px-[50px]">
            <X
              onClick={() => isModalOpen(false)}
              className="w-5 h-5 text-white"
            />
          </div>

          <div className="bg-white flex-row px-20 font-bold font-27px ">
            <div className="py-5">
              Type
              <input
                className=" flex-row items-center border-gray border rounded-[10px] ml-4 pl-5"
                type="text"
                id="type"
                name="type"
                style={{ width: "645px", height: "57px" }}
              />
            </div>
            <div className="py-3">
              Type
              <input
                className=" flex-row items-center border-gray border rounded-[10px] ml-4 pl-5"
                type="text"
                id="type"
                name="type"
                style={{ width: "645px", height: "57px" }}
              />
            </div>
            <div className="py-3">
              Type
              <input
                className=" flex-row items-center border-gray border rounded-[10px] ml-4 pl-5"
                type="text"
                id="type"
                name="type"
                style={{ width: "645px", height: "57px" }}
              />
            </div>
            <div className="py-3">
              Type
              <input
                className=" flex-row items-center border-gray border rounded-[10px] ml-4 pl-5"
                type="text"
                id="type"
                name="type"
                style={{ width: "645px", height: "160px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};