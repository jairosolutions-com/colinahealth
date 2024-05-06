"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  updateSurgeryOfPatient,
  createSurgeriesOfPatient,
} from "@/app/api/medical-history-api/surgeries.api";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

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
  const [charactersFull, setCharactersFull] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState("");
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
  const { toast } = useToast();
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (value === "Others") {
      setSelectedType("Others");
      setFormData((prevData) => ({
        ...prevData,
        [name]: "",
      }));
    } else {
      setSelectedType("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "notes" && value.length > 200) {
      const truncatedValue = value.slice(0, 200);
      setCharactersFull(true);
      setFormData((prevData) => ({
        ...prevData,
        [name]: truncatedValue,
      }));
    } else {
      setCharactersFull(false);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      if (isEdit) {
        await updateSurgeryOfPatient(
          surgeryData.surgeries_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        setIsSubmitted(false);
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
        setIsSubmitted(false);
        onSuccess();
      }
    } catch (error: any) {
      console.log(error.message, "error");
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Surgery already exist");
        setIsSubmitted(false);
        onFailed();
        isModalOpen(false);
        console.log("conflict error");
      } else if (error.message == "Network Error") {
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
      setError("Failed to add Surgery");
    }
  };
  console.log(surgeryData, "surgeryData");
  console.log(formData, "formData");
  return (
    <div className={`w-[676px] ${charactersFull ? "h-[577px]" : "h-[550px]"}`}>
      <form className="h-full" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {isEdit ? "Update" : "Add"} Medical History Surgeries Log
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
          <div className="w-full max-h-[400px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  TYPE
                </label>
                <div className="mt-2.5 relative">
                  {selectedType === "Others" && (
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input type"
                      onChange={handleChange}
                      name="typeOfSurgery"
                      value={formData.typeOfSurgery}
                    />
                  )}
                  {selectedType !== "Others" && (
                    <>
                      <select
                        required
                        className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 cursor-pointer"
                        name="typeOfSurgery"
                        value={formData.typeOfSurgery}
                        onChange={handleTypeChange}
                      >
                        <option value="">Select Surgery Type</option>
                        <option value="Bariatric Surgery">
                          Bariatric Surgery
                        </option>
                        <option value="Breast Surgery">Breast Surgery</option>
                        <option value="Colon & Rectal Surgery">
                          Colon & Rectal Surgery
                        </option>
                        <option value="Endocrine Surgery">
                          Endocrine Surgery
                        </option>
                        <option value="General Surgery">General Surgery</option>
                        <option value="Gynecological Surgery">
                          Gynecological Surgery
                        </option>
                        <option value="Hand Surgery">Hand Surgery</option>
                        <option value="Head & Neck Surgery">
                          Head & Neck Surgery
                        </option>
                        <option value="Hernia Surgery">Hernia Surgery</option>
                        <option value="Minimally Invasive Surgery">
                          Minimally Invasive Surgery
                        </option>
                        <option value="Neurosurgery">Neurosurgery</option>
                        <option value="Orthopedic Surgery">
                          Orthopedic Surgery
                        </option>
                        <option value="Ophthalmological Surgery">
                          Ophthalmological Surgery
                        </option>
                        <option value="Outpatient Surgery">
                          Outpatient Surgery
                        </option>
                        <option value="Pediatric Surgery">
                          Pediatric Surgery
                        </option>
                        <option value="Plastic, Reconstructive, Hand & Micro-Vascular Surgery">
                          Plastic, Reconstructive, Hand & Micro-Vascular Surgery
                        </option>
                        <option value="Robotic Surgery">Robotic Surgery</option>
                        <option value="Thoracic Surgery">
                          Thoracic Surgery
                        </option>
                        <option value="Trauma Surgery">Trauma Surgery</option>
                        <option value="Urologic Surgery">
                          Urologic Surgery
                        </option>
                        <option value="Vascular Surgery">
                          Vascular Surgery
                        </option>
                        <option value="Others">Others</option>
                      </select>
                      <Image
                        className="absolute top-0 right-0 mt-3 mr-3 pointer-events-none"
                        width={20}
                        height={20}
                        src={"/svgs/chevron-up.svg"}
                        alt={""}
                      />
                    </>
                  )}
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
                  <p
                    className={` text-red-500 ${
                      charactersFull ? "visible" : "hidden"
                    }`}
                  >
                    *Maximum of 200 characters only!
                  </p>
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
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
