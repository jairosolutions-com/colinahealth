"use client";

import {
  updateAllergyOfPatient,
  createAllergiesOfPatient,
} from "@/app/api/medical-history-api/allergies.api";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

interface Modalprops {
  isEdit: boolean;
  allergy: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const AllergiesModalContent = ({
  isEdit,
  allergy,
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

  console.log(allergy, "allergy");
  const { toast } = useToast();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [charactersFull, setCharactersFull] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    patientUuid: patientId,
    type: allergy.allergies_type,
    allergen: allergy.allergies_allergen,
    severity: allergy.allergies_severity,
    reaction: allergy.allergies_reaction,
    notes: allergy.allergies_notes,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        await updateAllergyOfPatient(allergy.allergies_uuid, formData, router);
        setIsUpdated(true);
        setIsSubmitted(false);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        const allergy = await createAllergiesOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Allergy added successfully:", allergy);

        // Reset the form data after successful submission
        setFormData({
          patientUuid: patientId,
          type: "",
          allergen: "",
          severity: "",
          reaction: "",
          notes: "",
        });
        setIsSubmitted(false);
        onSuccess();
      }
    } catch (error: any) {
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Allergy already exist");
        onFailed();
        setIsSubmitted(false);
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
      setError("Failed to add allergy");
    }
  };

  console.log(formData, "formData");

  return (
    <div className="w-[676px] h-[550px]">
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {isEdit ? "Update" : "Add"} Medical History Allergies Log
            </h2>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
             ${isSubmitted && " cursor-not-allowed"}
             w-6 h-6 text-black mt-6 mr-9 cursor-pointer`}
            />
          </div>
          <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="w-full max-h-[380px] md:px-10 mt-5">
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
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  ALLERGEN
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input allergen"
                    name="allergen"
                    value={formData.allergen}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  SEVERITY
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  REACTION
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input reaction"
                    name="reaction"
                    value={formData.reaction}
                    onChange={handleChange}
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
                    placeholder="input notes"
                    style={{ resize: "none" }}
                    name="notes"
                    value={formData.notes}
                    onChange={handleTextChange}
                  />
                  <p
                    className={`absolute text-end text-red-500 ${
                      charactersFull ? "visible" : "hidden"
                    }`}
                  >
                    *Maximum of 200 characters only!
                  </p>
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
            w-[150px] h-[45px] bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium rounded-sm  `}
          >
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};
