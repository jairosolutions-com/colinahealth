"use client";

import {
  updateLabResultOfPatient,
  createLabResultOfPatient,
} from "@/app/api/lab-results-api/lab-results.api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  fetchLabResultFiles,
  fetchLabFile,
} from "@/app/api/lab-results-api/lab-results.api";
import Image from "next/image";

interface Modalprops {
  isEdit: any;
  labResultData: any;
  setIsUpdated: any;
  label: string;
  isOpen: boolean;
  isView: boolean;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}
interface LabFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

export const LabResultModal = ({
  isEdit,
  isView,
  labResultData,
  setIsUpdated,
  label,
  isOpen,
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const patientId = params.id.toUpperCase();
  const [labFiles, setLabFiles] = useState([]); // Initialize as an empty array
  const [fileId, setFileId] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(new Uint8Array());
  const [fileView, setFileView] = useState();
  const [fileIndex, setFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState({} as LabFile);
  // Convert the buffer data to base64 string

  const [base64String, setBase64String] = useState("");
  const [fileType, setFileType] = useState("");

  // Define the effect to update base64String and fileType when fileData changes
  useEffect(() => {
    if (labFiles.length > 0) {
      const file = labFiles[fileIndex];
      setCurrentFile(file);
      setFileName(fileName);
      setFileData(fileData);

      // Convert the data to base64 and set the file type
      const newBase64String = Buffer.from(currentFile.data).toString("base64");
      setBase64String(newBase64String);
      console.log("FILE STRING", base64String);
      const newFileType = currentFile.filename.split(".").pop() as string;
      setFileType(newFileType);
      console.log("FILE newFileType", newFileType);
    }
  }, [fileIndex, labFiles]);
  // Update the current file when fileIndex changes
  useEffect(() => {
    setCurrentFile(labFiles[fileIndex]);
  }, [fileIndex, labFiles, currentFile]);

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
  } else if (isView) {
    headingText = "View Laboratory Result";
  } else {
    headingText = "Add Laboratory Result";
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  if (isEdit) {
    console.log(labResultData, "labResultData");
    console.log(formData, "formData");
  }

  const handleSubmit = async (e: any) => {
    console.log(isEdit, "edit stat");

    e.preventDefault();
    try {
      if (isEdit) {
        await updateLabResultOfPatient(
          labResultData.labResults_uuid,
          formData,
          router
        );
        setIsUpdated(true);
        onSuccess();
        isModalOpen(false);
        return;
      } else {
        const labResult = await createLabResultOfPatient(
          patientId,
          formData,
          router
        );
        console.log("Lab Result added successfully:", labResult);

        // Reset the form data after successful submission
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLabResultFiles(
          labResultData.labResults_uuid,
          router
        );
        setLabFiles(response.data);
        if (response.data.length > 0) {
          setCurrentFile(response.data[0]);
          setFileIndex(0);
        }
        console.log(currentFile);
      } catch (error: any) {
        setError(error.message);
      }
    };

    const fetchFile = async () => {
      try {
        const response = await fetchLabFile(
          labResultData.labResults_uuid,
          fileId,
          router
        );
        console.log(response, "filez");
        setFileView(response);
      } catch (error: any) {
        setError(error.message);
      }
    };

    // Call fetchData and fetchFile when `labResultData.labResults_uuid` changes
    fetchData();
    fetchFile();
  }, [labResultData.labResults_uuid, fileId]);


  return (
    <div
      className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-60`}
    >
      <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {headingText}
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">
            {isView ? "View" : "Submit"} your log details.
          </p>
        </div>
        {!isView ? (
          <div className=" mb-9 pt-4">
            <div className="h-[600px] max-h-[320px] md:px-10 mt-5">
              <form className="" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="mt-5 pb-3 ">
                    <button
                      onClick={() => isModalOpen(false)}
                      type="button"
                      className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-5 pb-3  ">
                    <button
                      type="submit"
                      className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                    >
                      {isEdit ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="h-[600px] max-h-[500px] md:px-10 mt-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {labFiles.map((file: LabFile, index) => (
                <div key={index} className="even:bg-gray-50 border-b">
                  <div
                    onClick={() => {
                      // Set file index and current file for display
                      setFileIndex(index);
                      setCurrentFile(file);

                      setFileName(file.filename);
                      setFileData(file.data);
                    }}
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {file.filename}
                  </div>
                </div>
              ))}

              {currentFile && (
                <div
                  key={currentFile.file_uuid}
                  className="even:bg-gray-50 border-b">
                  <div className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {currentFile.filename}
                  </div>
                  <div className="flex items-center justify-center">
                    {fileType === "pdf" ? (
                      <iframe
                        src={`data:application/pdf;base64,${base64String}`}
                        width="500px"
                        height="500px"
                      ></iframe>
                    ) : (
                      <img
                        src={`data:image/${fileType};base64,${base64String}`}
                        alt={currentFile.filename}
                        width="500px"
                        height="500px"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    {fileIndex > 0 && (
                      <button
                        onClick={() => {
                          // Set file index and current file for display
                          prevFile();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Previous
                      </button>
                    )}
                    {fileIndex < labFiles.length - 1 && (
                      <button
                        onClick={() => {
                          // Set file index and current file for display
                          nextFile();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 pb-3">
              <button
                onClick={() => isModalOpen(false)}
                type="button"
                className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200"
              >
                Cancel
              </button>
            </div>

            <div className="mt-5 pb-3">
              <button
                onClick={() => isModalOpen(false)}
                className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
