"use client";

import Image from "next/image";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormsModalContent } from "@/components/modal-content/forms-modal-content";
import { FormViewsModalContent } from "@/components/modal-content/formsview-modal-content";
import Modal from "@/components/reusable/modal";
import {
  createFormsOfPatient,
  fetchFormsByPatient,
  addFormFile,
  deleteFormFiles,
  getCurrentFileCountFromDatabase,
  updateFormsOfPatient,
} from "@/app/api/forms-api/forms.api";
import { toast } from "@/components/ui/use-toast";
import { SuccessModal } from "@/components/shared/success";
import { ConfirmationModal } from "@/components/modal-content/confirmation-modal-content";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
interface Modalprops {
  isEdit: any;
  formAddData: any;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

interface FormFile {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  file_uuid: string;
}

function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
  throw new Error("Function not implemented.");
}

export default function FormsTab() {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [selectedFiles, setSelectedFormFiles] = useState<File[]>([]);
  const [numFilesCanAdd, setNumFilesCanAdd] = useState<number>(5);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [formFiles, setFormFiles] = useState<any[]>([]); //
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

  const isConfirmModalOpen = (confirmArchived: boolean) => {
    setConfirmArchived(confirmArchived);
    if (confirmArchived) {
      document.body.style.overflow = "hidden";
    } else if (!confirmArchived) {
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

  const handleIsArchived = async (formUuid: string) => {
    setIsSubmitted(true);
    try {
      await updateFormsOfPatient(formUuid, formData, router);
      onSuccess();
      setConfirmArchived(false);
      isModalOpen(false);

      return;
    } catch (error) {
    } finally {
      setIsSubmitted(false);
    }
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

  return (
    <div className="  w-full h-full flex flex-col justify-between">
      <div className="w-full h-full">
        <div className="w-full justify-between flex ">
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
              <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[15px]">
                Total of {totalForms} logs
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsAddOpen(true);
              }}
              className="btn-add gap-2"
            >
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

          {/* START OF TABLE */}
          <div>
            <table className="text-left rtl:text-right">
              <thead>
                {" "}
                <tr className="uppercase text-[#64748B] border-b-[1px] text-[15px] h-[70px] font-semibold">
                  <td className="px-6 py-3">FORM UID</td>
                  <td className="px-6 py-3">NAME OF DOCUMENT</td>
                  <td className="px-6 py-3">DATE ISSUED</td>
                  <td className="px-6 py-3">NOTES</td>
                  <td className="px-6 py-3 text-center">ACTION</td>
                  <td className="w-[14px]"></td>
                </tr>
              </thead>
              <tbody className="h-[220px] overflow-y-scroll">
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
                    <td className="px-6 py-3">
                      <ResuableTooltip text={form.forms_uuid} />
                    </td>
                    <td className="px-6 py-3 ">
                      <ResuableTooltip text={form.forms_nameOfDocument} />
                    </td>
                    <td className="px-6 py-3 ">{form.forms_dateIssued}</td>
                    <td className="px-6 py-3 ">
                      <ResuableTooltip text={form.forms_notes} />
                    </td>

                    <td className="px-6 py-3 flex gap-2 justify-center">
                      <p
                        onClick={() => {
                          isModalOpen(true);
                          setIsEdit(true);
                          setFormViewData(form);
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
      </div>
      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setCurrentPage={setCurrentPage}
      />
      {confirmArchived && (
        <Modal
          content={
            <ConfirmationModal
              uuid={formsUuid}
              setConfirm={setConfirmArchived}
              label="Archived"
              handleFunction={(e) => {
                handleIsArchived(formsUuid);
              }}
              isSubmitted={isSubmitted}
            />
          }
          isModalOpen={isConfirmModalOpen}
        />
      )}
      {isOpen && (
        <Modal
          content={
            <FormViewsModalContent
              isModalOpen={isModalOpen}
              formsData={formViewdData}
              isView={false}
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
              isEdit={undefined}
              formAddData={undefined}
            />
          }
          isModalOpen={isAddModalOpen}
        />
      )}
    </div>
  );
}
