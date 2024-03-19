"use client";

import React from "react";
import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/shared/modals";

const Allergies = () => {
  const router = useRouter();
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);

  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);

  const optionsOrderedBy = ["Accending", "Decending"];
  const optionsSortBy = ["Type", "Severity", "Reaction", "Notes"];
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
      <div className="flex justify-between ">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h1 className="p-title">Medical History</h1>
            <h1 className="p-title mx-2">{">"} </h1>
            <h1 className="p-title text-[#007C85] cursor-pointer">Allergies</h1>
            <h1 className="p-title mx-2">{">"} </h1>
            <h1
              onClick={() =>
                onNavigate(
                  router,
                  "/patient-overview/patiendId/medical-history/surgeries"
                )
              }
              className="p-title cursor-pointer text-gray-600"
            >
              Surgeries
            </h1>
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
              options={optionsOrderedBy}
              open={isOpenOrderedBy}
              width={"165px"}
              label={"Select"}
            />

            <p className="text-[#191D23] opacity-[60%] font-semibold">
              Sort by
            </p>
            <DropdownMenu
              options={optionsSortBy}
              open={isOpenSortedBy}
              width={"165px"}
              label={"Select"}
            />
          </div>
        </div>

        {/* START OF TABLE */}
        <div>
          <table className="w-full text-left rtl:text-right">
            <thead className="">
              <tr className="uppercase text-[#64748B] border-y  ">
                <th scope="col" className="px-6 py-3 w-[300px] h-[70px]">
                  Patient ID
                </th>
                <th scope="col" className="px-6 py-3 w-[400px]">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 w-[400px]">
                  Age
                </th>
                <th scope="col" className="px-6 py-3 w-[300px]">
                  Gender
                </th>

                <th scope="col" className="px-[80px] py-3 w-[10px] ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  SGY-5146846548465
                </th>
                <td className="truncate max-w-[552px] px-6 py-4">
                  Drake Ramos
                </td>
                <td className="px-6 py-4">21</td>
                <td className="px-6 py-4">Male</td>

                <td className="px-[70px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  SGY-5146846548465
                </th>
                <td className="px-6 py-4">Drake Ramos</td>
                <td className="px-6 py-4">21</td>
                <td className="px-6 py-4">Male</td>

                <td className="px-[70px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  SGY-5146846548465
                </th>
                <td className="px-6 py-4">Drake Ramos</td>
                <td className="px-6 py-4">21</td>
                <td className="px-6 py-4">Male</td>

                <td className="px-[70px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  SGY-5146846548465
                </th>
                <td className="px-6 py-4">Drake Ramos</td>
                <td className="px-6 py-4">21</td>
                <td className="px-6 py-4">Male</td>

                <td className="px-[70px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
                >
                  SGY-5146846548465
                </th>
                <td className="px-6 py-4">Drake Ramos</td>
                <td className="px-6 py-4">21</td>
                <td className="px-6 py-4">Male</td>

                <td className="px-[70px] py-4">
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

export default Allergies;
