import React, { useEffect, useState } from "react";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  const [selectedStatus, setSelectedStatus] = useState(""); // State to hold the selected status

  return (
    <div className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-40`}>
      <div className="max-w-[1000px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            Appointment Details
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">List of Upcoming Schedules</p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[400px] w-screen md:px-9 mt-7">
            <form className="h-[600px] max-h-[400px] w-screen ">
            <table className="w-[500px] ">
            <thead className="">
              <tr className="uppercase text-[#64748B] bg-[#F4F4F4]   ">
              <th scope="col" className="px-9 py-3 w-[400px] h-[50px]">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 w-[400px] h-[50px]">
                  Day
                </th>
                <th scope="col" className="px-9 py-3 w-[300px] h-[50px]">
                  Time
                </th>
                <th scope="col" className="px-9 py-3 truncate max-w-[300px]">
                  Status
                </th>
                <th scope="col" className="px-8 py-3 w-[400px]">
                  Notes
                </th>
                <th scope="col" className="px-[80px] py-3 w-[10px] ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  March 26, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-4">
                Tuesday
                </td>
                <td className="px-6 py-4">6:20am</td>
                <td className="px-6 py-4">no status</td>
                <input
                type="text"
                required
                className=" w-full rounded-md h-7 mt-4 w-[170px] px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="input notes"
              />
                <td className="px-[70px] py-4">
                </td>
              </tr>
              <tr className="odd:bg-white hover:bg-[#f4f4f4] group">
                <th
                  scope="row"
                  className="truncate max-w-[286px] px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  March 27, 2024
                </th>
                <td className="truncate max-w-[552px] px-6 py-4">
                Wednesday
                </td>
                <td className="px-6 py-4">6:20am</td>
                <td className="px-6 py-4">no status</td>
                <input
                type="text"
                required
                className=" w-full rounded-md h-7 mt-4 w-[170px] px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="input notes"
              />

                <td className="px-[70px] py-4">
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 pb-3 flex items-center justify-center pr-[75px]">
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                >
                  Done
                </button>   
                </div>  
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};