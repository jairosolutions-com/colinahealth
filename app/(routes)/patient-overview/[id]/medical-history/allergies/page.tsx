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
import PdfDownloader from "@/components/pdfDownloader";

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
        const response = await fetchAllergiesByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
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
      <div className="container w-full h-full flex justify-center items-center ">
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
    <div className="w-full h-full flex flex-col justify-between">
      <div className="w-full h-full">
        <div className="w-full justify-between flex mb-2">
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
                    `/patient-overview/${patientId.toLowerCase()}/medical-history/surgeries`
                  );
                }}
                className="bread"
              >
                Surgeries
              </span>
            </div>
            <div>
              <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[15px]">
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
        <div className="w-full m:rounded-lg items-center">
          <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px]">
            <form className="mr-5 relative">
              {/* search bar */}
              <label className=""></label>
              <div className="flex">
                <input
                  className="py-3 px-5 m-5 w-[573px] outline-none h-[47px] pt-[15px] ring-[1px] ring-[#E7EAEE] text-[15px] rounded pl-10 relative bg-[#fff] bg-no-repeat bg-[573px] bg-[center] bg-[calc(100%-20px)]"
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
        </div>
        {/* START OF TABLE */}
        <div>
          <table className="text-left rtl:text-right">
            <thead>
              <tr className="uppercase text-[#64748B] border-y text-[15px] h-[70px] font-semibold">
                <td className="px-6 py-3">Allergy ID</td>
                <td className="px-6 py-3">Date</td>
                <td className="px-6 py-3">Type</td>
                <td className="px-6 py-3">Allergen</td>
                <td className="px-6 py-3">Severity</td>
                <td className="px-6 py-3">Reaction</td>
                <td className="px-6 py-3">Notes</td>
                <td className="py-3 px-6 text-center">Action</td>
                <td className="w-[14px]"></td>
              </tr>
            </thead>
            <tbody className="h-[220px] overflow-y-scroll">
              {patientAllergies.length === 0 && (
                <h1 className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                  <p className="text-[15px] font-normal text-gray-700 text-center">
                    No Allergies Found <br />
                  </p>
                </h1>
              )}
              {patientAllergies.map((allergy, index) => (
                <tr
                  key={index}
                  className=" group hover:bg-[#f4f4f4]  border-b text-[15px] "
                >
                  <td className="truncate px-6 py-3 ">
                    {allergy.allergies_uuid}
                  </td>
                  <td className="truncate px-6 py-3">
                    {" "}
                    {new Date(allergy.allergies_createdAt).toLocaleDateString()}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_type}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_allergen}
                  </td>

                  <td className="text-15px me-1 px-6 py-3 rounded-full flex items-center">
                    <div
                      className={`px-2 font-semibold rounded-[20px] relative flex items-center ${
                        allergy.allergies_severity === "Mild"
                          ? "bg-[#FFF8DD] text-[#F6C000] text-[15px]" // Green color for Mild
                          : allergy.allergies_severity === "Moderate"
                          ? "bg-[#fff5ef] text-[#ff6f1e] text-[15px]" // Dark color for Moderate
                          : allergy.allergies_severity === "Severe"
                          ? "bg-[#FFE8EC] text-[#EF4C6A] text-[15px]" // Red color for Severe
                          : ""
                      }`}
                    >
                     
                        {allergy.allergies_severity}
                      
                    </div>
                    
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_reaction}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_notes ? allergy.allergies_notes : "None"}
                  </td>

                  <td className="py-3 px-6 flex justify-center ">
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
