"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormsModalContent } from "@/components/modal-content/forms-modal-content";
import { FormsviewModalContent } from "@/components/modal-content/formsview-modal-content";
import Modal from "@/components/reusable/modal";
import {
  fetchFormsByPatient,
  updateFormsOfPatient,
} from "@/app/api/forms-api/forms.api";
import { SuccessModal } from "@/components/shared/success";

export default function FormsTab() {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const [formViewdData, setFormViewData] = useState<any[]>([]);
  const patientId = params.id.toUpperCase();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientForms, setPatientForms] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("dateIssued");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalForms, setTotalForms] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [term, setTerm] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [formsToEdit, setFormsToEdit] = useState<any[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isView, setIsView] = useState(false);
  const [confirmArchived, setConfirmArchived] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formsUuid, setFormsUuid] = useState("");
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "Form ID") {
      setSortBy("uuid");
    } else if (option == "Name") {
      setSortBy("nameofDocument");
    } else if (option == "Date") {
      setSortBy("dateIssued");
    }
    console.log(sortBy, "option");
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Form ID", onClick: handleSortOptionClick },
    { label: "Name", onClick: handleSortOptionClick },
    { label: "Date Issued", onClick: handleSortOptionClick },
  ];
  // end of orderby & sortby function

  const [isOpen, setIsOpen] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
    }
  };

  // add form
  const [isAddOpen, setIsAddOpen] = useState(false);
  const isAddModalOpen = (isAddOpen: boolean) => {
    setIsAddOpen(isAddOpen);
    if (isAddOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isAddOpen) {
      document.body.style.overflow = "visible";
    }
  };
  // add form

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
        const response = await fetchFormsByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          false,
          router
        );
        setPatientForms(response.data);
        console.log("DATAAAAA:", response.data);
        setTotalPages(response.totalPages);
        setTotalForms(response.totalCount);
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
  };

  const [formData, setFormData] = useState({
    isArchived: true,
  });

  const handleIsArchived = async (formUuid: string, e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      await updateFormsOfPatient(formUuid, formData, router);
      onSuccess();
      setConfirmArchived(false);
      isModalOpen(false);

      return;
    } catch (error) {}

    setIsSubmitted(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }

  return (
    <div className="  w-full">
      <div className="w-full justify-between flex mb-2">
        <div className="flex-row">
          <div className="flex gap-2">
            <p className="p-title">Form</p>
            <span className="slash">{">"}</span>
            <span
              onClick={() => {
                setIsLoading(true);
                router.replace(
                  `/patient-overview/${patientId.toLowerCase()}/forms/archived`
                );
              }}
              className="bread"
            >
              Archived
            </span>
          </div>
          <div>
            <p>Total of {totalForms} logs</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsAddOpen(true);
            }}
            className="btn-add gap-2"
          >
            <img src="/imgs/add.svg" alt="" />
            <p className="text-[18px]">Add</p>
          </button>
          <button className="btn-pdfs gap-2">
            <img src="/imgs/downloadpdf.svg" alt="" />
            <p className="text-[18px]">Download PDF</p>
          </button>
        </div>
      </div>

      <div className="w-full sm:rounded-lg items-center pt-2">
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
                <td className="px-6 py-3">FORM UID</td>
                <td className="px-6 py-3">NAME OF DOCUMENT</td>
                <td className="px-6 py-3">DATE ISSUED</td>
                <td className="px-6 py-3">NOTES</td>
                <td className="px-20 py-3">ACTION</td>
              </tr>
            </thead>
            <tbody className="h-[220px]">
              {patientForms.length === 0 && (
                <tr>
                  <td className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                    <p className="text-[15px] font-normal text-gray-700 text-center">
                      No forms <br />
                    </p>
                  </td>
                </tr>
              )}
              {patientForms.map((form, index) => (
                <tr
                  key={index}
                  className="odd:bg-white border-b hover:bg-[#f4f4f4] group text-[15px]"
                >
                  <td className="truncate px-6 py-3">{form.forms_uuid}</td>
                  <td className="truncate px-6 py-3 ">
                    {form.forms_nameOfDocument}
                  </td>
                  <td className="truncate px-6 py-3 ">
                    {form.forms_dateIssued}
                  </td>
                  <td className="truncate px-6 py-3 ">{form.forms_notes}</td>

                  <td className="px-6 py-3 flex gap-2">
                    <p
                      onClick={() => {
                        isModalOpen(true);
                        setIsEdit(true);
                        setFormsToEdit(form);
                      }}
                    >
                      <Edit />
                    </p>
                    <p>
                      <button
                        onClick={(e) => {
                          setFormsUuid(form.forms_uuid);
                          setConfirmArchived(true);
                        }}
                        className="w-[90px] h-[35px] rounded bg-[#E7EAEE]  hover:!text-white hover:!bg-[#007C85] group-hover:bg-white group-hover:text-black"
                      >
                        Archive
                      </button>
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
      {confirmArchived && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#76898A99]">
          <div className="bg-white max-w-lg rounded-lg w-[700px] h-[146px]">
            <div className="flex justify-center items-center pt-6 pb-6">
              <h2 className="font-semibold text-[20px] text-[#667085]">
                Are you sure to archive this?
              </h2>
            </div>
            <div className="flex border-t-4">
              <button
                onClick={() => setConfirmArchived(false)}
                disabled={isSubmitted}
                type="button"
                className={`
                              ${isSubmitted && " cursor-not-allowed"}
                              w-[600px] h-[50px] px-3 py-2 bg-[#BCBCBC] hover:bg-[#D9D9D9] font-medium text-white mt-4 mr-[3px] rounded-bl-md`}
              >
                No
              </button>
              <button
                disabled={isSubmitted}
                type="button"
                onClick={(e) => {
                  handleIsArchived(formsUuid, e);
                }}
                className={`
                                ${isSubmitted && " cursor-not-allowed"}
                                w-[600px] px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] text-white font-medium mt-4 rounded-br-md`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {isOpen && (
        <Modal
          content={
            <FormsviewModalContent
              isModalOpen={isModalOpen}
              formData={formViewdData}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isSuccessOpen && (
        <SuccessModal
          label={isEdit ? "Edit Form" : "Add Form"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isAddOpen && (
        <Modal
          content={
            <FormsModalContent
              isModalOpen={setIsAddOpen}
              onSuccess={onSuccess}
            />
          }
          isModalOpen={isAddModalOpen}
        />
      )}
    </div>
  );
}
