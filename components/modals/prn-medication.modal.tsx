import {
  createPRNMedOfPatient,
  updatePRNMedOfPatient,
} from "@/app/api/medication-logs-api/prn-med-api";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ModalProps {
  isEdit: boolean;
  setIsUpdated: any;
  PRNData: any;
  label: string;
  isOpen: boolean;
  uuid: string;
  name:any;
  setErrorMessage: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const PRNMedModal = ({
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

  const patientId = params.id ? params.id.toUpperCase() : uuid.toUpperCase();
  console.log(patientId, "patientId");

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    medicationLogsName: PRNData.medicationlogs_medicationLogsName || "",
    medicationLogsDate: PRNData.medicationlogs_medicationLogsDate || "",
    medicationLogsTime: PRNData.medicationlogs_medicationLogsTime || "",
    notes: PRNData.medicationlogs_notes || "",
    medicationType: "PRN",
    medicationLogStatus: PRNData.medicationlogs_medicationLogStatus || "",
  });
  console.log(isEdit, "isEdit")
  console.log(label, "label");
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
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
      }
      setError("Failed to add PRN Med");
    }
  };
  console.log(formData, "formData");
  return (
    <div
      className={`fixed inset-[-100px] overflow-y-hidden overflow-x-hidden bg-[#76898A99] flex items-center justify-center pb-[150px] z-50`}
    >
      <div className="w-[676px] h-[660px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start text-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {isEdit ? "Update" : "Add"} PRN Medication Log {name? 'for' : ""} <span className="text-[#007C85]">{name? name: ""}</span>
          </h2>
          <p className="!text-sm pl-9 text-gray-600 pb-10 pt-2">
            Submit your log details.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="w-full max-h-[300px] md:px-10 mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-2 text-start">
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                      required
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 text-start">
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
                      placeholder="Input notes"
                      style={{ resize: "none" }}
                      required
                      name="notes"
                      value={formData.notes}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>
                <div className="flex-grow md:mr-8 mb-4 md:mb-0 text-start">
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    DATE
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="date"
                      className="block w-[290px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Input medication"
                      name="medicationLogsDate"
                      value={formData.medicationLogsDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex-grow md:mr-8 mb-4 md:mb-0 text-start">
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    TIME
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="time"
                      className="block w-[290px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="Input medication"
                      name="medicationLogsTime"
                      value={formData.medicationLogsTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="text-start">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                  >
                    STATUS
                  </label>
                  <div className="mt-2.5">
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
                  </div>
                </div>
              </div>
              <div className="mt-8 pb-3  grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-[290px] h-12  hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-[290px] h-12 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
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
