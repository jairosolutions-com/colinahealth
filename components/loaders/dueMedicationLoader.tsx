import React from "react";
import Image from "next/image";
import DropdownMenu from "../dropdown-menu";
const DueMedicationLoader = () => {
  return (
    <div className="w-full animate-pulse pt-[90px] px-[150px] h-full flex flex-col justify-between">
      <div className="flex w-full justify-between items-center">
        <div className="flex flex-col">
          <div className="h-[30px] w-[150px] bg-gray-300 rounded-full mr-2"></div>
          <div className="h-[15px] w-[200px] bg-gray-400 rounded-full mr-2 mt-2"></div>
        </div>
        <div className="h-[50px] w-[220px] bg-gray-300 rounded-full mr-2"></div>
      </div>
      <div className="w-full sm:rounded-lg items-center">
        <div className="w-full mt-3 justify-between flex items-center bg-[#F4F4F4] h-[75px]">
          <form className="mr-5 relative">
            <label className=""></label>
            <div className="flex">
              <input
                className="py-3 px-5 m-5 w-[573px] outline-none h-[47px] pt-[14px] ring-[1px] ring-[#E7EAEE] text-[15px] rounded pl-10 relative bg-[#fff] bg-no-repeat "
                type="text"
                placeholder="Search by reference no. or name..."
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
              options={[]}
              open={false}
              width={"165px"}
              label={"Select"}
            />
            <p className="text-[#191D23] opacity-[60%] font-semibold text-[15px]">
              Sort by
            </p>
            <DropdownMenu
              options={[]}
              open={false}
              width={"165px"}
              label={"Select"}
            />
          </div>
        </div>
      </div>
      <table className="w-full h-full justify-center items-start text-[15px]">
        <thead className=" text-left rtl:text-right">
          <tr className="uppercase font-semibold text-[#64748B] border-b border-[#E7EAEE] h-[70px]">
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[50px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[50px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[50px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className=" group  bg-white hover:bg-gray-100  border-b">
            <td className="px-6 py-5 flex items-center gap-2">
              <div className="min-h-[45px] min-w-[45px] bg-gray-400 rounded-full mr-2 "></div>
              <div className="h-[22px] w-[250px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5">
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
          </tr>
          <tr className=" group  bg-white hover:bg-gray-100  border-b">
            <td className="px-6 py-5 flex items-center gap-2">
              <div className="min-h-[45px] min-w-[45px] bg-gray-400 rounded-full mr-2 "></div>
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
          </tr>
          <tr className=" group  bg-white hover:bg-gray-100  border-b">
            <td className="px-6 py-5 flex items-center gap-2">
              <div className="min-h-[45px] min-w-[45px] bg-gray-400 rounded-full mr-2 "></div>
              <div className="h-[22px] w-[250px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5">
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
          </tr>
          <tr className=" group  bg-white hover:bg-gray-100  border-b">
            <td className="px-6 py-5 flex items-center gap-2">
              <div className="min-h-[45px] min-w-[45px] bg-gray-400 rounded-full mr-2 "></div>
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
          </tr>
          <tr className=" group  bg-white hover:bg-gray-100  border-b">
            <td className="px-6 py-5 flex items-center gap-2">
              <div className="min-h-[45px] min-w-[45px] bg-gray-400 rounded-full mr-2 "></div>
              <div className="h-[22px] w-[250px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[100px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5 ">
              <div className="h-[22px] w-[120px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
            <td className="px-6 py-5">
              <div className="h-[22px] w-[150px] bg-gray-400 rounded-full mr-2 "></div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mb-6 flex justify-between">
        <div className="h-[22px] w-[80px] bg-gray-400 rounded-full mr-2 "></div>
        <div className="h-[22px] w-[430px] bg-gray-400 rounded-full mr-2 "></div>
      </div>
    </div>
  );
};

export default DueMedicationLoader;
