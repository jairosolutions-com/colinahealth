"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  updateSurgeryOfPatient,
  createSurgeriesOfPatient,
} from "@/app/api/medical-history-api/surgeries.api";

interface Modalprops {
  isEdit: boolean;
  surgeryData: any;
  label: string;
  isOpen: boolean;
  setIsUpdated: any;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const SurgeriesModalContent = ({
  isEdit,
  surgeryData,
  label,
  isOpen,
  setIsUpdated,
  setErrorMessage,
  isModalOpen,
  onSuccess,
  onFailed,
}: Modalprops) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dateOfSurgery: surgeryData.surgeries_dateOfSurgery,
    typeOfSurgery: surgeryData.surgeries_typeOfSurgery,
    surgery: surgeryData.surgeries_surgery,
    notes: surgeryData.surgeries_notes,
  });
  const router = useRouter();

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateSurgeryOfPatient(
          surgeryData.surgeries_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        const surgeries = await createSurgeriesOfPatient(
          patientId,
          formData,
          router
        );
        console.log("surgeries added successfully:", surgeries);

        // Reset the form data after successful submission
        setFormData({
          dateOfSurgery: "",
          typeOfSurgery: "",
          surgery: "",
          notes: "",
        });
        onSuccess();
      }
    } catch (error: any) {
      console.log(error.message, "error");
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Surgery already exist");
        onFailed();
        isModalOpen(false);
        console.log("conflict error");
      }
      setError("Failed to add Surgery");
    }
  };
  console.log(surgeryData, "surgeryData");
  console.log(formData, "formData");
  return (
    <div className="w-[676px] h-[554px]">
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {isEdit ? "Update" : "Add"} Medical History Surgeries Log
            </h2>
            <X
              onClick={() => isModalOpen(false)}
              className="w-7 h-7 text-black flex items-center mt-2 mr-4"
            />
          </div>
          <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="w-full max-h-[400px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  TYPE
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input type"
                    onChange={handleChange}
                    name="typeOfSurgery"
                    value={formData.typeOfSurgery}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  SURGERY
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full  h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    onChange={handleChange}
                    name="surgery"
                    value={formData.surgery}
                    placeholder="input surgery"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  NOTES
                </label>
                <div className="mt-2.5">
                  <textarea
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    name="notes"
                    value={formData.notes}
                    onChange={handleNoteChange}
                    placeholder="input notes"
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="date"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  DATE
                </label>
                <div className="mt-2.5 relative">
                  <input
                    type="date"
                    required
                    className="block w-[290px]  h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input surgery"
                    onChange={handleChange}
                    name="dateOfSurgery"
                    value={formData.dateOfSurgery}
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
            </div>
          </div>
        </div>
        <div className="justify-center flex border-t-4">
          <button
            onClick={() => isModalOpen(false)}
            type="button"
            className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
          >
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};