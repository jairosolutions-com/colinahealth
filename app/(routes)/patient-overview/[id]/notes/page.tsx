"use client";

import React, { useEffect } from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/edit";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useParams, useRouter } from "next/navigation";
import { NotesModal } from "@/components/modals/notes.modal";
import { fetchNotesByPatient } from "@/app/api/notes-api/notes-api";
import { SuccessModal } from "@/components/shared/success";
import Loading from "./loading";

const Notes = () => {
  const router = useRouter();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [term, setTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isEdit, setIsEdit] = useState(false);
  const [notesToEdit, setNotesToEdit] = useState<any[]>([]);
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
    setIsOpenSortedBy(false);
    if (option === "Subject") {
      setSortBy("subject");
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
    { label: "Subject", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const [isOpen, setIsOpen] = useState(false);

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "scroll";
      setNotesToEdit([]);
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
        const response = await fetchNotesByPatient(
          patientId,
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          router
        );
        setPatientNotes(response.data);
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

  console.log(patientNotes, "patientNotes");

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
  };

  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <div className="  w-full">
      <div className="flex justify-between ">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h1 className="p-title">Notes</h1>
          </div>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] mb-4 ">
            Total of {totalNotes} Notes
          </p>
        </div>
        <div className="flex flex-row justify-end mt-[15px]">
          <button
            onClick={() => isModalOpen(true)}
            className=" mr-2 btn-add text-[#000000] w-[109px] h-[42px] radiu"
          >
            <img
              src="/imgs/add.svg"
              alt="Custom Icon"
              className="w-5 h-5 mr-2"
            />
            Add
          </button>
          <button className="btn-pdfs hover:bg-[#007C85] h-[42px] hover:border-[#007C85] hover:text-white flex items-center justify-center rounded-lg font-manrope text-black text-lg px-8 py-4 border-2 border-gray-300 text-center w-64 relative ">
            <img
              src="/imgs/downloadpdf.svg"
              alt="Custom Icon"
              className="w-5 h-5 mr-2"
            />
            Download PDF
          </button>
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
              label={"Select"}
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
          {patientNotes.length === 0 ? (
            <h1 className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-700">No Notes</p>
            </h1>
          ) : (
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="uppercase text-[#64748B] border-y  ">
                  <th scope="col" className="px-7 py-3 w-[200px] h-[60px]">
                    NOTES ID
                  </th>
                  <th scope="col" className="px-7 py-3 w-[200px] h-[60px]">
                    DATE
                  </th>
                  <th scope="col" className="px-6 py-3 w-[250px]">
                    SUBJECT
                  </th>
                  <th scope="col" className="px-6 py-3 w-[600px]">
                    NOTES
                  </th>
                  <th scope="col" className=" px-[90px] py-3 w-10">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientNotes.map((note, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white  even:bg-gray-50  border-b hover:bg-[#f4f4f4] group"
                  >
                    <td className="truncate max-w-[552px] px-6 py-3">
                      {note.notes_uuid}
                    </td>
                    <th
                      scope="row"
                      className="  font-medium text-[16px] me-1 px-6 py-5 rounded-full flex justify-start "
                    >
                      {new Date(note.notes_createdAt).toLocaleDateString()}
                    </th>
                    <td className="truncate max-w-[552px] px-6 py-3">
                      {note.notes_subject}
                    </td>
                    <td className="px-6 py-3">{note.notes_notes}</td>
                    <td className="px-[90px] py-3">
                      <p
                        onClick={() => {
                          isModalOpen(true);
                          setIsEdit(true);
                          setNotesToEdit(note);
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
        <NotesModal
          isEdit={isEdit}
          isModalOpen={isModalOpen}
          isOpen={isOpen}
          label={isEdit ? "Edit Note" : "Add Note"}
          notesToEdit={notesToEdit}
          onSuccess={onSuccess}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal
          label={isEdit ? "Edit Note" : "Add Note"}
          isAlertOpen={isSuccessOpen}
          toggleModal={setIsSuccessOpen}
          isEdit={isEdit}
        />
      )}
    </div>
  );
};

export default Notes;
