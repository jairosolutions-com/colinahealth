"use client";
import {
  updatePRNMedOfPatient,
  createPRNMedOfPatient,
} from "@/app/api/medication-logs-api/prn-med-api";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

interface ModalProps {
  isEdit: boolean;
  setIsUpdated: any;
  PRNData: any;
  label: string;
  isOpen: boolean;
  uuid: string;
  name: any;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const PrnModalContent = ({
  isEdit,
  setIsUpdated,
  PRNData,
  label,
  isOpen,
  uuid,
  name,
  setErrorMessage,
  isModalOpen,
  onSuccess,
  onFailed,
}: ModalProps) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const { toast } = useToast();
  console.log(isEdit, "isEdit");
  const patientId = params.id ? params.id.toUpperCase() : uuid.toUpperCase();
  console.log(patientId, "patientId");
  const [error, setError] = useState<string | null>(null);
  const [charactersFull, setCharactersFull] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    medicationLogsName: PRNData.medicationlogs_medicationLogsName || "",
    medicationLogsDate: PRNData.medicationlogs_medicationLogsDate || "",
    medicationLogsTime: PRNData.medicationlogs_medicationLogsTime || "",
    notes: PRNData.medicationlogs_notes || "",
    medicationType: "PRN",
    medicationLogStatus: PRNData.medicationlogs_medicationLogStatus || "",
  });
  console.log(label, "label");

  useEffect(() => {
    if (label === "charting") {
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toTimeString().split(" ")[0];

      setFormData({
        ...formData,
        medicationLogsDate: formattedDate,
        medicationLogsTime: formattedTime,
      });
    }
  }, [label]);
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
    setIsSubmitted(true);
    e.preventDefault();
    try {
      if (isEdit) {
        await updatePRNMedOfPatient(
          PRNData.medicationlogs_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        const prescription = await createPRNMedOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Prescription added successfully:", prescription);

        // Reset the form data after successful submission
        setFormData({
          medicationLogsName: "",
          medicationLogsDate: "",
          medicationLogsTime: "",
          notes: "",
          medicationType: "PRN",
          medicationLogStatus: "",
        });
        onSuccess();
      }
    } catch (error: any) {
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("PRN Med already exist");
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
      setError("Failed to add PRN Med");
    }
    setIsSubmitted(false);
  };
  console.log(formData, "formData");
  return (
    <div className={`w-[676px] ${charactersFull ? "h-[646px]" : "h-[648px]"} `}>
      <form onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7 truncate">
              {isEdit ? "Update" : "Add"} PRN Medication Log {name ? "for" : ""}{" "}
              <span className="text-[#007C85]">{name ? name : ""}</span>
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
        <div
          className={` ${charactersFull ? "mb-[175px]" : "mb-[156px]"} pt-4`}
        >
          <div className="w-full h-[320px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  MEDICATION
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Input medication"
                    name="medicationLogsName"
                    value={formData.medicationLogsName}
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
                    placeholder="Input notes"
                    style={{ resize: "none" }}
                    name="notes"
                    value={formData.notes}
                    onChange={handleTextChange}
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
                    className="block w-[287px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Input medication"
                    name="medicationLogsDate"
                    value={formData.medicationLogsDate}
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
              <div className="">
                <label
                  htmlFor="date"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  TIME
                </label>
                <div className="mt-2.5 relative">
                  <input
                    type="time"
                    className="block w-[287px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Input medication"
                    name="medicationLogsTime"
                    value={formData.medicationLogsTime}
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
                    name="medicationLogStatus"
                    value={formData.medicationLogStatus}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Held">HELD</option>
                    <option value="Given">GIVEN</option>
                    <option value="Refused">REFUSED</option>
                  </select>
                  {/* <Image
                    className="absolute top-0 right-0 mt-3 mr-3 pointer-events-none"
                    src="svgs/chevron.svg"
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
            </div>
          </div>
        </div>
        <div className="">
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
        </div>
      </form>
    </div>
  );
};
