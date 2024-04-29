"use client";

import {
  createPrescriptionOfPatient,
  updatePrescriptionOfPatient,
} from "@/app/api/prescription-api/prescription.api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  isEdit: boolean;
  prescriptionData: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const PrescriptionModal = ({
  isEdit,
  prescriptionData,
  label,
  setIsUpdated,
  isOpen,
  setErrorMessage,
  isModalOpen,
  onSuccess,
  onFailed
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
    name: prescriptionData.prescriptions_name || "",
    frequency: prescriptionData.prescriptions_frequency || "",
    interval: prescriptionData.prescriptions_interval || "",
    dosage: prescriptionData.prescriptions_dosage || "",
    status: prescriptionData.prescriptions_status || "",
  });
console.log(label,'label')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        await updatePrescriptionOfPatient(
          prescriptionData.prescriptions_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess()
        isModalOpen(false);
        return;
      } else {
        const prescription = await createPrescriptionOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Prescription added successfully:", prescription);

        // Reset the form data after successful submission
        setFormData({
          name: "",
          frequency: "",
          interval: "",
          dosage: "",
          status: "",
        });
        onSuccess()
      }
    } catch (error:any) {
      if(error.message === "Request failed with status code 409"){
        setErrorMessage("Prescription already exist")
        onFailed()
        isModalOpen(false);
        console.log("conflict error")
      }
      setError("Failed to add Prescription");
    }
  };
  console.log(prescriptionData, "prescriptionData");
  console.log(formData, "formData");
  return (
    <div
      className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-[260px]`}
    >
      <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {isEdit ? "Update" : "Add"} Prescription Schedule
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[300px] md:px-10 mt-5">
            <form className="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    MEDICINE NAME
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input medicine name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    FREQUENCY
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    INTERVAL
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input interval"
                      name="interval"
                      value={formData.interval}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    DOSAGE
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      required
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input dosage"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    STATUS
                  </label>
                  <div className="mt-2.5">
                    <select
                      id="status"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      value={formData.status}
                      name="status"
                      onChange={handleStatusChange}
                      required
                    >
                      <option value="">select status</option>
                      <option value="active">ACTIVE</option>
                      <option value="inactive">INACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 pb-3 flex flex-row">
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                >
                  {isEdit ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
