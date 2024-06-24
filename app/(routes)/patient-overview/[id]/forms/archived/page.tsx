"use client";
import Image from "next/image";
import DropdownMenu from "@/components/dropdown-menu";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFormsByPatient } from "@/app/api/forms-api/forms.api";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";

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
  const [patientArchive, setpatientArchive] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("dateIssued");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalArchive, setTotalArchive] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [term, setTerm] = useState<string>("");
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "Name") {
      setSortBy("nameofDocument");
    } else if (option == "Notes") {
      setSortBy("notes");
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
    { label: "NAME", onClick: handleSortOptionClick },
    { label: "DATE ISSUED", onClick: handleSortOptionClick },
    { label: "NOTES", onClick: handleSortOptionClick },
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
    }
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
          true,
          router,
        );
        setpatientArchive(response.data);
        setTotalPages(response.totalPages);
        setTotalArchive(response.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortOrder, sortBy, term]);

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
  console.log(patientArchive, "patientArchive");
  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full w-full">
        <div className="flex w-full justify-between">
          <div className="flex-row">
            <div className="flex gap-2">
              <p
                onClick={() => {
                  setIsLoading(true);
                  router.replace(
                    `/patient-overview/${patientId.toLowerCase()}/forms`,
                  );
                }}
                className="p-title cursor-pointer hover:underline"
              >
                Form
              </p>
              <p className="slash">{">"}</p>
              <p className="active">Archived</p>
            </div>
            <div>
              <p className="h-[22px] w-[1157px] text-[15px] font-normal text-[#64748B]">
                Total of {totalArchive} logs
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
        </div>

        {/* START OF TABLE */}
        <div>
          {patientArchive.length == 0 ? (
            <div>
              <div className="w-full flex-col items-center justify-center">
                <table className="block w-full text-left rtl:text-right">
                  <thead className="w-full">
                    <tr className="border-b-[1px] text-[15px] text-[#64748B]">
                      <td className="h-[70px] px-6 py-3">NAME OF DOCUMENT</td>
                      <td className="px-6 py-3">DATE ISSUED</td>
                      <td className="px-6 py-3">NOTES</td>
                      <td className="px-6 py-3">ACTION</td>
                    </tr>
                  </thead>
                </table>
                <div className="flex items-center justify-center py-5">
                  <p className="text-center text-[15px] font-normal text-gray-700">
                    No Form/s
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <table className="block w-full text-left rtl:text-right">
              <thead className="w-full">
                <tr className="h-[70px] border-b-[1px] text-[15px] font-semibold text-[#64748B]">
                  <td className="px-6 py-3">NAME OF DOCUMENT</td>
                  <td className="px-6 py-3">DATE ISSUED</td>
                  <td className="px-6 py-3">NOTES</td>
                  <td className="w-[14px]"></td>
                </tr>
              </thead>

              <tbody className="h-[220px] overflow-y-scroll">
                {patientArchive.map((form, index) => (
                  <tr
                    key={index}
                    className="group border-b text-[15px] odd:bg-white hover:bg-[#f4f4f4]"
                  >
                    <td className="px-6 py-3">
                      <ResuableTooltip text={form.forms_nameOfDocument} />
                    </td>
                    <td className="px-6 py-3">{form.forms_dateIssued}</td>
                    <td className="px-6 py-3">
                      <ResuableTooltip text={form.forms_notes} />
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
    </div>
  );
}
