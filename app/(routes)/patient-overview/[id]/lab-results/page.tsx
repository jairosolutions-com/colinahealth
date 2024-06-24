"use client";
import Image from "next/image";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import View from "@/components/shared/buttons/view";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchLabResultsByPatient } from "@/app/api/lab-results-api/lab-results.api";
import Modal from "@/components/reusable/modal";
import { SuccessModal } from "@/components/shared/success";
import { LabresultsModalContent } from "@/components/modal-content/labresults-modal-content";
import { LabResultsViewModalContent } from "@/components/modal-content/labresultsview-modal-content";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
export default function Laboratoryresults() {
  const router = useRouter();
  if (typeof window === "undefined") {
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
          className={`border-px flex w-[49px] items-center justify-center border ${
            currentPage === i ? "btn-pagination" : ""
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
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
          router,
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
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex justify-between">
          <div className="flex flex-col">
            <p className="p-title">Laboratory Results </p>
            {/* number of patients */}
            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalLabResults} Lab Results
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
                  width="20"
                  height="20"
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
                <td className="w-[170px] px-6 py-3">LAB RESULT UID</td>
                <td className="w-[170px] px-6 py-3">DATE</td>
                <td className="w-[170px] px-6 py-3">HEMO A1c (%)</td>
                <td className="w-[170px] px-6 py-3">FBG (mg/dL)</td>
                <td className="w-[170px] px-6 py-3">TC (mg/dL)</td>
                <td className="w-[170px] px-6 py-3">LDL-C (mg/dL)</td>
                <td className="w-[170px] px-6 py-3">HDL-C (mg/dL)</td>
                <td className="w-[170px] px-6 py-3">TG (mg/dL)</td>
                <td className="px-6 py-3 text-center">ACTION</td>
                <td className="w-[14px]"></td>
              </tr>
            </thead>

            <tbody className="h-[220px] overflow-y-scroll">
              {patientLabResults.length === 0 && (
                <div className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                  <p className="text-center text-[15px] font-normal text-gray-700">
                    No Lab Results found <br />
                  </p>
                </div>
              )}
              <>
                {patientLabResults.map((labResult, index) => (
                  <tr
                    key={index}
                    className="group border-b text-[15px] odd:bg-white hover:bg-[#f4f4f4]"
                  >
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip text={`${labResult.labResults_uuid}`} />
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      {labResult.labResults_date}
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip
                        text={`${labResult.labResults_hemoglobinA1c}%`}
                      />
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip
                        text={`${labResult.labResults_fastingBloodGlucose}mg/dL`}
                      />
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip
                        text={`${labResult.labResults_totalCholesterol}mg/dL`}
                      />
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip
                        text={`${labResult.labResults_ldlCholesterol}mg/dL`}
                      />
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip
                        text={`${labResult.labResults_hdlCholesterol}mg/dL`}
                      />
                    </td>
                    <td className="w-[170px] px-6 py-3">
                      <ResuableTooltip
                        text={`${labResult.labResults_triglycerides}mg/dL`}
                      />
                    </td>
                    <td className="flex justify-center gap-2 px-6 py-3">
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
