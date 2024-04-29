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
import Modal from "@/components/reusable/modal";
import { PrescriptionModalContent } from "@/components/modal-content/prescription-modal-content";
import View from "@/components/shared/buttons/view";
import { PrescriptionViewModalContent } from "@/components/modal-content/prescriptionview-modal-content";

export default function prescription() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
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
  const [isView, setIsView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
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
      setPrescriptionData([]);
      setIsEdit(false);
      setIsView(false);
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
    } else {
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
    setIsView(false);
    isModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
    setIsView(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }
  return (
    <div className=" w-full">
      <div className="w-full justify-between flex mb-2">
        <div className="flex-row">
          <p className="p-title">Prescription</p>

          <div>
            <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px]">
              Total of {totalPrescription} Prescriptions
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
          {patientPrescriptions.length == 0 ? (
            <div className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-700 text-center text-[15px]">
                No Prescription/s <br />
              </p>
            </div>
          ) : (
            <table className="text-left rtl:text-right">
              <thead>
                <tr className=" text-[#64748B] border-y text-[15px] h-[70px] font-semibold">
                  <td className="px-6 py-3 w-[230px]">PRESCRIPTION ID</td>
                  <td className="px-6 py-3 w-[230px]">MEDICINE NAME</td>
                  <td className="px-6 py-3 w-[230px]">FREQUENCY</td>
                  <td className="px-6 py-3 w-[230px]">INTERVAL (hr/s)</td>
                  <td className="px-6 py-3 w-[230px]">DOSAGE</td>
                  <td className="px-6 py-3 w-[170px] ">STATUS</td>
                  <td className="px-6 py-3 text-center">ACTION</td>
                </tr>
              </thead>
              <tbody className="h-[220px]">
                {patientPrescriptions.length > 0 && (
                  <>
                    {patientPrescriptions.map((prescription, index) => (
                      <tr
                        key={index}
                        className="group  even:bg-gray-50  border-b hover:bg-[#f4f4f4] text-[15px]"
                      >
                        <td className="truncate px-6 py-3 w-[230px]">
                          {prescription.prescriptions_uuid}
                        </td>
                        <td className="truncate  px-6 py-3 w-[230px] ">
                          {prescription.prescriptions_name}
                        </td>
                        <td className="truncate  px-6 py-3 w-[230px]">
                          {prescription.prescriptions_frequency}
                        </td>
                        <td className="truncate  px-6 py-3 w-[230px]">
                          {prescription.prescriptions_interval} hours
                        </td>
                        <td className="truncate  px-6 py-3 w-[230px] ">
                          {prescription.prescriptions_dosage}
                        </td>
                        <td className="px-6 py-3">
                          <div
                            className={`px-2 font-semibold rounded-[20px] ${
                              prescription.prescriptions_status === "active"
                                ? "bg-[#dfffea] text-[#17C653] text-[15px]"
                                : prescription.prescriptions_status ===
                                  "inactive"
                                ? "bg-[#FEE9E9] text-[#EF4C6A]  text-[15px]"
                                : prescription.prescriptions_status
                            }`}
                            style={{
                              width: `${
                                prescription.prescriptions_status.length * 10
                              }px`,
                            }}
                          >
                            {prescription.prescriptions_status}
                          </div>
                        </td>

                        <td className="px-6 py-3 flex gap-2 justify-center">
                          <p
                            onClick={() => {
                              isModalOpen(true);
                              setIsEdit(true);
                              setPrescriptionData(prescription);
                            }}
                          >
                            <Edit></Edit>
                          </p>
                          <p
                            onClick={() => {
                              isModalOpen(true);
                              setIsView(true);

                              setPrescriptionData(prescription);
                            }}
                          >
                            <View></View>
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
        <Modal
          content={
            <PrescriptionModalContent
              isModalOpen={isModalOpen}
              isOpen={isOpen}
              label="sample label"
              isEdit={isEdit}
              prescriptionData={prescriptionData}
              onSuccess={onSuccess}
              onFailed={onFailed}
              setErrorMessage={setError}
              setIsUpdated={setIsUpdated}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isView && (
        <Modal
          content={
            <PrescriptionViewModalContent
              isModalOpen={isModalOpen}
              isView={isView}
              prescriptionData={prescriptionData}
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
