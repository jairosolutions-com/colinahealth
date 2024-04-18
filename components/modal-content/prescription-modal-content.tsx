"use client";
import {
  updatePrescriptionOfPatient,
  createPrescriptionOfPatient,
} from "@/app/api/prescription-api/prescription.api";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  isEdit: boolean;
  prescriptionData: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const PrescriptionModalContent = ({
  isEdit,
  prescriptionData,
  label,
  setIsUpdated,
  isOpen,
  setErrorMessage,
  isModalOpen,
  onSuccess,
  onFailed,
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
  console.log(label, "label");
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }
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
        onSuccess();
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
        onSuccess();
      }
    } catch (error: any) {
      if (error.message === "Request failed with status code 409") {
        console.log(error.message,'error message  ')
        setErrorMessage("Prescription already exist");
        onFailed();
        isModalOpen(false);
        console.log("conflict error");
      }
      setError("Failed to add Prescription");
    }
  };
  console.log(prescriptionData, "prescriptionData");
  console.log(formData, "formData");
  return (
    <div className="w-[676px] h-[487px]">
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {isEdit ? "Update" : "Add"} Prescription Schedule
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
          <div className="w-full max-h-[300px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  MEDICINE NAME
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  FREQUENCY
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  INTERVAL
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  DOSAGE
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
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
                  className="block text-md font-bold leading-6 text-gray-900 required-field pb-2"
                >
                  STATUS
                </label>
                <div className="relative">
                  <select
                    id="status"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">select status</option>
                    <option value="active">ACTIVE</option>
                    <option value="inactive">INACTIVE</option>
                  </select>
                  {/* <img
                    className="absolute top-0 right-0 mt-3 mr-3 pointer-events-none"
                    src="svgs/chevron-up.svg"
                    alt="Dropdown Arrow"
                    style={{ width: '1rem', height: '1rem' }}
                      /> */}
                  <Image
                    className="absolute top-0 right-0 mt-3 mr-3 pointer-events-none"
                    width={20}
                    height={20}
                    src={"/svgs/chevron-up.svg"}
                    alt={""}
                  />
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="imageUpload"
                  className="relative h-12 w-full bg-[#daf3f5] border-[#007C85] border-dashed border-2 flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[31px]"
                >
                  <Image
                    className="w-10 h-10 mr-1"
                    width={50}
                    height={50}
                    src={"/svgs/folder-add.svg"}
                    alt={""}
                  />
                  <div className="flex pb-5 text-nowrap text-[12px] ">
                    <p className="mt-2">Upload or Attach Files or</p>
                    <p className="underline decoration-solid text-blue-500 ml-1 mt-2">
                      Browse
                    </p>
                  </div>
                  <span className="text-[10px] font-normal absolute bottom-2 text-[#667085] ml-10 ">
                    Minimum file size
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
          </div>
        </div>
        <div className="">
          <div className="justify-center flex border-t-4 pt-26">
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
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
