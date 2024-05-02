import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  addPrescriptionFile,
  getCurrentPrescriptionFileCountFromDatabase,
} from "@/app/api/prescription-api/prescription.api";
import { useRouter } from "next/navigation";

interface ModalProps {
  prescriptionUuid: any;
  isModalOpen: (isOpen: boolean) => void;
  onClose: any;
  onSuccess: any;
}
interface PrescriptionFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const NofileviewPrescriptionsModalContent = ({
  prescriptionUuid,
  isModalOpen,
  onClose, // Receive the callback function
  onSuccess,
}: ModalProps) => {
  const { toast } = useToast();

  const [prescriptionFiles, setPrescriptionFiles] = useState<any[]>([]); //
  const defaultPrescriptionFiles = Array.isArray(prescriptionFiles)
    ? prescriptionFiles
    : [];
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    const getUuid = prescriptionUuid;

    console.log("submit clicked");
    if (selectedFiles.length === 0) {
      toggleToast();
      return;
    }
    const currentFileCount = await getCurrentPrescriptionFileCountFromDatabase(
      getUuid
    );
    const maxAllowedFiles = 5 - currentFileCount;

    console.log("FILES TO ADD", maxAllowedFiles);

    if (selectedFiles.length > maxAllowedFiles) {
      toggleMaxFilesToast(maxAllowedFiles);
      return;
    }
    try {
      console.log(getUuid, "getUuid");
      // Iterate through each selected file
      if (selectedFiles && selectedFiles.length > 0) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFiles.length; i++) {
          const prescriptionFormData = new FormData();
          prescriptionFormData.append(
            "prescriptionfile",
            selectedFiles[i],
            fileNames[i]
          );

          const addPrescriptionFiles = await addPrescriptionFile(
            getUuid,
            prescriptionFormData
          );

          console.log(
            `Prescription FILE ${fileNames[i]} added successfully:`,
            addPrescriptionFiles
          );
        }
        onSuccess();
        onClose(false);
        // Call the onSuccess callback function
      } else {
        console.warn("No files selected to upload");
      }
    } catch (error) {
      console.error("Error adding Prescription:", error);
    }
    setIsSubmitted(false);
  };
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
    const maxAllowedFiles = 5 - prescriptionFiles.length;
    setNumFilesCanAdd(maxAllowedFiles);
    const files = e.target.files;
    const MAX_FILE_SIZE_MB = 15;
    if (files) {
      const totalSize = Array.from(files).reduce(
        (acc, file) => acc + file.size,
        0
      );
      const totalSizeMB = totalSize / (1024 * 1024); // Convert bytes to MB
      if (totalSizeMB > MAX_FILE_SIZE_MB) {
        toggleMaxSizeToast();
        e.target.value = ""; // Clear the input field
      }
      if (files.length > numFilesCanAdd) {
        toggleMaxFilesToast(numFilesCanAdd);
        e.target.value = ""; // Clear the input field
      }
    }
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newFileNames: string[] = [];
      const newFileTypes: string[] = [];

      Array.from(files).forEach((file) => {
        if (file) {
          // Add file, name, and type to arrays
          newFiles.push(file);
          newFileNames.push(file.name);
          newFileTypes.push(file.type.split("/")[1]);
          if (files && files.length > 0) {
            // Push file names to selectedFileNames array
            if (file && file.name) {
              selectedFileNames.push(file.name);
            }

            console.log(selectedFileNames, "selected file names");
            console.log(prescriptionFiles, "PrescriptionFiles");

            // Set selected file names
            setSelectedFileNames(selectedFileNames);
          }
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays
      setSelectedFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
      const maxAllowedFiles = 5 - prescriptionFiles.length;
      setNumFilesCanAdd(maxAllowedFiles);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };
  const toggleToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "No File Attached!",
      description: "Please try again.",
    });
  };

  const toggleMaxSizeToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const toggleMaxFilesToast = (maxFiles: number): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "Maximum Number of Files Exceeded!",
      description: `You can only add ${maxFiles} more file(s). Please try again.`,
    });
  };
  useEffect(() => {
    // Initialize selected file names array
    let selectedFileNames: string[] = [];

    if (prescriptionFiles && prescriptionFiles.length > 0) {
      // Push file names to selectedFileNames array
      for (let file of prescriptionFiles) {
        // Only push the filename if it's defined
        if (file && file.filename) {
          selectedFileNames.push(file.filename);
        }
      }

      console.log(selectedFileNames, "selected file names");

      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      console.log("No files in labFiles");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [prescriptionFiles, defaultPrescriptionFiles]);
  const [isHovering, setIsHovering] = useState(false);

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
            defaultPrescriptionFiles.length === 5
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          <p className="border-2 rounded-l-md text-gray-400 px-2 py-1 text-[13px] text-nowrap w-full ">
            {selectedFiles.length > 0
              ? `${selectedFiles.length}/${numFilesCanAdd}selected`
              : defaultPrescriptionFiles.length < 5
              ? "Choose files to upload"
              : "Max Files Uploaded"}
          </p>
          <label
            htmlFor="fileupload"
            className={` ${
              defaultPrescriptionFiles.length === 5
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
            disabled={defaultPrescriptionFiles.length === 5}
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
export default NofileviewPrescriptionsModalContent;
