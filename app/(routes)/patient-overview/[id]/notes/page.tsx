"use client";

import React from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modals/modals";

const Notes = () => {
  const router = useRouter();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortOrder, setSortOrder] = useState<string>("ASC");

  const [sortBy, setSortBy] = useState("Type");

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    setSortBy(option);
    console.log("option", option);
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Type", onClick: handleSortOptionClick },
    { label: "Severity", onClick: handleSortOptionClick },
    { label: "Reaction", onClick: handleSortOptionClick },
    { label: "Notes", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

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
      <div className="flex justify-between ">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h1 className="p-title">Notes</h1>
          </div>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[14px] mb-4 ">
            Total of 6 Patients
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
          <table className="w-full text-left rtl:text-right">
            <thead>
              <tr className="uppercase text-[#64748B] border-y  ">
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
              <tr className="odd:bg-white  even:bg-gray-50  border-b hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="  font-medium text-[16px] me-1 px-6 py-5 rounded-full flex justify-start "
                >
                  March 22, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-3">
                  Health Problem
                </td>
                <td className="px-6 py-3">
                  Get started with an enterprise-level, profesionally designed
                  profesionally designed
                </td>
                <td className="px-[90px] py-3">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white border-b hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="  font-medium text-[16px] me-1 px-6 py-5 rounded-full flex justify-start "
                >
                  March 22, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-3">
                  Health Problem
                </td>
                <td className="px-6 py-3">
                  Get started with an enterprise-level, profesionally designed
                  profesionally designed
                </td>
                <td className="px-[90px] py-3">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="  font-medium text-[16px] me-1 px-6 py-5 rounded-full flex justify-start "
                >
                  March 22, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-3">
                  Health Problem
                </td>
                <td className="px-6 py-3">
                  Get started with an enterprise-level, profesionally designed
                  profesionally designed
                </td>
                <td className="px-[90px] py-3">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white    border-b hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="  font-medium text-[16px] me-1 px-6 py-5 rounded-full flex justify-start "
                >
                  March 22, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-3">
                  Health Problem
                </td>
                <td className="px-6 py-3">
                  Get started with an enterprise-level, profesionally designed
                  profesionally designed
                </td>
                <td className="px-[90px] py-3">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50 hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="  font-medium text-[16px] me-1 px-6 py-5 rounded-full flex justify-start "
                >
                  March 22, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-3">
                  Health Problem
                </td>
                <td className="px-6 py-3">
                  Get started with an enterprise-level, profesionally designed
                  profesionally designed
                </td>
                <td className="px-[90px] py-3">
                  <Edit></Edit>
                </td>
              </tr>
            </tbody>
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
        {isOpen && (
          <Modal
            isModalOpen={isModalOpen}
            isOpen={isOpen}
            label="sample label"
          />
        )}
      </div>
    </div>
  );
};

export default Notes;
