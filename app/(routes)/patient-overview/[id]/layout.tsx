"use client";
import { useEffect, useRef, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { Navbar } from "@/components/navbar";
import { useParams, useRouter } from "next/navigation";
import { fetchPatientOverview } from "@/app/api/patients-api/patientOverview.api";
import { usePathname } from "next/navigation";
import Loading from "./loading";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { toast } from "sonner";
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
    onNavigate(router, "/login");
  }
  const [patientData, setPatientData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [detailsClicked, setDetailsClicked] = useState<boolean>(false); // State to track if "See more details" is clicked
  const patientId = params.id.toUpperCase();
  const pathname = usePathname();
  const [isAllergy, setIsAllergy] = useState(true);
  const [isSurgery, setIsSurgery] = useState(false);
  const [isMedicationLog, setIsMedicationLog] = useState(false);
  const [isPrescription, setIsPrescription] = useState(false);
  const [isVitalSign, setIsVitalSign] = useState(false);
  const [isLabRes, setIsLabRes] = useState(false);
  const [isAppointment, setIsAppointment] = useState(false);
  const [isNotes, setIsNotes] = useState(false);
  const inputRef = useRef<HTMLSpanElement>(null);

  console.log(getAccessToken, "getAccessToken");
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
      url: `/patient-overview/${params.id}/notes`,
    },
  ];

  const handleSeeMoreDetails = (url: string, tabIndex: number) => {
    setIsLoading(true);
    onNavigate(router, url);
    setActiveTab(-1);
    setDetailsClicked(true);
    
  };

  // const handleTabClick = (index: number, url: string) => {
  //   setActiveTab(index);
  //   onNavigate(router, url);
  //   setDetailsClicked(false); // Reset detailsClicked to false when a tab is clicked
  // };
  const handleTabClick = (url: string, tabIndex: number) => {
    setIsLoading(true);
    onNavigate(router, url);
    setActiveTab(tabIndex);
    setDetailsClicked(false);
    console.log(url, "url")
    
  };
  console.log(pathname, "pathname");
  useEffect(() => {
    const pathParts = pathname.split("/");
    const tabUrl = pathParts[pathParts.length - 1];

    if (tabUrl === "allergies") {
      setIsAllergy(true);
    } else if (tabUrl === "surgeries") {
      setIsSurgery(true);
    } else if (tabUrl === "medication") {
      setIsMedicationLog(true);
    } else if (tabUrl === "prescription") {
      setIsPrescription(true);
    } else if (tabUrl === "vital-signs") {
      setIsVitalSign(true);
    } else if (tabUrl === "lab-results") {
      setIsLabRes(true);
    } else if (tabUrl === "patient-appointment") {
      setIsAppointment(true);
    } else if (tabUrl === "notes") {
      setIsNotes(true);
    }
    const fetchData = async () => {
      try {
        const response = await fetchPatientOverview(patientId, router);
        console.log(response, "response");
        setPatientData(response);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId, router, params]);

  if (isLoading) {
    switch (true) {
      case !isAllergy:
        return <Loading></Loading>;
      case !isSurgery:
        return <Loading></Loading>;
      case !isMedicationLog:
        return <Loading></Loading>;
      case !isPrescription:
        return <Loading></Loading>;
      case !isVitalSign:
        return <Loading></Loading>;
      case !isLabRes:
        return <Loading></Loading>;
      case !isAppointment:
        return <Loading></Loading>;
      case !isNotes:
        return <Loading></Loading>;
      default:
        break;
    }
  }
  console.log(patientData, "patientData");

  const pathParts = pathname.split("/");
  const tabUrl = pathParts[pathParts.length - 1];

  const handleCopyClick = () => {
    if (inputRef.current) {
      toast.success("Patient ID copied to clipboard")
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
    <div className="flex flex-col w-full  px-4 lg:px-28 mt-[100px]">
      <div className="flex flex-col gap-[3px]">
        <div className="text-2xl font-bold">
          <h1>Patient Overview</h1>
          <p className="text-[14px] font-medium text-[#64748B] mt-[-5px]">
            {detailsClicked
              ? "View - Details"
              : activeTab !== -1
              ? tabs[activeTab]?.label
              : ""}
          </p>
        </div>
        <div className="form ring-1 w-full h-[220px] shadow-md ring-gray-300 px-5 pt-5 rounded-md">
          <div className="flex">
            <div className="flex flex-col">
              <img
                src="/imgs/dennis.svg"
                alt="profile"
                width="200"
                height="200"
              />
            </div>
            <div className="justify-between ml-4 mt-1 flex flex-col w-full ">
              <div>
                <div className=" w-full justify-between text-2xl font-semibold flex">
                  <h1>
                    {" "}
                    {patientData[0]?.firstName} {patientData[0]?.middleName} {patientData[0]?.lastName}
                  </h1>
                  <div className=" cursor-pointer items-center ml-10 flex ">
                    <p
                      className="underline text-sm font-semibold text-[#07143799] text-right"
                      onClick={() =>
                        handleSeeMoreDetails(
                          `/patient-overview/${params.id}/patient-details`,
                          -1
                        )
                      }
                    >
                      See more details
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex flex-row w-full mt-2">
                    <img
                      src="/imgs/profile-circle.svg"
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
                        <p className="flex items-center mr-11">
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
                          className="cursor-pointer"
                          onClick={handleCopyClick}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5"></div>
                  <div className="flex flex-row w-full ">
                    <div className="w-1/6 flex">
                      <img
                        src="/imgs/codestatus.svg"
                        className="px-1"
                        alt="codestatus"
                        width="26"
                        height="26"
                      />
                      <div className="">
                        <h1 className={`flex items-center mr-11`}>
                          Code Status:
                          <p
                            className={` 
                          ${
                            patientData[0]?.codeStatus === "DNR"
                              ? "text-red-500"
                              : "text-blue-500"
                          } ml-1`}
                          >
                            {patientData[0]?.codeStatus}
                          </p>
                        </h1>
                      </div>
                    </div>
                    <div className="flex w-5/6">
                      <div>
                        <p className="flex items-center mr-11">
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
                  <p
                    className={`cursor-pointer font-semibold ${
                      pathname === tab.url ||
                      (tabUrl === "surgeries" &&
                        tab.label === "Medical History") ||
                      (tabUrl === "prorenata" && tab.label === "Medication Log")
                        ? "text-[#007C85] border-b-[3px] border-[#007C85]"
                        : "hover:text-[#007C85] hover:border-b-[3px] h-[27px] border-[#007C85]"
                    }`}
                    key={index}
                    onClick={() => {
                      handleTabClick(tab.url, index);
                    }}
                  >
                    {tab.label}
                  </p>
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
