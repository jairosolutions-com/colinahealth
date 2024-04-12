"use client";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { fetchPatientPrescriptions } from "@/app/api/patients-api/patientTimeGraph";
import { PRNMedModal } from "@/components/modals/prn-medication.modal";
import PatientCard from "@/components/patientCard";
import TimeGraph from "@/components/timeGraph";
import { formUrlQuery } from "@/lib/utils";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function ChartPage() {
  const router = useRouter();
  if (!getAccessToken()) {
    onNavigate(router, "/login");
  }
  const [patientList, setPatientList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gotoError, setGotoError] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPrescriptions, setTotalPrescriptions] = useState<number>(1);
  const [patientUuid, setPatientUuid] = useState<string>("");
  const [PRNData, setPRNData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  console.log(patientName, "patientName");

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle going to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToPage = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pageNumberInt = parseInt(pageNumber, 10);

    // Check if pageNumber is a valid number and greater than 0
    if (
      !isNaN(pageNumberInt) &&
      pageNumberInt <= totalPages &&
      pageNumberInt > 0
    ) {
      setCurrentPage(pageNumberInt);

      console.log("Navigate to page:", pageNumberInt);
    } else {
      setGotoError(true);
      setTimeout(() => {
        setGotoError(false);
      }, 3000);
      console.error("Invalid page number:", pageNumber);
    }
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`flex border border-px items-center justify-center  w-[49px]  ${
            currentPage === i ? "btn-pagination" : ""
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const patientWithMedicationLogsToday = patientList?.filter((patient) => {
    // Assuming medicationlogs is an array and you want to check if any of the logs were created today
    return patient.medicationlogs.some((log: any) => {
      // Explicitly define the type of 'log' as 'any'
      // Check if the createdAt of any medication log is today's date
      const createdAtDate = new Date(log.createdAt);
      const today = new Date();
      return createdAtDate.toDateString() === today.toDateString();
    });
  });

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "scroll";
      setPRNData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientListWithPrescription = await fetchPatientPrescriptions(
          currentPage,
          router
        );
        setPatientList(patientListWithPrescription.data);
        setTotalPages(patientListWithPrescription.totalPages);
        setTotalPrescriptions(patientListWithPrescription.totalCount);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patientListWithPrescription list:");
      }
    };

    fetchData();
  }, [currentPage, isOpen]);

  const [id, setId] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    if (id) {
      isModalOpen(true);
    }
  }, [id]);
  const handlePRNClicked = (patientId: string) => {
    setId(patientId); // Update state first
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: patientId,
    });
    router.push(newUrl, { scroll: true }); // Update URL immediately
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
  };
  interface Modalprops {
    label: string;
    isOpen: boolean;
    isModalOpen: (isOpen: boolean) => void;
  }

  const [currentTime, setCurrentTime] = useState(moment().format("HHmm"));
  // Function to get distinct allergy types
  const getDistinctAllergyTypes = (allergies: any[]) => {
    const distinctTypes: string[] = [];
    allergies.forEach((allergy: any) => {
      if (!distinctTypes.includes(allergy.type)) {
        distinctTypes.push(allergy.type);
      }
    });
    return distinctTypes.join(", ");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("HHmm"));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentTime]);
  // Function to get medication types and their counts
  const getPRNCount = (medicationLogs: any[]) => {
    const medicationTypes: { [key: string]: number } = {};

    // Count the occurrences of each medication type
    medicationLogs.forEach((log: any) => {
      if (log.medicationType === "PRN") {
        if (!medicationTypes[log.medicationType]) {
          medicationTypes[log.medicationType] = 1;
        } else {
          medicationTypes[log.medicationType]++;
        }
      }
    });

    return medicationTypes;
  };
  const handlePatientClick = (patientId: any) => {
    const lowercasePatientId = patientId.toLowerCase();

    onNavigate(
      router,
      `/patient-overview/${lowercasePatientId}/medical-history/allergies`
    );
  };

  const [tableHeight, setTableHeight] = useState<number>(0);
  const lineRef = useRef<HTMLDivElement>(null);

  console.log("Updating currentTime:", currentTime);
  const colData: { name: string; time: string }[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    const timeLabel = hour + "00";
    colData.push({
      name: timeLabel,
      time: moment().set("hour", i).set("minute", 0).format("HHmm"),
    });
  }
  console.log(patientWithMedicationLogsToday, "timegraph");

  const currentDate = new Date();
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Convert hours to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Add leading zeros to minutes if needed
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  // Concatenate hours, minutes, and AM/PM to form the time string
  const timeStrings = `${hours}:${minutesString} ${ampm}`;

  function convertTimeToHundreds(timeString: string): number {
    // Split the time string into hours, minutes, and AM/PM
    const [time, period] = timeString.split(" ");
    const [hoursStr, minutesStr] = time.split(":");

    // Convert hours and minutes to numbers
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Adjust hours for PM, but not for 12:00 PM
    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }

    // Calculate the total time in "hundreds"
    const totalTimeInMinutes = hours * 60 + minutes;
    const totalTimeInHundreds = Math.round((totalTimeInMinutes * 100) / 60);

    // Adjust for 2400 if the time is 12:00 AM
    return totalTimeInHundreds === 0 ? 2400 : totalTimeInHundreds;
  }

  console.log(timeStrings, "timeStrings");
  const hundredsTime = convertTimeToHundreds(timeStrings).toString();
  console.log(hundredsTime);
  const linePosition = {
    left: `${(parseInt(hundredsTime.substring(0, 10)) / 2400) * 100}%`,
    height: tableHeight + "px",
  };

  const formatTime = (timeString: string) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Format the hours part into 12-hour format
    let formattedHours = hours % 12 || 12; // Convert 0 to 12
    const ampm = hours < 12 ? "am" : "pm"; // Determine if it's AM or PM

    // If minutes is undefined or null, set it to 0
    const formattedMinutes =
      minutes !== undefined ? minutes.toString().padStart(2, "0") : "00";

    // Return the formatted time string
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("HHmm"));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentTime]);

  useEffect(() => {
    const table = document.querySelector(".time-graph-table");
    if (table) {
      setTableHeight(table.clientHeight);
      if (lineRef.current) {
        // Here we directly set the height of the line position element
        lineRef.current.style.height = table.clientHeight + "px";
      }
    }
  }, [patientWithMedicationLogsToday]); // Re-calculate height when table content changes

  useEffect(() => {
    // Calculate line position height after the table height has been set
    const table = document.querySelector(".time-graph-table");
    if (table) {
      setTableHeight(table.clientHeight);
      if (lineRef.current) {
        lineRef.current.style.height = table.clientHeight + "px";
      }
    }
  }, []); // Run once after component is mounted

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [linePosition]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }

  return (
    <div className="App w-full h-full pt-20  md:overflow-hidden md:px-28 ">
      {patientWithMedicationLogsToday.length == 0 ? (
        <div className="flex items-center justify-center font-semibold text-3xl w-full h-full -mt-10">
          No Patient Prescription/s <br />
          •ω•
        </div>
      ) : (
        <div className="w-full h-full ">
          <div className="w-full h-full md:block hidden">
            <div className="w-full flex items-end -mt-8 py-5 bg-[#F4F4F4] ">
              <div className="text-start p-title ml-5 -mb-14 just gap-[34px]  flex items-end z-10">
                <h1> Time Chart</h1>
                {/* <input type="text" placeholder="search patient..." className="text-md font-thin"/> */}
              </div>
            </div>
            <div className="w-full h-full flex flex-col ">
              <div className="flex flex-row bg-[#F4F4F4]">
                <div className="w-2/6 h-full sticky top-0 pt-4">
                  <PatientCard
                    patientWithMedicationLogsToday={
                      patientWithMedicationLogsToday
                    }
                    setPatientUuid={setPatientUuid}
                    isModalOpen={isModalOpen}
                    setPatientName={setPatientName}
                  />
                </div>
                {/* Ensuring TimeGraph's height adjusts based on PatientCard's height */}
                <div className="w-4/6 h-full  overflow-y-hidden border-r-4 border-solid border-blue-500 ">
                  <div className="w-full h-full ">
                    {" "}
                    <TimeGraph
                      patientWithMedicationLogsToday={
                        patientWithMedicationLogsToday
                      }
                    />
                  </div>
                </div>
              </div>

              {/* pagination */}
              {totalPages <= 1 ? (
                <div></div>
              ) : (
                <div className="mt-5">
                  <div className="flex justify-between">
                    <p className="font-medium size-[18px] w-[138px] items-center">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div>
                      <nav>
                        <div className="flex -space-x-px text-sm">
                          <div>
                            <button
                              onClick={goToPreviousPage}
                              className="flex border border-px items-center justify-center  w-[77px] h-full"
                            >
                              Prev
                            </button>
                          </div>
                          {renderPageNumbers()}

                          <div className="ml-5">
                            <button
                              onClick={goToNextPage}
                              className="flex border border-px items-center justify-center  w-[77px] h-full"
                            >
                              Next
                            </button>
                          </div>
                          <form onSubmit={handleGoToPage}>
                            <div className="flex px-5 ">
                              <input
                                className={`ipt-pagination appearance-none  text-center border ring-1 ${
                                  gotoError ? "ring-red-500" : "ring-gray-300"
                                } border-gray-100`}
                                type="text"
                                placeholder="-"
                                pattern="\d*"
                                value={pageNumber}
                                onChange={handlePageNumberChange}
                                onKeyPress={(e) => {
                                  // Allow only numeric characters (0-9), backspace, and arrow keys
                                  if (
                                    !/[0-9\b]/.test(e.key) &&
                                    e.key !== "ArrowLeft" &&
                                    e.key !== "ArrowRight"
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <div className="px-5">
                                <button
                                  type="submit"
                                  className="btn-pagination "
                                >
                                  Go{" "}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* mobile */}

          <div className="md:hidden block mt-10">
            <div className="w-full flex flex-col items-center -mt-5  py-5 bg-[#F4F4F4] ">
              <div className="text-start p-title ml-5   flex items-start ">
                <h1> Time Chart</h1>
                {/* <input type="text" placeholder="search patient..." className="text-md font-thin"/> */}
              </div>
              <div className="w-full h-full pt-8 pb-4">
                <div className="flex w-full h-full flex-col  bg-[#F4F4F4] items-center  border-dashed border-r border-r-black   right-0 justify-end">
                  <p className="absolute top-2 right-7 text-lg text-gray-500 font-light ">
                    Prior
                  </p>
                  {patientWithMedicationLogsToday.map(
                    (patient: any, index: number) => (
                      <div className="w-full flex flex-col">
                        <div
                          key={index}
                          className="flex flex-row  bg-white border-2 border-b-8 border-l-8  h-[11rem] w-full rounded-lg border-[#F4F4F4] right-0"
                        >
                          <div
                            className="w-4/6 h-full cursor-pointer"
                            onClick={() => handlePatientClick(patient.uuid)}
                          >
                            <div className="flex p-3 pl-5 flex-row w-full">
                              <div className="rounded-full max-h-[60px] max-w-[60px] p-1 bg-[#007C854D]">
                                <img
                                  className="rounded-full"
                                  src="/imgs/tao1.svg"
                                  alt="Patient"
                                  width={50}
                                />
                              </div>
                              <div className="ml-5 flex flex-col  ">
                                <p className="font-semibold text-lg justify-start items-start flex truncate text-ellipsis">
                                  {patient.firstName} {patient.middleName}{" "}
                                  {patient.lastName}
                                </p>
                                <p className="flex text-sm justify-start">
                                  {patient.age} years old - {patient.gender}
                                </p>
                              </div>
                            </div>
                            <div className="w-full h-full flex flex-col justify-start items-start ml-5 pr-5 pb-5">
                              <p>
                                Attending -{" "}
                                <span className="text-gray-400">
                                  Nurse Name
                                </span>
                              </p>
                              <p className="truncate text-ellipsis w-full flex justify-start items-start">
                                Allergies - {"  "}
                                <span className="w-full flex justify-start items-start text-gray-400">
                                  {getDistinctAllergyTypes(patient.allergies)
                                    .length > 0
                                    ? getDistinctAllergyTypes(patient.allergies)
                                    : "None"}
                                </span>
                              </p>
                              <p>
                                Code -{" "}
                                <span
                                  className={`${
                                    patient.codeStatus == "DNR"
                                      ? "text-red-600"
                                      : "text-blue-400"
                                  }`}
                                >
                                  {patient.codeStatus}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="h-full w-1/6 border-[#F4F4F4] border-l-4 border-solid flex justify-between items-center flex-col">
                            <div className="h-full w-full flex flex-col border-[#F4F4F4] border-b-4 text-xs items-center justify-center  cursor-pointer">
                              <img
                                src="/icons/chart-order.svg"
                                alt="order"
                                width={20}
                                className="pointer-events-none select-none"
                              />
                              Orders
                              <span
                                className={`absolute h-4 w-4 text-white bg-red-500 text-xs pointer-events-none select-none -mt-7 -mr-7 rounded-full ${
                                  patient.medicationlogs.length === 0
                                    ? "hidden"
                                    : ""
                                }`}
                              >
                                {patient.medicationlogs.length}
                              </span>
                            </div>

                            <div
                              className="h-full w-full flex flex-col border-[#F4F4F4] border-b-4 text-xs items-center justify-center  cursor-pointer"
                              onClick={() => {
                                setPatientUuid(patient.uuid);
                                isModalOpen(true);
                                setPatientName(
                                  `${patient.firstName} ${patient.lastName}`
                                );
                              }}
                            >
                              <img
                                src="/icons/chart-prn.svg"
                                alt="prn"
                                width={20}
                                className="pointer-events-none select-none"
                              />
                              PRN
                              {Object.entries(
                                getPRNCount(patient.medicationlogs)
                              ).map(([type, count]) => (
                                <span
                                  key={type}
                                  className={`absolute h-4 w-4 text-white bg-red-500 text-xs select-none pointer-events-none -mt-7 -mr-7 rounded-full ${
                                    count === 0 ? "hidden" : ""
                                  }`}
                                >
                                  {count}
                                </span>
                              ))}
                            </div>
                            <div className="h-full w-full flex flex-row border-[#F4F4F4] text-xs items-center gap-1 justify-center  cursor-pointer">
                              <div>
                                <img
                                  src="/icons/chart-status.svg"
                                  alt="status"
                                  width={15}
                                  className="pointer-events-none select-none"
                                />
                                A
                              </div>
                              <div>
                                <img
                                  src="/icons/chart-status.svg"
                                  alt="status"
                                  width={15}
                                  className="pointer-events-none select-none"
                                />
                                S
                              </div>
                              <div>
                                <img
                                  src="/icons/chart-status.svg"
                                  alt="status"
                                  width={15}
                                  className="pointer-events-none select-none"
                                />
                                D
                              </div>
                            </div>
                          </div>

                          <div className="h-full w-1/6 border-[#F4F4F4] border-l-2 border-solid flex justify-center items-center flex-col bg-[#007C851A]">
                            {patient.medicationlogs[0]?.medicationLogStatus ===
                              "pending" &&
                            patient.medicationlogs[0]?.medicationLogsTime <=
                              currentTime ? (
                              <div
                                className={`bg-[#FACC15] rounded-full p-1.5 ${
                                  patient.medicationlogs[0]
                                    ?.medicationLogStatus !== "pending"
                                    ? "hidden"
                                    : ""
                                }`}
                              >
                                <img
                                  src="icons/card-list.svg"
                                  alt="list"
                                  width={20}
                                  className="pointer-events-none select-none"
                                />

                                <div className=" h-full absolute -mt-6 ml-5 ">
                                  {patient.medicationlogs.filter(
                                    (log: {
                                      medicationLogStatus: string;
                                      medicationLogsTime: any;
                                    }) =>
                                      log.medicationLogStatus === "pending" &&
                                      log.medicationLogsTime <= currentTime
                                  ).length !== 0 && (
                                    <span className="absolute h-4 w-4  text-xs font-light rounded-full bg-red-600 text-white pointer-events-none select-none">
                                      {
                                        patient.medicationlogs.filter(
                                          (log: {
                                            medicationLogStatus: string;
                                            medicationLogsTime: any;
                                          }) =>
                                            log.medicationLogStatus ===
                                              "pending" &&
                                            log.medicationLogsTime <=
                                              currentTime
                                        ).length
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>

                        {/* timegraph */}
                        <div className="w-full  overflow-x-auto">
                          <div className="w-[320vh] h-full">
                            <div className=" relative z-10">
                              <div
                                ref={lineRef}
                                className="absolute w-1 bg-[#1B84FF] "
                                style={linePosition}
                              ></div>
                            </div>

                            <table
                              className="w-full time-graph-table h-full   "
                              style={{ tableLayout: "fixed" }}
                            >
                              <thead>
                                <tr className="max-h-[20px]">
                                  {colData.map((col, index) => (
                                    <th
                                      key={col.time}
                                      className={`text-lg text-center border-b font-light text-gray-500  border-x border-[#191D23]  border-opacity-60   h-12 max-h-[20px] ${
                                        index !== colData.length - 1
                                          ? "text-center border-solid  max-h-[20px]  text-nowrap text-ellipsis overflow-hidden"
                                          : ""
                                      }`}
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {col.name}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr key={index}>
                                  {colData.map((col) => {
                                    const logsInColumn =
                                      patient.medicationlogs.filter(
                                        (medLog: any) => {
                                          const medicationLogsTime = parseInt(
                                            medLog.medicationLogsTime.replace(
                                              ":",
                                              ""
                                            )
                                          );
                                          const colTime = parseInt(col.time);

                                          return (
                                            colTime <= medicationLogsTime &&
                                            medicationLogsTime < colTime + 100
                                          );
                                        }
                                      );
                                    const isLastColumn =
                                      index ===
                                      patientWithMedicationLogsToday.length - 1;
                                    return (
                                      <td
                                        key={`${index}_${col.time}`}
                                        className={`text-center border-x border-dashed max-h-[50px] border-black overflow text-nowrap text-ellipsis overflow-hidden  ${
                                          parseInt(col.time) <=
                                          parseInt(currentTime) - 100
                                            ? "bg-[#E4E4E4] "
                                            : "bg-white"
                                        }`}
                                        style={{ maxHeight: "50px" }} // Set fixed height for table cells
                                      >
                                        <div
                                          className={` h-full ${
                                            isLastColumn
                                              ? "border-b-[9px]"
                                              : "border-b-[10px]"
                                          }  border-solid border-[#F4F4F4] flex flex-col justify-center items-center`}
                                        >
                                          {logsInColumn.length >= 1 ? (
                                            <div className=" h-[100px] flex-col gap-2 text-ellipsis flex  justify-center items-center ">
                                              <HoverCard>
                                                <HoverCardTrigger>
                                                  <div className="flex">
                                                    <div className="cursor-pointer relative flex items-center justify-center">
                                                      {logsInColumn.some(
                                                        (log: {
                                                          medicationLogStatus: string;
                                                        }) =>
                                                          log.medicationLogStatus !==
                                                          "pending"
                                                      ) && (
                                                        <img
                                                          src="/icons/chart-done.svg"
                                                          alt="chart-done"
                                                          width={30}
                                                          className="pointer-events-none select-none"
                                                        />
                                                      )}{" "}
                                                      {/* Calculate the count of logs where status is not pending */}
                                                      {/* Render the count */}
                                                      {logsInColumn.filter(
                                                        (log: {
                                                          medicationLogStatus: string;
                                                        }) =>
                                                          log.medicationLogStatus !==
                                                          "pending"
                                                      ).length !== 0 && (
                                                        <span className="absolute h-4 w-4 -mt-10 pointer-events-none select-none -right-2 top-11 text-xs font-light rounded-full bg-red-600 text-white">
                                                          {
                                                            logsInColumn.filter(
                                                              (log: {
                                                                medicationLogStatus: string;
                                                              }) =>
                                                                log.medicationLogStatus !==
                                                                "pending"
                                                            ).length
                                                          }
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </HoverCardTrigger>
                                                {/* Conditionally render HoverCardContent if there are logs with status other than pending */}
                                                {logsInColumn.some(
                                                  (log: {
                                                    medicationLogStatus: string;
                                                  }) =>
                                                    log.medicationLogStatus !==
                                                    "pending"
                                                ) && (
                                                  <HoverCardContent>
                                                    {logsInColumn
                                                      .filter(
                                                        (log: {
                                                          medicationLogStatus: string;
                                                        }) =>
                                                          log.medicationLogStatus !==
                                                          "pending"
                                                      )
                                                      .map(
                                                        (
                                                          log: {
                                                            [
                                                              x: string
                                                            ]: ReactNode;
                                                            medicationLogsName:
                                                              | string
                                                              | number
                                                              | boolean
                                                              | React.ReactElement<
                                                                  any,
                                                                  | string
                                                                  | React.JSXElementConstructor<any>
                                                                >
                                                              | Iterable<React.ReactNode>
                                                              | React.ReactPortal
                                                              | React.PromiseLikeOfReactNode
                                                              | null
                                                              | undefined;
                                                            medicationType:
                                                              | string
                                                              | number
                                                              | boolean
                                                              | React.ReactElement<
                                                                  any,
                                                                  | string
                                                                  | React.JSXElementConstructor<any>
                                                                >
                                                              | Iterable<React.ReactNode>
                                                              | React.ReactPortal
                                                              | React.PromiseLikeOfReactNode
                                                              | null
                                                              | undefined;
                                                          },
                                                          logIndex:
                                                            | React.Key
                                                            | null
                                                            | undefined
                                                        ) => (
                                                          <div key={logIndex}>
                                                            {
                                                              log.medicationLogsName
                                                            }{" "}
                                                            -{" "}
                                                            {log.medicationType}{" "}
                                                            -{" "}
                                                            {
                                                              log.medicationLogStatus
                                                            }
                                                          </div>
                                                        )
                                                      )}
                                                  </HoverCardContent>
                                                )}
                                              </HoverCard>

                                              {/* FOR PENDING PRESCRIPTIONS */}

                                              {logsInColumn.filter(
                                                (log: {
                                                  medicationLogStatus: string;
                                                }) =>
                                                  log.medicationLogStatus ===
                                                  "pending"
                                              ).length !== 0 && (
                                                <HoverCard>
                                                  <HoverCardTrigger>
                                                    <div>
                                                      <div className="cursor-pointer relative flex items-center justify-center">
                                                        <img
                                                          src="/icons/chart-list.svg"
                                                          alt="list"
                                                          width={30}
                                                          className="pointer-events-none select-none"
                                                        />
                                                        {/* Calculate the count of logs where status is not pending */}
                                                        {/* Render the count */}
                                                        {logsInColumn.filter(
                                                          (log: {
                                                            medicationLogStatus: string;
                                                          }) =>
                                                            log.medicationLogStatus ===
                                                            "pending"
                                                        ).length !== 0 && (
                                                          <span className="absolute h-4 w-4 -mt-10 pointer-events-none select-none -right-2 top-11 text-xs font-light rounded-full bg-red-600 text-white">
                                                            {
                                                              logsInColumn.filter(
                                                                (log: {
                                                                  medicationLogStatus: string;
                                                                }) =>
                                                                  log.medicationLogStatus ===
                                                                  "pending"
                                                              ).length
                                                            }
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </HoverCardTrigger>
                                                  <HoverCardContent>
                                                    {logsInColumn
                                                      .filter(
                                                        (log: {
                                                          medicationLogStatus: string;
                                                        }) =>
                                                          log.medicationLogStatus ===
                                                          "pending"
                                                      )
                                                      .map(
                                                        (
                                                          log: {
                                                            [
                                                              x: string
                                                            ]: ReactNode;
                                                            medicationLogsName:
                                                              | string
                                                              | number
                                                              | boolean
                                                              | React.ReactElement<
                                                                  any,
                                                                  | string
                                                                  | React.JSXElementConstructor<any>
                                                                >
                                                              | Iterable<React.ReactNode>
                                                              | React.ReactPortal
                                                              | React.PromiseLikeOfReactNode
                                                              | null
                                                              | undefined;
                                                            medicationType:
                                                              | string
                                                              | number
                                                              | boolean
                                                              | React.ReactElement<
                                                                  any,
                                                                  | string
                                                                  | React.JSXElementConstructor<any>
                                                                >
                                                              | Iterable<React.ReactNode>
                                                              | React.ReactPortal
                                                              | React.PromiseLikeOfReactNode
                                                              | null
                                                              | undefined;
                                                          },
                                                          logIndex:
                                                            | React.Key
                                                            | null
                                                            | undefined
                                                        ) => (
                                                          <div key={logIndex}>
                                                            {
                                                              log.medicationLogsName
                                                            }{" "}
                                                            -{" "}
                                                            {log.medicationType}{" "}
                                                            -{" "}
                                                            {
                                                              log.medicationLogStatus
                                                            }
                                                          </div>
                                                        )
                                                      )}
                                                  </HoverCardContent>
                                                </HoverCard>
                                              )}
                                            </div>
                                          ) : (
                                            logsInColumn.map(
                                              (
                                                log: {
                                                  medicationLogStatus:
                                                    | string
                                                    | number
                                                    | boolean
                                                    | React.ReactElement<
                                                        any,
                                                        | string
                                                        | React.JSXElementConstructor<any>
                                                      >
                                                    | Iterable<React.ReactNode>
                                                    | React.PromiseLikeOfReactNode
                                                    | null
                                                    | undefined;
                                                  medicationLogsName:
                                                    | string
                                                    | number
                                                    | boolean
                                                    | React.ReactElement<
                                                        any,
                                                        | string
                                                        | React.JSXElementConstructor<any>
                                                      >
                                                    | Iterable<React.ReactNode>
                                                    | React.PromiseLikeOfReactNode
                                                    | null
                                                    | undefined;
                                                  medicationLogsTime: string;
                                                  medicationType:
                                                    | string
                                                    | number
                                                    | boolean
                                                    | React.ReactElement<
                                                        any,
                                                        | string
                                                        | React.JSXElementConstructor<any>
                                                      >
                                                    | Iterable<React.ReactNode>
                                                    | React.ReactPortal
                                                    | React.PromiseLikeOfReactNode
                                                    | null
                                                    | undefined;
                                                },
                                                logIndex:
                                                  | React.Key
                                                  | null
                                                  | undefined
                                              ) => (
                                                //For single prescription logs

                                                <HoverCard key={logIndex}>
                                                  <HoverCardTrigger>
                                                    <div
                                                      className="cursor-pointer max-h-[15px] relative flex items-center justify-center"
                                                      key={`${index}_${col.time}_${logIndex}`}
                                                    >
                                                      {log.medicationLogStatus ===
                                                      "pending" ? (
                                                        <span>
                                                          {
                                                            log.medicationLogsName
                                                          }
                                                        </span>
                                                      ) : (
                                                        <span>
                                                          <img
                                                            src="/icons/chart-done.svg"
                                                            alt="done"
                                                            width={50}
                                                            className="pointer-events-none select-none"
                                                            //
                                                          />
                                                        </span>
                                                      )}
                                                    </div>
                                                  </HoverCardTrigger>
                                                  <HoverCardContent>
                                                    {log.medicationLogsName}
                                                    <br />
                                                    {formatTime(
                                                      log.medicationLogsTime
                                                    )}
                                                    <br />
                                                    {log.medicationLogStatus}
                                                    <br />
                                                    {log.medicationType}
                                                  </HoverCardContent>
                                                </HoverCard>
                                              )
                                            )
                                          )}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <PRNMedModal
          isModalOpen={isModalOpen}
          uuid={patientUuid}
          name={patientName}
          setIsUpdated={""}
          isOpen={isOpen}
          isEdit={isEdit}
          PRNData={PRNData}
          label="sample label"
          onSuccess={onSuccess}
          onFailed={onFailed}
          setErrorMessage={setError}
        />
      )}
    </div>
  );
}
