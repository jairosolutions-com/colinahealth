"use client";
import { fetchPatientDetails } from "@/app/api/patients-api/patientDetails.api";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  isModalOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  onFailed: () => void;
}

export const AppointmentemailModalContent = ({
  isModalOpen,
  onSuccess,
  onFailed,
}: Modalprops) => {
  const [selectedCodeStatus, setSelectedCodeStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isSuccessful, setIsSuccessFul] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    subject: false,
    message: false,
  });

  const params = useParams<{
    id: any;
    tag: string;
    item: string;
  }>();
  const patientId = params.id.toUpperCase();
  const router = useRouter();
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsSuccessFul(false);
        const response = await fetchPatientDetails(patientId, router);
        setPatientEmail(response.data[0].email);
        setPatientName(response.data[0].firstName + response.data[0].lastName);
        // setIsLoading(false);
      } catch (error: any) {
        // setError(error.message);
        // setIsLoading(false);
      }
    };

    fetchData();
  }, [isSuccessful]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: false,
    });
    // setInvalidEmail(false);
  };

  const handleSendEmail = () => {
    let newErrors = {
      subject: false,
      message: false,
    };
    let hasError = false;

    for (const [key, value] of Object.entries(formData)) {
      if (value.trim() === "") {
        newErrors = { ...newErrors, [key]: true };
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (!hasError) {
      setIsLoading(true);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      name: patientName,
      emailAddress: patientEmail,
      subject: String(e.target.subject.value),
      message: String(e.target.message.value),
    };

    if (
      data.name != "" &&
      data.emailAddress != "" &&
      data.subject != "" &&
      data.message != ""
    ) {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // formData.emailAddress = "";
        // formData.firstName = "";
        // formData.lastName = "";
        setIsLoading(false);
        isModalOpen(false);
        onSuccess();
        // setToastMessage("Email Sent Successfully.");
        // setShowToast(true);
      }

      if (!response.ok) {
        // setInvalidEmail(true);
        setIsLoading(false);
        onFailed();
        // setShowToast(true);
        // setToastMessage("Something went wrong.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="w-[1200px] h-[641px]">
          <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
            <div className="items-center flex justify-between px-8">
              <h2 className="p-title text-left text-[#071437] mt-5 w-full pl-2">
                Compose an Email for Schedule
              </h2>
              <X
                onClick={() => isModalOpen(false)}
                className="w-6 h-6 text-black flex items-center mt-2"
              />
            </div>
            <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
              Ensure to input details
            </p>
            <div className="flex place-items-end mr-4"></div>
          </div>
          <div className=" mb-9 pt-4">
            <div className="h-[600px] max-h-[470px] md:px-10 mt-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    TO
                  </label>
                  <div className="mt-2.5">
                    <input
                      disabled
                      name="emailAddress"
                      value={patientEmail}
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input recipient"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    SUBJECT
                  </label>
                  <div className="mt-2.5">
                    <input
                      autoComplete="off"
                      name="subject"
                      type="text"
                      required
                      className={`block w-full h-12 rounded-md  px-3.5 py-2 text-gray-900 shadow-sm border outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                        errors.subject ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="input subject"
                      onChange={handleInputChange}
                      value={formData.subject}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="block text-md font-bold leading-6 text-gray-900 required-field"
                  >
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      rows={12}
                      className={`block w-full rounded-md border px-3.5 py-2 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="compose message here"
                      style={{ resize: "none" }}
                      onChange={handleInputChange}
                      value={formData.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="justify-end flex mr-10">
              <button
                onClick={() => isModalOpen(false)}
                type="button"
                className="w-[150px] h-[45px]  bg-[#F3F3F3] hover:bg-[#D9D9D9] font-medium text-black mr-4 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSendEmail}
                className="w-[150px] h-[45px] bg-[#007C85] hover:bg-[#03595B] flex justify-center items-center  text-[#ffff]  font-medium rounded-sm"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-[20px] w-[20px]" />
                ) : (
                  <span>Send</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
