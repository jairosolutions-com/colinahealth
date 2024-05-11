"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { fetchUpcomingAppointments } from "@/app/api/appointments-api/upcoming-appointments-api";
import { ToastAction } from "@radix-ui/react-toast";

const DBUpcomingAppointments = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [term, setTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [upcomingSortBy, setUpcomingSortBy] = useState("appointmentDate");
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

  console.log(upcomingAppointments, "upcomingAppointments");
  return (
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
  );
};

export default DBUpcomingAppointments;
