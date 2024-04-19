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
import { fetchLabResultFiles } from "@/app/api/lab-results-api/lab-results.api";

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
  const formatDate = (createdAt: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(createdAt);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };
  const [labFile, setLabFile] = useState<any>(null);
  const patientId = params.id.toUpperCase();
  const [labFiles, setLabFiles] = useState<any[]>([]); //
  const defaultLabFiles = Array.isArray(labFiles) ? labFiles : [];
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(new Uint8Array());
  const [fileIndex, setFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState({} as LabFile);
  // Convert the buffer data to base64 string
  const formRef = useRef(null);

  const [base64String, setBase64String] = useState("");
  const [fileType, setFileType] = useState<string>("");

  // Define functions to navigate through files
  const prevFile = () => {
    if (fileIndex > 0) {
      setFileIndex(fileIndex - 1);
      setCurrentFile(labFiles[fileIndex - 1]);
    }
  };

  const nextFile = () => {
    if (fileIndex < labFiles.length - 1) {
      setFileIndex(fileIndex + 1);
      setCurrentFile(labFiles[fileIndex + 1]);
    }
  };
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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

  // Update the handleFile function to track selected filenames and change the label
  // const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const files = e.target.files;

  //     if (files && files.length > 0) {
  //         // Map the filenames from the input
  //         const fileNames = Array.from(files).map(file => file.name);

  //         // Update the selected filenames state
  //         setSelectedFileNames(fileNames);

  //         // Process the first file for existing functionality
  //         const file = files[0];
  //         setLabFile(file);
  //         setFileName(file.name);

  //         const reader = new FileReader();

  //         reader.onloadend = () => {
  //             const base64String = reader.result?.toString() || "";
  //             setBase64String(base64String);

  //             const fileType = file.type.split("/")[1];
  //             setFileType(fileType);
  //         };

  //         reader.onerror = () => {
  //             console.error("Error reading file");
  //             setError("Error reading file");
  //         };

  //         reader.readAsDataURL(file);
  //     } else {
  //         // No files selected
  //         console.warn("No files selected");
  //         setSelectedFileNames([]); // Clear selected filenames state
  //     }
  // };
  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);

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
  if (isEdit) {
    console.log(labResultData, "labResultData");
    console.log(formData, "formData");
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit clicked");
    try {
      if (isEdit) {
        await updateLabResultOfPatient(
          labResultData.labResults_uuid,
          formData,
          router
        );
        const getUuid = labResultData.labResults_uuid;
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
  };

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     console.log("Submit clicked");

  //     try {
  //         if (isEdit) {
  //             // Update existing lab result
  //             await updateLabResultOfPatient(labResultData.labResults_uuid, formData, router);
  //             setIsUpdated(true);
  //             onSuccess();
  //             isModalOpen(false);
  //         } else {
  //             // Create new lab result
  //             const labResult = await createLabResultOfPatient(patientId, formData, router);
  //             console.log("Lab Result added successfully:", labResult);

  //             const getUuid = labResult.uuid;
  //             console.log("Lab UUID:", getUuid);

  //             // Prepare FormData for file uploads
  //             const labFileFormData = new FormData();

  //             // Check that labFiles is defined and has files
  //             if (labFiles && labFiles.length > 0) {
  //                 // Append each file to FormData
  //                 labFiles.forEach((file) => {
  //                     labFileFormData.append("labfile", file);
  //                 });

  //                   console.log(getUuid);
  //                 // Submit all files in a single API call
  //                 const addLabFiles = await addLabFile(getUuid, labFileFormData, router);
  //                 console.log("Lab FILES added successfully:", addLabFiles);
  //             } else {
  //                 console.warn("No files to upload");
  //             }

  //             // Reset form data
  //             setFormData({
  //                 date: "",
  //                 hemoglobinA1c: "",
  //                 fastingBloodGlucose: "",
  //                 totalCholesterol: "",
  //                 ldlCholesterol: "",
  //                 hdlCholesterol: "",
  //                 triglycerides: "",
  //             });
  //             onSuccess();
  //         }
  //     } catch (error :any) {
  //         console.error("Error adding Lab Result:", error);

  //         // Log the error details for troubleshooting
  //         if (error.response) {
  //             console.error("Response data:", error.response.data);
  //             console.error("Response status:", error.response.status);
  //             console.error("Response headers:", error.response.headers);
  //         }
  //         setError("Failed to add Lab Result");
  //     }
  // };

  useEffect(() => {
    // Only proceed if labFiles is not null and contains files
    if (labFiles && labFiles.length > 0) {
      const file = labFiles[fileIndex];
      setCurrentFile(file);
      setFileName(file.filename); // Set the filename using the file object
      setFileData(file.data); // Set the file data using the file object

      // Only proceed with the conversion if file.data is defined
      if (file.data) {
        // Convert the data to base64 and set the file type
        const newBase64String = Buffer.from(file.data).toString("base64");
        setBase64String(newBase64String);

        const newFileType = file.filename.split(".").pop() as string;
        setFileType(newFileType);
        console.log("FILE newFileType", newFileType);
      }
    }
  }, [fileIndex, labFiles, fileData, fileName]);
  useEffect(() => {
    // Initialize selected file names array
    let selectedFileNames: string[] = [];

    // Push file names to selectedFileNames array
    for (let file of labFiles) {
      selectedFileNames.push(file.filename);
    }
    console.log(selectedFileNames, "selected file names");
    setSelectedFileNames(selectedFileNames);
  }, [labFiles]);

  // Update the current file when fileIndex changes
  useEffect(() => {
    // Only proceed if labFiles is not null and contains files
    if (labFiles && labFiles.length > 0) {
      setCurrentFile(labFiles[fileIndex]);
    }
  }, [fileIndex, labFiles]);

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

          setCurrentFile(response.data[0]);
          setFileIndex(0);
        }

        console.log(currentFile);
      } catch (error: any) {
        setError(error.message);
      }
    };

    // Call fetchData and fetchFile only if `labResultData.labResults_uuid` changes and is not null
    if (labResultData.labResults_uuid) {
      fetchData();
    }
  }, [labResultData.labResults_uuid]);

  return (
    <div className="w-[676px] h-[575px]">
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {headingText}
            </h2>
            <X
              onClick={() => isModalOpen(false)}
              className="w-7 h-7 text-black flex items-center mt-2 mr-4"
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
              <div className="">
                <label
                  htmlFor="imageUpload"
                  className={`relative h-12 w-full flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-[33px] ${
                    selectedFileNames.length > 0
                      ? "bg-[#e3f2fd] border-[#2196f3]"
                      : "bg-[#daf3f5] border-[#007C85] border-dashed border-2"
                  }`}
                >
                  {selectedFileNames.length > 0 ? (
                    // Display selected filenames
                    <div className="text-[12px] w-full truncate mx-2">
                      {selectedFileNames.join(", ")}
                    </div>
                  ) : (
                    // Default label content
                    <>
                      <Image
                        className="w-10 h-10 mr-1"
                        width={50}
                        height={50}
                        src={"/svgs/folder-add.svg"}
                        alt={""}
                      />
                      <div className="flex pb-5 text-nowrap text-[12px]">
                        <p className="mt-2">Upload or Attach Files or</p>
                        <p className="underline decoration-solid text-blue-500 ml-1 mt-2">
                          Browse
                        </p>
                      </div>
                      <span className="text-[10px] font-normal absolute bottom-2 text-[#667085] ml-10">
                        Minimum file size
                      </span>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  multiple={true}
                  accept="image/*,pdf"
                  className=""
                  name="file"
                  onChange={(e) => handleFile(e)}
                />
              </div>
            </div>
          </div>
          <div className="pt-26">
            <div className="justify-center flex border-t-4 pt-26">
              <button
                onClick={() => isModalOpen(false)}
                type="button"
                className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
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
        </div>
      </form>
    </div>
  );
};
