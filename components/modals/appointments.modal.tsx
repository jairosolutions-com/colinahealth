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
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [date, setDate] = useState("March 26, 2024");
  const [day, setDay] = useState("Tuesday");
  const [time, setTime] = useState("1:30pm");
  const [endTime, setEndTime] = useState("2:00pm");
  const [details, setDetails] = useState("Input details");

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

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
                  onClick={() => setIsEditable(!isEditable)}
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
          <div className="mb-9 pt-4">
            <div className="h-[600px] max-h-[520px] md:px-10 mt-5">
              <form className="">
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      DATE
                    </label>
                    <div className="mt-2.5">
                      {isEditable ? (
                        <input
                          id="date"
                          type="text"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="March 26, 2024"
                        />
                      ) : (
                        <p className="font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>{date}</span>
                        </p>
                      )}
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
                      {isEditable ? (
                        <input
                          id="day"
                          type="text"
                          value={day}
                          onChange={(e) => setDate(e.target.value)}
                          className="block w-full h-12  rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="March 26, 2024"
                        />
                      ) : (
                        <p className=" font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>Tuesday</span>
                        </p>
                      )}
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
                      {isEditable ? (
                        <input
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => setDate(e.target.value)}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="1:30pm"
                        />
                      ) : (
                        <p className=" font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>1:30pm</span>
                        </p>
                      )}
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
                      {isEditable ? (
                        <input
                          type="time"
                          required
                          onChange={(e) => setDate(e.target.value)}
                          value={endTime}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="2:00pm"
                        />
                      ) : (
                        <p className=" font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>2:00pm</span>
                        </p>
                      )}
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
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 resize-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                        className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        defaultValue="select satus"
                      >
                        <option value="">select status</option>
                        <option value="dad">SUCCESSFUL</option>
                        <option value="Pending">CANCELED</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pb-3  grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="w-[250px] h-12 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-[250px] h-12 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
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
                <div className="flex flex-col mt-6 pb-3">
                  <div className="flex flex-col w-full">
                    <input
                      type="date"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input reaction"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      Time From:
                    </label>
                    <input
                      type="time"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input reaction"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      Time to:
                    </label>
                    <input
                      type="time"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input reaction"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                    >
                      Details
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        rows={5}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        placeholder="input details"
                        style={{ resize: "none" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 pb-3 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="w-[250px] h-12 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] ring-1 ring-gray-200 mr-8"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-[250px] h-12 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
