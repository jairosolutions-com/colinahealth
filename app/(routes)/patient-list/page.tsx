"use client";

import { onNavigate } from "@/actions/navigation";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Edit from "@/components/shared/buttons/view";
import { useRouter } from "next/navigation";

export default function PatientPage() {
  const router = useRouter();
  return (
    <div className=" relative w-full mx-24 mt-24">
      <div className="flex justify-end">
        <a href="" className="text-[#64748B] underline">
          Back to Dashboard
        </a>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col mb-5 px-3">
          <p className="p-title">Patients List Records</p>
          {/* number of patiens */}
          <p className="text-[#64748B] font-normal w-[1157px] h-[22px] text-[21px] mt-2 ">
            Total of 20 Patients
          </p>
        </div>
        <div className="flex flex-row justify-end">
          <Add></Add>
          <DownloadPDF></DownloadPDF>
        </div>
      </div>

      <div className="mx-3 w-full shadow-md sm:rounded-lg items-center">
        <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px]">
          <form className=" mr-5">
            {/* search bar */}
            <label className=""></label>
            <div className="flex">
              <input
                className="outline-none py-3 px-5 m-5 w-[573px] h-[47px] pt-[14px]  ring-[1px] ring-[#E7EAEE]"
                type="text"
                placeholder="Search by reference no. or name..."
              />
            </div>
          </form>
          <div className="flex items-center">
            <p className="text-[#191D23] opacity-[60%]">Order by</p>
            <button className="bg-[#FFFFFF] w-[165px] h-[47px] mx-3 rounded-[5px] px-[20px] items-center flex justify-between">
              Select
              <img src="/imgs/dropdown.svg" alt="" />
            </button>
            <p className="text-[#191D23] opacity-[60%]">Sort by</p>
            <button className="bg-[#FFFFFF] w-[165px] h-[47px] mx-3 rounded-[5px] px-[20px] items-center flex justify-between">
              Choose
              <img src="/imgs/dropdown.svg" alt="" />
            </button>
          </div>
        </div>

        {/* START OF TABLE */}
        <div>
          <table className="w-full text-left rtl:text-right">
            <thead className="">
              <tr className="uppercase text-[#64748B] border-y  ">
                <th scope="col" className="px-6 py-3 w-[286px] h-[70px]">
                  Patient ID
                </th>
                <th scope="col" className="px-6 py-3 w-[552px]">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 w-[277px]">
                  Age
                </th>
                <th scope="col" className="px-6 py-3 w-[277px]">
                  Gender
                </th>

                <th scope="col" className="px-[70px] py-3 w-[210px] ">
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
                <td
                  onClick={() =>
                    onNavigate(router, "/medical-history/allergies")
                  }
                  className="cursor-pointer truncate max-w-[552px] px-6 py-4"
                >
                  Drake Ramos
                </td>
                <td className="px-6 py-4">21</td>
                <td className="px-6 py-4">Male</td>

                <td className="px-[50px] py-4">
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

                <td className="px-[50px] py-4">
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

                <td className="px-[50px] py-4">
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

                <td className="px-[50px] py-4">
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
      <div className="mx-3 mt-5">
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
                  <div className="px-5">
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
