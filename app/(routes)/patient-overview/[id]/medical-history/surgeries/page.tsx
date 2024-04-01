"use client";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { SurgeriesModal } from "@/components/modals/surgeries.modal";
import { fetchSurgeriesByPatient } from "@/app/api/medical-history-api/surgeries.api";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Loading from "./loading";

export default function Surgeries() {
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [patientSurgeries, setPatientSurgeries] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalSurgeries, setTotalSurgeries] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [surgeryUuid, setSurgeryUuid] = useState("");
  const router = useRouter();
  const [sortBy, setSortBy] = useState("typeOfSurgery");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [surgeryData, setSurgeryData] = useState<any[]>([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();

  // const patientId = params.id;
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
    if (option === "Type") {
      setSortBy("typeOfSurgery");
    } else if (option === "Surgery") {
      setSortBy("surgery");
    } else {
      setSortBy("notes");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Type", onClick: handleSortOptionClick },
    { label: "Surgery", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
  ];

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "scroll";
      setIsEdit(false);
      setSurgeryData([]);
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
        const response = await fetchSurgeriesByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );

        //convert date to ISO string

        setPatientSurgeries(response.data);
        console.log("Patient list after setting state:", response.data);
        setTotalPages(response.totalPages);
        setTotalSurgeries(response.totalCount);
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
      <Loading></Loading>
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
  console.log(patientSurgeries, "PatientSurgeries");
  return (
    <div className="  w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h1 className="p-title">Medical History</h1>
            <h1 className="p-title mx-2">{">"} </h1>
            <h1
              onClick={() =>
              {onNavigate(
                  router,
                  `/patient-overview/${patientId.toLowerCase()}/medical-history/allergies`
                ); setIsLoading(true)}
              }
              className=" p-title  cursor-pointer text-gray-600"
            >
              Allergies
            </h1>
            <h1 className="p-title mx-2">{">"} </h1>
            <h1 className="p-title cursor-pointer text-[#007C85]">Surgeries</h1>
          </div>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] mb-4 ">
            Total of {totalSurgeries} Surgeries
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <Add onClick={() => isModalOpen(true)} />
          <DownloadPDF></DownloadPDF>
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
                value={term}
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
          {patientSurgeries.length == 0 ? (
            <div className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-700">
                No Surgeries
              </p>
            </div>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead className="">
                <tr className="uppercase text-[#64748B] border-y  ">
                  <th scope="col" className="px-6 py-3 w-[300px] h-[70px]">
                    Surgery ID
                  </th>
                  <th scope="col" className="px-2 py-3 w-[300px] h-[70px]">
                    DATE OF SURGERY
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    TYPE
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    SURGERY
                  </th>
                  <th scope="col" className="px-6 py-3 w-[300px]">
                    NOTES
                  </th>

                  <th scope="col" className="px-[80px] py-3 w-[10px] ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientSurgeries.map((surgery, index) => (
                  <tr key={index} className="group hover:bg-[#f4f4f4]  even:bg-gray-50  border-b ">
                    <th
                      scope="row"
                      className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {surgery.surgeries_uuid}
                    </th>
                    <td className="px-2 py-4">
                      {formatDate(surgery.surgeries_dateOfSurgery)}
                    </td>
                    <td className="px-6 py-4">
                      {surgery.surgeries_typeOfSurgery}
                    </td>
                    <td className=" max-w-[552px] px-6 py-4">
                      {surgery.surgeries_surgery}
                    </td>
                    <td className="px-6 py-4">{surgery.surgeries_notes}</td>
                    <td className="px-[50px] py-4 flex items-center justify-center  ">
                      <div
                        onClick={() => {
                          isModalOpen(true);
                          setIsEdit(true);
                          setSurgeryData(surgery);
                        }}
                      >
                        <Edit></Edit>
                      </div>
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
        <SurgeriesModal
          isModalOpen={isModalOpen}
          isOpen={isOpen}
          isEdit={isEdit}
          surgeryData={surgeryData}
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
          label="Surgery already exist"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
}
