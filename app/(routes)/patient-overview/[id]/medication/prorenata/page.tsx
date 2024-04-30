"use client";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchPRNMedByPatient } from "@/app/api/medication-logs-api/prn-med-api";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Modal from "@/components/reusable/modal";
import { PrnModalContent } from "@/components/modal-content/prn-modal-content";
const Prorenata = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [sortBy, setSortBy] = useState("createdAt");
  const [pageNumber, setPageNumber] = useState("");
  const [patientPRNMed, setPatientPRNMed] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPRNMeds, setTotalPRNMeds] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [PRNData, setPRNData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

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
      setPRNData([]);
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
      setSortBy("medicationLogsDate");
    } else if (option === "Time") {
      setSortBy("medicationLogsTime");
    } else {
      setSortBy("medicationLogsName");
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
    { label: "Medication", onClick: handleSortOptionClick },
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

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPRNMedByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );
        setPatientPRNMed(response.data);
        setTotalPages(response.totalPages);
        console.log(response.totalPages, "total");
        setTotalPRNMeds(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }

  console.log(patientPRNMed, "prn med");

  return (
    <div className="w-full">
      <div className="w-full justify-between flex mb-2">
        <div className="flex-row">
          <div className="flex gap-2">
            <p className="p-title">Medication Logs</p>
            <span className="slash">{">"}</span>
            <span
              onClick={() => {
                setIsLoading(true);
                router.replace(
                  `/patient-overview/${patientId.toLowerCase()}/medication/scheduled`
                );
              }}
              className="bread"
            >
              Scheduled
            </span>
            <span className="slash">{"/"}</span>
            <span className="active">PRN</span>
          </div>
          <div>
            <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px]">
              Total of {totalPRNMeds} PRN Medication Logs
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
                className="py-3 px-5 m-5 w-[573px] outline-none h-[47px] pt-[14px] ring-[1px] ring-[#E7EAEE] text-[15px] rounded pl-10 relative bg-[#fff] bg-no-repeat bg-[573px] bg-[center] bg-[calc(100%-20px)]"
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
                <td className="px-6 py-3">Medication ID</td>
                <td className="px-6 py-3">Date</td>
                <td className="px-6 py-3">Time</td>
                <td className="px-6 py-3">Medication</td>
                <td className="px-5 py-3">Notes</td>
                <td className="px-6 py-3">Status</td>
                <td className="px-6 py-4">Action</td>
              </tr>
            </thead>
            <tbody className="h-[220px]">
              {patientPRNMed.length === 0 && (
                <tr>
                  <td className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                    <p className="text-[15px] font-normal text-gray-700 text-center">
                      No PRN Medication Log/s <br />
                    </p>
                  </td>
                </tr>
              )}
              {patientPRNMed.map((prnMed, index) => (
                <>
                  <tr
                    key={index}
                    className="group hover:bg-[#f4f4f4]  border-b text-[15px]"
                  >
                    <td className="truncate px-6 py-3">
                      {prnMed.medicationlogs_uuid}
                    </td>
                    <td className="truncate px-6 py-3">
                      {prnMed.medicationlogs_medicationLogsDate}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(
                        new Date().getFullYear(), // Use current year as default
                        new Date().getMonth(), // Use current month as default
                        new Date().getDate(), // Use current day as default
                        parseInt(
                          prnMed.medicationlogs_medicationLogsTime.split(":")[0]
                        ), // Extract hours
                        parseInt(
                          prnMed.medicationlogs_medicationLogsTime.split(":")[1]
                        ) // Extract minutes
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="truncate px-6 py-3">
                      {prnMed.medicationlogs_medicationLogsName}
                    </td>
                    <td className="px-6 py-3">{prnMed.medicationlogs_notes}</td>
                    <td className="text-15px me-1 px-6 py-5 rounded-full flex items-center">
                      <div
                        className={`px-2 font-semibold rounded-[20px] relative flex items-center ${
                          prnMed.medicationlogs_medicationLogStatus === "Given"
                            ? "bg-[#dfffea] text-[#17C653] text-[15px]" // Green color for Given
                            : prnMed.medicationlogs_medicationLogStatus ===
                              "Held"
                            ? "bg-[#E7EAEE] text-[#3C3C3C] text-[15px]" // Dark color for Held
                            : prnMed.medicationlogs_medicationLogStatus ===
                              "Refused"
                            ? "bg-[#FEE9E9] text-[#EF4C6A] text-[15px]" // Red color for Refused
                            : prnMed.medicationlogs_medicationLogStatus
                        }`}
                      >
                        {prnMed.medicationlogs_medicationLogStatus}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p
                        onClick={() => {
                          isModalOpen(true);
                          setIsEdit(true);
                          setPRNData(prnMed);
                        }}
                      >
                        <Edit></Edit>
                      </p>
                    </td>
                  </tr>
                </>
              ))}
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
            <PrnModalContent
              isModalOpen={isModalOpen}
              isOpen={isOpen}
              uuid={""}
              name=""
              isEdit={isEdit}
              setIsUpdated={setIsUpdated}
              PRNData={PRNData}
              label="sample label"
              onSuccess={onSuccess}
              onFailed={onFailed}
              setErrorMessage={setError}
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
      {isErrorOpen && (
        <ErrorModal
          label="PRN Log already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default Prorenata;
