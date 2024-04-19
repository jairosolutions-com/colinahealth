import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  fetchLabResultFiles,
  deleteLabFiles,
} from "@/app/api/lab-results-api/lab-results.api";
import Image from "next/image";
import { NofileviewModalContent } from "./nofileview-modal-content";

interface ModalProps {
  labResultsData: any;
  isView: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

interface LabFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  fileId: string;
}

export const LabResultsViewModalContent = ({
  isView,
  labResultsData,
  isModalOpen,
}: ModalProps) => {
  const params = useParams<{ id: any; tag: string; item: string }>();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [labResultUuid, setLabResultUuid] = useState("");
  const [labFile, setLabFile] = useState<any>(null);
  const patientId = params.id.toUpperCase();
  const [labFiles, setLabFiles] = useState<LabFile[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<Uint8Array>(new Uint8Array());
  const [fileIndex, setFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<LabFile>({} as LabFile);

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
  const defaultLabFiles = Array.isArray(labFiles) ? labFiles : [];

  const [base64String, setBase64String] = useState("");
  const [fileType, setFileType] = useState<string>("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (labFiles && labFiles.length > 0) {
      const file = labFiles[fileIndex];
      setCurrentFile(file);
      setFileName(file.filename);
      setFileData(file.data);

      if (file.data) {
        const newBase64String = Buffer.from(file.data).toString("base64");
        setBase64String(newBase64String);

        const newFileType = file.filename.split(".").pop();
        setFileType(newFileType as string);
      }
    }
  }, [fileIndex, labFiles]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLabResultFiles(
          labResultsData.labResults_uuid,
          router
        );

        if (response.data && response.data.length > 0) {
          setLabFiles(response.data);
          console.log(response.data, "labFilesdATA");

          setCurrentFile(response.data[0]);
          setFileIndex(0);
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (labResultsData.labResults_uuid) {
      fetchData();
    }
  }, [labResultsData.labResults_uuid, router]);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [toast, setToast] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setShowCheckboxes(false);
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
  };
  const [selectedFileUUID, setSelectedFileUUID] = useState("");
  const handleDeleteClick = async () => {
    console.log("Delete button clicked");
    console.log("Selected File UUID:", selectedFileUUID);

    try {
        // Check if there is a selected file UUID to delete
        if (selectedFileUUID) {
            // Call the delete function with the labResultUuid and selectedFileUUID
            await deleteLabFiles(labResultUuid, selectedFileUUID);

            console.log("File deleted successfully");

            // Reset the selected file UUID
            setSelectedFileUUID("");

            // Close the delete modal
            setDeleteModalOpen(false);
        } else {
            console.warn("No files selected for deletion");
        }
    } catch (error) {
        // Handle any errors that occurred during the API call
        console.error("Error deleting file:", error);
        // Optionally, set error state to display an error message to the user
        setError("Failed to delete file");
    }
};

  // const handleCheckboxChange = (fileUuid: string, isChecked: boolean) => {
  //   if (isChecked) {
  //     // Add the fileUuid to the array if it is not already present
  //     setSelectedFileUUID((prevUUIDs) => [...prevUUIDs, fileUuid]);
  //   } else {
  //     // Remove the fileUuid from the array
  //     setSelectedFileUUID((prevUUIDs) =>
  //       prevUUIDs.filter((uuid) => uuid !== fileUuid)
  //     );
  //   }
  // };
  const selectAll = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = true;
    });
  };

  return (
    <div>
      {defaultLabFiles?.length === 0 ? (
        <NofileviewModalContent
          isModalOpen={(isOpen: boolean): void => {
            isModalOpen(isOpen);
          }}
        />
      ) : (
        <div className="w-[676px] h-[607  px]">
          <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
            <div className="items-center flex justify-between">
              <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
                View Laboratory Result
              </h2>
              <X
                onClick={() => isModalOpen(false)}
                className="w-7 h-7 text-black flex items-center mt-2 mr-4"
              />
            </div>
            <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
              Document Files
            </p>
          </div>
          <div className="mb-9 pt-4">
            <div className="h-[380px] md:px-8 mt-5">
              <div className="even:bg-gray-50 cursor-pointer">
                {currentFile && (
                  <div className="w-full max-w-xl flex justify-between gap-4">
                    <div
                      style={{
                        overflow: "scroll",
                        width: "400px",
                        height: "350px",
                      }}
                    >
                      {fileType === "pdf" ? (
                        <iframe
                          src={`data:application/pdf;base64,${base64String}`}
                          width="600px"
                          height="550px"
                          className="shadow-md rounded-lg"
                          onClick={toggleModal}
                        ></iframe>
                      ) : (
                        <Image
                          alt="fileimage"
                          width="600"
                          height="550"
                          onClick={toggleModal}
                          src={`data:image/${fileType};base64,${base64String}`}
                        ></Image>
                      )}
                    </div>
                    <div className="w-[220px]">
                      <div className="w-full flex justify-between flex-row">
                        <p className="border-2 rounded-l-md text-gray-400 px-2 py-1 text-[13px] text-nowrap w-full flex justify-center hover:border-[#686868]  ">
                          Choose files to upload
                        </p>
                        <label
                          htmlFor="imageUpload"
                          className="text-[13px] bg-[#007C85] px-2 py-1 text-white cursor-pointer rounded-r-md flex justify-center border-2 border-[#007C85]"
                        >
                          Browse
                        </label>
                      </div>
                      {defaultLabFiles.map((file: LabFile, index) => (
                        <div
                          className="flex justify-between px-1 bg-white rounded-md border-2 mt-4 hover:border-[#686868] text-overflow truncate cursor-pointer"
                          key={index}
                          onClick={() => {
                            setFileIndex(index);
                            setCurrentFile(file);
                          }}
                        >
                          <h2 className="text-[12px] px-1 text-gray-400 py-1">
                            {file.filename}
                          </h2>
                          {/* Delete button for each file */}
                          <X
                            onClick={(e) => {
                              setSelectedFileUUID(file.fileId);
                              console.log("Delete button clicked");
                              console.log("File UUID:", file.fileId, selectedFileUUID);
                              toggleDeleteModal();
                            }}
                            className="w-3 h-3 text-gray-400 flex items-center mt-[6px] mr-2"
                          />
                        </div>
                      ))}
                    </div>
                    <div className={`w-[190px] ${editMode ? "edit-mode" : ""}`}>
                      <div className="flex justify-end text-[12px] font-bold">
                        <button
                          className={
                            !editMode ? "delete-btn" : "delete-btn hidden"
                          }
                          onClick={toggleEditMode}
                        >
                          Delete
                        </button>
                        <button
                          className={
                            editMode
                              ? "select-all-btn"
                              : "select-all-btn hidden"
                          }
                          onClick={selectAll}
                        >
                          Select All
                        </button>
                      </div>
                      {defaultLabFiles.map((file: LabFile, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setFileIndex(index);
                            setCurrentFile(file);
                          }}
                          className="h-[40px]  text-overflow
                        truncate flex justify-between bg-white shadow-md mt-2"
                        >
                          {editMode && (
                            <input
                              type="checkbox"
                             /*  onChange={(e) =>
                                handleCheckboxChange(
                                  file.fileUuid,
                                  e.target.checked
                                )
                              } */
                              className="h-[15px] mt-3 bg-white w-full flex justify-between"
                            />
                          )}
                          <p className="bg-white shadow-sm">
                            <span className="   ml-4 mr-10 mt-2 flex items-center text-[15px]">
                              {file.filename}
                            </span>
                          </p>
                        </div>
                      ))}
                      <div className="mt-4 ml-[100px]">
                        {editMode && (
                          <button
                            className="w-[80px] h-[30px] text-white bg-blue-500 hover:bg-blue-700"
                            onClick={toggleDeleteModal}
                          >
                            <label>Delete</label>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal */}
              {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                  <div className="bg-white p-6 max-w-lg rounded-lg">
                    <button
                      type="button"
                      className="absolute top-0 left-0 m-4 ml-10 text-white hover:underline flex text-[20px]"
                    >
                      <Image
                        className="mr-2"
                        src="/svgs/print.svg"
                        alt="Icon"
                        width={30}
                        height={30}
                      />
                      Print
                    </button>
                    <button
                      type="button"
                      className="absolute top-0 left-0 m-4 ml-36 text-white hover:underline flex text-[20px]"
                    >
                      <Image
                        className="mr-2"
                        src="/svgs/downlod.svg"
                        alt="Icon"
                        width={30}
                        height={30}
                      />
                      Download
                    </button>
                    <button
                      className="absolute top-0 right-0 m-4 text-white hover:underline text-[20px]"
                      onClick={toggleModal}
                    >
                      Close
                    </button>
                    <Image
                      alt="Document Full Preview"
                      width={1500}
                      height={1200}
                      src={`data:image/${fileType};base64,${base64String}`}
                    />
                  </div>
                </div>
              )}
              {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#76898A99]">
                  <div className="bg-white max-w-lg rounded-lg w-[700px] h-[146px]">
                    <div className="flex justify-center items-center pt-6 pb-6">
                      <h2 className="font-semibold text-[20px] text-[#667085]">
                        Are you sure to delete this?
                      </h2>
                    </div>
                    <div className="flex border-t-4">
                      <button
                        onClick={() => setDeleteModalOpen(false)}
                        type="button"
                        className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] text-white font-medium mt-4 rounded-br-md"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-4 ml-[115px] text-[15px]">
                {fileIndex > 0 && (
                  <button
                    className="w-[80px] h-[30px] text-blue-500 bg-white-500 border-2 border-blue-500"
                    onClick={prevFile}
                  >
                    Previous
                  </button>
                )}
                {fileIndex < labFiles.length - 1 && (
                  <button
                    onClick={nextFile}
                    className="w-[80px] h-[30px] text-white bg-blue-500 hover:bg-blue-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="justify-center flex border-t-4">
              <button
                onClick={() => isModalOpen(false)}
                type="button"
                className="w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md"
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] text-white font-medium mt-4 rounded-br-md"
              >
                Submit
              </button>
            </div>
          </div>
          {toast}
        </div>
      )}
    </div>
  );
};
