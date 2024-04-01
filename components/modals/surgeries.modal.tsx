"use client";

import {
  createSurgeriesOfPatient,
  updateSurgeryOfPatient,
} from "@/app/api/medical-history-api/surgeries.api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Modalprops {
  isEdit: boolean;
  surgeryData: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const SurgeriesModal = ({
  isEdit,
  surgeryData,
  label,
  isOpen,
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
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        const prescription = await createSurgeriesOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Prescription added successfully:", prescription);

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
    <div
      className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-[150px]`}
    >
      <div className="w-[676px] h-[570px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
          {isEdit ? "Update" : "Add"} Medical History Surgeries Log
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="w-full max-h-[400px] md:px-10 mt-5">
            <form className="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    TYPE
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      onChange={handleChange}
                      name="typeOfSurgery"
                      value={formData.typeOfSurgery}
                      placeholder="input type"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    DATE
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="date"
                      onChange={handleChange}
                      name="dateOfSurgery"
                      value={formData.dateOfSurgery}
                      className="block w-[290px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input date"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 pb-3 ">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="w-[290px] h-12 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-6 pb-3 ">
                  <button
                    type="submit"
                    className="w-[290px] h-12 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                  >
                    {isEdit ? "Update" : "Submit"}
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
