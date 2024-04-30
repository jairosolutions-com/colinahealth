import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
}

export const AppointmentviewModalContent = ({ isModalOpen }: Modalprops) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [date, setDate] = useState("March 26, 2024");
  const [day, setDay] = useState("Tuesday");
  const [time, setTime] = useState("1:30pm");
  const [endTime, setEndTime] = useState("2:00pm");
  const [details, setDetails] = useState("Input details");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="w-[676px] h-[640px]">
      <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
        <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
          Appointment Details
        </h2>
        <X
          onClick={() => isModalOpen(false)}
          className="w-7 h-7 text-black flex items-center mt-2 mr-4"
        />
        <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
          List of Upcoming Schedules.
          <button
            type="button"
            onClick={handleEditToggle}
            className="w-[70px] h-7 hover:bg-[#D9D9D9] font-medium rounded text-[#000] ring-1 ring-gray-200 ml-[529px] "
          >
            {isEditable ? "Save" : "Edit"}
          </button>
        </p>
      </div>
      <div className="mb-9 pt-4">
        <div className="h-[600px] max-h-[470px] md:px-10 mt-5">
          <form className="">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="date"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
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
                    <p className="font-regular text-gray-400 text-md h-[36px] flex items-center ml-3">
                      <span>{date}</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
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
                    <p className=" font-regular text-gray-400 text-md h-[36px] flex items-center ml-3">
                      <span>Tuesday</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  TIME
                </label>
                <div className="mt-2.5">
                  {isEditable ? (
                    <input
                      id="time"
                      type="text"
                      value={time}
                      onChange={(e) => setDate(e.target.value)}
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="1:30pm"
                    />
                  ) : (
                    <p className=" font-regular text-gray-400 text-md h-[36px] flex items-center ml-3">
                      <span>1:30pm</span>
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  END TIME
                </label>
                <div className="mt-2.5">
                  {isEditable ? (
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="2:00pm"
                    />
                  ) : (
                    <p className=" font-regular text-gray-400 text-md h-[36px] flex items-center ml-3">
                      <span>2:00pm</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  DETAILS
                </label>
                <div className="mt-2.5">
                  <textarea
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input details"
                    style={{ resize: "none" }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
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
          </form>
        </div>
        <div className="">
          <div className="justify-end flex mr-10">
            <button
              onClick={() => isModalOpen(false)}
              type="button"
              className="w-[150px] h-[45px] px-3 py-2 bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-[150px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
