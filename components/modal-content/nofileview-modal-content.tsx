import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addLabFile } from "@/app/api/lab-results-api/lab-results.api";
import { useRouter } from "next/navigation";
interface ModalProps {
  labResultUuid: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}
interface LabFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const NofileviewModalContent = ({
  labResultUuid ,
  isModalOpen,
  onSuccess,
}: ModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();
  const [labFiles, setLabFiles] = useState<any[]>([]); //
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit clicked");
    try {
      const getUuid = labResultUuid;
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
      } else {
        console.warn("No files selected to upload");
      }
    } catch (error) {
      console.error("Error adding Lab Result:", error);
      // setError("Failed to add Lab Result");
    }
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

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
    } else {
      console.warn("No files selected");
    }
  };
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
  }, [labFiles]);

  return (
    <div className="w-[676px] h-[545px]">
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
                {selectedFileNames.length > 0 ? (
                  // Display selected filenames
                  <div className="text-[12px] w-full truncate mx-2">
                    {selectedFileNames.join(", ")}
                  </div>
                ) : (
                  <div className="flex flex-row justify-center">
                    <p className="border-2 rounded-l-md px-2 py-2 text-gray-400 text-[12px]">
                      Upload or Attach Files or
                    </p>
                    <label
                      htmlFor="imageUploads"
                      className="decoration-solid text-[12px] bg-[#007C85] px-2 py-2 text-white border-r-md cursor-pointer rounded-r-lg border-2 border-[#007C85]"
                    >
                      Browse
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  id="imageUploads"
                  multiple={true}
                  accept="image/*,pdf"
                  className="hidden"
                  name="file"
                  onChange={(e) => handleFile(e)}
                />
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
              type="submit"
              className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE]  text-[#ffff] font-medium mt-4 rounded-br-md"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default NofileviewModalContent;
