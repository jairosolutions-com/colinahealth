"use client";

import { X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  updateLabResultOfPatient,
  createLabResultOfPatient,
  addLabFile,
} from "@/app/api/lab-results-api/lab-results.api";
import { useParams, useRouter } from "next/navigation";
import {
  fetchLabResultFiles,
  getCurrentFileCountFromDatabase,
} from "@/app/api/lab-results-api/lab-results.api";
import { useToast } from "@/components/ui/use-toast";
interface Modalprops {
  isEdit: any;
  labResultData: any;
  setIsUpdated: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}
interface LabFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const LabresultsModalContent = ({
  isEdit,
  labResultData,
  setIsUpdated,
  // isOpen,
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();
  const [labFiles, setLabFiles] = useState<any[]>([]); //

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    date: labResultData.labResults_date || "",
    hemoglobinA1c: labResultData.labResults_hemoglobinA1c || "",
    fastingBloodGlucose: labResultData.labResults_fastingBloodGlucose || "",
    totalCholesterol: labResultData.labResults_totalCholesterol || "",
    ldlCholesterol: labResultData.labResults_ldlCholesterol || "",
    hdlCholesterol: labResultData.labResults_hdlCholesterol || "",
    triglycerides: labResultData.labResults_triglycerides || "",
  });
  let headingText = "";

  if (isEdit) {
    headingText = "Update Laboratory Result";
  } else {
    headingText = "Add Laboratory Result";
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "appointmentDate") {
      setDate(value);
      labResultData.date = value;
      console.log(value, "lab date");
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Define a state to track the selected filenames
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const { toast } = useToast();
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
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);

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
          console.log(labFiles, "labFiles labFiles labFiles");
          // Set selected file names
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
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
    setIsSubmitted(false);
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    const getUuid = labResultData.labResults_uuid;
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
      if (isEdit) {
        await updateLabResultOfPatient(
          labResultData.labResults_uuid,
          formData,
          router
        );

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
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
      } else {
        // Create the lab result
        const labResult = await createLabResultOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Lab Result added successfully:", labResult);
        const getUuid = labResult.uuid;
        console.log("Lab UUID:", getUuid);

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
        // Reset form data
        setFormData({
          date: "",
          hemoglobinA1c: "",
          fastingBloodGlucose: "",
          totalCholesterol: "",
          ldlCholesterol: "",
          hdlCholesterol: "",
          triglycerides: "",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding Lab Result:", error);
      setError("Failed to add Lab Result");
    }
    setIsSubmitted(false);
  };
  //for edit files and storing num of files in the state
  useEffect(() => {
    // Initialize selected file names array
    setSelectedFileNames([]);
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
  }, [labFiles, setSelectedFileNames]);
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
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {labFiles.length === 5 && isEdit ? (
          <div className="">
            <label className="relative w-full bg-[#daf3f5] border-[#007C85] border-dashed border-2 flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold">
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
          <div className="">
            <label
              htmlFor="imageUpload"
              className="relative h-12 w-full flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[33px] bg-[#daf3f5] border-[#007C85] border-dashed border-2"
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
                <div className="flex pb-5 text-nowrap text-[12px]">
                  <p className="mt-2">Upload or Attach Files or</p>
                  <p className="underline decoration-solid text-blue-500 ml-1 mt-2">
                    Browse
                  </p>
                </div>
                <span className="text-[10px] font-normal absolute bottom-2 text-[#667085] ml-10">
                  {selectedFileNames.length === 0 ? (
                    // Display "Maximum File Size: 10MB" if no files are attached
                    <span>Maximum File Size: 15MB</span>
                  ) : (
                    // Display the file name if one file is attached, or the number of files if more than one are attached
                    <span>
                      {selectedFiles.length < 5
                        ? // Display the file name if the number of files is less than or equal to 5
                          selectedFiles.length === 1
                          ? selectedFileNames[0]
                          : `${selectedFiles.length}/${numFilesCanAdd} files attached`
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
              accept=".jpeg,.jpg,.png,.pdf"
              className="hidden"
              name="file"
              onChange={(e) => handleFile(e)}
            />
            {isHovering && selectedFiles.length > 0 && (
              <div className="absolute bg-[#4E4E4E] p-2 w-[290px] text-[13px]   text-white rounded-md shadow-md left-0">
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <div className="w-[676px] h-[571px]">
        {isLoading && isEdit ? (
          // Loading state
          <>
            <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
              <div className="items-center flex justify-between">
                <h2 className="p-title text-left text-[#071437] pl-10 mt-7"></h2>
                <X
                  onClick={() => {
                    isSubmitted ? null : isModalOpen(false);
                  }}
                  className={`
                  ${isSubmitted && " cursor-not-allowed"}
                  w-6 h-6 text-black flex items-center mt-6 mr-9 cursor-pointer`}
                />
              </div>
              <p className="text-sm pl-10 text-gray-600 pb-10 pt-2"></p>
            </div>
            <div className="mb-9 pt-4">
              <div className="h-[380px] md:px-8 mt-5">
                <div className="w-full h-full flex justify-center items-center ">
                  <img
                    src="/imgs/colina-logo-animation.gif"
                    alt="logo"
                    width={100}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <form className="" onSubmit={handleSubmit}>
              <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
                <div className="items-center flex justify-between">
                  <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
                    {headingText}
                  </h2>
                  <X
                    onClick={() => isModalOpen(false)}
                    className="w-6 h-6 text-black flex items-center mt-6 mr-9"
                  />
                </div>
                <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
                  {isEdit ? "Update" : "Submit"} your log details.
                </p>
              </div>
              <div className=" mb-9 pt-4">
                <div className="h-[600px] max-h-[400px] md:px-10 mt-5">
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        HEMOGLOBIN A1c
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={formData.hemoglobinA1c}
                          type="text"
                          onChange={handleChange}
                          required
                          name="hemoglobinA1c"
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input hemoglobin a1c"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        FASTING BLOOD GLUCOSE
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          onChange={handleChange}
                          value={formData.fastingBloodGlucose}
                          required
                          name="fastingBloodGlucose"
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input fasting blood glucose"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        TOTAL CHOLESTEROL
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={formData.totalCholesterol}
                          type="text"
                          required
                          name="totalCholesterol"
                          onChange={handleChange}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input total cholesterol"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        LDL CHOLESTEROL
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={formData.ldlCholesterol}
                          required
                          name="ldlCholesterol"
                          onChange={handleChange}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="input ldl cholesterol"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        HDL CHOLESTEROL
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={formData.hdlCholesterol}
                          type="text"
                          onChange={handleChange}
                          required
                          name="hdlCholesterol"
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="input hdl cholesterol"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        TRIGLYCERIDES
                      </label>
                      <div className="mt-2.5">
                        <input
                          value={formData.triglycerides}
                          type="text"
                          name="triglycerides"
                          onChange={handleChange}
                          required
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="input triglycerides"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-md font-bold leading-6 text-gray-900 required-field"
                      >
                        DATE
                      </label>

                      <div className="mt-2.5 relative">
                        <input
                          required
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="input triglycerides"
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
                    <div className="filehover">
                      <FileUploadWithHover />
                    </div>
                    {/* {labFiles.length === 5 && isEdit ? (
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
                      <div className="">
                        <label
                          htmlFor="imageUpload"
                          className="relative h-12 w-full flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[33px] bg-[#daf3f5] border-[#007C85] border-dashed border-2"
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
                            <div className="flex pb-5 text-nowrap text-[12px]">
                              <p className="mt-2">Upload or Attach Files or</p>
                              <p className="underline decoration-solid text-blue-500 ml-1 mt-2">
                                Browse
                              </p>
                            </div>
                            <span className="text-[10px] font-normal absolute bottom-2 text-[#667085] ml-10">
                              {selectedFileNames.length === 0 ? (
                                // Display "Maximum File Size: 10MB" if no files are attached
                                <span>Maximum File Size: 15MB</span>
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
                        {isHovering && (
                          <div className="absolute bg-[#4E4E4E] p-2 text-white rounded-md shadow-md bottom-[-90px] left-0">
                            <p>Minimum file size of 1 MB</p>
                            <p>Maximum file size of 100 MB</p>
                            <p>Supported formats: PNG, JPG, JPEG</p>
                          </div>
                        )}
                      </div>
                    )} */}
                  </div>
                </div>
                <div className="pt-26">
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
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};
