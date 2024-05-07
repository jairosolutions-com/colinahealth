import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  createFormsOfPatient,
  fetchFormsByPatient,
  addFormFile,
  deleteFormFiles,
  updateFormsOfPatient,
} from "@/app/api/forms-api/forms.api";
import { toast, useToast } from "@/components/ui/use-toast";
interface Modalprops {
  isEdit: any;
  formAddData: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}
interface FormFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
  throw new Error("Function not implemented.");
}

export const FormsModalContent = ({
  isModalOpen,
  onSuccess,
  formAddData,
  isEdit,
}: Modalprops) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFormFiles] = useState<File[]>([]);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [formFiles, setFormFiles] = useState<any[]>([]); //
  const patientId = params.id.toUpperCase();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    dateIssued: "",
    nameOfDocument: "",
    notes: "",
  });

  const toggleMaxSizeToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
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
          console.log(formFiles, "formFiles formFiles formFiles");
          // Set selected file names
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays

      setSelectedFormFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };

  const toggleMaxFilesToast = (maxFiles: number): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "Maximum Number of Files Exceeded!",
      description: `You can only add ${maxFiles} more file(s). Please try again.`,
    });
  };

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

  // de
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    console.log(
      "SUBMITTING FORM DATA",
      selectedFileNames,
      selectedFiles.length
    );

    try {
      // Create the form result
      const forms = await createFormsOfPatient(patientId, formData, router);
      console.log("Form Result added successfully:", forms);
      const getUuid = forms.uuid;
      console.log("Form UUID:", getUuid);

      // Iterate through each selected file
      if (selectedFiles && selectedFiles.length > 0) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFiles.length; i++) {
          const formFileFormData = new FormData();
          formFileFormData.append("formfile", selectedFiles[i], fileNames[i]);

          // Add form file
          const addFormFiles = await addFormFile(
            getUuid,
            formFileFormData,
            router
          );

          console.log(
            `Form FILE ${fileNames[i]} added successfully:`,
            addFormFiles
          );
        }
      } else {
        console.warn("No files selected to upload");
      }
      // Reset form data
      setFormData({
        nameOfDocument: "",
        dateIssued: "",
        notes: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding Form Result:", error);
      setError("Failed to add Form Result");
    } finally {
      isModalOpen(false);
    }
    setIsSubmitted(false);
  };
  // de

  console.log(formData, "formData");

  return (
    <div className="w-[676px] h-[621px] bg-[#FFFFFF] rounded-md overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="flex justify-between items-center px-[40px] mt-7">
            <p className="p-title">Add Form Details</p>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-7 h-7 text-black flex items-center mt-2 cursor-pointer`}
            />
          </div>
          {/* <div className="items-center flex justify-between">
            <p className="font-semibold text-[20px] text-left  pl-10 mt-7">
              Add Form Details
            </p>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-7 h-7 text-black flex items-center mt-2 cursor-pointer`}
            />
          </div>
          <p className="text-[15px] pl-10 text-[#667085] pb-10 pt-2">
            Download PDF once your done.
          </p> */}
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

              {formFiles.length === 5 ? (
                <div></div>
              ) : (
                <div className="">
                  <label
                    htmlFor="imageUpload"
                    className="relative font-medium h-[70px] w-[600px] flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] bg-[#daf3f5] border-[#007C85] border-dashed border-2"
                  >
                    <>
                      {selectedFileNames.length > 0 ? (
                        // If files are selected, display filein.svg
                        <Image
                          className="w-10 h-10 mr-1"
                          width={50}
                          height={50}
                          src={"/svgs/filein.svg"}
                          alt=""
                        />
                      ) : (
                        // If no files are selected, display folder-add.svg
                        <Image
                          className="w-10 h-10 mr-1"
                          width={50}
                          height={50}
                          src={"/svgs/folder-add.svg"}
                          alt=""
                        />
                      )}
                      <div className="flex pb-5">
                        <p className="mt-2 text-[20px] font-medium">
                          Upload or Attach Files or{" "}
                          <span className="underline decoration-solid text-[20px] font-medium text-blue-500 ml-1 mt-2">
                            Browse
                          </span>
                        </p>
                      </div>
                      <span className="text-[10px] font-normal absolute bottom-2 text-[#667085] ml-10">
                        {selectedFileNames.length === 0 ? (
                          // Display "Maximum File Size: 10MB" if no files are attached
                          <span className="font-medium text-[15px]">
                            Maximum File Size: 15MB
                          </span>
                        ) : (
                          // Display the file name if one file is attached, or the number of files if more than one are attached
                          <span>
                            {selectedFileNames.length < 5
                              ? // Display the file name if the number of files is less than or equal to 5
                                selectedFileNames.length === 1
                                ? selectedFileNames[0]
                                : `${selectedFileNames.length}/5 files attached`
                              : // Display a message indicating that the maximum limit has been reached
                                `Maximum of 5 files added`}
                          </span>
                        )}
                      </span>
                    </>
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    multiple={true}
                    accept="image/*,.pdf"
                    className="hidden"
                    name="file"
                    onChange={(e) => handleFile(e)}
                  />
                </div>
              )}
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
                w-[200px] h-[50px] bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm `}
            >
              Cancel
            </button>
            <button
              disabled={isSubmitted}
              type="submit"
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-[170px] h-[50px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
