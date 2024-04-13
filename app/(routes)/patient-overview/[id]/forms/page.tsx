"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";
import { FormsModalContent } from "@/components/modals/forms.modal";

export default function FormsTab() {
  const router = useRouter();
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sordOrder, setSortOrder] = useState("ASC");
  const [sortBy, setSortBy] = useState("firstName");
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
    console.log(sortBy, "ooption");
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
      document.body.style.overflow = "scroll";
    }
  };

  return (
    <div className="  w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="font-bold text-[20px]">Forms</h1>
        </div>
        <div className="flex flex-row justify-end">
          <Add
            onClick={() => {
              isModalOpen(true);
            }}
          ></Add>
          <DownloadPDF></DownloadPDF>
        </div>
      </div>

      <div className="w-full sm:rounded-lg items-center pt-2">
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
          <table className="w-full text-left rtl:text-right">
            <thead className=""></thead>
            <tbody></tbody>
          </table>
        </div>
        {/* END OF TABLE */}
      </div>
      {/* pagination */}
      <div className="mt-5 pb-5">
        <div className="flex justify-between">
          <p className="font-medium text-[14px] w-[138px] items-center">
            Page 1 of 10
          </p>
          <div>
            <nav>
              <div className="flex -space-x-px text-sm">
                <div>
                  <a
                    href="#"
                    className="flex border border-px items-center justify-center  w-[77px] h-full"
                  >
                    Prev
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="flex border border-px items-center justify-center  w-[49px] h-full"
                  >
                    1
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="flex border border-px items-center justify-center  w-[49px] h-full"
                  >
                    2
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    aria-current="page"
                    className="flex border border-px items-center justify-center  w-[49px] h-full"
                  >
                    3
                  </a>
                </div>

                <div className="">
                  <a
                    href="#"
                    className="flex border border-px items-center justify-center  w-[77px] h-full mr-5"
                  >
                    Next
                  </a>
                </div>
                <div className="flex">
                  <input
                    className="ipt-pagination border text-center"
                    type="text"
                    placeholder="-"
                  />
                  <div className="">
                    <button className="btn-pagination ">Go </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
        {isOpen && <FormsModalContent isModalOpen={isModalOpen} />}
      </div>
    </div>
  );
}
