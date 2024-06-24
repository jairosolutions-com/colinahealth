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
          router,
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
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p className="p-title">Form</p>
              <span className="slash">{">"}</span>
              <span
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/forms/archived`,
                  );
                }}
                className="bread"
              >
                Archived
              </span>
            </div>
            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
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

        <div className="w-full items-center pt-2 sm:rounded-lg">
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
            <table className="text-left rtl:text-right">
              <thead>
                {" "}
                <tr className="h-[70px] border-b-[1px] text-[15px] font-semibold uppercase text-[#64748B]">
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
                    <td className="border-1 absolute flex w-[180vh] items-center justify-center py-5">
                      <p className="text-center text-[15px] font-normal text-gray-700">
                        No forms <br />
                      </p>
                    </td>
                  </tr>
                )}
                {patientForms.map((form, index) => (
                  <tr
                    key={index}
                    className="group border-b text-[15px] odd:bg-white hover:bg-[#f4f4f4]"
                  >
                    <td className="px-6 py-3">
                      <ResuableTooltip text={form.forms_uuid} />
                    </td>
                    <td className="px-6 py-3">
                      <ResuableTooltip text={form.forms_nameOfDocument} />
                    </td>
                    <td className="px-6 py-3">{form.forms_dateIssued}</td>
                    <td className="px-6 py-3">
                      <ResuableTooltip text={form.forms_notes} />
                    </td>

                    <td className="flex justify-center gap-2 px-6 py-3">
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
                          className="h-[35px] w-[90px] rounded bg-[#E7EAEE] hover:!bg-[#007C85] hover:!text-white group-hover:bg-white group-hover:text-black"
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
