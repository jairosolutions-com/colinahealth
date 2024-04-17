"use client";

import { X } from "lucide-react";
import React, { useEffect } from "react";
import Image from "next/image";
interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const AppointmentModalContent = ({ isModalOpen }: Modalprops) => {
  return (
    <div className="w-[676px] h-[523px] bg-[#FFFFFF] rounded-md">
      <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
        <div className="items-center flex justify-between">
          <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
            Add an Appointment
          </h2>
          <X
            onClick={() => isModalOpen(false)}
            className="w-7 h-7 text-black flex items-center mt-2 mr-4"
          />
        </div>
        <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
          Submit your appointment schedule.
        </p>
      </div>
      <div className=" mb-9 pt-4">
        <div className="h-[600px] max-h-[300px] md:px-10 mt-5">
          <form className="">
            <div className="flex flex-col mt-6 pb-3 relative">
              <div className="flex flex-col w-full">
                <input
                  type="date"
                  required
                  className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                  placeholder="input reaction"
                />
                <Image
                  className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                  width={20}
                  height={20}
                  src={"/svgs/calendark.svg"}
                  alt={""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="">
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  Time From:
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input reaction"
                  />
                  <Image
                    className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                    width={20}
                    height={20}
                    src={"/svgs/clock.svg"}
                    alt={""}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  Time to:
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input reaction"
                  />
                  <Image
                    className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                    width={20}
                    height={20}
                    src={"/svgs/clock.svg"}
                    alt={""}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  Details
                </label>
                <div className="mt-2.5">
                  <textarea
                    rows={5}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input details"
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="pt-11">
          <div className="justify-center flex border-t-4 pt-26">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
