import { createNotesOfPatient, updateNotesOfPatient } from "@/app/api/notes-api/notes-api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  isEdit: boolean;
  notesToEdit: any;
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const IncidentReportModal = ({ isEdit,
  notesToEdit,
  label,
  isOpen,
  isModalOpen,
  onSuccess}: Modalprops) => {
    const params = useParams<{
      id: any;
      tag: string;
      item: string;
    }>();
  
    const patientId = params.id.toUpperCase();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      subject: notesToEdit.notes_subject || "",
      notes: notesToEdit.notes_notes || "",
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
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      try {
        if (isEdit) {
          await updateNotesOfPatient(
            notesToEdit.notes_uuid,
            formData,
            router
          );
          onSuccess();
          isModalOpen(false);
          return;
        } else {
          const vitalSign = await createNotesOfPatient(
            patientId,
            formData,
            router
          );
          console.log("vital sign added successfully:", vitalSign);
  
          // Reset the form data after successful submission
          setFormData({
            subject: "",
            notes: "",
          });
  
          onSuccess();
        }
      } catch (error) {
        console.error("Error adding note:", error);
        setError("Failed to add note");
      }
    };
    console.log(notesToEdit, "notesToEdit");
    console.log(formData, "formData");
  return (
    <div className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-[266px]`}>
      <div className="w-[676px] h-[630px] bg-[#FFFFFF] rounded-md mt-20">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
          {isEdit? "Update" : "Add"}  Incident Report.
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">Submit your log details.</p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[300px] md:px-10 mt-5">
            <form className="" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
                    SUBJECT
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="subject"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input medication"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
                    DETAILS OF INCIDENT
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      rows={4}
                      name="notes"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input notes"
                      style={{ resize: "none" }}
                      required
                      value={formData.notes}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 required-field">
                    REPORTED BY
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      rows={4}
                      name="notes"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input notes"
                      style={{ resize: "none" }}
                      required
                      value={formData.notes}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 pb-3 flex grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-[290px] h-12 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                >
                  Cancel
                </button>     
                <button
                  type="submit"
                  className="w-[290px] h-12 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
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