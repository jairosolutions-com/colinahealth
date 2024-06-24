"use client";
import Image from "next/image";
import printJS from "print-js";
import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import {
  fetchAllergiesByPatient,
  fetchAllergiesForPDF,
} from "@/app/api/medical-history-api/allergies.api";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Modal from "@/components/reusable/modal";
import { AllergiesModalContent } from "@/components/modal-content/allergies-modal-content";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/shared/pagination";
import PdfDownloader from "@/components/pdfAllergiesDownloader";
import ResuableTooltip from "@/components/reusable/tooltip";

const Allergies = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
  }
  const { toast } = useToast();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("DESC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientAllergies, setPatientAllergies] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalAllergies, setTotalAllergies] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [term, setTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("Type");
  const [isEdit, setIsEdit] = useState(false);
  const [allergyToEdit, setAllergyToEdit] = useState<any[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDownloadPDF, setIsDownloadPDF] = useState<boolean>(false);

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  console.log(params, "for surgery patientId");
  const patientId = params.id.toUpperCase();
  // const patientId = params.id;

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    setSortBy(option);
    console.log("option", option);
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Type", onClick: handleSortOptionClick },
    { label: "Severity", onClick: handleSortOptionClick },
    { label: "Reaction", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const [isOpen, setIsOpen] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setIsEdit(false);
      setAllergyToEdit([]);
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
          className={`flex w-[49px] items-center justify-center ring-1 ring-gray-300 ${
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
        const response = await fetchAllergiesByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router,
        );
        setPatientAllergies(response.data);
        setTotalPages(response.totalPages);
        setTotalAllergies(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term, isSuccessOpen]);

  console.log(allergyToEdit, "allergy uuid");
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

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-title">Medical History</p>
              <span className="slash">{">"}</span>
              <span className="active">Allergies</span>
              <span className="slash">{"/"}</span>
              <span
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/medical-history/surgeries`,
                  );
                }}
                className="bread"
              >
                Surgeries
              </span>
            </div>
            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalAllergies} Allergies
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
              <Image src="/imgs/add.svg" alt="" width={22} height={22} />
              <p className="text-[18px]">Add</p>
            </button>

            <PdfDownloader
              data={patientAllergies}
              props={[
                "Uuid",
                "Date",
                "Type",
                "Allergen",
                "Severity",
                "Reaction",
                "Notes",
              ]}
              variant={"Allergy Table"}
            />
          </div>
        </div>
        <div className="m:rounded-lg w-full items-center">
          <div className="flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative m-5 h-[47px] w-[573px] rounded bg-[#fff] bg-[573px] bg-[calc(100%-20px)] bg-[center] bg-no-repeat px-5 py-3 pl-10 pt-[15px] text-[15px] outline-none ring-[1px] ring-[#E7EAEE]"
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
              <tr className="h-[70px] border-y text-[15px] font-semibold uppercase text-[#64748B]">
                <td className="px-6 py-3">Allergy ID</td>
                <td className="px-6 py-3">Date</td>
                <td className="px-6 py-3">Type</td>
                <td className="px-6 py-3">Allergen</td>
                <td className="px-6 py-3">Severity</td>
                <td className="px-6 py-3">Reaction</td>
                <td className="px-6 py-3">Notes</td>
                <td className="px-6 py-3 text-center">Action</td>
                <td className="w-[14px]"></td>
              </tr>
            </thead>
            <tbody className="h-[220px] overflow-y-scroll">
              {patientAllergies.length === 0 && (
                <h1 className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                  <p className="text-center text-[15px] font-normal text-gray-700">
                    No Allergies Found <br />
                  </p>
                </h1>
              )}
              {patientAllergies.map((allergy, index) => (
                <tr
                  key={index}
                  className="group border-b text-[15px] hover:bg-[#f4f4f4]"
                >
                  <td className="px-6 py-3">
                    <ResuableTooltip text={allergy.allergies_uuid} />
                  </td>
                  <td className="px-6 py-3">
                    {" "}
                    {new Date(allergy.allergies_createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={allergy.allergies_type} />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={allergy.allergies_allergen} />
                  </td>

                  <td className="text-15px me-1 flex items-center rounded-full px-6 py-3">
                    <div
                      className={`relative flex items-center rounded-[20px] px-2 font-semibold ${
                        allergy.allergies_severity === "Mild"
                          ? "bg-[#FFF8DD] text-[15px] text-[#F6C000]" // Green color for Mild
                          : allergy.allergies_severity === "Moderate"
                            ? "bg-[#fff5ef] text-[15px] text-[#ff6f1e]" // Dark color for Moderate
                            : allergy.allergies_severity === "Severe"
                              ? "bg-[#FFE8EC] text-[15px] text-[#EF4C6A]" // Red color for Severe
                              : ""
                      }`}
                    >
                      {allergy.allergies_severity}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip text={allergy.allergies_reaction} />
                  </td>
                  <td className="px-6 py-3">
                    <ResuableTooltip
                      text={
                        allergy.allergies_notes
                          ? allergy.allergies_notes
                          : "None"
                      }
                    />
                  </td>

                  <td className="flex justify-center px-6 py-3">
                    <p
                      onClick={() => {
                        isModalOpen(true);
                        setIsEdit(true);
                        setAllergyToEdit(allergy);
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
      <div className="bottom-0">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {isOpen && (
        <Modal
          content={
            <AllergiesModalContent
              isModalOpen={isModalOpen}
              isOpen={isOpen}
              isEdit={isEdit}
              allergy={allergyToEdit}
              setIsUpdated={setIsUpdated}
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
          label="Allergy already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
};

export default Allergies;
