"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import View from "@/components/shared/buttons/view";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchLabResultsByPatient } from "@/app/api/lab-results-api/lab-results.api";
import { LabResultModal } from "@/components/modals/labresults.modal";
import Modal from "@/components/reusable/modal";
import { SuccessModal } from "@/components/shared/success";
import { LabresultsModalContent } from "@/components/modal-content/labresults-modal-content";
import { LabResultsViewModalContent } from "@/components/modal-content/labresultsview-modal-content";
export default function Laboratoryresults() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [patientLabResults, setPatientLabResults] = useState<any[]>([]);
  const [totalLabResults, setTotalLabResults] = useState<number>(0);
  const [labResultData, setLabResultData] = useState<any[]>([]);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [sortBy, setSortBy] = useState("uuid");
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setIsView(false);

      setLabResultData([]);
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
        const response = await fetchLabResultsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );

        //convert date to ISO string

        setPatientLabResults(response.data);
        console.log("Patient list after setting state:", response.data);
        setTotalPages(response.totalPages);
        setTotalLabResults(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }
  const handleSortOptionClick = (option: string) => {
    setIsOpenSortedBy(false);
    if (option === "Date") {
      setSortBy("date");
    } else if (option === "Total Cholesterol") {
      setSortBy("totalCholesterol");
    } else if (option === "LDL-C") {
      setSortBy("ldlCholesterol");
    } else {
      setSortBy("hdlCholesterol");
    }
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Total Cholesterol", onClick: handleSortOptionClick },
    { label: "LDL-C", onClick: handleSortOptionClick },
    { label: "HDL-C", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    setIsView(false);

    isModalOpen(false);
  };

  return (
    <div className="  w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="p-title">Laboratory Results </h1>
          {/* number of patients */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[15px] mb-4 ">
            Total of {totalLabResults} Lab Results
          </p>
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

      <div className="w-full sm:rounded-lg items-center">
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
              <tr className="text-[#64748B] border-y text-[15px] h-[70px] font-semibold">
                <td className="px-6 py-3 w-[160px]">LAB RESULT ID</td>
                <td className="px-6 py-3 w-[150px]">DATE</td>
                <td className="px-6 py-3 w-[210px]">HEMOGLOBIN A1c (%)</td>
                <td className="px-6 py-3 w-[190px]">
                  FASTING BLOOD GLUCOSE (mg/dL)
                </td>
                <td className="px-6 py-3 w-[200px]">
                  TOTAL CHOLESTEROL (mg/dL)
                </td>
                <td className="px-6 py-3 w-[150px]">LDL-C (mg/dL)</td>
                <td className="px-6 py-3 w-[150px]">HDL-C (mg/dL)</td>
                <td className="px-6 py-3 w-[160px]">TRIGLYCERIDES (mg/dL)</td>
                <td className="px-6 py-3 text-center">ACTION</td>
              </tr>
            </thead>

            <tbody className="h-[220px]">
              {patientLabResults.length === 0 && (
                <div className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                  <p className="text-[15px] font-normal text-gray-700 text-center">
                    No Lab Results found <br />
                  </p>
                </div>
              )}
              <>
                {patientLabResults.map((labResult, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white border-b hover:bg-[#f4f4f4] group text-[15px]"
                  >
                    <td className="px-6 py-3 w-[160px]">
                      {labResult.labResults_uuid}
                    </td>
                    <td className=" px-6 py-3 w-[150px]">
                      {labResult.labResults_date}
                    </td>
                    <td className="px-6 py-3 w-[210px]">
                      {labResult.labResults_hemoglobinA1c}%
                    </td>
                    <td className="px-6 py-3 w-[190px]">
                      {labResult.labResults_fastingBloodGlucose}mg/dL
                    </td>
                    <td className="px-6 py-3 w-[200px]">
                      {labResult.labResults_totalCholesterol}mg/dL
                    </td>
                    <td className="px-6 py-3 w-[150px]">
                      {labResult.labResults_ldlCholesterol}mg/dL
                    </td>
                    <td className="px-6 py-3 w-[150px]">
                      {labResult.labResults_hdlCholesterol}mg/dL
                    </td>
                    <td className="px-6 py-3 w-[160px]">
                      {labResult.labResults_triglycerides}mg/dL
                    </td>
                    <td className="px-6 py-3 flex gap-2 justify-center">
                      <p
                        onClick={() => {
                          isModalOpen(true);
                          setIsEdit(true);
                          setLabResultData(labResult);
                        }}
                      >
                        <Edit></Edit>
                      </p>
                      <p
                        onClick={() => {
                          isModalOpen(true);
                          setIsView(true);

                          setLabResultData(labResult);
                        }}
                      >
                        <View></View>
                      </p>
                    </td>
                  </tr>
                ))}
              </>
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
            <LabresultsModalContent
              isModalOpen={isModalOpen}
              isEdit={isEdit}
              labResultData={labResultData}
              onSuccess={onSuccess}
              setIsUpdated={setIsUpdated}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isView && (
        <Modal
          content={
            <LabResultsViewModalContent
              isModalOpen={isModalOpen}
              isView={isView}
              labResultsData={labResultData}
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
