import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createFormsOfPatient } from "@/app/api/forms-api/forms.api";
import { useToast } from "@/components/ui/use-toast";
interface Modalprops {
  passedFormData: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
  throw new Error("Function not implemented.");
}

const [formFiles, setformFiles] = useState<any[]>([]); //

export const FormsModalContent = ({
  passedFormData,
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const [formFiles, setFormFiles] = useState<any[]>([]); //
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
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

  console.log(formData, "formData");

  // De

  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const { toast } = useToast();
  const toggleMaxSizeToast = (): void => {
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const toggleMaxFilesToast = (maxFiles: number): void => {
    toast({
      variant: "destructive",
      title: "Maximum Number of Files Exceeded!",
      description: `You can only add ${maxFiles} more file(s). Please try again.`,
    });
  };
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            console.log(formFiles, "labFiles labFiles labFiles");

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

  const [isLoading, setIsLoading] = useState<boolean>(true);

  //for edit files and storing num of files in the state
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
      const maxAllowedFiles = 5 - selectedFileNames.length;
      setNumFilesCanAdd(maxAllowedFiles);
      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      // Log a message when there are no files in labFiles
      console.log("No files in labFiles");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [formFiles, setSelectedFileNames]);
  // for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLabResultFiles(
          labResultData.labResults_uuid,
          router
        );

        // Only proceed if response.data is not null or empty
        if (response.data && response.data.length > 0) {
          setLabFiles(response.data);
          console.log(response.data, "LAB.data");
          const maxAllowedFiles = 5 - labFiles.length;
          setNumFilesCanAdd(maxAllowedFiles);
          setIsLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    // Call fetchData and fetchFile only if `labResultData.labResults_uuid` changes and is not null
    if (labResultData.labResults_uuid) {
      fetchData();
    }
  }, [labResultData.labResults_uuid]);

  // Ed

  return (
    <div className="w-[676px] h-[621px] bg-[#FFFFFF] rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <p className="font-semibold text-[20px] text-left  pl-10 mt-7">
              Add Form Details
            </p>
            <X
              onClick={() => isModalOpen(false)}
              className="w-7 h-7 text-black flex items-center mt-2 mr-4"
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
              {formFiles.length === 5 ? (
                <div className="">
                  <label className="relative h-12 w-full flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[33px] bg-[#daf3f5] border-[#007C85] border-dashed border-2">
                    <>
                      <Image
                        className="w-10 h-10 mr-1"
                        width={50}
                        height={50}
                        src={"/svgs/filein.svg"}
                        alt=""
                      />
                      <div className="flex pb-5 text-nowrap text-[12px]">
                        <p className="mt-2">Maximum Files Uploaded</p>
                      </div>
                    </>
                  </label>
                </div>
              ) : (
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
              )}
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
              className="w-[170px] h-[50px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
