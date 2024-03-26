import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const AppointmentsModal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null); // State to hold the selected date and time
  const [selectedStatus, setSelectedStatus] = useState(""); // State to hold the selected status

  return (
    <div className={`absolute inset-[-100px] bg-[#76898A99] flex items-center justify-center pb-40`}>
      <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            Add an Appointment
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">Submit your appointment schedule.</p>
        </div>
        <div className=" mb-9 pt-4">
          <div className="h-[600px] max-h-[300px] md:px-10 mt-5">
            <form className="">
              <div className="flex flex-col md:flex-row items-center mt-6 pb-3">
                <div className="flex-grow md:mr-8 mb-4 md:mb-0">
                  <DatePicker
                    selected={selectedDateTime}
                    onChange={(date: Date | null) => setSelectedDateTime(date)}
                    dateFormat="MM/dd/yyyy hh:mm aa"
                    showTimeSelect
                    timeFormat="hh:mm aa"
                    timeIntervals={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[7px] text-[#000] ring-1 ring-gray-200"
                  />
                </div>
                <div className="flex">
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-full md:w-auto px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mb-4 md:mb-0 mr-0 md:mr-8"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-full md:w-auto px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                >
                  Submit
                </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};