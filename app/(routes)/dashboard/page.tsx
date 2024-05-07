"use client";

import Image from "next/image";
import { onNavigate } from "@/actions/navigation";
import { fetchUpcomingAppointments } from "@/app/api/appointments-api/upcoming-appointments-api";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { ToastAction } from "@/components/ui/toast";
import { Edit, View } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const router = useRouter();
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

  const { toast } = useToast();
  const [term, setTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dueMedSortBy, setDueMedSortBy] = useState(
    "medicationlogs.medicationLogsTime"
  );
  const [upcomingSortBy, setUpcomingSortBy] = useState("appointmentDate");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [dueMedicationList, setDueMedicationList] = useState<
    {
      patient_uuid: string;
      medicationlogs_medicationLogsName: string;
      patient_firstName: string;
      patient_lastName: string;
      patient_middleName: string;
      medicationlogs_medicationLogsDate: string;
      medicationlogs_medicationLogsTime: string;
    }[]
  >([]);
  const [dueMedTotalPages, setDueMedTotalPages] = useState(0);
  const [totalDueMedication, setTotalDueMedication] = useState(0);

  const [upcomingAppointments, setUpcomingAppointments] = useState<
    {
      patient_firstName: string;
      patient_middleName: string;
      patient_lastName: string;
      appointments_appointmentDate: string;
      appointments_appointmentEndTime: string;
      appointments_appointmentTime: string;
    }[]
  >([]);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(0);
  const [totalUpcoming, setTotalUpcoming] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dueMedicationList = await fetchDueMedication(
          term,
          currentPage,
          dueMedSortBy,
          sortOrder as "ASC" | "DESC",
          router
        );

        // Filter data by distinct medicationLogsName for each patient
        const filteredData = dueMedicationList.data.reduce(
          (
            acc: { [key: string]: any },
            currentItem: {
              patient_uuid: string;
              medicationlogs_medicationLogsName: string;
            }
          ) => {
            const key = `${currentItem.patient_uuid}-${currentItem.medicationlogs_medicationLogsName}`;
            if (!acc[key]) {
              acc[key] = currentItem;
            }
            return acc;
          },
          {}
        );

        const filteredArray: {
          patient_uuid: string;
          medicationlogs_medicationLogsName: string;
          patient_firstName: string;
          patient_lastName: string;
          patient_middleName: string;
          medicationlogs_medicationLogsDate: string;
          medicationlogs_medicationLogsTime: string;
        }[] = Object.values(filteredData);
        const limitedArray = filteredArray.slice(0, 5);

        setDueMedicationList(limitedArray);
        setDueMedTotalPages(dueMedicationList.totalPages);
        setTotalDueMedication(dueMedicationList.totalCount);
        setIsLoading(false);
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upcomingAppoinments = await fetchUpcomingAppointments(
          term,
          currentPage,
          upcomingSortBy,
          sortOrder as "ASC" | "DESC",
          router
        );
        setUpcomingAppointments(upcomingAppoinments.data);
        setTotalUpcoming(upcomingAppoinments.totalCount);
        setUpcomingTotalPages(upcomingAppoinments.totalPages);
        setIsLoading2(false);
      } catch (error: any) {
        setError(error.message);
        console.log("error");
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
  }, [currentPage]);

  console.log(upcomingAppointments, "upcomingAppointments");
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
  const formatDate = (dateOfSurgery: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(dateOfSurgery);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };

  console.log(dueMedicationList, "dueMedicationList");

  if (isLoading || isLoading2) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          width={100}
          height={100}
          alt="logo"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="justify-center items-center mx-[154px] mt-[90px] overflow-hidden">
        <div className="w-full">
          <p className="p-title select-none mb-1">WELCOME TO DASHBOARD!</p>
          <div className="font-bold text-[15px] flex mb-4 select-none">
            Hey Alexa Dramos -
            <p className="font-normal text-[15px] pl-1 text-[#71717A] select-none">
              here's what's happening with your clinic today!
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-[28px]">
          {/* {/ Start of Upcoming Appointments /} */}

          <div className="w-[930px] min-w-max-[930px] max-h-[670px] ">
            <div className="border-x-[1px] border-t-[1px] h-[95px] px-18 pt-3">
              <p className="p-title mx-[30px] pt-2">
                Upcoming Appointment
                <span>{upcomingAppointments.length > 1 ? "s" : ""}</span>
              </p>
              <p className="font-normal text-[15px] text-[#71717A] mx-[30px] pt-3">
                Total of {totalUpcoming} upcoming appointment
                <span>{upcomingAppointments.length > 1 ? "s" : ""}</span>
              </p>
            </div>
            {/* {/ content /} */}
            <div className="border-t-0 border-[1px]">
              <div className="divide-y">
                {upcomingAppointments.length > 0 ? (
                  <div>
                    {upcomingAppointments.map((upcomingAppointment, index) => (
                      <div
                        key={index}
                        className="h-[95px] flex justify-evenly items-center hover:bg-slate-50 px-4 min-w-max"
                      >
                        <div className="flex bg-[#FEF9C3] px-2 me-2 py-0.5 items-center rounded-[30px]">
                          <p className="text-[#FACC15] text-[15px] mr-2">●</p>
                          <span className="pr-1 text-[#713F12] font-semibold text-[15px]">
                            Pending
                          </span>
                        </div>
                        <p className="font-bold w-1/4 truncate hover:ho hover:text-wrap text-[15px]">
                          {upcomingAppointment.patient_firstName}{" "}
                          {upcomingAppointment.patient_middleName}{" "}
                          {upcomingAppointment.patient_lastName}
                        </p>
                        <div className=" items-center flex flex-col w-1/4">
                          <p className="font-bold text-[15px]">
                            {upcomingAppointment.appointments_appointmentDate}
                          </p>
                        </div>
                        <p className="text-[#71717A] font-medium text-[15px] w-1/4 text-center">
                          {formatTime(
                            upcomingAppointment.appointments_appointmentTime
                          )}
                          -
                          {formatTime(
                            upcomingAppointment.appointments_appointmentEndTime
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex mt-10 items-center text-center justify-center font-semibold text-3xl w-full h-full ">
                    No Upcoming Appointments/s
                    <br />
                  </div>
                )}
              </div>
            </div>
            {/* {/ content /} */}
          </div>
          {/* {/ End of Upcoming Appointments /}
      {/ Start of Due Medications /} */}
          <div className="w-[621px]  border-[1px] border-[#E4E4E7] py-3 select-none px-[40px]">
            <div className="">
              <p className="p-title pt-2">
                Due Medication
                <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
              </p>
              <p className="font-normal text-[15px] text-[#71717A] pt-3 mb-3">
                Total of {totalDueMedication} due medication
                <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
              </p>
            </div>
            {dueMedicationList.length > 0 ? (
              <div>
                {dueMedicationList.map((dueMedication, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-row h-[75px] mb-1 hover:bg-slate-100 cursor-pointer"
                  >
                    <div className="flex w-1/6 items-center ">
                      <Image
                        className="rounded-full"
                        src="/imgs/drake.png"
                        width={58}
                        height={58}
                        alt="picture"
                      />
                    </div>
                    <div className="flex w-4/6">
                      <div className="flex flex-col justify-center gap-1">
                        <p className="font-bold text-[15px] truncate hover:text-wrap">
                          {dueMedication.patient_firstName}{" "}
                          {dueMedication.patient_middleName}{" "}
                          {dueMedication.patient_lastName}
                        </p>
                        <p className="text-[#71717A] font-normal text-[15px]">
                          {dueMedication.medicationlogs_medicationLogsName}
                        </p>
                      </div>
                    </div>
                    <div className="w-1/6  flex flex-col justify-center items-start gap-1">
                      <p className="font-semibold text-[15px] flex">
                        {dueMedication.medicationlogs_medicationLogsDate}
                      </p>
                      <p className="text-[#71717A] font-medium text-[15px] ml-4">
                        {formatTime(
                          dueMedication.medicationlogs_medicationLogsTime
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center text-center justify-center font-normal text-[15px] w-full h-full -mt-10">
                No Due Medication/s
                <br />
              </div>
            )}

            <div
              onClick={() => {
                setIsLoading(true);
                onNavigate(router, "/due-medications");
              }}
              className="group flex w-fit cursor-pointer items-center hover:text-[#007C85] font-semibold text-[15px] text-[#71717A] py-[40px]"
            >
              SEE ALL DUE
              <svg
                className="text-[#71717A] ml-2 group-hover:text-[#007C85]"
                width="17"
                height="14"
                viewBox="0 0 10 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.14795 2.15826L8.7739 8.78421L2.14795 15.4102"
                  stroke="currentColor"
                  strokeWidth="2.43402"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {/* End of Due Medications */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
