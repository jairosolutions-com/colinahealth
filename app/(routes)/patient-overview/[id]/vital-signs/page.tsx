"use client";
import Image from "next/image";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchVitalSignsByPatient } from "@/app/api/vital-sign-api/vital-sign-api";
import { SuccessModal } from "@/components/shared/success";
import Modal from "@/components/reusable/modal";
import { VitalModalContent } from "@/components/modal-content/vital-modal-content";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
export default function vitalsigns() {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState("createdAt");
  const [pageNumber, setPageNumber] = useState("");
  const [patientVitalSign, setPatientVitalSign] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalVitalSigns, setTotalVitalSigns] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vitalSignData, setVitalSignData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  interface Modalprops {
    label: string;
    isOpen: boolean;
    isModalOpen: (isOpen: boolean) => void;
  }
  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setVitalSignData([]);
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

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const patientId = params.id.toUpperCase();

  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    setIsOpenOrderedBy(false);
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };
  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("createdAt");
    } else if (option === "Status") {
      setSortBy("bloodPressure");
    } else {
      setSortBy("heartRate");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Blood Pressure", onClick: handleSortOptionClick },
    { label: "Heart Rate", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

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
  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchVitalSignsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router,
        );
        setPatientVitalSign(response.data);
        setTotalPages(response.totalPages);
        setTotalVitalSigns(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  console.log(patientVitalSign, "patientVitalSign");

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container flex h-full w-full items-center justify-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <p className="p-title">Vital Signs</p>

            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalVitalSigns} Vital Signs
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={22} height={22} />
              <p className="text-[18px]">Add</p>
            </button>
            <button className="btn-pdfs gap-2">
              <Image
                src="/imgs/downloadpdf.svg"
                alt=""
                width={22}
                height={22}
              />
              <p className="text-[18px]">Download PDF</p>
            </button>
          </div>
        </div>

        <div className="w-full items-center sm:rounded-lg">
          <div className="flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative m-5 h-[47px] w-[573px] rounded bg-[#fff] bg-[573px] bg-[calc(100%-20px)] bg-[center] bg-no-repeat px-5 py-3 pl-10 pt-[14px] text-[15px] outline-none ring-[1px] ring-[#E7EAEE]"
                  type="text"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Image
                  src="/svgs/search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="pointer-events-none absolute left-8 top-9"
                />
              </div>
            </form>

            <div className="mr-3 flex w-full items-center justify-end gap-[12px]">
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
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
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
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
        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="h-[70px] border-y text-[15px] font-semibold text-[#64748B]">
                <td className="px-6 py-3">VITAL SIGN ID</td>
                <td className="px-6 py-3">DATE</td>
                <td className="px-6 py-3">TIME</td>
                <td className="px-6 py-3">BP (mmHg)</td>
                <td className="px-6 py-3">HR (bpm)</td>
                <td className="px-6 py-3">TEMP (°F)</td>
                <td className="px-6 py-3">RESP (brtds/min)</td>
                <td className="px-6 py-3 text-center">ACTION</td>
                <td className="w-[14px]"></td>
              </tr>
            </thead>

            <tbody className="h-[220px] overflow-y-scroll">
              {patientVitalSign.length == 0 && (
                <div className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                  <p className="text-center text-[15px] font-normal text-gray-700">
                    No Vital Sign/s <br />
                  </p>
                </div>
              )}
              {patientVitalSign.map((vitalSign, index) => (
                <tr
                  key={index}
                  className="group border-b text-[15px] odd:bg-white hover:bg-[#f4f4f4]"
                >
                  <td className="px-6 py-3">
                    <ResuableTooltip text={vitalSign.vitalsign_uuid} />
                  </td>
                  <td className="px-6 py-3">
                    {formatDate(vitalSign.vitalsign_date)}
                  </td>
                  <td className="px-6 py-3">
                    {formatTime(vitalSign.vitalsign_time)}
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip
                      text={`${vitalSign.vitalsign_bloodPressure}mmHg`}
                    />
                  </td>
                  <td className="px-6 py-3">
                    {vitalSign.vitalsign_heartRate}bpm
                  </td>
                  <td className="px-6 py-3">
                    {vitalSign.vitalsign_temperature}°F
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip
                      text={`${vitalSign.vitalsign_respiratoryRate}breaths/min`}
                    />
                  </td>

                  <td className="flex justify-center px-6 py-3">
                    <p
                      onClick={() => {
                        isModalOpen(true);
                        setIsEdit(true);
                        setVitalSignData(vitalSign);
                      }}
                    >
                      <Edit></Edit>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* END OF TABLE */}
      </div>

      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setCurrentPage={setCurrentPage}
      />
      {isOpen && (
        <Modal
          content={
            <VitalModalContent
              isModalOpen={isModalOpen}
              isEdit={isEdit}
              isOpen={isOpen}
              label="sample label"
              vitalSignData={vitalSignData}
              onSuccess={onSuccess}
              setIsUpdated={setIsUpdated}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
    </div>
  );
}
