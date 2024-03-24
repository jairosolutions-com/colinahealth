
"use client";
import { fetchCountryList } from "@/app/api/country-api/countryList.api";
import { addPatient } from "@/app/api/patients-api/patientList.api";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ label, isOpen, isModalOpen }: Modalprops) => {
  const [countryList, setCountryList] = useState<any[]>([]);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    phoneNo: "",
    address1: "",
    city: "",
    address2: "",
    state: "",
    country: "",
    zip: "",
    admissionDate: "",
    codeStatus: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Call the addPatient API function here
    try {
      const patientList = await addPatient(formData, router);
      console.log("Patient added successfully:", patientList);
      // Optionally, you can reset the form data after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        gender: "",
        age: "",
        dateOfBirth: "",
        phoneNo: "",
        address1: "",
        city: "",
        address2: "",
        state: "",
        country: "",
        zip: "",
        admissionDate: "",
        codeStatus: "",
        email: "",
      });
    } catch (error: any) {
      if (error.message === "Patient already exist") {
        console.error("Error adding patient: Patient already exists");
        // Handle specific error message (e.g., display an error message to the user)
        setError("Patient already exists");
      } else {
        console.error("Error adding patient:", error);
        // Handle other errors (e.g., display a generic error message to the user)
      }
    }
  };

  const handleCountryChange = (countryId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      country: countryId,
    }));
  };
  console.log(error, "error");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await fetchCountryList(router);
        setCountryList(countries);
      } catch (error) {
        console.error("Error fetching country list:");
      }
    };

    fetchData();
  }, []);
  console.log(formData, "formData");
  return (
    <>
      <div
        className={` absolute w-screen h-screen mt-1 ml-1 inset-[-100px] bg-[#76898A99] flex items-center justify-center`}
      >
        <div className="max-w-[1018px] w-full bg-[#FFFFFF]">
          <div className="bg-[#ffffff] w-full h-[50px] flex items-center justify-start ring-1 ring-gray-200">
            <h2 className="p-title text-left text-[#071437] pl-9">
              Patient Demographic
            </h2>
          </div>
          <div className="h-[600px] w-full max-w-7xl py-10 md:px-10 ring-1 ring-gray-200">
            <div className="">
              <div className="mb-4 grid grid-cols-2 gap-6 ">
                <div className="flex flex-row gap-x-[70px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  rounded border border-gray-200"
                    placeholder="input fullname"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-x-[56px]">
                  <label className="mb-1 font-medium font-manrope mt-2 text-nowrap">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input gender"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-6 ">
                <div className="flex flex-row gap-x-[55px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  rounded border border-gray-200"
                    placeholder="input fullname"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-x-[80px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    Gender
                  </label>
                  <input
                    type="text"
                    name="gender"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input gender"
                    value={formData.gender}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-6">
                <div className="flex flex-row gap-x-[120px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-x-[42px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input date of birth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-6">
                <div className="flex flex-row gap-x-[35px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phoneNo"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input contact phone"
                    value={formData.phoneNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-x-[67px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    Address1
                  </label>
                  <input
                    type="text"
                    name="address1"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input Address"
                    value={formData.address1}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-6">
                <div className="flex flex-row gap-x-[116px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-x-[65px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    Address2
                  </label>
                  <input
                    type="text"
                    name="address2"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input Addres2"
                    value={formData.address2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-6">
                <div className="flex flex-row gap-x-[107px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row gap-x-[74px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    Country
                  </label>
                  <select
                    name="country"
                    onChange={(event) =>
                      handleCountryChange(event.target.value)
                    }
                  >
                    <option disabled>Select a country</option>
                    {countryList.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-6">
                <div className="flex flex-row gap-x-[105px]">
                  <label className="mb-1 font-medium font-manrope  mt-2">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input email"
                  />
                </div>
                <div className="flex flex-row gap-x-[112px]">
                  <label className="mb-1 font-medium font-manrope mt-2">
                    Zip
                  </label>
                  <input
                    type="text"
                    name="zip"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input zip"
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-6">
                <div className="flex flex-row gap-x-[27px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    name="admissionDate"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                    placeholder="input admission date"
                  />
                </div>
                <div className="flex flex-row gap-x-[42px]">
                  <label className="mb-1 font-medium font-manrope text-nowrap mt-2">
                    Code Status
                  </label>
                  <input
                    type="text"
                    name="codeStatus"
                    className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] text-normal rounded border border-gray-200"
                    placeholder="input code status"
                  />
                </div>
              </div>

              <div className="mb-4 gap-6">
                <div className="mt-4  justify-end flex  ">
                  <button
                    onClick={() => isModalOpen(false)}
                    type="button"
                    className="px-3 py-2 bg-[#D9D9D9] bg-opacity-30 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] mt-2 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                  onClick={handleSubmit}
                    type="button"
                    className="px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium mt-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
