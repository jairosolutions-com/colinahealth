"use client";

import { createAllergiesOfPatient, updateAllergyOfPatient } from "@/app/api/medical-history-api/allergies.api";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  isEdit: boolean;
  allergy: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  setErrorMessage: any
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
  
}

export const AllergyModal = ({
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

  const patientId = params.id.toUpperCase();
  // const patientId = params.id;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateAllergyOfPatient(allergy.allergies_uuid, formData, router);
        setIsUpdated(true);
        onSuccess()
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
        onSuccess()
      }
    } catch (error: any) {
      if(error.message === "Request failed with status code 409"){
        setErrorMessage("Allergy already exist")
        onFailed()
        isModalOpen(false);
        console.log("conflict error")
      }
      setError("Failed to add allergy");
    }
  };

  console.log(formData, "formData")

  return (
    

    <div className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-40`}>
    <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
      <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
        <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
        {isEdit?"Update": "Add"} Medical History Allergies Log
        </h2>
        <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">Submit your log details.</p>
      </div>
      <div className=" mb-9 pt-4">
      <div className="h-[600px] max-h-[400px] md:px-10 mt-5" >
        <form className="" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
              TYPE
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="input type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
              ALLERGEN
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="input allergen"
                name="allergen"
                value={formData.allergen}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
             SEVERITY
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="input severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
              REACTION
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                required
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                placeholder="input reaction"
                name="reaction"
                value={formData.reaction}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
              NOTES
            </label>
            <div className="mt-2.5">
              <textarea
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="input notes"
                name="notes"
                value={formData.notes}
                onChange={handleTextChange}
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