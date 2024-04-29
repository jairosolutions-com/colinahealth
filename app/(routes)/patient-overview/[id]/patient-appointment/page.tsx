"use client";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import View from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { AppointmentsModal } from "@/components/modals/appointments.modal";
import { fetchAppointmentsByPatient as fetchAppointmentsByPatient } from "@/app/api/appointments-api/appointments.api";
import { AppointmentviewModalContent } from "@/components/modal-content/appointmentview-modal-content";
import Modal from "@/components/reusable/modal";
import { AppointmentModalContent } from "@/components/modal-content/appointment-modal-content";
const Appointment = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEdit, setIsView] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const formatDate = (createdAt: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(createdAt);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
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
  const [error, setError] = useState<string | null>(null);
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
  const [appointmentData, setAppointmentData] = useState<any[]>([]);

  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState("appointmentDate");
  const [pageNumber, setPageNumber] = useState("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalAppointments, setTotalAppointments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
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
  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("appointmentDate");
    } else if (option === "Time") {
      setSortBy("appointmentTime");
    } else {
      setSortBy("appointmentStatus");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Status", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function
  const [gotoError, setGotoError] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`flex ring-1 ring-gray-300 items-center justify-center  w-[49px]  ${
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
  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsView(false);
      setAppointmentData([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAppointmentsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );

        //convert date to ISO string

        setPatientAppointments(response.data);
        console.log("Patient list after setting state:", response.data);
        setTotalPages(response.totalPages);
        setTotalAppointments(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isOpen]);
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full justify-between flex mb-2">
        <div className="flex-row">
          <p className="p-title">Appointment</p>

          <div>
            <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] ">
              Total of {totalAppointments} Appointments
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
            <img src="/imgs/add.svg" alt="" />
            <p className="text-[18px]">Add</p>
          </button>
          <button className="btn-pdfs gap-2">
            <img src="/imgs/downloadpdf.svg" alt="" />
            <p className="text-[18px]">Download PDF</p>
          </button>
        </div>
      </div>

      <div className="w-full m:rounded-lg items-center">
        <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px]">
          <form className="mr-5 relative">
            {/* search bar */}
            <label className=""></label>
            <div className="flex">
              <input
                className="py-3 px-5 m-5 w-[573px] outline-none h-[47px] pt-[14px] ring-[1px] ring-[#E7EAEE] text-[15px] rounded pl-10 relative bg-[#fff] bg-no-repeat"
                type="text"
                placeholder="Search by reference no. or name..."
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <img
                src="/svgs/search.svg"
                alt="Search"
                width="20"
                height="20"
                className="absolute left-8 top-9 pointer-events-none"
              />
            </div>
          </form>

          <div className="flex w-full justify-end items-center gap-[12px] mr-3">
            <p className="text-[#191D23] opacity-[60%] font-semibold text-[15px]">
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
        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="uppercase text-[#64748B] border-y text-[15px] h-[70px] font-semibold">
                <th className="px-6 py-3 ">STATUS</th>
                <th className="px-6 py-3 ">DATE</th>
                <th className="px-6 py-3 ">TIME</th>
                <th className="px-4 py-3 ">END TIME</th>
                <th className="px-4 py-3 ">DETAILS</th>
                <th className="px-24 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="h-[220px]">
              {patientAppointments.length === 0 && (
                <tr>
                  <td className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                    <p className="font-semibold text-gray-700 text-center text-[15px]">
                      No Appointment/s <br />
                    </p>
                  </td>
                </tr>
              )}
              {patientAppointments.length > 0 && (
                <>
                  {patientAppointments.map((appointments, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white  even:bg-gray-50  border-b hover:bg-[#f4f4f4] group"
                    >
                      <td className="text-15px me-1 px-6 py-5 rounded-full flex items-center">
                        <div
                          className={`px-2 font-semibold rounded-[20px] relative flex items-center ${
                            appointments.appointments_appointmentStatus ===
                            "Scheduled"
                              ? "bg-[#dfffea] text-[#17C653] text-[15px]" // Green color for Scheduled
                              : appointments.appointments_appointmentStatus ===
                                "Done"
                              ? "bg-[#E7EAEE] text-[#3C3C3C] text-[15px]" // Dark color for Done
                              : appointments.appointments_appointmentStatus ===
                                  "Patient-IN" ||
                                appointments.appointments_appointmentStatus ===
                                  "On-going"
                              ? "bg-[#FFFCDB] text-[#E0BD03] text-[15px]" // Yellow for On Going
                              : appointments.appointments_appointmentStatus ===
                                  "Missed" ||
                                appointments.appointments_appointmentStatus ===
                                  "Cancelled"
                              ? "bg-[#FEE9E9] text-[#EF4C6A] text-[15px]" // Red color for Missed and Cancelled
                              : ""
                          }`}
                        >
                          <span
                            className={`inline-block h-2 w-2 rounded-full mr-1 ${
                              appointments.appointments_appointmentStatus ===
                              "Scheduled"
                                ? "bg-green-500" // Green color for Scheduled
                                : appointments.appointments_appointmentStatus ===
                                  "Done"
                                ? "bg-[#E7EAEE]" // Dark color for Done
                                : appointments.appointments_appointmentStatus ===
                                    "Patient-IN" ||
                                  appointments.appointments_appointmentStatus ===
                                    "On-going"
                                ? "bg-[#E0BD03]" // Yellow for On Going
                                : appointments.appointments_appointmentStatus ===
                                    "Missed" ||
                                  appointments.appointments_appointmentStatus ===
                                    "Cancelled"
                                ? "bg-[#EF4C6A]" // Red color for Missed and Cancelled
                                : ""
                            }`}
                          ></span>
                          {appointments.appointments_appointmentStatus}
                        </div>
                      </td>

                      <td className="px-6 py-3 text-[15px]">
                        {formatDate(appointments.appointments_appointmentDate)}
                      </td>
                      <td className="px-6 py-3 text-[15px]">
                        {formatTime(appointments.appointments_appointmentTime)}
                      </td>
                      <td className="px-6 py-3 text-[15px]">
                        {formatTime(
                          appointments.appointments_appointmentEndTime
                        )}
                      </td>
                      <td className="px-6 py-3 text-[15px]">
                        {appointments.appointments_details}
                      </td>
                      <td className="px-[90px] py-3 items-center">
                        <p
                          onClick={() => {
                            isModalOpen(true);
                            setIsView(true);
                            setAppointmentData(appointments);
                          }}
                        >
                          <View></View>
                        </p>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* END OF TABLE */}
      </div>
      {/* pagination */}
      {totalPages <= 1 ? (
        <div></div>
      ) : (
        <div className="mt-5 pb-5">
          <div className="flex justify-between">
            <p className="font-medium size-[18px] text-[15px] w-[138px] items-center">
              Page {currentPage} of {totalPages}
            </p>
            <div>
              <nav>
                <div className="flex text-[15px] ">
                  <div className="flex">
                    <button
                      onClick={goToPreviousPage}
                      className="flex ring-1 text-[15px] ring-gray-300 items-center justify-center  w-[77px] h-full"
                    >
                      Prev
                    </button>

                    {renderPageNumbers()}

                    <button
                      onClick={goToNextPage}
                      className="flex ring-1 text-[15px] ring-gray-300 items-center justify-center  w-[77px] h-full"
                    >
                      Next
                    </button>
                  </div>
                  <form onSubmit={handleGoToPage}>
                    <div className="flex pl-4 ">
                      <input
                        className={`ipt-pagination appearance-none  text-center ring-1 ${
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
                      <div className="">
                        <button
                          type="submit"
                          className="btn-pagination ring-1 ring-[#007C85]"
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
      {isOpen && (
        <Modal
          content={
            <AppointmentModalContent
              isModalOpen={isModalOpen}
              isOpen={isOpen}
              isView={isEdit}
              appointmentData={appointmentData}
              label="sample label"
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default Appointment;
