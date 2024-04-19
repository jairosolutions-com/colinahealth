import { X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ModalProps {
  isModalOpen: (isOpen: boolean) => void;
}

export const NofileviewModalContent = ({ isModalOpen }: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const toggleToast = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    toast({
      variant: "destructive",
      title: "No File Attached!",
      description: "Please try again.",
    });
  };

  return (
    <div className="w-[676px] h-[545px]">
      <div className="mb-9 ">
        <div className="h-[400px] md:px-10 mt-10 flex justify-center items-center">
          <div className="even:bg-gray-50 cursor-pointer">
            <div
              style={{ overflow: "hidden", width: "400px", height: "400px" }}
            >
              <Image
                src="/imgs/nodocs.png"
                alt="Document"
                width={500}
                height={200}
                className="w-89 mt-10"
              />
            </div>
            <div className="flex justify-center text-[15px] font-medium mb-4 mt-2">
              No image/document found!
            </div>
            <div className="flex flex-row justify-center">
              <p className="border-2 rounded-l-md px-2 py-2 text-gray-400 text-[12px]">
                Upload or Attach Files or
              </p>
              <label
                htmlFor="imageUpload"
                className="decoration-solid text-[12px] bg-[#007C85] px-2 py-2 text-white border-r-md cursor-pointer rounded-r-lg border-2 border-[#007C85]"
              >
                Browse
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <div className="justify-center flex border-t-4">
          <button
            onClick={() => isModalOpen(false)}
            type="button"
            className="w-[600px] h-[50px] px-3 py-2 bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mt-4 mr-[4px] rounded-bl-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={toggleToast}
            className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default NofileviewModalContent;
