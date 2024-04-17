import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormsviewsModalContent } from "@/components/modal-content/formsviews-modal-content";
import Modal from "@/components/reusable/modal";
interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const FormsviewModalContent = ({ isModalOpen }: Modalprops) => {
  const [selectedStatus, setSelectedStatus] = useState(""); // State to hold the selected status
  const [isOpen, setIsOpen] = useState(false);

  const handleModalOpen = (isOpen: boolean) => {
    // Rename the function
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
  };
  return (
    <div className="w-[676px] h-[550px] bg-[#FFFFFF] rounded-md">
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
          <form className="">
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
                    placeholder="Patient Details"
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
                <div className="mt-2.5">
                  <input
                    type="text"
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="12/12/2024"
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
                    placeholder="Patient reports occasional headaches. Advised to monitor and follow up."
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="pt-10">
        <div className="justify-center flex border-t-4 ">
          <button
            onClick={() => isModalOpen(false)}
            type="button"
            className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
          >
            Download PDF
          </button>
        </div>
      </div>
      {isOpen && (
        <Modal
          content={<FormsviewsModalContent isModalOpen={isModalOpen} />}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
};
