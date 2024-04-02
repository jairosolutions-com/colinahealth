"use client";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { fetchAllergiesByPatient } from "@/app/api/medical-history-api/allergies.api";
import Loading from "./loading";
import { AllergyModal } from "@/components/modals/allergies.modal";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";

const Allergies = () => {
  const router = useRouter();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("ASC");
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
      document.body.style.overflow = "scroll";
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
    <Loading></Loading>;
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
  console.log(error, "error");
  return (
    <div className="   w-full">
      <div className="flex justify-between ">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h1 className="p-title">Medical History</h1>
            <h1 className="p-title mx-2">{">"} </h1>
            <h1 className="p-title text-[#007C85] cursor-pointer">Allergies</h1>
            <h1 className="p-title mx-2">{">"} </h1>
            <h1
              onClick={() =>
                {onNavigate(
                  router,
                  `/patient-overview/${patientId.toLowerCase()}/medical-history/surgeries`
                ); setIsLoading(true)}
              }
              className="p-title cursor-pointer text-gray-600"
            >
              Surgeries
            </h1>
          </div>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] mb-4 ">
            Total of {totalAllergies} Allergies
          </p>
        </div>
        <div className="flex flex-row justify-end mt-[15px]">
          <Add onClick={() => isModalOpen(true)} />
          <DownloadPDF></DownloadPDF>
        </div>
      </div>

      <div className="w-full m:rounded-lg items-center">
        <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px] px-5">
          <form className="">
            {/* search bar */}
            <label className=""></label>
            <div className="flex">
              <input
                className=" py-3 px-5  w-[573px] h-[47px] pt-[14px]  ring-[1px] ring-[#E7EAEE]"
                type="text"
                onChange={(event) => {
                  setTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by reference no. or name..."
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
          {patientAllergies.length === 0 ? (
            <h1 className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-700">
                No Allergies
              </p>
            </h1>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="">
                <tr className="uppercase text-[#64748B] border-y  ">
                  <th scope="col" className="px-6 py-3 w-[300px] h-[70px]">
                    Allergy ID
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    Allergen
                  </th>
                  <th scope="col" className="px-6 py-3 w-[300px]">
                    Severity
                  </th>

                  <th scope="col" className="px-[80px] py-3 w-[10px] ">
                    Reaction
                  </th>
                  <th scope="col" className="px-[80px] py-3 w-[10px] ">
                    Notes
                  </th>
                  <th scope="col" className="px-[80px] py-3 w-[10px] ">
                    ACtions
                  </th>
                </tr>
              </thead>

              <tbody>
                {patientAllergies.map((allergy, index) => (
                  <tr key={index} className=" group even:bg-gray-50 hover:bg-[#f4f4f4]  border-b ">
                    <th
                      scope="row"
                      className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {allergy.allergies_uuid}
                    </th>
                    <td className="px-2 py-4">
                      {" "}
                      {new Date(
                        allergy.allergies_createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{allergy.allergies_type}</td>
                    <td className=" max-w-[552px] px-6 py-4">
                      {allergy.allergies_allergen}
                    </td>

                    <td className="px-6 py-4">{allergy.allergies_severity}</td>
                    <td className="px-6 py-4">{allergy.allergies_reaction}</td>
                    <td className="px-2 py-4">
                      {allergy.allergies_notes
                        ? allergy.allergies_notes
                        : "None"}
                    </td>

                    <td className="px-[50px] py-4 flex items-center justify-center">
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
        <AllergyModal
          isModalOpen={isModalOpen}
          isOpen={isOpen}
          isEdit={isEdit}
          allergy={allergyToEdit}
          label="sample label"
          onSuccess={onSuccess}
          onFailed={onFailed}
          setErrorMessage={setError}
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
