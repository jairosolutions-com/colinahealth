import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Modalprops {
  formData: any;
  isModalOpen: (isOpen: boolean) => void;
}

interface FormData {
  uuid: string;
  nameOfDocument: any; // Assuming file property exists for the key
  dateIssued: string;
  notes: string;
}

export const FormsviewModalContent = ({
  isModalOpen,
  formData,
}: Modalprops) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleModalOpen = (isOpen: boolean) => {
    // Rename the function
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
  };
  // Test
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [formViewData, setFormViewData] = useState({
    nameOfDocument: formData.forms_nameOfDocument || "",
    uuid: formData.forms_uuid || "",
    dateIssued: formData.forms_dateIssued || "",
    notes: formData.forms_uuid || "",
  });
  //
  console.log(formData, "formzzzzz");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "appointmentDate") {
      setDate(value);
      formViewData.dateIssued = value;
      console.log(value, "lab date");
    }
    setFormViewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="w-[676px] h-[546px] bg-[#FFFFFF] rounded-md">
      <form>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              Form Preview
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
            Download PDF once your done.
            <button className="pl-[297px] hover:underline text-[15px]">
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
                    disabled
                    required
                    value={formData.forms_nameOfDocument}
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
                    disabled
                    required
                    value={formData.forms_dateIssued}
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
                    required
                    disabled
                    value={formData.forms_notes}
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
              disabled={isSubmitted}
              type="button"
              className={`
                ${isSubmitted && " cursor-not-allowed"}
                w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black  mr-4 rounded-sm `}
            ></button>
            <button
              disabled={isSubmitted}
              type="submit"
              className={`
                      ${isSubmitted && " cursor-not-allowed"}
                      w-[150px] h-[45px]px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormsviewModalContent;
