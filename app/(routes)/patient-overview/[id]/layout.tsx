"use client";
import { useEffect, useRef, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";

import { getAccessToken } from "@/app/api/login-api/accessToken";
import { toast as sonner } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
export default function PatientOverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  if (!getAccessToken()) {
    router.replace("/login");
  }
  const { toast } = useToast();
  const [patientData, setPatientData] = useState<any[]>([]);
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
    <div className="flex flex-col w-full px-[150px] pt-[90px]">
      <div className="flex flex-col gap-[3px]">
        <div className="p-title pb-2">
          <h1>Patient Overview</h1>
        </div>
        <div className="form ring-1 w-full h-[220px] ring-[#D0D5DD] px-5 pt-5 rounded-md">
          <div className="flex">
            <div className="flex flex-col">
              <img
                src="/imgs/drake.png"
                alt="profile"
                width="200"
                height="200"
              />
            </div>
            <div className="justify-between ml-4 mt-1 flex flex-col w-full ">
              <div>
                <div className="w-full justify-between p-title flex ml-2">
                  <h1>
                    {" "}
                    {patientData[0]?.firstName} {patientData[0]?.middleName}{" "}
                    {patientData[0]?.lastName}
                  </h1>
                  <div className=" cursor-pointer items-center ml-10 flex ">
                    <Link
                      href={`/patient-overview/${params.id}/patient-details`}
                    >
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
                          Age: {patientData[0]?.age}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center mr-10 ml-1 ">
                          Gender: {patientData[0]?.gender}
                        </p>
                      </div>
                      <div className="flex">
                        <p className="flex items-center">
                          ID: <span ref={inputRef}>{patientData[0]?.uuid}</span>
                        </p>
                        <img
                          src="/imgs/id.svg"
                          alt="copy"
                          className="cursor-pointer ml-2"
                          onClick={handleCopyClick}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5"></div>
                  <div className="flex flex-row w-full font-medium text-[15px]">
                    <img
                      src="/imgs/codestatus.svg"
                      className="px-1"
                      alt="codestatus"
                      width="26"
                      height="26"
                    />
                    <div className="">
                      <h1 className={`flex items-center`}>
                        Code Status:
                        <p
                          className={` 
                          ${
                            patientData[0]?.codeStatus === "DNR"
                              ? "text-red-500"
                              : "text-blue-500"
                          } ml-1 w-[100px]`}
                        >
                          {patientData[0]?.codeStatus}
                        </p>
                      </h1>
                    </div>

                    <div className="">
                      <div>
                        <p className="flex items-center">
                          Allergy:{" "}
                          {patientData[0]?.allergies
                            ? patientData[0]?.allergies
                            : "None"}
                        </p>
                      </div>
                    </div>
                  </div>
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
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center mt-4">
        {children}
      </div>
    </div>
  );
}
