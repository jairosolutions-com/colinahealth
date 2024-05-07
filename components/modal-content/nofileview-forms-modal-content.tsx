import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
// import {
//   addPrescriptionFile,
//   getCurrentPrescriptionFileCountFromDatabase,
// } from "@/app/api/prescription-api/prescription.api";
import {
  addFormFile,
  getCurrentFileCountFromDatabase,
} from "@/app/api/forms-api/forms.api";
import { useRouter } from "next/navigation";

interface ModalProps {
  formsUuid: any;
  isModalOpen: (isOpen: boolean) => void;
  onClose: any;
  onSuccess: any;
}
interface FormFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const NofileviewFormsModalContent: React.FC<ModalProps> = ({
  formsUuid,
  isModalOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [formsFiles, setFormsFiles] = useState<any[]>([]);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const defaultFormsFiles = Array.isArray(formsFiles) ? formsFiles : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      const getUuid = formsUuid;
      console.log("getUuid", getUuid);

      if (selectedFiles.length === 0) {
        toggleToast("No File Attached!", "Please try again.");
        return;
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const formsFormData = new FormData();
        formsFormData.append("formfile", selectedFiles[i], fileNames[i]);

        const addFormFiles = await addFormFile(getUuid, formsFormData, router);

        console.log(
          `Form FILE ${fileNames[i]} added successfully:`,
          addFormFile
        );
      }

      setSelectedFileNames([]);
      setSelectedFiles([]);
      onSuccess();
      onClose(false);
    } catch (error) {
      console.error("Error adding Forms:", error);
    } finally {
      setIsSubmitted(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
    const files = e.target.files;
    const newFiles: File[] = [];
    const newFileNames: string[] = [];
    const newFileTypes: string[] = [];

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file) {
          newFiles.push(file);
          newFileNames.push(file.name);
          newFileTypes.push(file.type.split("/")[1]);
        }
      });
    }

    setSelectedFiles(newFiles);
    setFileNames(newFileNames);
    setFileTypes(newFileTypes);
    setIsSubmitted(false);
  };

  const toggleToast = (title: string, description: string): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title,
      description,
    });
  };

  useEffect(() => {
    let selectedFileNames: string[] = [];

    if (formsFiles && formsFiles.length > 0) {
      for (let file of formsFiles) {
        if (file && file.filename) {
          selectedFileNames.push(file.filename);
        }
      }

      setSelectedFileNames(selectedFileNames);
    } else {
      setSelectedFileNames([]);
    }
  }, [formsFiles]);

  const [isHovering, setIsHovering] = useState(false);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

  const FileUploadWithHover = () => {
    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    return (
      <div
        className="relative justify-center flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`w-[220px] flex justify-items-center flex-row ${
            defaultFormsFiles.length === 5
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <p className="border-2 rounded-l-md text-gray-400 px-2 py-1 text-[13px] text-nowrap w-full ">
            {selectedFiles.length > 0
              ? `${selectedFiles.length}/${numFilesCanAdd}selected`
              : defaultFormsFiles.length < 5
              ? "Choose files to upload"
              : "Max Files Uploaded"}
          </p>
          <label
            htmlFor="fileupload"
            className={` ${
              defaultFormsFiles.length === 5
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }
                              text-[13px] bg-[#007C85] px-2 py-1 text-white rounded-r-md flex justify-center border-2 border-[#007C85]`}
          >
            Browse
          </label>

          <input
            type="file"
            id="fileupload"
            multiple={true}
            accept=".jpeg,.jpg,.png,.pdf"
            className="hidden"
            name="file"
            disabled={defaultFormsFiles.length === 5}
            onChange={(e) => handleFile(e)}
            max={5}
          />
          {isHovering && selectedFiles.length > 0 && (
            <div className="absolute bg-[#4E4E4E] p-2 w-[220px] text-[13px] mt-[30px] text-white rounded-md shadow-md ">
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="w-[676px] h-[541px]">
      <form className="" onSubmit={handleSubmit}>
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
              <div className="">
                <FileUploadWithHover />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10">
          <div className="justify-end flex mr-10">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-[150px] h-[45px] px-3 py-2 bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm`}
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
export default NofileviewFormsModalContent;
