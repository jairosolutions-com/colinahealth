"use client";

import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  updateAppointmentOfPatient,
  createAppointmentOfPatient,
} from "@/app/api/appointments-api/appointments.api";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
interface Modalprops {
  isView: boolean;
  appointmentData: any;
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export const AppointmentModalContent = ({
  isView,
  appointmentData,
  label,
  isOpen,
  isModalOpen,
  onSuccess,
}: Modalprops) => {
  const router = useRouter();
  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [charactersFull, setCharactersFull] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };
  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "details" && value.length > 200) {
      const truncatedValue = value.slice(0, 200);
      setCharactersFull(true);
      setFormData((prevData) => ({
        ...prevData,
        [name]: truncatedValue,
      }));
    } else {
      setCharactersFull(false);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
      appointmentData.appointments_appointmentEndTime = value;
      console.log(value, "appointmentTime");
    }

    if (name === "appointmentEndTime") {
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
    setIsSubmitted(true);
    try {
      if (isEditable || isView) {
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
        onSuccess();
        // Reset the form data after successful submission
        setFormData({
          appointmentDate: "",
          appointmentTime: "",
          appointmentEndTime: "",
          details: "",
          appointmentStatus: "",
        });
      }
    } catch (error: any) {
      if (error.message == "Network Error") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message,
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => {
                window.location.reload();
              }}
            >
              Try again
            </ToastAction>
          ),
        });
      }
      console.error("Error adding Appointment:", error);
      setError("Failed to add Prescription");
    }
  };

  function getImageSrc(isEditable: boolean, isHovered: boolean) {
    if (isEditable) {
      return isHovered
        ? "/icons/edit-icon-white.svg"
        : "/icons/edit-icon-blue.svg";
    } else {
      return "/icons/edit-icon.svg";
    }
    setIsSubmitted(false);
  }
  console.log(formData, "formdata");
  console.log(formData.appointmentStatus, "status");
  return (
    <div
      className={`${
        isView ? "h-[640px]" : charactersFull ? "h-[551px]" : "h-[552px]"
      } w-[676px]  bg-[#FFFFFF] rounded-md`}
    >
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
          <div className="items-center flex justify-between">
            <h2 className="p-title text-left text-[#071437] pl-10 mt-7">
              {isView
                ? isEditable
                  ? "Update Appointment Details"
                  : "View Appointment Details"
                : "Make an Appointment"}
            </h2>
            <X
              onClick={() => {
                isSubmitted ? null : isModalOpen(false);
              }}
              className={`
              ${isSubmitted && " cursor-not-allowed"}
              w-6  h-6 text-black flex items-center mt-6 mr-9 cursor-pointer`}
            />
          </div>
          <div className="text-sm text-start px-9 pr-10 text-gray-600 pb-10 pt-2">
            {isView ? (
              <div className="flex justify-between w-full">
                <div className="flex items-center">
                  {formData.appointmentStatus === "Scheduled" && (
                    <div className="flex">
                      <div className="w-1 h-1 my-2 mx-1 mt-2 bg-green-500 rounded-full"></div>
                      <p> Upcoming Appointment</p>
                    </div>
                  )}
                  {formData.appointmentStatus === "Done" && (
                    <div className="flex">
                      <div className="w-1 h-1 my-2 mx-1 mt-2 bg-[#3C3C3C] rounded-full"></div>
                      <p> {formData.appointmentStatus} Appointment</p>
                    </div>
                  )}
                  {formData.appointmentStatus === "Patient-IN" && (
                    <div className="flex">
                      <div className="w-1 h-1 my-2 mx-1 mt-2 bg-[#E0BD03] rounded-full"></div>
                      <p> On-going Appointment </p>
                    </div>
                  )}
                  {formData.appointmentStatus === "Missed" && (
                    <div className="flex">
                      <div className="w-1 h-1 my-2 mx-1 mt-2 bg-[#B81C1C] rounded-full"></div>
                      <p> {formData.appointmentStatus} Appointment </p>
                    </div>
                  )}
                  {formData.appointmentStatus === "Cancelled" && (
                    <div className="flex">
                      <div className="w-1 h-1 my-2 mx-1 mt-2 bg-[#B81C1C] rounded-full"></div>
                      <p> {formData.appointmentStatus} Appointment </p>
                    </div>
                  )}
                </div>
                <div className="">
                  <Image
                    className="absolute mt-2 ml-6 pointer-events-none z-10 "
                    width={15}
                    height={15}
                    src={getImageSrc(isEditable, isHovered)}
                    alt="edit-icon"
                  />
                  <button
                    disabled={formData.appointmentStatus === "Missed"}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => {
                      setIsEditable(!isEditable);
                      console.log("edit", isEditable);
                    }}
                    type="button"
                    className={`${
                      isEditable
                        ? "ring-[#2867C7] hover:ring-0 text-[#1B84FF] hover:text-white hover:bg-[#1B84FF]"
                        : "hover:bg-[#D9D9D9]"
                    } ${
                      formData.appointmentStatus === "Missed" &&
                      "cursor-not-allowed"
                    } 
                    w-24 h-8  font-medium rounded text-[#000] ring-1 ring-gray-200 `}
                  >
                    <p className="w-full pl-5">Edit</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex text-start items-start justify-start">
                <p className="text-sm text-start pl-1 text-gray-600 pb-10 pt-2">
                  Submit your appointment schedule.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className=" mb-9 pt-4">
          <div className="md:px-10 mb-9 ">
            <div className="flex flex-col mt-6 pb-3 relative">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold leading-6 text-gray-900 required-field"
                >
                  DATE
                </label>
                <input
                  type="date"
                  required
                  className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                  placeholder="input reaction"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  disabled={!isEditable && isView}
                />
                <Image
                  className="absolute top-5 right-0 mt-3.5 mr-3 pointer-events-none"
                  width={20}
                  height={20}
                  src={"/svgs/calendark.svg"}
                  alt={""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="">
                <label
                  htmlFor="first-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  Time From:
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input reaction"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    disabled={!isEditable && isView}
                  />
                  <Image
                    className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                    width={20}
                    height={20}
                    src={"/svgs/clock.svg"}
                    alt={""}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  Time to:
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                    placeholder="input reaction"
                    name="appointmentEndTime"
                    onChange={handleChange}
                    value={formData.appointmentEndTime}
                    disabled={!isEditable && isView}
                  />
                  <Image
                    className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                    width={20}
                    height={20}
                    src={"/svgs/clock.svg"}
                    alt={""}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  Details
                </label>
                <div className="mt-2.5">
                  <textarea
                    rows={5}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="input details"
                    style={{ resize: "none" }}
                    name="details"
                    onChange={handleDetailsChange}
                    value={formData.details}
                    disabled={!isEditable && isView}
                  />
                  <p
                    className={`absolute text-red-500 ${
                      charactersFull ? "visible" : "hidden"
                    }`}
                  >
                    *Maximum of 200 characters only!
                  </p>
                </div>
              </div>
              <div className={`${isView ? "visible" : "hidden"}`}>
                <label
                  htmlFor="status"
                  className="block text-md font-bold leading-6 text-gray-900 required-field"
                >
                  STATUS
                </label>
                <div className="mt-2.5 flex ">
                  <select
                    disabled={
                      formData.appointmentStatus === "Missed" ||
                      formData.appointmentStatus === "Done"
                    }
                    id="status"
                    className={`${
                      formData.appointmentStatus === "Missed" ||
                      formData.appointmentStatus === "Done"
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } block w-full h-12  rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    value={formData.appointmentStatus}
                    onChange={handleStatusChange}
                    defaultValue="select status"
                  >
                    <option value="">Select Status</option>
                    <option value="Patient-IN">Patient-IN</option>
                    <option value="Cancelled">Cancel Appointment</option>
                  </select>
                  <Image
                    className="absolute ml-[260px] mt-[13px]  pointer-events-none"
                    width={20}
                    height={20}
                    src={"/svgs/chevron-up.svg"}
                    alt={""}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`${charactersFull ? "mt-[30px]" : "mt-5"}`}>
            <div className="justify-end flex mr-10">
              <button
                onClick={() => isModalOpen(false)}
                disabled={isSubmitted}
                type="button"
                className={`
                ${isSubmitted && " cursor-not-allowed"}
                w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black  mr-4 rounded-sm `}
              >
                Cancel
              </button>
              <button
                disabled={
                  formData.appointmentStatus === "Missed" ||
                  formData.appointmentStatus === "Done" ||
                  isSubmitted
                }
                type="submit"
                className={`${
                  formData.appointmentStatus === "Missed" ||
                  formData.appointmentStatus === "Done" ||
                  isSubmitted
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } w-[150px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
              >
                {isEditable ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
