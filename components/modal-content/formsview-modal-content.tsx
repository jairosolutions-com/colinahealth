import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createFormsOfPatient } from "@/app/api/forms-api/forms.api";
interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const FormsviewModalContent = ({
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const [selectedStatus, setSelectedStatus] = useState(""); // State to hold the selected status
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dateIssued: "",
    nameOfDocument: "",
    notes: "",
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

  const handleModalOpen = (isOpen: boolean) => {
    // Rename the function
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const forms = await createFormsOfPatient(patientId, formData, router);
      console.log("forms added successfully:", forms);

      // Reset the form data after successful submission
      setFormData({
        dateIssued: "",
        nameOfDocument: "",
        notes: "",
      });

      onSuccess();
    } catch (error) {
      console.error("Error adding forms:", error);
      setError("Failed to add forms");
    }
  };
  console.log(formData, "formData");
  return (
    <div className="w-[676px] h-[546px] bg-[#FFFFFF] rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              Form Preview
            </h2>
            <X
              onClick={() => isModalOpen(false)}
              className="w-7 h-7 text-black flex items-center mt-2 mr-4"
            />
          </div>
          <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
            Download PDF once your done.
            <button
              className="pl-[297px] hover:underline text-[15px]"
              onClick={() => handleModalOpen(true)}
            >
              View Document
            </button>
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[300px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  NAME OF DOCUMENT
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input name of document"
                    name="nameOfDocument"
                    value={formData.nameOfDocument}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="company"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  DATE ISSUED
                </label>
                <div className="mt-2.5 flex">
                  <input
                    type="date"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="12/12/2024"
                    name="dateIssued"
                    value={formData.dateIssued}
                    onChange={handleChange}
                    required
                  />
                  <Image
                    className="absolute ml-[560px]  mt-4 pointer-events-none cursor-pointer"
                    width={20}
                    height={20}
                    src={"/svgs/calendark.svg"}
                    alt={""}
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
                    placeholder="Input Notes"
                    style={{ resize: "none" }}
                    name="notes"
                    value={formData.notes}
                    onChange={handleTextChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10">
          <div className="justify-end flex mr-10">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className="w-[170px] h-[50px] px-3 py-2 bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-[170px] h-[50px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium rounded-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
