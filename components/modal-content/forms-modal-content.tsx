import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createFormsOfPatient } from "@/app/api/forms-api/forms.api";
interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

// export const FormsModalContent = ({ isModalOpen, onSuccess }: Modalprops) => {
//   const [selectedStatus, setSelectedStatus] = useState(""); // State to hold the selected status

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
  throw new Error("Function not implemented.");
}

//   const router = useRouter();
//   const params = useParams<{
//     id: any;
//     tag: string;
//     item: string;
//   }>();
//   const patientId = params.id.toUpperCase();
//   const [isOpen, setIsOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     dateIssued: "",
//     nameOfDocument: "",
//     notes: "",
//   });
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleModalOpen = (isOpen: boolean) => {
//     // Rename the function
//     setIsOpen(isOpen);
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     }
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     try {
//       const forms = await createFormsOfPatient(patientId, formData, router);
//       console.log("forms added successfully:", forms);

//       // Reset the form data after successful submission
//       setFormData({
//         dateIssued: "",
//         nameOfDocument: "",
//         notes: "",
//       });

//       onSuccess();
//     } catch (error) {
//       console.error("Error adding forms:", error);
//       setError("Failed to add forms");
//     }
//   };
//   console.log(formData, "formData");

export const FormsModalContent = ({ isModalOpen, onSuccess }: Modalprops) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
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
    setIsSubmitted(true);
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
      isModalOpen(false); 
      onSuccess();
    } catch (error) {
      console.error("Error adding forms:", error);
      setError("Failed to add forms");
    }
    setIsSubmitted(false);
  };
  console.log(formData, "formData");

  return (
    <div className="w-[676px] h-[621px] bg-[#FFFFFF] rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <p className="font-semibold text-[20px] text-left  pl-10 mt-7">
              Add Form Details
            </p>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-6 h-6 text-black flex items-center mt-6 mr-9 cursor-pointer`}
            />
          </div>
          <p className="text-[15px] pl-10 text-[#667085] pb-10 pt-2">
            Download PDF once your done.
          </p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[375px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="font-medium text-[15px] required-field">
                  NAME OF DOCUMENT
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Input name of document"
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
                  className="font-medium text-[15px] required-field"
                >
                  DATE ISSUED
                </label>
                <div className="mt-2.5 relative">
                  <input
                    type="date"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Select date"
                    name="dateIssued"
                    value={formData.dateIssued}
                    onChange={handleChange}
                    required
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
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="font-medium text-[15px] required-field"
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
                    required
                  />
                </div>
              </div>
              <div className="grid-cols-1 grid">
                <label className="relative h-[70px] w-[596px] bg-[#daf3f5] border-[#007C85] border-dashed border-2 flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-1.5">
                  <Image
                    className="w-10 h-10 mr-1"
                    width={50}
                    height={50}
                    src={"/svgs/folder-add.svg"}
                    alt={""}
                  />
                  <div className="flex pb-5 text-nowraptext-[15px] font-medium">
                    <p className="">Upload or Attach Files or</p>
                    <p className="underline text-blue-500 ml-1">Browse</p>
                  </div>
                  <span className="text-[15px] font-medium absolute bottom-2 text-[#667085] ml-10 pb-1">
                    Minimum file size 100 MB.
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
        <div className="pt-10">
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
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
