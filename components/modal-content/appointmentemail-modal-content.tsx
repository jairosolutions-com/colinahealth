"use client";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const AppointmentemailModalContent = ({ isModalOpen }: Modalprops) => {
  const [selectedCodeStatus, setSelectedCodeStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="w-[1200px] h-[641px]">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between px-8">
            <h2 className="p-title text-left text-[#071437] mt-5 w-full pl-2">
              Compose an Email for Schedule
            </h2>
            <X
              onClick={() => isModalOpen(false)}
              className="w-6 h-6 text-black flex items-center mt-2"
            />
          </div>
          <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
            Ensure to input details
          </p>
          <div className="flex place-items-end mr-4"></div>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[470px] md:px-10 mt-5">
            <form className="">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    TO
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input recipient"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    SUBJECT
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input subject"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      rows={12}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="compose email here"
                      style={{ resize: "none", overflowY: "scroll" }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="justify-end flex mr-10">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className="w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-[150px] h-[45px] bg-[#007C85] hover:bg-[#03595B]  text-[#ffff]  font-medium rounded-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
