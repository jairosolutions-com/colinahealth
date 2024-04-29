"use client";

import { searchPatientList } from "@/app/api/patients-api/patientList.api";
import DropdownMenu from "@/components/dropdown-menu";
import Edit from "@/components/shared/buttons/view";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DemographicModal } from "@/components/modals/demographic.modal";
import { ErrorModal } from "@/components/shared/error";
import { SuccessModal } from "@/components/shared/success";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import { AppointmentsModal } from "@/components/modals/appointments.modal";
import { fetchUpcomingAppointments } from "@/app/api/appointments-api/upcoming-appointments-api";
import Image from "next/image";
import * as React from "react";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchAllAppointments } from "@/app/api/appointments-api/fetch-all-appointments.api";

export default function AppointmentPage() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }

  if (!getAccessToken()) {
    router.replace("/login");
  }

  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);

  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortBy, setSortBy] = useState("appointmentDate");
  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [patientIdappointmentList, setPatientId] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [totalUpcoming, setTotalUpcoming] = useState(0);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(0);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
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
  const startD = startDate
    ? startDate.toISOString().slice(0, 10)
    : "2021-01-01";
  const endD = endDate ? endDate.toISOString().slice(0, 10) : "2300-01-01";
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const isEdit = false;
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "Status") {
      setSortBy("appointmentStatus");
    } else if (option == "Date") {
      setSortBy("appointmentDate");
    } else if (option == "Time") {
      setSortBy("appointmentTime");
    } else if (option == "Endtime") {
      setSortBy("appointmentEndTime");
    }
    console.log(sortBy, "ooption");
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Status", onClick: handleSortOptionClick },
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Endtime", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upcomingAppoinments = await fetchAllAppointments(
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          startD,
          endD,
          router
        );

        const appointmentsArray = Object.values(upcomingAppoinments.data);
        setTotalPages(upcomingAppoinments.totalPages);
        setAppointmentList(appointmentsArray);
        setTotalAppointments(upcomingAppoinments.totalCount);
        setIsLoading(false);
        return upcomingAppoinments;
      } catch (error) {}
    };
    fetchData();
  }, [currentPage, startDate, endDate, sortBy, sortOrder, term]);

  // const handlePatientClick = (patientId: any) => {
  //   const lowercasePatientId = patientId.toLowerCase();
  //   setIsLoading(true);
  //   onNavigate(
  //     router,
  //     `/patient-overview/${lowercasePatientId}/medical-history/allergies`
  //   );
  // };
  console.log(startD, "startDate");
  console.log(appointmentList, "appointmentList");
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }

  const onSuccess = () => {
    setIsSuccessOpen(true);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
  };

  return (
    <div className="w-full px-[150px] pt-[90px]">
      <div className="flex justify-end">
        <p
          onClick={() => router.push("/dashboard")}
          className="text-[#64748B] underline cursor-pointer text-[15px]"
        >
          Back to Dashboard
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col mb-3">
          <p className="p-title">Appointments List Records</p>

          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[15px]">
            Total of {totalAppointments} Appointments
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <DownloadPDF></DownloadPDF>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full bg-[#F4F4F4] justify-between items-center flex px-5 h-[75px] rounded-sm gap-5">
          <div className="flex items-center bg-white rounded-sm border border-gray-300 shadow-sm px-4 py-2 h-[47px] w-[460px]">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by reference no. or name..."
              className="flex-grow focus:outline-none text-gray-700"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-[500px]">
            <div className="flex w-full justify-end items-center gap-3">
              <p>Filter Date</p>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[166px] justify-start text-left font-normal h-[47px] rounded-[5px]",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>From</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[166px] justify-start text-left font-normal h-[47px] rounded-[5px] *:",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>To</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="w-[500px]">
            <div className="w-full justify-end items-center flex gap-3">
              <p className="flex text-[#191D23] opacity-[60%] font-semibold">
                Order by
              </p>
              <DropdownMenu
                options={optionsOrderedBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                  },
                }))}
                open={isOpenOrderedBy}
                width={"165px"}
                label={"Select"}
              />
              <p className="text-[#191D23] opacity-[60%] font-semibold text-[15px]">
                Sort by
              </p>
              <DropdownMenu
                options={optionsSortBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                    console.log("label", label);
                  },
                }))}
                open={isOpenSortedBy}
                width={"165px"}
                label={"Select"}
              />
            </div>
          </div>
        </div>

        <div>
          <table className="w-full h-full justify-center items-start text-[15px]">
            <thead className="text-left rtl:text-right">
              <tr className="uppercase font-semibold text-[#64748B] border-b border-[#E7EAEE] h-[70px]">
                <td className="px-6 py-5 ">Name</td>
                <td className="px-6 py-5 ">Appointment UID</td>
                <td className="px-6 py-5 ">Date</td>
                <td className="px-6 py-5 ">Time</td>
                <td className="px-6 py-5 ">End time</td>
                <td className="px-6 py-5  flex justify-start">Status</td>
              </tr>
            </thead>
            <tbody>
              {appointmentList.length === 0 && (
                <tr>
                  <td className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                    <p className="text-[15px] font-normal text-gray-700 flex text-center">
                      No Appointments Found! <br />
                    </p>
                  </td>
                </tr>
              )}
              {appointmentList.map((appointment, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-[#f4f4f4] group border-b "
                >
                  <td className="px-6 py-5 flex items-center">
                    <Image
                      className="rounded-full mr-2 "
                      src="/imgs/dennis.svg"
                      alt="Icon"
                      width={45}
                      height={45}
                    />
                    <span>
                      {appointment.patient_firstName} {""}
                      {appointment.patient_lastName}
                    </span>
                  </td>
                  <td className="px-6 py-5 ">
                    {appointment.appointments_uuid}
                  </td>
                  <td className="px-6 py-5">
                    {appointment.appointments_appointmentDate}
                  </td>
                  <td className="px-6 py-5 ">
                    {appointment.appointments_appointmentTime}
                  </td>
                  <td className=" px-6 py-5">
                    {appointment.appointments_appointmentEndTime}
                  </td>

                  <td className="text-15px text-nowrap  px-6 py-5 rounded-full">
                    <div
                      className={`px-2 font-semibold rounded-[20px] relative flex items-center w-fit ${
                        appointment.appointments_appointmentStatus ===
                        "Scheduled"
                          ? "bg-[#dfffea] text-[#17C653]" // Green color for Scheduled
                          : appointment.appointments_appointmentStatus ===
                            "Done"
                          ? "bg-[#E7EAEE] text-[#71717A]" // Dark color for Done
                          : appointment.appointments_appointmentStatus ===
                              "Patient-IN" ||
                            appointment.appointments_appointmentStatus ===
                              "On-going"
                          ? "bg-[#FFFCDB] text-[#E0BD03]" // Yellow for On Going
                          : appointment.appointments_appointmentStatus ===
                            "Missed"
                          ? "bg-[#FEE9E9] text-[#EF4C6A]" // Red color for Missed
                          : appointment.appointments_appointmentStatus ===
                            "Cancelled"
                          ? "bg-[#FEE9E9] text-[#EF4C6A]" // Red color for Cancelled
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-block h-2 w-2 rounded-full mr-1 ${
                          appointment.appointments_appointmentStatus ===
                          "Scheduled"
                            ? "bg-green-500" // Green color for Scheduled
                            : appointment.appointments_appointmentStatus ===
                              "Done"
                            ? "bg-[#7E7E7E]" // Dark color for Done
                            : appointment.appointments_appointmentStatus ===
                                "Patient-IN" ||
                              appointment.appointments_appointmentStatus ===
                                "On-going"
                            ? "bg-[#E0BD03]" // Yellow for On Going
                            : appointment.appointments_appointmentStatus ===
                                "Missed" ||
                              appointment.appointments_appointmentStatus ===
                                "Cancelled"
                            ? "bg-[#EF4C6A]" // Red color for Missed and Cancelled
                            : ""
                        }`}
                      ></span>
                      {appointment.appointments_appointmentStatus} Appointment
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages <= 1 ? (
        <div></div>
      ) : (
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="font-medium text-[15px] w-[138px] items-center">
              Page {currentPage} of {totalPages}
            </p>
            <div>
              <nav>
                <div className="flex -space-x-px text-[15px]">
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
                        <button type="submit" className="btn-pagination ">
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
      {isOpen && (
        <AppointmentsModal
          isModalOpen={isModalOpen}
          isOpen={isOpen}
          label="sample label"
          isView={false}
          appointmentData={appointmentList}
        />
      )}
      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          setIsUpdated=""
          isUpdated=""
        />
      )}
      {isErrorOpen && (
        <ErrorModal
          label="Patient already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
}
