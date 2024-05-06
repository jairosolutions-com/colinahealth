"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { redirect, useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";
import {
  fetchPatientProfileImage,
  updatePatientProfileImage,
} from "@/app/api/patients-api/patientProfileImage.api";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { EditProvider, useEditContext } from "./editContext"; // Assuming you've exported EditContext from your context file
import { updatePatient } from "@/app/api/patients-api/patientDetails.api";

function PatientOverview() {
  const { isEdit, isSave, toggleEdit } = useEditContext();
  console.log("Current value of isEdit:", isEdit);

  useEffect(() => {
    console.log("isEdit changed in layout:", isEdit);
  }, [isEdit]); // Include isEdit in the dependency array to ensure that the effect runs whenever the isEdit state changes

  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any[]>([]);
  const [patientImage, setPatientImage] = useState<string>();
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [detailsClicked, setDetailsClicked] = useState<boolean>(false); // State to track if "See more details" is clicked
  const patientId = params.id.toUpperCase();
  const pathname = usePathname();
  const inputRef = useRef<HTMLSpanElement>(null);

  const tabs = [
    {
      label: "Medical History",
      url: `/patient-overview/${params.id}/medical-history/allergies`,
    },
    {
      label: "Medication Log",
      url: `/patient-overview/${params.id}/medication/scheduled`,
    },
    {
      label: "Prescription",
      url: `/patient-overview/${params.id}/prescription`,
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
      label: "Appointment",
      url: `/patient-overview/${params.id}/patient-appointment`,
    },
    {
      label: "Notes",
      url: `/patient-overview/${params.id}/notes/nurses-notes`,
    },
    {
      label: "Forms",
      url: `/patient-overview/${params.id}/forms`,
    },
  ];
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const [currentRoute, setCurrentRoute] = useState<string>("");

  const [seeMoreClicked, setSeeMoreClicked] = useState(
    localStorage.getItem("seeMoreClicked") === "true" ? true : false
  );
  const [seeMoreHovered, setSeeMoreHovered] = useState(
    localStorage.getItem("seeMoreHovered") === "true" ? true : false
  );

  const handleSeeMoreDetails = (url: string, tabIndex: number) => {
    if (url) {
      setActiveTab(-1);
      setDetailsClicked(true);
      localStorage.setItem("seeMoreClicked", "true"); // Set local storage
      router.replace(url);
    }
  };

  const handleSeeMoreHover = () => {
    setSeeMoreHovered(true);
    localStorage.setItem("seeMoreHovered", "true"); // Set local storage
  };

  const handleSeeMoreLeave = () => {
    setSeeMoreHovered(false);
    localStorage.setItem("seeMoreHovered", "false"); // Set local storage
  };

  useEffect(() => {
    const pathParts = pathname.split("/");
    setCurrentRoute(pathParts[pathParts.length - 1]);
    // Check local storage for previous state
    const clicked = localStorage.getItem("seeMoreClicked") === "true";
    const hovered = localStorage.getItem("seeMoreHovered") === "true";
    setSeeMoreClicked(clicked);
    setSeeMoreHovered(hovered);
  }, [pathname, currentRoute]);
  // const handleTabClick = (index: number, url: string) => {
  //   setActiveTab(index);
  //   onNavigate(router, url);
  //   setDetailsClicked(false); // Reset detailsClicked to false when a tab is clicked
  // };
  const handleTabClick = (url: string, tabIndex: number) => {
    if (url) {
      setActiveTab(tabIndex);
      setDetailsClicked(false);
      router.replace(url);
    }
  };
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
      <div className="form ring-1 w-full h-[220px] ring-[#D0D5DD] px-5 pt-5 rounded-md">
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex">
              <div className="relative">
                {!isLoading ? (
                  <>
                    {patientImage ? (
                      <div
                        className="rounded-lg"
                        style={{
                          width: "180px",
                          height: "180px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={patientImage}
                          alt="profile"
                          max-width="100%"
                          height="auto"
                          className="rounded-lg"
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "180px",
                          height: "180px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src="/imgs/user-no-icon.png"
                          alt="profile"
                          max-width="100%"
                          height="auto"
                          className="rounded-lg"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-[180px] h-[180px] animate-pulse bg-gray-300 rounded-lg "></div>
                )}
                {currentRoute === "patient-details" && isEdit && (
                  <label
                    htmlFor="fileInput"
                    className="absolute bottom-2 right-[-20px] cursor-pointer"
                  >
                    <img
                      src="/svgs/editprof.svg"
                      alt="edit button"
                      width="35"
                      height="35"
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
            </div>
          </div>
          <div className="justify-between ml-4 mt-1 flex flex-col w-full ">
            <div>
              <div
                className={`w-full justify-between p-title flex ${
                  isLoading ? "" : "ml-1"
                }`}
              >
                <h1>
                  {" "}
                  {isLoading ? (
                    <div className="h-[30px] w-52 bg-gray-300 rounded-full animate-pulse"></div>
                  ) : (
                    `${patientData[0]?.firstName} ${patientData[0]?.middleName} ${patientData[0]?.lastName}`
                  )}
                </h1>
                <div className=" cursor-pointer items-center ml-10 flex ">
                  <Link href={`/patient-overview/${params.id}/patient-details`}>
                    <p
                      className={`underline text-[15px] font-semibold text-right mr-10 hover:text-[#007C85] ${
                        currentRoute === "patient-details"
                          ? "text-[#007C85]"
                          : ""
                      }`}
                      onMouseEnter={handleSeeMoreHover}
                      onMouseLeave={handleSeeMoreLeave}
                      onClick={() => {
                        setIsLoading(true);
                        // handleSeeMoreDetails(
                        //   `/patient-overview/${params.id}/patient-details`,
                        //   -1
                        // );
                      }}
                    >
                      See more details
                    </p>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-row w-full mt-2 font-medium text-[15px]">
                  {isLoading ? (
                    <div className="flex items-start animate-pulse ">
                      <div className="h-[22px] w-32 bg-gray-300 rounded-full mr-2"></div>
                      <div className="h-[22px] w-24 bg-gray-400 rounded-full mr-2 "></div>
                      <div className="h-[22px] w-36 bg-gray-300 rounded-full mr-2"></div>
                      <div className="h-[22px] w-36 bg-gray-200 rounded-full mr-2"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src="/imgs/profile-circle-new.svg"
                        className="px-1"
                        alt="profile"
                        width="26"
                        height="26"
                      />
                      <div>
                        <p className="flex items-center mr-11">Patient</p>
                      </div>
                      <div className="flex">
                        <div>
                          <p className="flex items-center mr-11">
                            Age:
                            {patientData[0]?.age}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center mr-10 ml-1 ">
                            Gender:
                            {patientData[0]?.gender}
                          </p>
                        </div>
                        <div className="flex">
                          <p className="flex items-center">
                            ID:
                            <span ref={inputRef}>{patientData[0]?.uuid}</span>
                          </p>
                          <img
                            src="/imgs/id.svg"
                            alt="copy"
                            className="cursor-pointer ml-2"
                            onClick={handleCopyClick}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mb-5"></div>
                <div className="flex flex-row w-full font-medium text-[15px]">
                  {isLoading ? (
                    <div className="flex items-start animate-pulse">
                      <div className="h-5 w-44 bg-gray-400 rounded-full mr-12"></div>
                      <div className="h-5 w-60 bg-gray-400 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src="/imgs/codestatus.svg"
                        className="px-1"
                        alt="codestatus"
                        width="26"
                        height="26"
                      />
                      <div>
                        <h1 className={`flex items-center`}>
                          Code Status:
                          <p
                            className={`${
                              patientData[0]?.codeStatus === "DNR"
                                ? "text-red-500"
                                : "text-blue-500"
                            } ml-1 w-[100px]`}
                          >
                            {patientData[0]?.codeStatus}
                          </p>
                        </h1>
                      </div>

                      <div>
                        <div>
                          <p className="flex items-center">
                            Allergy:{" "}
                            {patientData[0]?.allergies
                              ? patientData[0]?.allergies
                              : "None"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-[50px] px-2 ">
              {isLoading ? (
                <div className="flex items-start animate-pulse">
                  <div className="h-8 w-28 bg-gray-300 rounded-full mr-12"></div>
                  <div className="h-8 w-28 bg-gray-200 rounded-full mr-12"></div>
                  <div className="h-8 w-24 bg-gray-300 rounded-full mr-12"></div>
                  <div className="h-8 w-20 bg-gray-400 rounded-full mr-12"></div>
                  <div className="h-8 w-36 bg-gray-300 rounded-full mr-12"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full mr-12"></div>
                  <div className="h-8 w-14 bg-gray-400 rounded-full mr-12"></div>
                  <div className="h-8 w-14 bg-gray-200 rounded-full "></div>
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
                          tab.label === "Medication Log") ||
                        (tabUrl === "incident-report" &&
                          tab.label === "Notes") ||
                        (tabUrl === "archived" && tab.label === "Forms")
                          ? "text-[#007C85] border-b-2 border-[#007C85] text-[15px] pb-1"
                          : "hover:text-[#007C85] hover:border-b-2 pb-1 h-[31px] border-[#007C85] text-[15px]"
                      }`}
                      onClick={() => {
                        setIsLoading(true);
                        // handleTabClick(tab.url, index);
                        toggleEdit();
                      }}
                    >
                      {tab.label}
                    </p>
                  </Link>
                ))
              )}
            </div>
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
  return (
    <div className="flex flex-col w-full px-[150px] pt-[90px] h-full">
      <EditProvider>
        <PatientOverview />
        <div className="w-full flex items-center justify-center mt-4 h-full">
          {children}
        </div>
      </EditProvider>
    </div>
  );
}
