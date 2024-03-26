"use client";

import {
  updateLabResultOfPatient,
  createLabResultOfPatient,
} from "@/app/api/lab-results-api/lab-results.api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  isEdit: any;
  labResultData: any;
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const LabResultModal = ({
  isEdit,
  labResultData,
  label,
  isOpen,
  isModalOpen,
  onSuccess
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: labResultData.labResults_date || "",
    hemoglobinA1c: labResultData.labResults_hemoglobinA1c || "",
    fastingBloodGlucose: labResultData.labResults_fastingBloodGlucose || "",
    totalCholesterol: labResultData.labResults_totalCholesterol || "",
    ldlCholesterol: labResultData.labResults_ldlCholesterol || "",
    hdlCholesterol: labResultData.labResults_hdlCholesterol || "",
    triglycerides: labResultData.labResults_triglycerides || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  console.log(isEdit, "EDIT STATUS");
  console.log(labResultData.labResults_uuid, "labResultData.labResults_uuid");
  const handleSubmit = async (e: any) => {
    console.log(isEdit, "edit stat");

    e.preventDefault();
    try {
      if (isEdit) {
        await updateLabResultOfPatient(
          labResultData.labResults_uuid,
          formData,
          router
        );
        onSuccess()
        isModalOpen(false);
        return;
      } else {
        const labResult = await createLabResultOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Lab Result added successfully:", labResult);

        // Reset the form data after successful submission
        setFormData({
          date: "",
          hemoglobinA1c: "",
          fastingBloodGlucose: "",
          totalCholesterol: "",
          ldlCholesterol: "",
          hdlCholesterol: "",
          triglycerides: "",
        });
        onSuccess()
      }
    } catch (error) {
      console.error("Error adding Lab Result:", error);
      setError("Failed to add Lab Result");
    }
  };
  console.log(labResultData, "labResultData");
  console.log(formData, "formData");
  return (
    <div
      className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-60`}
    >
      <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {isEdit ? "Update" : "Add"} Laboratory Result
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[320px] md:px-10 mt-5">
            <form className="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    HEMOGLOBIN A1c
                  </label>
                  <div className="mt-2.5">
                    <input
                      value={formData.hemoglobinA1c}
                      type="text"
                      onChange={handleChange}
                      required
                      name="hemoglobinA1c"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    FASTING BLOOD GLUCOSE
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      onChange={handleChange}
                      value={formData.fastingBloodGlucose}
                      required
                      name="fastingBloodGlucose"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    TOTAL CHOLESTEROL
                  </label>
                  <div className="mt-2.5">
                    <input
                      value={formData.totalCholesterol}
                      type="text"
                      required
                      name="totalCholesterol"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    LDL CHOLESTEROL
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={formData.ldlCholesterol}
                      required
                      name="ldlCholesterol"
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    HDL CHOLESTEROL
                  </label>
                  <div className="mt-2.5">
                    <input
                      value={formData.hdlCholesterol}
                      type="text"
                      onChange={handleChange}
                      required
                      name="hdlCholesterol"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    TRIGLYCERIDES
                  </label>
                  <div className="mt-2.5">
                    <input
                      value={formData.triglycerides}
                      type="text"
                      name="triglycerides"
                      onChange={handleChange}
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
                    type="submit"
                    className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
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
