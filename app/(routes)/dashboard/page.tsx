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
import NurseDrawer from "@/components/nurse-drawer";
import { SuccessModal } from "@/components/shared/success";

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
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);
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
          3,
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
          3,
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
      <div className="justify-center h-full items-center mx-[154px] mt-[90px] overflow-hidden">
        <div className="w-full flex justify-between items-center">
          <div className="w-full">
            <p className="p-title select-none mb-1">WELCOME TO DASHBOARD!</p>
            <div className="font-bold text-[15px] flex mb-4 select-none">
              Hey Alexa Dramos -
              <p className="font-normal text-[15px] pl-1 text-[#71717A] select-none">
                here's what's happening with your clinic today!
              </p>
            </div>
          </div>
          <NurseDrawer setIsSuccessOpen={setIsSuccessOpen} />
        </div>

        <div className="w-full h-full flex gap-5">
          <div className="w-4/6 flex flex-col justify-between gap-3">
            <div className="h-4/6 bg-red-200 w-full flex gap-3">
              <div className="w-1/2 flex flex-col  gap-3">
                <div className="h-3/4 bg-slate-300"></div>
                <div className="h-1/4 bg-yellow-400"></div>
              </div>
              <div className="w-1/2 flex flex-col gap-3">
                <div className="h-2/6 bg-orange-400"></div>
                <div className="h-2/6 bg-violet-500"></div>
                <div className="h-2/6 bg-pink-600"></div>
              </div>
            </div>
            <div className="h-2/6  w-full flex gap-3">
              <div className="w-1/2 bg-blue-500"></div>
              <div className="w-1/2 bg-green-500"></div>
            </div>
          </div>
          <div className="w-2/6 h-full flex flex-col gap-3">
            {/* {/ Start of Due Medications /} */}
            <div className="w-full border-[1px] border-[#E4E4E7] py-3 select-none px-5 bg-white">
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
                      className="w-full flex flex-row h-[70px] mb-1 hover:bg-slate-100 cursor-pointer justify-between"
                    >
                      <div className="flex w-3/4">
                        <div className="flex mr-3 items-center ">
                          <Image
                            className="rounded-full"
                            src="/imgs/drake.png"
                            width={45}
                            height={45}
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
                      </div>
                      <div className="w-1/4  flex flex-col justify-center items-end text-end gap-1">
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
                className="group flex w-fit cursor-pointer items-center hover:text-[#007C85] font-semibold text-[15px] text-[#71717A] mt-3"
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
            {/* {/ End of Due Medications /} */}
            {/* {/ Start of Upcoming Appointments /} */}
            <div className="w-full border-[1px] border-[#E4E4E7] py-3 select-none px-5 bg-white">
              <div className="">
                <p className="p-title pt-2">
                  Upcoming Appointment
                  <span>{upcomingAppointments.length > 1 ? "s" : ""}</span>
                </p>
                <p className="font-normal text-[15px] text-[#71717A] pt-3 mb-3">
                  Total of {totalUpcoming} upcoming appointment
                  <span>{upcomingAppointments.length > 1 ? "s" : ""}</span>
                </p>
              </div>
              {upcomingAppointments.length > 0 ? (
                <div>
                  {upcomingAppointments.map((upcomingAppointment, index) => (
                    <div
                      key={index}
                      className="w-full flex flex-row h-[70px] mb-1 hover:bg-slate-100 cursor-pointer justify-between"
                    >
                      <div className="flex w-3/4">
                        <div className="flex mr-3 items-center ">
                          <Image
                            className="rounded-full"
                            src="/imgs/drake.png"
                            width={45}
                            height={45}
                            alt="picture"
                          />
                        </div>
                        <div className="flex w-4/6">
                          <div className="flex flex-col justify-center gap-1">
                            <p className="font-bold text-[15px] truncate ">
                              {upcomingAppointment.patient_firstName}{" "}
                              {upcomingAppointment.patient_middleName}{" "}
                              {upcomingAppointment.patient_lastName}
                            </p>
                            <p className="text-[#E4B90E] font-normal text-[15px]">
                              Pending
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/4  flex flex-col justify-center items-end text-end gap-1">
                        <p className="font-semibold text-[15px] flex">
                          {upcomingAppointment.appointments_appointmentDate}
                        </p>
                        <p className="text-[#71717A] font-medium text-[15px] ml-4">
                          {formatTime(
                            upcomingAppointment.appointments_appointmentTime
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
                className="group flex w-fit cursor-pointer items-center hover:text-[#007C85] font-semibold text-[15px] text-[#71717A] mt-3"
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
            {/* /* / End of Upcoming Appointments / */}
          </div>
        </div>
      </div>
      {isSuccessOpen && (
        <SuccessModal
          label={""}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={""}
          setIsUpdated={""}
        />
      )}
    </div>
  );
};

export default Dashboard;
