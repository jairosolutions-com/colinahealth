"use client";
import {
  createAppointmentOfPatient,
  updateAppointmentOfPatient,
} from "@/app/api/appointments-api/appointments.api";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "../shared/timepicker";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);

  const [day, setDay] = useState("Tuesday");
  const [time, setTime] = useState("1:30pm");
  const [endTime, setEndTime] = useState("2:00pm");
  const [details, setDetails] = useState("Input details");

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };
  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      appointmentStatus: e.target.value,
    }));
    console.log(e.target.value, "statuschanged");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "appointmentDate") {
      setDate(value);
      appointmentData.appointments_appointmentDate = value;
      console.log(value, "date");
    }

    if (name === "appointmentTime") {
      setEndTime(value);
      appointmentData.appointments_appointmentEndTime = value;
      console.log(value, "appointmentTime");
    }

    if (name === "appointmentEndTime") {
      setTime(value);
      appointmentData.appointments_appointmentTime = value;
      console.log(value, "appointmentEndTime");
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const formatDate = (createdAt: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(createdAt);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };
  const [formData, setFormData] = useState({
    appointmentDate: appointmentData.appointments_appointmentDate,
    appointmentTime: appointmentData.appointments_appointmentTime,
    appointmentEndTime: appointmentData.appointments_appointmentEndTime,
    details: appointmentData.appointments_details,
    appointmentStatus:
      appointmentData.appointments_appointmentStatus || "Scheduled",
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isView) {
        await updateAppointmentOfPatient(
          appointmentData.appointments_uuid,
          formData,
          router
        );
        isModalOpen(false);
        return;
      } else {
        console.log("Appointment adding");
        console.log(formData, "formdata");
        const prescription = await createAppointmentOfPatient(
          patientId,
          formData,
          router
        );
        isModalOpen(false);

        console.log("Appointment added successfully:", prescription);

        // Reset the form data after successful submission
        setFormData({
          appointmentDate: "",
          appointmentTime: "",
          appointmentEndTime: "",
          details: "",
          appointmentStatus: "",
        });
      }
    } catch (error) {
      console.error("Error adding Appointment:", error);
      setError("Failed to add Prescription");
    }
  };
  return (
    <div
      className={`absolute inset-[-200px] bg-[#76898A99] flex items-center justify-center pb-[170px]`}
    >
      <div className="max-w-[600px] bg-[#FFFFFF] rounded-md">
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
            {isView ? "Appointment Details" : "Make an Appointment"}
          </h2>
          <div className="text-sm pl-9 text-gray-600 pb-10 pt-2">
            {isView ? (
              <div className="flex">
                <div className="w-1 h-1 my-2 mx-1 mt-2 bg-green-500 rounded-full"></div>
                Upcoming Schedule
                <button
                  onClick={() => {
                    setIsEditable(!isEditable);
                    console.log("edit", isEditable);
                  }}
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
          </div>
        </div>
        {isView === true && (
          <div className="mb-9 pt-4">
            <div className="h-[600px] max-h-[520px] md:px-10 mt-5">
              <form className="" onSubmit={handleSubmit}>
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
                          required
                          type="text"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleChange}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="March 26, 2024"
                        />
                      ) : (
                        <p className="font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>{formatDate(formData.appointmentDate)}</span>
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
                          name="day"
                          value={day}
                          required
                          onChange={handleChange}
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
                          required
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleChange}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                          placeholder="1:30pm"
                        />
                      ) : (
                        <p className=" font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>{formData.appointmentTime}</span>
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
                          name="appointmentEndTime"
                          onChange={handleChange}
                          value={formData.appointmentEndTime}
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="2:00pm"
                        />
                      ) : (
                        <p className=" font-regular text-gray-400 text-md h-[48px] flex items-center ml-3">
                          <span>{formData.appointmentEndTime}</span>
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
                      {isEditable ? (
                        <textarea
                          rows={4}
                          required
                          name="details"
                          onChange={handleDetailsChange}
                          placeholder="input details"
                          style={{ resize: "none" }}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 resize-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      ) : (
                        <textarea
                          rows={4}
                          disabled={true}
                          value={formData.details}
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 resize-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      )}
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
                        onChange={handleStatusChange}
                      >
                        <option value="">select status</option>
                        <option value="Patient-IN">Patient-IN</option>
                        <option value="Cancelled">Cancelled</option>
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
                    type="submit"
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
              <form className="" onSubmit={handleSubmit}>
                <div className="flex flex-col mt-6 pb-3">
                  <div className="flex flex-col w-full">
                    <input
                      type="date"
                      required
                      min={Date.now().toString()}
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input date"
                      name="appointmentDate"
                      onChange={(e) => handleChange(e)}
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
                      name="appointmentTime"
                      onChange={handleChange}
                      placeholder="input reaction"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold leading-6 text-gray-900 required-field">
                      Time to:
                    </label>
                    <input
                      type="time"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      onChange={handleChange}
                      name="appointmentEndTime"
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
                        name="details"
                        onChange={handleDetailsChange}
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
                    type="submit"
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
