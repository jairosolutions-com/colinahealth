"use client";
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
import { AllergyModal } from "@/components/modals/allergies.modal";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Modal from "@/components/reusable/modal";
import { AllergiesModalContent } from "@/components/modal-content/allergies-modal-content";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const Allergies = () => {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
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
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
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
  const handleDownloadPDF = async () => {
    if (patientAllergies.length === 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Allergy list is empty",
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
    } else {
      const allergies = await fetchAllergiesForPDF(
        patientId,
        term,
        currentPage,
        sortBy,
        sortOrder as "ASC" | "DESC",
        0,
        router
      );
      let patientName =
        allergies[0]?.patient_lastName +
        ", " +
        allergies[0]?.patient_firstName +
        " " +
        allergies[0]?.patient_middleName;
      let jsonFile: {
        "Allergy UID": string;
        Date: string;
        Type: string;
        Allergen: string;
        Severity: string;
        Reaction: string;
        Notes: string;
      }[] = allergies.map((allergy) => ({
        "Allergy UID": allergy.allergies_uuid,
        Date: new Date(allergy.allergies_createdAt).toLocaleDateString(),
        Type: allergy.allergies_type,
        Allergen: allergy.allergies_allergen,
        Severity: allergy.allergies_severity,
        Reaction: allergy.allergies_reaction,
        Notes: allergy.allergies_notes,
      }));

      const patientFullName = patientName;

      printJS({
        printable: jsonFile,
        properties: [
          "Allergy UID",
          "Date",
          "Type",
          "Allergen",
          "Severity",
          "Reaction",
          "Notes",
        ],
        type: "json",
        gridHeaderStyle: "color: red;  border: 2px solid #3971A5;",
        header: patientFullName,
        gridStyle: "border: 2px solid #3971A5;",
        documentTitle: `${patientFullName}'s Allergies`,
      });
    }
  };

  return (
    <div className="w-full">
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
            <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px]">
              Total of {totalAllergies} Allergies
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => isModalOpen(true)} className="btn-add gap-2">
            <img src="/imgs/add.svg" alt="" />
            <p className="text-[18px]">Add</p>
          </button>

          <button className="btn-pdfs gap-2" onClick={handleDownloadPDF}>
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
                <td className="px-6 py-3">Allergy ID</td>
                <td className="px-6 py-3">Date</td>
                <td className="px-5 py-3">Type</td>
                <td className="px-5 py-3">Allergen</td>
                <td className="px-4 py-3">Severity</td>
                <td className="px-4 py-3">Reaction</td>
                <td className="px-4 py-3 ">Notes</td>
                <td className="py-3 px-14">Action </td>
              </tr>
            </thead>
            <tbody className="h-[220px]">
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
                  <td className="truncate px-5 py-3">
                    {allergy.allergies_uuid}
                  </td>
                  <td className="truncate px-5 py-3">
                    {" "}
                    {new Date(allergy.allergies_createdAt).toLocaleDateString()}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_type}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_allergen}
                  </td>

                  <td className="truncate px-6  py-3">
                    {allergy.allergies_severity}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_reaction}
                  </td>
                  <td className="truncate px-6  py-3">
                    {allergy.allergies_notes ? allergy.allergies_notes : "None"}
                  </td>

                  <td className="py-3 flex justify-center">
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
