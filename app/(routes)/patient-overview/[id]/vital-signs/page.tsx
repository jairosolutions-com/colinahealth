"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { VitalSignModal } from "@/components/modals/vitalsign.modal";
import { fetchVitalSignsByPatient } from "@/app/api/vital-sign-api/vital-sign-api";
import { SuccessModal } from "@/components/shared/success";

export default function vitalsigns() {
  const router = useRouter();
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
      document.body.style.overflow = "scroll";
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
        const response = await fetchVitalSignsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
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

  return (
    <div className="  w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="p-title">Vital Signs</h1>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] mb-4 ">
            Total of {totalVitalSigns} Vital Sign/s
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <div className="flex flex-row justify-end">
            <Add onClick={() => isModalOpen(true)} />
            <DownloadPDF></DownloadPDF>
          </div>
        </div>
      </div>

      <div className="w-full sm:rounded-lg items-center">
        <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px] px-5">
          <form className="">
            {/* search bar */}
            <label className=""></label>
            <div className="flex">
              <input
                className=" py-3 px-5  w-[573px] h-[47px] pt-[14px]  ring-[1px] ring-[#E7EAEE]"
                type="text"
                placeholder="Search by reference no. or name..."
                onChange={(event) => {
                  setTerm(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </form>
          <div className="flex w-full justify-end items-center gap-[12px]">
            <p className="text-[#191D23] opacity-[60%] font-semibold">
              Order by
            </p>
            <DropdownMenu
              options={optionsOrderedBy.map(({ label, onClick }) => ({
                label,
                onClick: () => {
                  onClick(label);
                  console.log("label", label);
                },
              }))}
              open={isOpenOrderedBy}
              width={"165px"}
              label={"Ascending"}
            />

            <p className="text-[#191D23] opacity-[60%] font-semibold">
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
          {patientVitalSign.length == 0 ? (
            <div>
              <div className="border-1 min-w-[180vh] py-5  flex-col justify-center items-center">
                <table className="w-full block text-left rtl:text-right">
                  <thead className="">
                    <tr className=" text-[#64748B] border-y  ">
                      <th scope="col" className="px-6 py-3 w-[400px] h-[70px]">
                        VITAL SIGN ID
                      </th>
                      <th scope="col" className="px-6 py-3 w-[400px] h-[70px]">
                        DATE
                      </th>
                      <th scope="col" className="px-6 py-3 w-[300px] h-[70px]">
                        TIME
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 truncate max-w-[300px]"
                      >
                        BLOOD PRESSURE (mmHg)
                      </th>
                      <th scope="col" className="px-6 py-3 w-[400px]">
                        HEART RATE (bpm)
                      </th>
                      <th scope="col" className="px-6 py-3 w-[400px]">
                        TEMPERATURE (°C)
                      </th>
                      <th scope="col" className="px-1 py-3 w-[400px]">
                        RESPIRATORY (brths/min)
                      </th>

                      <th scope="col" className="px-[80px] py-3 w-[10px] ">
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
                <div className="py-5 flex justify-center items-center">
                  <p className="text-xl font-semibold text-gray-700">
                    No Vital Sign/s
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="">
                <tr className=" text-[#64748B] border-y  ">
                  <th scope="col" className="px-6 py-3 w-[400px] h-[70px]">
                    VITAL SIGN ID
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px] h-[70px]">
                    DATE
                  </th>
                  <th scope="col" className="px-6 py-3 w-[300px] h-[70px]">
                    TIME
                  </th>
                  <th scope="col" className="px-6 py-3 truncate max-w-[300px]">
                    BLOOD PRESSURE (mmHg)
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    HEART RATE (bpm)
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    TEMPERATURE (°C)
                  </th>
                  <th scope="col" className="px-1 py-3 w-[400px]">
                    RESPIRATORY (brths/min)
                  </th>

                  <th scope="col" className="px-[80px] py-3 w-[10px] ">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {patientVitalSign.map((vitalSign, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white border-b hover:bg-[#f4f4f4] group"
                  >
                    <th
                      scope="row"
                      className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {vitalSign.vitalsign_uuid}
                    </th>
                    <td className="px-6 py-4">
                      {formatDate(vitalSign.vitalsign_date)}
                    </td>
                    <td className="px-6 py-4">
                      {formatTime(vitalSign.vitalsign_time)}
                    </td>
                    <td className="px-6 py-4">
                      {vitalSign.vitalsign_bloodPressure}mmHg
                    </td>
                    <td className="px-6 py-4">
                      {vitalSign.vitalsign_heartRate}bpm
                    </td>
                    <td className="px-6 py-4">
                      {vitalSign.vitalsign_temperature}°C
                    </td>
                    <td className="px-6 py-4">
                      {vitalSign.vitalsign_respiratoryRate}breaths/min
                    </td>

                    <td className="px-[70px] py-4">
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
          )}
        </div>
        {/* END OF TABLE */}
      </div>
      {/* pagination */}
      {totalPages <= 1 ? (
        <div></div>
      ) : (
        <div className="mt-5 pb-5">
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
        <VitalSignModal
          isEdit={isEdit}
          isModalOpen={isModalOpen}
          isOpen={isOpen}
          label="sample label"
          vitalSignData={vitalSignData}
          onSuccess={onSuccess}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          label="Success"
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}
