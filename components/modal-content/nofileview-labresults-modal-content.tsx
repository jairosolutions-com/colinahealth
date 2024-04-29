import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  addLabFile,
  getCurrentFileCountFromDatabase,
} from "@/app/api/lab-results-api/lab-results.api";
import { useRouter } from "next/navigation";
interface ModalProps {
  labResultUuid: any;
  isModalOpen: (isOpen: boolean) => void;
  onClose: any;
}
interface LabFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const NofileviewLabResultsModalContent = ({
  labResultUuid,
  isModalOpen,
  onClose, // Receive the callback function
}: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const [labFiles, setLabFiles] = useState<any[]>([]); //
  const defaultLabFiles = Array.isArray(labFiles) ? labFiles : [];
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    const getUuid = labResultUuid;

    console.log("submit clicked");
    if (selectedFiles.length === 0) {
      toggleToast();
      return;
    }
    if (getUuid) {
      const currentFileCount = await getCurrentFileCountFromDatabase(getUuid);
      console.log("Current file count:", currentFileCount);
      // Define the maximum allowed files based on the current count
      const maxAllowedFiles = currentFileCount === 0 ? 5 : 5 - currentFileCount;
      if (selectedFiles.length > maxAllowedFiles) {
        toggleMaxFilesToast(maxAllowedFiles);
        return;
      }
      console.log("FILES TO ADD", maxAllowedFiles);

      console.log("Lab UUID:", getUuid);
    }
    try {
      console.log(getUuid, "getUuid");
      // Iterate through each selected file
      if (selectedFiles && selectedFiles.length > 0) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFiles.length; i++) {
          const labFileFormData = new FormData();
          labFileFormData.append("labfile", selectedFiles[i], fileNames[i]);

          // Add lab file
          const addLabFiles = await addLabFile(
            getUuid,
            labFileFormData,
            router
          );

          console.log(
            `Lab FILE ${fileNames[i]} added successfully:`,
            addLabFiles
          );
        }

        onClose(false);
        // Call the onSuccess callback function
      } else {
        console.warn("No files selected to upload");
      }
    } catch (error) {
      console.error("Error adding Lab Result:", error);
      // setError("Failed to add Lab Result");
    }
    setIsSubmitted(false);
  };
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
    const maxAllowedFiles = 5 - labFiles.length;
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
            console.log(labFiles, "labFiles labFiles labFiles");

            // Set selected file names
            setSelectedFileNames(selectedFileNames);
          }
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays
      setSelectedLabFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
      const maxAllowedFiles = 5 - labFiles.length;
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

    // Only proceed if labFiles is not null and contains files
    if (labFiles && labFiles.length > 0) {
      // Push file names to selectedFileNames array
      for (let file of labFiles) {
        // Only push the filename if it's defined
        if (file && file.filename) {
          selectedFileNames.push(file.filename);
        }
      }

      console.log(selectedFileNames, "selected file names");
      console.log(labFiles, "labFiles labFiles labFiles");

      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      // Log a message when there are no files in labFiles
      console.log("No files in labFiles");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [labFiles, defaultLabFiles]);
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
        <div className="">
          <div
            className={`w-[220px] flex justify-items-center flex-row ${
              defaultLabFiles.length === 5
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <p className="border-2 rounded-l-md text-gray-400 px-2 py-1 text-[13px] text-nowrap w-full ">
              {selectedFiles.length > 0
                ? `${selectedFiles.length}/${numFilesCanAdd}selected`
                : defaultLabFiles.length < 5
                ? "Choose files to upload"
                : "Max Files Uploaded"}
            </p>
            <label
              htmlFor="fileupload"
              className={` ${
                defaultLabFiles.length === 5
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }text-[13px] bg-[#007C85] px-2 py-1 text-white rounded-r-md flex justify-center border-2 border-[#007C85]`}
            >
              Browse
            </label>
          </div>
          <input
            type="file"
            id="fileupload"
            multiple={true}
            accept=".jpeg,.jpg,.png,.pdf"
            className="hidden"
            name="file"
            onChange={(e) => handleFile(e)}
          />
        </div>
        {isHovering && selectedFiles.length > 0 && (
          <div className="absolute bg-[#4E4E4E] p-2 w-[220px] text-[13px] mt-[30px] text-white rounded-md shadow-md">
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
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
              <div className="filehover">
                <FileUploadWithHover />
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
export default NofileviewLabResultsModalContent;
