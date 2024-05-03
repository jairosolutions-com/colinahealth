"use client";
import Image from "next/image";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useEffect, useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { FormsviewModalContent } from "@/components/modal-content/formsview-modal-content";
import Modal from "@/components/reusable/modal";
import { fetchFormsByPatient } from "@/app/api/forms-api/forms.api";
import { SuccessModal } from "@/components/shared/success";
import Pagination from "@/components/shared/pagination";

export default function ArchiveTab() {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientForms, setPatientForms] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("dateIssued");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [term, setTerm] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);
  const [formsToView, setFormsToView] = useState<any[]>([]);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "Age") {
      setSortBy("age");
    } else if (option == "Name") {
      setSortBy("firstName");
    } else if (option == "Gender") {
      setSortBy("gender");
    }
    console.log(sortBy, "option");
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Vital Sign ID", onClick: handleSortOptionClick },
    { label: "Date", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Blood Pressure", onClick: handleSortOptionClick },
    { label: "Heart Rate", onClick: handleSortOptionClick },
    { label: "Temperature", onClick: handleSortOptionClick },
    { label: "Respiratory", onClick: handleSortOptionClick },
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
          router
        );
        setPatientForms(response.data);
        setTotalPages(response.totalPages);
        setTotalNotes(response.totalCount);
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
  console.log(patientForms, "patientForms");
  return (
    <div className="  w-full h-full flex flex-col justify-between">
      <div className="w-full h-full">
        <div className="w-full justify-between flex">
          <div className="flex-row">
            <div className="flex gap-2">
              <p
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/forms`
                  );
                }}
                className="p-title hover:underline cursor-pointer"
              >
                Form
              </p>
              <p className="slash">{">"}</p>
              <p className="active">Archived</p>
            </div>
            <div>
              <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[15px]">
                Total of 6 logs
              </p>
            </div>
          </div>
          <div className="flex gap-2">
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
          {patientForms.length == 0 ? (
            <div>
              <div className="w-full flex-col justify-center items-center">
                <table className="w-full block text-left rtl:text-right">
                  <thead className="w-full ">
                    <tr className=" text-[#64748B] border-b-[1px] text-[15px]">
                      <th scope="col" className="px-6 py-3 w-[400px] h-[70px]">
                        NAME OF DOCUMENT
                      </th>
                      <th scope="col" className="px-6 py-3 w-[400px]">
                        DATE ISSUED
                      </th>
                      <th scope="col" className="px-6 py-3 w-[750px]">
                        NOTES
                      </th>
                      <th scope="col" className="px-6 py-3 max-w-[300px]">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                </table>
                <div className="py-5 flex justify-center items-center">
                  <p className="font-normal text-gray-700 text-center text-[15px]">
                    No Form/s
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full block text-left rtl:text-right">
              <thead className="w-full">
                <tr className=" text-[#64748B] border-b-[1px] text-[15px]">
                  <th scope="col" className="px-6 py-3 w-[400px] h-[70px]">
                    NAME OF DOCUMENT
                  </th>
                  <th scope="col" className="px-6 py-3 w-[400px]">
                    DATE ISSUED
                  </th>
                  <th scope="col" className="px-6 py-3 w-[750px]">
                    NOTES
                  </th>
                </tr>
              </thead>

              <tbody className="overflow-y-scroll">
                {patientForms.map((form, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white border-b hover:bg-[#f4f4f4] group text-[15px]"
                  >
                    <th
                      scope="row"
                      className="truncate px-6 py-3 w-[400px] font-medium text-gray-900 whitespace-nowrap"
                    >
                      {form.forms_nameOfDocument}
                    </th>
                    <td className="px-6 py-3 w-[400px]">
                      {form.forms_dateIssued}
                    </td>
                    <td className="px-6 py-3 w-[750px] max-w-[750px] truncate">
                      {form.forms_notes}
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
            <FormsviewModalContent
              isModalOpen={isModalOpen}
              formData={setFormsToView}
            />
          }
          isModalOpen={isModalOpen}
        />
      )}
      {isSuccessOpen && (
        <SuccessModal
          label={isEdit ? "Edit Note" : "Add Note"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isUpdated={isUpdated}
          setIsUpdated={setIsUpdated}
        />
      )}
    </div>
  );
}
