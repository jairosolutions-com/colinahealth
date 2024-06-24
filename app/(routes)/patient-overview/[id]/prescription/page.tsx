"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useRouter, useParams } from "next/navigation";
import { fetchPrescriptionByPatient as fetchPrescriptionsByPatient } from "@/app/api/prescription-api/prescription.api";
import { SuccessModal } from "@/components/shared/success";
import { ErrorModal } from "@/components/shared/error";
import Modal from "@/components/reusable/modal";
import { PrescriptionModalContent } from "@/components/modal-content/prescription-modal-content";
import View from "@/components/shared/buttons/view";
import { PrescriptionViewModalContent } from "@/components/modal-content/prescriptionview-modal-content";
import Pagination from "@/components/shared/pagination";
import Image from "next/image";
import ResuableTooltip from "@/components/reusable/tooltip";
export default function prescription() {
  const router = useRouter();
  if (typeof window === "undefined") {
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
        const response = await fetchPrescriptionsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router,
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
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="mb-2 flex w-full justify-between">
          <div className="flex-row">
            <p className="p-title">Prescription</p>

            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalPrescription} Prescriptions
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

          {/* START OF TABLE */}
          <div>
            {patientPrescriptions.length == 0 ? (
              <div className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                <p className="text-center text-[15px] text-xl font-semibold text-gray-700">
                  No Prescription/s <br />
                </p>
              </div>
            ) : (
              <table className="text-left rtl:text-right">
                <thead>
                  <tr className="h-[70px] border-y text-[15px] font-semibold text-[#64748B]">
                    <td className="px-6 py-3">PRESCRIPTION ID</td>
                    <td className="px-6 py-3">MEDICINE NAME</td>
                    <td className="px-6 py-3">FREQUENCY</td>
                    <td className="px-6 py-3">INTERVAL (hr/s)</td>
                    <td className="px-6 py-3">DOSAGE</td>
                    <td className="px-6 py-3">STATUS</td>
                    <td className="px-6 py-3 text-center">ACTION</td>
                    <td className="w-[14px]"></td>
                  </tr>
                </thead>
                <tbody className="h-[220px] overflow-y-scroll">
                  {patientPrescriptions.length > 0 && (
                    <>
                      {patientPrescriptions.map((prescription, index) => (
                        <tr
                          key={index}
                          className="group border-b text-[15px] even:bg-gray-50 hover:bg-[#f4f4f4]"
                        >
                          <td className="px-6 py-3">
                            <ResuableTooltip
                              text={prescription.prescriptions_uuid}
                            />
                          </td>
                          <td className="px-6 py-3">
                            <ResuableTooltip
                              text={prescription.prescriptions_name}
                            />
                          </td>
                          <td className="px-6 py-3">
                            {prescription.prescriptions_frequency}
                          </td>
                          <td className="px-6 py-3">
                            {prescription.prescriptions_interval === "1"
                              ? "1 hour"
                              : `${prescription.prescriptions_interval} hours`}
                          </td>
                          <td className="px-6 py-3">
                            {prescription.prescriptions_dosage}
                          </td>
                          <td className="px-6 py-3">
                            <div
                              className={`rounded-[20px] px-2 font-semibold ${
                                prescription.prescriptions_status === "active"
                                  ? "bg-[#dfffea] text-[15px] text-[#17C653]"
                                  : prescription.prescriptions_status ===
                                      "inactive"
                                    ? "bg-[#FEE9E9] text-[15px] text-[#EF4C6A]"
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

                          <td className="flex justify-center gap-2 px-6 py-3">
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
