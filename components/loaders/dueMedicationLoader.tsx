import React from "react";
import Image from "next/image";
import DropdownMenu from "../dropdown-menu";
import DownloadPDF from "../shared/buttons/downloadpdf";
import Pagination from "../shared/pagination";
import PaginationLoader from "./PaginationLoader";
const DueMedicationLoader = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between px-[150px] pt-[90px]">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <div className="p-title mr-2 w-full rounded-full">
              Due Medication
            </div>
            <div className="sub-title">Total of 0 Due Medication</div>
          </div>
          <div className="flex h-full flex-row justify-end">
            <DownloadPDF></DownloadPDF>
          </div>
        </div>
        <div className="w-full items-center sm:rounded-lg">
          <div className="mt-3 flex h-[75px] w-full items-center justify-between bg-[#F4F4F4]">
            <form className="relative mr-5">
              <label className=""></label>
              <div className="flex">
                <input
                  className="relative m-5 h-[47px] w-[573px] rounded-[4.69px] bg-[#fff] bg-no-repeat px-5 py-3 pl-10 pt-[14px] text-[15px] outline-none ring-[1px] ring-[#E7EAEE]"
                  type="text"
                  placeholder="Search by reference no. or name..."
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
                options={[]}
                open={false}
                width={"165px"}
                label={"Select"}
              />
              <p className="text-[15px] font-semibold text-[#191D23] opacity-[60%]">
                Sort by
              </p>
              <DropdownMenu
                options={[]}
                open={false}
                width={"165px"}
                label={"Choose"}
              />
            </div>
          </div>
        </div>
        <table className="h-full w-full items-start justify-center text-[15px]">
          <thead className="text-left rtl:text-right">
            <tr className="sub-title h-[70px] border-b border-[#E7EAEE] !font-semibold uppercase">
              <td className="px-6 py-5">Name</td>
              <td className="w-[300px] px-6 py-5">DUE MED UID</td>
              <td className="px-6 py-5">Medication</td>
              <td className="w-[200px] px-6 py-5">Date</td>
              <td className="w-[200px] px-6 py-5">Time</td>
            </tr>
          </thead>
          <tbody className="animate-pulse">
            <tr className="group border-b bg-white hover:bg-gray-100">
              <td className="flex items-center gap-2 px-6 py-5">
                <div className="mr-2 min-h-[45px] min-w-[45px] rounded-full bg-gray-400"></div>
                <div className="h-[22px] w-[250px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[300px] px-6 py-5">
                <div className="h-[22px] w-[180px] rounded-full bg-gray-400"></div>
              </td>
              <td className="px-6 py-5">
                <div className="h-[22px] w-[300px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[100px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[130px] rounded-full bg-gray-400"></div>
              </td>
            </tr>
            <tr className="group border-b bg-white hover:bg-gray-100">
              <td className="flex items-center gap-2 px-6 py-5">
                <div className="mr-2 min-h-[45px] min-w-[45px] rounded-full bg-gray-400"></div>
                <div className="h-[22px] w-[230px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[300px] px-6 py-5">
                <div className="h-[22px] w-[230px] rounded-full bg-gray-400"></div>
              </td>
              <td className="px-6 py-5">
                <div className="h-[22px] w-[250px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[120px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[90px] rounded-full bg-gray-400"></div>
              </td>
            </tr>
            <tr className="group border-b bg-white hover:bg-gray-100">
              <td className="flex items-center gap-2 px-6 py-5">
                <div className="mr-2 min-h-[45px] min-w-[45px] rounded-full bg-gray-400"></div>
                <div className="h-[22px] w-[270px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[300px] px-6 py-5">
                <div className="h-[22px] w-[200px] rounded-full bg-gray-400"></div>
              </td>
              <td className="px-6 py-5">
                <div className="h-[22px] w-[100px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[110px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[120px] rounded-full bg-gray-400"></div>
              </td>
            </tr>
            <tr className="group border-b bg-white hover:bg-gray-100">
              <td className="flex items-center gap-2 px-6 py-5">
                <div className="mr-2 min-h-[45px] min-w-[45px] rounded-full bg-gray-400"></div>
                <div className="h-[22px] w-[215px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[300px] px-6 py-5">
                <div className="h-[22px] w-[220px] rounded-full bg-gray-400"></div>
              </td>
              <td className="px-6 py-5">
                <div className="h-[22px] w-[90px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[80px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[80px] rounded-full bg-gray-400"></div>
              </td>
            </tr>
            <tr className="group border-b bg-white hover:bg-gray-100">
              <td className="flex items-center gap-2 px-6 py-5">
                <div className="mr-2 min-h-[45px] min-w-[45px] rounded-full bg-gray-400"></div>
                <div className="h-[22px] w-[250px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[300px] px-6 py-5">
                <div className="h-[22px] w-[180px] rounded-full bg-gray-400"></div>
              </td>
              <td className="px-6 py-5">
                <div className="h-[22px] w-[300px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[100px] rounded-full bg-gray-400"></div>
              </td>
              <td className="w-[200px] px-6 py-5">
                <div className="h-[22px] w-[130px] rounded-full bg-gray-400"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between">
        <PaginationLoader />
      </div>
    </div>
  );
};

export default DueMedicationLoader;
