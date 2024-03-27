"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "../shared/timepicker";
interface Modalprops {
  isView: boolean;
  appointmentData: any;
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const AppointmentsModal = ({
  isView,
  appointmentData,
  label,
  isOpen,
  isModalOpen,
}: Modalprops) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date and time
  const [selectedStatus, setSelectedStatus] = useState(""); // State to hold the selected status
  const [formData, setFormData] = useState({
    date: appointmentData.appointments_appointmentDate,
    time: appointmentData.appointments_appointmentTime,
    endTime: appointmentData.appointments_appointmentEndTime,
    details: appointmentData.appointments_details,
    status: appointmentData.appointments_appointmentStatus,
  });
  return (
    <div
      className={`absolute inset-[-200px] bg-[#76898A99] flex items-center justify-center pb-[170px]`}
    >
      <div className="max-w-[600px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {isView ? "Appointment Details" : "Make an Appointment"}
          </h2>
          <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">
            {isView ? (
              <div className="flex">
                <div className="w-1 h-1 my-2 mx-1 mt-2 bg-green-500 rounded-full"></div>
                Upcoming Schedule
                <button
                  onClick={() => isModalOpen(false)}
                  type="button"
                  className="w-24 h-8 hover:bg-[#D9D9D9] font-medium rounded text-[#000] ring-1 ring-gray-200 ml-[180px] "
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex">
                <div className="w-1 h-1 my-2 mx-1 mt-2 bg-green-500 rounded-full"></div>
                Submit your appointment schedule.
              </div>
            )}
          </p>
        </div>
        {isView === true && (
          <div className=" mb-9 pt-4">
            <div className="h-[600px] max-h-[470px] md:px-10 mt-5">
              <form className="">
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-9</div>00 required-field"
                    >
                      DATE
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder={formData.date}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      DAY
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="AUTOGEN TUESDAY"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      TIME
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="input time"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      END TIME
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        required
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                        placeholder="input end time"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      DETAILS
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        rows={4}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="input details"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      STATUS
                    </label>
                    <div className="mt-2.5">
                      <select
                        id="status"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        defaultValue="select status"
                      >
                        <option value="">select status</option>
                        <option value="">SUCCESSFUL</option>
                        <option value="Pending">CANCELED</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pb-3 flex flex-row">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isView === false && (
          <div className=" mb-9 pt-4">
            <div className="h-[400px] max-h-[400px] md:px-10 mt-5">
              <form className="">
                <div className=" grid gap-2 grid-cols-12  mt-6 ">
                  {/* Date Picker */}
                  <div className="w-full col-span-6 mb-4 md:mb-0">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date) => setSelectedDate(date)}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="Select Date"
                      className="w-full pl-2 pr-40 py-4 border-0 shadow-sm ring-1 ring-inset ring-gray-300 rounded-[5px] text-xs"
                      popperClassName="z-50" // Set a high z-index directly
                    />
                  </div>
                  {/* Time Pickers and Details */}
                  <div className="col-span-6 flex flex-col ">
                    {/* Time From */}
                    <div className="grid grid-rows-2">
                      <p className="text-xs font-bold text-black self-end">
                        Time From:
                      </p>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date!)}
                        timeFormat="hh:mm aa"
                        timeIntervals={15}
                        placeholderText="Select time from"
                        className="w-full h-full px-3 py-4 text-xs border-0 shadow-sm ring-1 ring-inset ring-gray-300 rounded-[5px]"
                      />
                    </div>
                    {/* Time To */}
                    <div className="flex col-span-3 content-end grid grid-rows-2 ">
                      <p className="text-xs font-bold text-black pt-7">
                        Time To:
                      </p>
                      {/* onChange={(time: null) =>
                          setSelectedTime())
                                                              timeIntervals={15}
            placeholderText="Select time to"

                        } */}
                      <TimePicker />
                    </div>
                    {/* Details */}
                    <div className=" col-span-3  ">
                      <p className="text-xs font-bold text-black pt-7 ">
                        Details
                      </p>
                      <textarea
                        rows={4}
                        className=" w-full px-3 py-4 text-gray-900 border-0 shadow-sm ring-1 ring-inset ring-gray-300 rounded-[5px]  resize-none placeholder:text-gray-400  text-xs  "
                        placeholder="input notes"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pb-3 flex justify-center flex-row">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <form className="max-w-[8rem] mx-auto">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select time:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              type="time"
              id="time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              min="09:00"
              max="18:00"
              value="00:00"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};
