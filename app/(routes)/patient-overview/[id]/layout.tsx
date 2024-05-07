"use client";
import { useEffect, useRef, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { redirect, useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";
import { fetchPatientProfileImage } from "@/app/api/patients-api/patientProfileImage.api";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import Image from "next/image";
export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!getAccessToken()) {
    redirect("/login");
  }
  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          width={100}
          height={100}
          alt="loading"
        />
      </div>
    );
  }
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
  }, [pathname]);
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
  console.log(pathname, "pathname");
  useEffect(() => {
    const pathParts = pathname.split("/");
    const tabUrl = pathParts[pathParts.length - 1];
    const fetchData = async () => {
      try {
        const response = await fetchPatientOverview(patientId, router);
        console.log(response, "response");
        const imgResponse = await fetchPatientProfileImage(patientId, router);
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
        setIsLoading(false);
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

    fetchData();
  }, [patientId, router, params]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }
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

  return (
    <div className="flex flex-col w-full px-[150px] pt-[90px] h-full">
      <div className="flex flex-col gap-[3px]">
        <div className="p-title pb-2">
          <h1>Patient Overview</h1>
        </div>
        <div className="flex ring-1 w-full gap-[30px]  ring-[#D0D5DD] p-5 rounded-md">
          <>
            {patientImage ? (
              <Image
                className="object-cover rounded-md w-[200px] h-[200px]"
                width={400}
                height={400}
                src={patientImage}
                alt="profile"
              />
            ) : (
              <Image
                className="object-cover rounded-md w-[200px] h-[200px]"
                width={400}
                height={400}
                src="/imgs/user-no-icon.jpg"
                alt="profile"
              />
            )}
          </>
          <div className="flex w-full">
            <div className="flex flex-col gap-[20px] justify-between pt-[10px]">
              <p className="p-title">
                {patientData[0]?.firstName} {patientData[0]?.middleName}{" "}
                {patientData[0]?.lastName}
              </p>
              <div className="flex flex-col gap-[20px]">
                <div className="flex gap-[55px]">
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
                </div>
                <div className="flex gap-[35px]">
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
                </div>
              </div>
              <div className="flex gap-[50px] px-2">
                {tabs.map((tab, index) => (
                  <Link href={tab.url}>
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
                      key={index}
                      onClick={() => {
                        setIsLoading(true);
                        // handleTabClick(tab.url, index);
                      }}
                    >
                      {tab.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className=" cursor-pointer">
              <Link href={`/patient-overview/${params.id}/patient-details`}>
                <p
                  className={`underline text-[15px] font-semibold text-right mr-10 hover:text-[#007C85] ${
                    currentRoute === "patient-details" ? "text-[#007C85]" : ""
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
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center mt-4">
        {children}
      </div>
    </div>
  );
}
