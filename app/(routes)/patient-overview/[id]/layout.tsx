"use client";
import { useEffect, useRef, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { redirect, useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";
import {
  fetchPatientProfileImage,
  updatePatientProfileImage,
} from "@/app/api/patients-api/patientProfileImage.api";

import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import Image from "next/image";
import { EditProvider, useEditContext } from "./editContext";
function PatientOverview({ setIsTableLoading }: { setIsTableLoading: any }) {
  const { isEdit, isSave, toggleEdit, disableEdit } = useEditContext();

  useEffect(() => {
    console.log("isEdit changed in layout:", isEdit);
  }, [isEdit]);

  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any[]>([]);
  const [patientImage, setPatientImage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const patientId = params.id.toUpperCase();
  const pathname = usePathname();
  const inputRef = useRef<HTMLSpanElement>(null);

  const tabs = [
    {
      label: "MAR",
      url: `/patient-overview/${params.id}/medication/scheduled`,
    },
    {
      label: "Notes",
      url: `/patient-overview/${params.id}/notes/nurses-notes`,
    },
    {
      label: "Vital Signs",
      url: `/patient-overview/${params.id}/vital-signs`,
    },
    {
      label: "Laboratory Results",
      url: `/patient-overview/${params.id}/lab-results`,
    },
    {
      label: "Medical History",
      url: `/patient-overview/${params.id}/medical-history/allergies`,
    },
    {
      label: "Prescription",
      url: `/patient-overview/${params.id}/prescription`,
    },
    {
      label: "Forms",
      url: `/patient-overview/${params.id}/forms`,
    },
    {
      label: "Appointment",
      url: `/patient-overview/${params.id}/patient-appointment`,
    },
  ];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const [currentRoute, setCurrentRoute] = useState<string>("");

  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const [seeMoreHovered, setSeeMoreHovered] = useState(false);

  const handleSeeMoreHover = () => {
    setSeeMoreHovered(true);
  };

  const handleSeeMoreLeave = () => {
    setSeeMoreHovered(false);
  };

  useEffect(() => {
    const pathParts = pathname.split("/");
    setCurrentRoute(pathParts[pathParts.length - 1]);
    const clicked = true;
    const hovered = true;
    setSeeMoreClicked(clicked);
    setSeeMoreHovered(hovered);
  }, [pathname, currentRoute]);

  //show loading
  const loadDefaultImage = async () => {
    try {
      // Fetch the default image as a file
      const response = await fetch("/imgs/loading.gif");
      const blob = await response.blob();

      // Read the file content as a data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPatientImage(reader.result); // Set the data URL as the state
        }
      };
      reader.readAsDataURL(blob); // Read the blob content as a data URL
    } catch (error) {
      console.error("Error loading default image:", error);
    }
  };

  const fetchData = async () => {
    setIsTableLoading(false);
    try {
      const response = await fetchPatientOverview(patientId, router);
      console.log(response, "response");
      const imgResponse = await fetchPatientProfileImage(patientId, router);
      setIsLoading(false);

      if (!imgResponse.data || imgResponse.data.length === 0) {
        // If no image data is available, set patientImage to null
        setPatientImage("");
      } else {
        // Convert the image data buffer to a data URL
        const buffer = Buffer.from(imgResponse.data);
        const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        setPatientImage(dataUrl);
      }
      setPatientData(response);
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              window.location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    }
  };
  useEffect(() => {
    const pathParts = pathname.split("/");
    const tabUrl = pathParts[pathParts.length - 1];
    setIsTableLoading(false);
    fetchData();
  }, [patientId, router, params]);
  //removed router and params replaced with pathname for reduce icon reload
  console.log(patientData, "patientData");

  const pathParts = pathname.split("/");
  const tabUrl = pathParts[pathParts.length - 1];

  const handleCopyClick = () => {
    if (inputRef.current) {
      sonner.success("Patient ID copied to clipboard");
      const range = document.createRange();
      range.selectNodeContents(inputRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
    }
  };
  const toggleMaxSizeToast = (): void => {
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const MAX_FILE_SIZE_MB = 15;

    if (!files || files.length === 0) {
      // No files selected, handle accordingly
      console.warn("No files selected");
      return;
    }

    const totalSize: number = Array.from(files).reduce(
      (acc, file) => acc + (file?.size || 0), // Check for null file and size
      0
    );
    const totalSizeMB = totalSize / (1024 * 1024); // Convert bytes to MB

    if (totalSizeMB > MAX_FILE_SIZE_MB) {
      toggleMaxSizeToast();
      e.target.value = ""; // Clear the input field
      return;
    }

    const reader = new FileReader(); // Create a new FileReader instance

    // Define an onload function for the reader
    reader.onload = () => {
      // Check if reader.result is a string
      if (typeof reader.result === "string") {
        // When the reader finishes loading the file and the result is a string, update the patientImage state with the data URL of the selected image
        setPatientImage(reader.result);
      }
    };

    // Read the selected file as a data URL
    if (files[0]) {
      reader.readAsDataURL(files[0]);
    } else {
      console.warn("No valid file selected");
    }

    // Handle other file details
    const newFiles: File[] = [];
    const newFileNames: string[] = [];
    const newFileTypes: string[] = [];

    Array.from(files).forEach((file) => {
      if (file) {
        // Add file, name, and type to arrays
        newFiles.push(file);
        newFileNames.push(file.name);
        newFileTypes.push(file.type.split("/")[1]);
      }
    });

    setSelectedFile(newFiles);
    setSelectedFileNames(newFileNames);
    setFileNames(newFileNames);
    setFileTypes(newFileTypes);
  };

  //save button
  useEffect(() => {
    if (isSave) {
      handleSubmit();
      toggleEdit();
    }
  }, [isSave]);

  const handleSubmit = async () => {
    console.log("submitting");
    try {
      if (selectedFile) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFile.length; i++) {
          const userIconFormData = new FormData();
          userIconFormData.append(
            "profileimage",
            selectedFile[i],
            fileNames[i]
          );

          // Add lab file
          const addUserIcon = await updatePatientProfileImage(
            patientId,
            userIconFormData
          );
          setIsLoading(true);

          loadDefaultImage(); // Call the function to load the default image
          fetchData();

          console.log(
            `Icon FILE ${fileNames[i]} added successfully:`,
            addUserIcon
          );
        }
      } else {
        console.warn("No files selected to upload");
      }
      // onSuccess();
      // isModalOpen(false);
    } catch (error: any) {
      if (error.message === "Patient already exist") {
        console.log("conflict error");
      }
      console.log(error.message);
      setError("Failed to add Patient");
    }
  };
  return (
    <div className="flex flex-col gap-[3px]">
      <div className="p-title pb-2">
        <h1>Patient Overview</h1>
      </div>
      <div className="flex ring-1 w-full gap-[30px]  ring-[#D0D5DD] p-5 rounded-md">
        <div className="relative">
          {!isLoading ? (
            <>
              {patientImage ? (
                <Image
                  className="object-cover rounded-md min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px]"
                  width={200}
                  height={200}
                  src={patientImage}
                  alt="profile"
                />
              ) : (
                <Image
                  className="object-cover rounded-md min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px]"
                  width={200}
                  height={200}
                  src="/imgs/user-no-icon.svg"
                  alt="profile"
                />
              )}
            </>
          ) : (
            <div className="w-[200px] h-[200px] animate-pulse bg-gray-300 rounded-lg "></div>
          )}
          {currentRoute === "patient-details" && isEdit && (
            <label
              htmlFor="fileInput"
              className="absolute bottom-2 right-[-20px] cursor-pointer"
            >
              <Image
                src="/svgs/editprof.svg"
                alt="edit button"
                width={35}
                height={35}
              />
            </label>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-[20px] justify-between pt-[10px]">
            <div className="flex flex-col gap-[15px]">
              {isLoading ? (
                <div className="h-[30px] w-52 bg-gray-300 rounded-full animate-pulse"></div>
              ) : (
                <p className="p-title ml-1">
                  {patientData[0]?.firstName} {patientData[0]?.middleName}{" "}
                  {patientData[0]?.lastName}
                </p>
              )}
              <div className="flex flex-col gap-[15px]">
                <div className="flex gap-[55px]">
                  {isLoading ? (
                    <div className="flex items-start animate-pulse ">
                      <div className="h-[22px] w-32 bg-gray-300 rounded-full mr-2"></div>
                      <div className="h-[22px] w-24 bg-gray-400 rounded-full mr-2 "></div>
                      <div className="h-[22px] w-36 bg-gray-300 rounded-full mr-2"></div>
                      <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-[3px]">
                        <img
                          src="/imgs/profile-circle-new.svg"
                          className="px-1"
                          alt="profile"
                          width="26"
                          height="26"
                        />
                        <p className="">Patient</p>
                      </div>
                      <p className="">Age: {patientData[0]?.age}</p>
                      <p className=" ">Gender: {patientData[0]?.gender}</p>
                      <div className="flex gap-[8px]">
                        <p className="flex items-center">
                          ID: <span ref={inputRef}>{patientData[0]?.uuid}</span>
                        </p>
                        <img
                          src="/imgs/id.svg"
                          alt="copy"
                          className="cursor-pointer"
                          onClick={handleCopyClick}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-[35px]">
                  {isLoading ? (
                    <div className="flex items-start animate-pulse">
                      <div className="h-5 w-44 bg-gray-400 rounded-full mr-12"></div>
                      <div className="h-5 w-60 bg-gray-400 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-[3px] w-[212px]">
                        <img
                          src="/imgs/codestatus.svg"
                          className="px-1"
                          alt="codestatus"
                          width="26"
                          height="26"
                        />
                        <p>
                          Code Status:
                          <span
                            className={` 
                          ${
                            patientData[0]?.codeStatus === "DNR"
                              ? "text-red-500"
                              : "text-blue-500"
                          } ml-1 w-[100px]`}
                          >
                            {patientData[0]?.codeStatus}
                          </span>
                        </p>
                      </div>
                      <p className="flex">
                        Allergy:{" "}
                        {patientData[0]?.allergies
                          ? patientData[0]?.allergies
                          : "None"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-[50px] px-2 ">
              {isLoading ? (
                <div className="flex items-start animate-pulse">
                  <div className="h-8 w-10 bg-gray-300 rounded-full mr-12"></div>
                  <div className="h-8 w-14 bg-gray-200 rounded-full mr-12"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded-full mr-12"></div>
                  <div className="h-8 w-36 bg-gray-400 rounded-full mr-12"></div>
                  <div className="h-8 w-28 bg-gray-300 rounded-full mr-12"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full mr-12"></div>
                  <div className="h-8 w-14 bg-gray-400 rounded-full mr-12"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full "></div>
                </div>
              ) : (
                tabs.map((tab, index) => (
                  <Link href={tab.url} key={index}>
                    <p
                      className={`cursor-pointer font-bold ${
                        pathname === tab.url ||
                        (tabUrl === "surgeries" &&
                          tab.label === "Medical History") ||
                        (tabUrl === "prorenata" &&
                          tab.label === "MAR") ||
                        (tabUrl === "incident-report" &&
                          tab.label === "Notes") ||
                        (tabUrl === "archived" && tab.label === "Forms")
                          ? "text-[#007C85] border-b-2 border-[#007C85] text-[15px] pb-1"
                          : "hover:text-[#007C85] hover:border-b-2 pb-1 h-[31px] border-[#007C85] text-[15px]"
                      }`}
                      onClick={() => {
                        setIsTableLoading(true);
                        disableEdit(); // disable edit on tab change
                      }}
                    >
                      {tab.label}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className={`cursor-pointer ${isLoading ? "hidden" : ""}`}>
            <Link href={`/patient-overview/${params.id}/patient-details`}>
              <p
                onClick={() => {
                  setIsTableLoading(true);
                }}
                className={`underline text-[15px] font-semibold text-right mr-10 hover:text-[#007C85] ${
                  currentRoute === "patient-details" ? "text-[#007C85]" : ""
                }`}
                onMouseEnter={handleSeeMoreHover}
                onMouseLeave={handleSeeMoreLeave}
              >
                See more details
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
//created the parent as a function and the wrapped the children with the provider
export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full px-[150px] pt-[90px] h-full">
      <EditProvider>
        <PatientOverview setIsTableLoading={setIsTableLoading} />
        <div className="w-full flex items-center justify-center mt-4 h-full">
          {isTableLoading ? (
            <div className="container w-full h-full flex justify-center items-center ">
              <Image
                src="/imgs/colina-logo-animation.gif"
                alt="logo"
                width={100}
                height={100}
              />
            </div>
          ) : (
            children
          )}
        </div>
      </EditProvider>
    </div>
  );
}
