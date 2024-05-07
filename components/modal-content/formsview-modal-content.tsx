import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  fetchFormFiles,
  deleteFormFiles,
  addFormFile,
  getCurrentFileCountFromDatabase,
} from "@/app/api/forms-api/forms.api";
import Image from "next/image";
import { NofileviewFormsModalContent } from "./nofileview-forms-modal-content";
import { SuccessModal } from "../shared/success";
import { useToast } from "@/components/ui/use-toast";
import Modal from "../reusable/modal";
import { ConfirmationModal } from "./confirmation-modal-content";

interface ModalProps {
  formsData: any;
  isView: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

interface FormFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  fileId: string;
}
export const FormViewsModalContent = ({
  isView,
  formsData,
  isModalOpen,
}: ModalProps) => {
  const onSuccess = () => {
    setIsSuccessOpen(true);

    // isModalOpen(false);
  };

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formsUuid, setFormsUuid] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [FormsFiles, setFormsFiles] = useState<FormFile[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<Uint8Array>(new Uint8Array());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isNoFileModalOpen, setIsNoFileModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  // update isNoFileModalOpen state
  const handleNoFileModalClose = (isModalOpen: boolean) => {
    setIsNoFileModalOpen(isModalOpen);
    setIsLoading(true);
    console.log("isNoFileModalOpen HANDLE", isNoFileModalOpen);
  };

  const isConfirmModalOpen = (confirmDelete: boolean) => {
    setConfirmDelete(confirmDelete);
    if (confirmDelete) {
      document.body.style.overflow = "hidden";
    } else if (!confirmDelete) {
      document.body.style.overflow = "visible";
    }
  };
  const downloadImage = () => {
    // Create a Blob from the base64 string
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: `image/${fileType}` });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and simulate a click on it
    const link = document.createElement("a");
    link.href = url;
    link.download = `image.${fileType}`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const handleDeleteClick = async () => {
    console.log("Delete button clicked");
    console.log("Selected File UUID:", selectedFileUUID);
    setIsSubmitted(true);
    try {
      // Check if there is a selected file UUID to delete
      if (selectedFileUUID) {
        // Call the delete function with the forms and selectedFileUUID
        await deleteFormFiles(formsUuid, selectedFileUUID);

        console.log("File deleted successfully");

        // Reset the selected file UUID
        setSelectedFileUUID("");

        // Close the delete modal
        setDeleteModalOpen(false);
        onSuccess();
      } else {
        console.warn("No files selected for deletion");
      }
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error("Error deleting file:", error);
      // Optionally, set error state to display an error message to the user
      setError("Failed to delete file");
    }
    setIsSubmitted(false);
  };
  const [selectedFileUUID, setSelectedFileUUID] = useState("");
  const [fileIndex, setFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState<FormFile>({} as FormFile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const prevFile = () => {
    if (fileIndex > 0) {
      setFileIndex(fileIndex - 1);
      setCurrentFile(FormsFiles[fileIndex - 1]);
    }
  };
  const nextFile = () => {
    if (fileIndex < FormsFiles.length - 1) {
      setFileIndex(fileIndex + 1);
      setCurrentFile(FormsFiles[fileIndex + 1]);
    }
  };
  const defaultFormsFiles = Array.isArray(FormsFiles) ? FormsFiles : [];
  const [base64String, setBase64String] = useState("");
  const [fileType, setFileType] = useState<string>("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  //switching to through previews
  useEffect(() => {
    if (FormsFiles && FormsFiles.length > 0) {
      const file = FormsFiles[fileIndex];
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
  }, [fileIndex, FormsFiles]);
  //fetching files from database
  useEffect(() => {
    const fetchData = async () => {
      setFormsUuid(formsData.forms_uuid);
      try {
        const response = await fetchFormFiles(formsData.forms_uuid, router);

        if (response.data && response.data.length > 0) {
          setFormsFiles(response.data);
          console.log(response.data, "Forms Data");
          setCurrentFile(response.data[0]);
          setFileIndex(0);
          const maxAllowedFiles = 5 - FormsFiles.length;
          setNumFilesCanAdd(maxAllowedFiles);
          setIsLoading(false);
        }
        if (defaultFormsFiles?.length === 0) {
          setIsNoFileModalOpen(true);
          console.log("no files");
          setIsLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (formsData.forms_uuid) {
      fetchData();
    }
  }, [
    formsData.forms_uuid,
    router,
    deleteModalOpen,
    isNoFileModalOpen,
    isSuccessOpen,
  ]);
  console.log(formsData, "passformdata", formsData.forms_uuid);
  // Define a state to track the selected filenames
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFormsFiles] = useState<File[]>([]);
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
  const toggleNoFilesToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "warning",
      title: "No Files Uploaded",
      description: `Please try again.`,
    });
  };
  const toggleFullFilesToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "warning",
      title: "Maximum Files Uploaded",
      description:
        "You have already uploaded 5 files. Delete some files to update.",
    });
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const MAX_FILE_SIZE_MB = 15;

    const MAX_NUM_FILES = 5;
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
            console.log(FormsFiles, "FromsFiles");

            // Set selected file names
            setSelectedFileNames(selectedFileNames);
          }
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays

      setSelectedFormsFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const getUuid = formsUuid;

    console.log("submit clicked");

    if (FormsFiles.length === 5) {
      toggleFullFilesToast();
      return;
    }
    if (getUuid) {
      const currentFileCount = await getCurrentFileCountFromDatabase(getUuid);
      const maxAllowedFiles = 5 - currentFileCount;
      console.log("FILES TO ADD", maxAllowedFiles);

      if (selectedFiles.length > maxAllowedFiles) {
        toggleMaxFilesToast(maxAllowedFiles);
        return;
      }
    }

    try {
      console.log(getUuid, "getUuid");
      // Iterate through each selected file
      if (selectedFiles && selectedFiles.length > 0) {
        setIsLoading(true);
        for (let i = 0; i < selectedFiles.length; i++) {
          const formsFileFormData = new FormData();
          formsFileFormData.append("formfile", selectedFiles[i], fileNames[i]);

          // Add  file
          const addFormsFiles = await addFormFile(
            getUuid,
            formsFileFormData,
            router
          );
          console.log(
            `Forms FILE ${fileNames[i]} added successfully:`,
            addFormFile
          );
        }
        setSelectedFileNames([]);
        setSelectedFormsFiles([]);
        onSuccess();

        // Call the onSuccess callback function
      } else {
        console.warn("No files selected to upload");
        toggleNoFilesToast();
      }
    } catch (error) {
      console.error("Error adding Forms:", error);
      // setError("Failed to add forms");
    } finally {
      // Update loading state after all files are processed
      setIsLoading(false);
      setIsSubmitted(false);
    }
    setIsSubmitted(false);
  };
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
        <div className="w-[220px]">
          <div
            className={`w-full flex flex-row ${
              defaultFormsFiles.length === 5
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <p className="border-2 rounded-l-md text-gray-400 items-center flex justify-center text-[13px] text-nowrap w-full">
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
              }text-[13px] bg-[#007C85] px-2 py-1 text-white cursor-pointer rounded-r-md flex justify-center border-2 border-[#007C85]`}
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
              <div className="absolute bg-[#4E4E4E] p-2 w-[220px] text-[13px]   mt-[30px] text-white rounded-md shadow-md left-0">
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {defaultFormsFiles?.length === 0 && isLoading === false ? (
        <NofileviewFormsModalContent
          formsUuid={formsUuid}
          onClose={handleNoFileModalClose}
          isModalOpen={(isOpen: boolean): void => {
            isModalOpen(isOpen);
          }}
          onSuccess={onSuccess}
        />
      ) : (
        <div className="w-[676px] h-[590px]">
          {isLoading ? (
            // Loading state
            <>
              <div className="mb-9 pt-4">
                <div className="h-[550px] md:px-8 mt-5">
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
              <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start px-[35px] rounded-md">
                <div className="items-center flex justify-between mt-5">
                  <h2 className="p-title text-[#071437]">View Form</h2>
                  <X
                    onClick={() => {
                      isSubmitted ? null : isModalOpen(false);
                    }}
                    className={`
                    ${isSubmitted && " cursor-not-allowed"}
                    w-6 h-6 text-black flex items-center cursor-pointer`}
                  />
                </div>
                <p className="text-sm text-gray-600">Document Files</p>
              </div>
              <form className="" onSubmit={handleSubmit}>
                <div className="mb-9 pt-4">
                  <div className="h-[380px] md:px-8 mt-5">
                    <div className="grid-rows-2">
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
                                alt="file image"
                                width="600"
                                height="550"
                                onClick={toggleModal}
                                src={`data:image/${fileType};base64,${base64String}`}
                              ></Image>
                            )}
                          </div>
                          <div className="">
                            <FileUploadWithHover />
                            {defaultFormsFiles.map((file: FormFile, index) => (
                              <div
                                className="border-[1px] rounded-lg h-[36px] items-center flex justify-center mt-2"
                                key={index}
                                onClick={() => {
                                  setFileIndex(index);
                                  setCurrentFile(file);
                                }}
                              >
                                <h2 className="rounded-l-md text-gray-400 text-[13px] text-nowrap cursor-pointer">
                                  {file.filename}
                                </h2>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Modal */}
                    {modalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                        <div className="w-full h-full rounded-lg flex items-center justify-center">
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
                            onClick={downloadImage}
                          >
                            <Image
                              className="mr-2"
                              src="/svgs/download.svg"
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
                      <Modal
                        content={
                          <ConfirmationModal
                            uuid={selectedFileUUID}
                            setConfirm={setConfirmDelete}
                            label="Delete"
                            handleFunction={(e) => {
                              handleDeleteClick();
                            }}
                            isSubmitted={isSubmitted}
                          />
                        }
                        isModalOpen={isConfirmModalOpen}
                      />
                    )}

                    <div className="flex space-x-4 mt-4 ml-[115px] text-[15px]">
                      {fileIndex > 0 && (
                        <button
                          type="button"
                          className="w-[80px] h-[30px] text-blue-500 bg-white-500 border-2 border-blue-500"
                          onClick={prevFile}
                        >
                          Previous
                        </button>
                      )}
                      {fileIndex < FormsFiles.length - 1 && (
                        <button
                          type="button"
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
              {/* {toast()} */}
            </>
          )}
        </div>
      )}
      {isSuccessOpen && (
        <SuccessModal
          label={selectedFileUUID !== "" ? "deleted" : "submitted"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
    </div>
  );
};
