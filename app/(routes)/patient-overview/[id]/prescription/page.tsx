"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useRouter, useParams } from "next/navigation";
import { fetchPrescriptionByPatient as fetchPrescriptionsByPatient } from "@/app/api/prescription-api/prescription.api";
import { PrescriptionModal } from "@/components/modals/prescription.modal";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
// import { Modal } from "@/components/shared/modalss";

export default function prescription() {
  const router = useRouter();
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState("name");
  const [pageNumber, setPageNumber] = useState("");
  const [patientPrescriptions, setPatientPrescription] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPrescription, setTotalPrescription] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [prescriptionData, setPrescriptionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
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
      document.body.style.overflow = "scroll";
      setPrescriptionData([]);
      setIsEdit(false);
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
    if (option === "Medicine Name") {
      setSortBy("medicationName");
    } else if (option === "Frequency") {
      setSortBy("frequency");
    } else if (option === "Interval") {
      setSortBy("interval");
    }else {
      setSortBy("dosage");
    }
    console.log("option", option);
  };
  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Medicine Name", onClick: handleSortOptionClick },
    { label: "Frequency", onClick: handleSortOptionClick },
    { label: "Interval", onClick: handleSortOptionClick },
    { label: "Dosage", onClick: handleSortOptionClick },
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
        const response = await fetchPrescriptionsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );

        //convert date to ISO string

        setPatientPrescription(response.data);
        console.log("Patient list after setting state:", response.data);
        setTotalPages(response.totalPages);
        setTotalPrescription(response.totalCount);
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
  return (
    <div className=" w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="p-title">Prescription </h1>
          {/* number of patients */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] mb-4 ">
            Total of {totalPrescription} Prescriptions
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <Add
            onClick={() => {
              isModalOpen(true);
            }}
          ></Add>{" "}
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
        {patientPrescriptions.length == 0 ? (
            <div className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-700">
                No Prescription/s
              </p>
            </div>
          ) : (
          <table className="w-full text-left rtl:text-right">
            <thead className="">
              <tr className="uppercase text-[#64748B] border-y  ">
                <th scope="col" className="px-0 py-3 w-[300px]">
                  PRESCRIPTION ID
                </th>
                <th scope="col" className="px-6 py-3 w-[300px] h-[70px]">
                  MEDICINE NAME
                </th>
                <th scope="col" className="px-0 py-3 w-[300px]">
                  FREQUENCY
                </th>
                <th scope="col" className="px-3 py-3 w-[300px]">
                  INTERVAL
                </th>
                <th scope="col" className="px-20  py-3 w-[300px]">
                  DOSAGE
                </th>
                <th scope="col" className="pl-10 pr-6 py-3 w-[200px] ">
                  STATUS
                </th>
                <th scope="col" className="px-[80px] py-3 w-[10px] ">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
             
              {patientPrescriptions.length > 0 && (
                <>
                  {patientPrescriptions.map((prescription, index) => (
                    <tr key={index} className="group  even:bg-gray-50  border-b hover:bg-[#f4f4f4]">
                      <td className="truncate max-w-[286px] px-0 py-4">
                        {prescription.prescriptions_uuid}
                      </td>
                      <th
                        scope="row"
                        className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {prescription.prescriptions_name}
                      </th>
                      <td className="truncate max-w-[286px] px-0 py-4">
                        {prescription.prescriptions_frequency}
                      </td>
                      <td className="truncate max-w-[286px] px-3 py-4 tb-med">
                        {prescription.prescriptions_interval}
                      </td>
                      <td className="truncate max-w-[286px] px-20 py-4">
                        {prescription.prescriptions_dosage}
                      </td>
                      <td className="px-12 py-4">
                        {" "}
                        {prescription.prescriptions_status}
                      </td>
                      <td className="px-[70px] py-4">
                        <p
                          onClick={() => {
                            isModalOpen(true);
                            setIsEdit(true);
                            setPrescriptionData(prescription);
                          }}
                        >
                          <Edit></Edit>
                        </p>
                      </td>
                    </tr>
                  ))}
                </>
              )}
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
        <PrescriptionModal
          isModalOpen={isModalOpen}
          isOpen={isOpen}
          label="sample label"
          isEdit={isEdit}
          prescriptionData={prescriptionData}
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
          label="prescriptionFailed"
          isAlertOpen={isErrorOpen}
          toggleModal={setIsErrorOpen}
          isEdit={isEdit}
          errorMessage={error}
        />
      )}
    </div>
  );
}
