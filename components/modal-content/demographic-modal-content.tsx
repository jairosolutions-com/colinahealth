"use client";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const DemographicModalContent = ({ isModalOpen }: Modalprops) => {
  const [selectedCodeStatus, setSelectedCodeStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="w-[1200px] h-[645px]">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between px-8">
            <h2 className="p-title text-left text-[#071437] mt-5 w-full pl-2">
              Patient Demographic
            </h2>
            <X
              onClick={() => isModalOpen(false)}
              className="w-7 h-7 text-black flex items-center mt-2"
            />
          </div>
          <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
            Add patient demographic and make sure to submit.
          </p>
          <div className="flex place-items-end mr-4"></div>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[470px] md:px-10 mt-5">
            <form className="">
              <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input firstname"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Middle Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input middlename"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input lastname"
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-lg font-bold leading-6 text-gray-900 required-field"
                    >
                      Age
                    </label>
                    <div className="mt-1 mr-4">
                      <input
                        type="text"
                        required
                        className="block w-[174px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                        placeholder="input age"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-lg font-bold leading-6 text-gray-900 required-field"
                      >
                        Gender
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="status"
                          className="block w-[173px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          value={selectedGender}
                          onChange={(e) => setSelectedGender(e.target.value)}
                          style={{ cursor: "pointer" }}
                        >
                          <option value="">select gender</option>
                          <option value="active">Male</option>
                          <option value="inactive">Female</option>
                        </select>
                        <Image
                          className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                          width={20}
                          height={20}
                          src={"/svgs/chevron-up.svg"}
                          alt={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Date of Birth
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input date"
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
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Address 1
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input address 1"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Address 2
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input address 2 (optional)"
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-lg font-bold leading-6 text-gray-900 required-field"
                    >
                      City
                    </label>
                    <div className="mt-1 mr-4">
                      <input
                        type="text"
                        required
                        className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                        placeholder="input city"
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-lg font-bold leading-6 text-gray-900 required-field"
                      >
                        State
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          required
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="input state"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input country"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Zip
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input zip"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Allergies
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input Allergies"
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Code Status
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="status"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      value={selectedCodeStatus}
                      onChange={(e) => setSelectedCodeStatus(e.target.value)}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">select status</option>
                      <option value="active">DNR</option>
                      <option value="inactive">FULL CODE</option>
                    </select>
                    <Image
                      className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                      width={20}
                      height={20}
                      src={"/svgs/chevron-up.svg"}
                      alt={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Addmission Date
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input addmission date"
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
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input email"
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="imageUpload"
                    className="relative h-[70px] w-full bg-[#daf3f5] border-[#007C85] border-dashed border-2 flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-1.5"
                  >
                    <Image
                      className="w-10 h-10 mr-1"
                      width={50}
                      height={50}
                      src={"/svgs/gallery-export.svg"}
                      alt={""}
                    />
                    <div className="flex pb-5">
                      <p className="">Drag & Drop files or</p>
                      <p className="underline decoration-solid text-blue-500 ml-1">
                        Browse
                      </p>
                    </div>
                    <span className="text-sm font-normal absolute bottom-2 text-[#667085] ml-10 pb-1">
                      Support PNG & JPG
                    </span>
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e)}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="justify-center flex border-t-4 ">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className="w-[600px] h-[50px]  bg-[#ffffff] hover:text-red-500 text-black font-medium mt-4 mr-[3px] rounded-bl-md border-2  "
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-[600px] bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff]  font-medium mt-4 rounded-br-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
