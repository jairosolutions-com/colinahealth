"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  updateVitalSignsOfPatient,
  createVitalSignsOfPatient,
} from "@/app/api/vital-sign-api/vital-sign-api";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
interface Modalprops {
  isEdit: boolean;
  vitalSignData: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const VitalModalContent = ({
  isEdit,
  vitalSignData,
  label,
  setIsUpdated,
  isOpen,
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const { toast } = useToast();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    date: vitalSignData.vitalsign_date || "",
    time: vitalSignData.vitalsign_time || "",
    bloodPressure: vitalSignData.vitalsign_bloodPressure || "",
    heartRate: vitalSignData.vitalsign_heartRate || "",
    temperature: vitalSignData.vitalsign_temperature || "",
    respiratoryRate: vitalSignData.vitalsign_respiratoryRate || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      if (isEdit) {
        await updateVitalSignsOfPatient(
          vitalSignData.vitalsign_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        const vitalSign = await createVitalSignsOfPatient(
          patientId,
          formData,
          router
        );
        console.log("vital sign added successfully:", vitalSign);

        // Reset the form data after successful submission
        setFormData({
          date: "",
          time: "",
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          respiratoryRate: "",
        });

        onSuccess();
      }
    } catch (error: any) {
      if (error.message == "Network Error") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => {
                window.location.reload();
              }}
            >
              Try again
            </ToastAction>
          ),
        });
      }
      console.error("Error adding Prescription:", error);
      setError("Failed to add Prescription");
    }
    setIsSubmitted(false);
  };
  console.log(vitalSignData, "prescriptionData");
  console.log(formData, "formData");
  return (
    <div className="w-[676px] h-[489px]">
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {isEdit ? "Update" : "Add"} Vital Sign
            </h2>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-6 h-6 text-black flex items-center mt-6 mr-9 cursor-pointer`}
            />
          </div>
          <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[237px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  BLOOD PRESSURE
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input blood pressure"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  HEART RATE
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input heart rate"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  TEMPERATURE
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  RESPIRATORY
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input respiratory"
                    name="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  DATE
                </label>
                <div className="mt-2.5 relative">
                  <input
                    type="date"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input temperature"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
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
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  TIME
                </label>
                <div className="mt-2.5 relative">
                  <input
                    type="time"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input respiratory"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
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
            </div>
          </div>
          <div className="pt-20">
            <div className="justify-end flex mr-10">
              <button
                onClick={() => isModalOpen(false)}
                disabled={isSubmitted}
                type="button"
                className={`
                ${isSubmitted && " cursor-not-allowed"}
                w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black  mr-4 rounded-sm `}
              >
                Cancel
              </button>
              <button
                disabled={isSubmitted}
                type="submit"
                className={`
               ${isSubmitted && " cursor-not-allowed"}
               w-[150px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
