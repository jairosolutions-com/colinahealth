"use client";

import DropdownMenu from "@/components/dropdown-menu";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useState } from "react";
import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";

export default function Surgeries() {
  const router = useRouter();
  // start of orderby & sortby function
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);

  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);

  const optionsOrderedBy = ["Accending", "Decending"];
  const optionsSortBy = ["Type", "Surgery", "Notes"];
  // end of orderby & sortby function

  return (
    <div className="  w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <h1 className="font-semibold text-[30px]">Medical History</h1>
            <h1 className="font-semibold text-[30px] mx-2">{">"} </h1>
            <h1
              onClick={() => onNavigate(router, "/medical-history/allergies")}
              className=" font-semibold text-[25px]  cursor-pointer text-gray-600"
            >
              Allergies
            </h1>
            <h1 className="font-semibold text-[30px] mx-2">{">"} </h1>
            <h1 className="font-semibold text-[25px] cursor-pointer text-[#007C85]">
              Surgeries
            </h1>
          </div>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[21px] mt-2 mb-4 ">
            Total of 6 Patients
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <Add></Add>
          <DownloadPDF></DownloadPDF>
        </div>
      </div>

      <div className="w-full shadow-md sm:rounded-lg items-center">
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
                <th scope="col" className="px-6 py-3 w-[288px] h-[70px]">
                  DATE
                </th>
                <th scope="col" className="px-6 py-3 w-[558px]">
                  TYPE
                </th>
                <th scope="col" className="px-6 py-3 w-[450px]">
                  SURGERY
                </th>
                <th scope="col" className="px-6 py-3 w-[250px]">
                  NOTES
                </th>

                <th scope="col" className="px-[70px] py-3 w-[10px] ">
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
                  10/12/2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-4">
                  Skin Allergy
                </td>
                <td className="px-6 py-4">Major</td>
                <td className="px-6 py-4">Irritated</td>

                <td className="px-[50px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  10/12/2024
                </th>
                <td className="px-6 py-4">Skin Allergy</td>
                <td className="px-6 py-4">Major</td>
                <td className="px-6 py-4">Irritated</td>

                <td className="px-[50px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  10/12/2024
                </th>
                <td className="px-6 py-4">Skin Allergy</td>
                <td className="px-6 py-4">Major</td>
                <td className="px-6 py-4">Irritated</td>

                <td className="px-[50px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr className="odd:bg-white  even:bg-gray-50  border-b dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  10/12/2024
                </th>
                <td className="px-6 py-4">Skin Allergy</td>
                <td className="px-6 py-4">Major</td>
                <td className="px-6 py-4">Irritated</td>

                <td className="px-[50px] py-4">
                  <Edit></Edit>
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
                >
                  10/12/2024
                </th>
                <td className="px-6 py-4">Skin Allergy</td>
                <td className="px-6 py-4">Major</td>
                <td className="px-6 py-4">Irritated</td>

                <td className="px-[50px] py-4">
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
          <p className="font-medium size-[18px] w-[138px] items-center">
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
                  {/* wala pay active function */}
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

                <div className="ml-5">
                  <a
                    href="#"
                    className="flex border border-px items-center justify-center  w-[77px] h-full"
                  >
                    Next
                  </a>
                </div>
                <div className="flex px-5 ">
                  <input
                    className="ipt-pagination text-center border ring-1 ring-gray-300 border-gray-100"
                    type="text"
                    placeholder="-"
                  />
                  <div className="px-9">
                    <button className="btn-pagination ">Go </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
