"use client";

import { createAllergiesOfPatient } from "@/app/api/medical-history-api/allergies-api";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientUuid: patientId,
    type: "",
    allergen: "",
    severity: "",
    reaction: "",
    notes: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Call the createAllergiesOfPatient API function
      const allergy = await createAllergiesOfPatient(patientId, formData, router);
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
    } catch (error) {
      console.error("Error adding allergy:", error);
      setError("Failed to add allergy");
    }
  };
  
  return (
    <div
      className={`absolute left-0 top-0 w-full h-full bg-[#76898A99] flex items-center justify-center `}
    >
      <div className="max-w-[800px] w-full">
        <div className="bg-[#007C85] w-full h-[50px] flex items-center justify-end px-[50px]">
          <X
            onClick={() => isModalOpen(false)}
            className="w-5 h-5 text-white"
          />
        </div>

        <div className="bg-white">
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px]">
            <div className="mt-12 flex items-center">
              <label className=" font-bold text-lg mr-[87px] text-nowrap pt-4">
                Type
              </label>
              <input
                type="text"
                className="h-12 w-[500px]  px-3 py-2 text-sm text-normal rounded-lg border border-gray-200"
                placeholder="input type of allergy"
                name="type"
                value={formData.type}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px]">
            <div className="mt-12 flex items-center">
              <label className=" font-bold text-lg mr-[57px] text-nowrap pt-4">
                Allergen
              </label>
              <input
                type="text"
                className="h-12 w-[500px]  px-3 py-2 text-sm text-normal rounded-lg border border-gray-200"
                placeholder="input type of allergy"
                name="allergen"
                value={formData.allergen}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px]">
            <div className="mt-12 flex items-center">
              <label className=" font-bold text-lg mr-[57px] text-nowrap pt-4">
                Severity
              </label>
              <input
                type="text"
                className="h-12 w-[500px]  px-3 py-2 text-sm  text-normal rounded-lg border border-gray-200"
                placeholder="input severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px]">
            <div className="mt-12 flex items-center">
              <label className=" font-bold text-lg mr-[53px] text-nowrap pt-4">
                Reaction
              </label>
              <input
                type="text"
                className="h-12 w-[500px]  px-3 py-2 text-sm  text-normal rounded-lg border border-gray-200"
                placeholder="input reaction"
                name="reaction"
                value={formData.reaction}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-rows-1 max-w-[736px] w-full pl-[70px] pb-9">
            <div className="mt-12 flex items-center">
              <label className=" font-bold text-lg mr-[80px] text-nowrap pb-[100px]">
                Notes
              </label>
              <input
                type="text"
                className="pb-[100px]   w-[500px]  px-3 py-2 text-sm  text-normal rounded-lg border border-gray-200"
                placeholder="input notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="justify-end flex pb-6 pr-[86px]">
            <button
              onClick={handleSubmit}
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-[#ffff] font-semibold font-manrope py-1 px-4 rounded w-24 h-8 mr-3"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
