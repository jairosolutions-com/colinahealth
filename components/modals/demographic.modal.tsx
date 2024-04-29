"use client";
import { fetchCountryList } from "@/app/api/country-api/countryList.api";
import { addPatient } from "@/app/api/patients-api/patientList.api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SuccessModal } from "../shared/success";

interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  setErrorMessage: any;
  onSuccess: () => void;
  onFailed: () => void;
}

export const DemographicModal = ({
  label,
  isOpen,
  isModalOpen,
  setErrorMessage,
  onSuccess,
  onFailed,
}: Modalprops) => {
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

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    // Call the addPatient API function here
    e.preventDefault();
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
      onSuccess();
      isModalOpen(false);
    } catch (error: any) {
      if (error.message === "Patient already exist") {
        setErrorMessage("Patient already exist");
        onFailed();
        isModalOpen(false);
        console.log("conflict error");
      }
      console.log(error.message);
      setError("Failed to add Patient");
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
      <main className="overflow-hidden z-50">
        <div
          className={`absolute h-[100vh] inset-[-100px]  bg-[#76898A99] flex items-center justify-center`}
        >
          <div className="max-w-[550px] bg-[#FFFFFF] rounded-md">
            <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
              <h2 className="p-title text-left text-[#071437] pl-9 mt-7">
                Patient Demographic
              </h2>
              <p className="text-sm pl-9 text-gray-600 pb-10 pt-2">
                Add patient demographic and make sure to submit.
              </p>
            </div>
            <div className="pr-9 mb-9 pt-4">
              <div className="h-[600px]  max-h-[500px] md:px-10 mt-5">
                <form className="" onSubmit={handleSubmit}>
                  <div className="overflow-auto max-h-[450px] px-10">
                    <div className="flex  flex-row gap-x-[70px] mb-4">
                      <label className="mb-1 font-medium font-manrope text-nowrap mt-2 required-field">
                        First Name
                      </label>
                      <input
                        type="text"
                        id=""
                        name="firstName"
                        required
                        className="h-10 w-80 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] rounded border border-gray-200"
                        placeholder="input first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-row gap-x-[71px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 text-nowrap required-field">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="flex flex-row gap-x-[53px] mb-4">
                      <label className="mb-1 ml-3 font-medium font-manrope text-nowrap mt-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  rounded border border-gray-200"
                        placeholder="input middle name"
                        value={formData.middleName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-row gap-x-[94px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 required-field">
                        Gender
                      </label>
                      <input
                        type="text"
                        name="gender"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-x-[120px] mb-4">
                      <label className="mb-1 font-medium font-manrope text-nowrap mt-2 required-field">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-x-[56px] mb-4">
                      <label className="mb-1 font-medium font-manrope text-nowrap mt-2 required-field">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input date of birth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-x-[25px] mb-4">
                      <label className="mb-1 ml-3 font-medium font-manrope text-nowrap mt-2">
                        Contact Number
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
                    <div className="flex flex-row gap-x-[81px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 required-field">
                        Address1
                      </label>
                      <input
                        type="text"
                        name="address1"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input Address"
                        value={formData.address1}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-x-[119px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 required-field">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-x-[79px] mb-4">
                      <label className="mb-1 ml-3 font-medium font-manrope mt-2">
                        Address2
                      </label>
                      <input
                        type="text"
                        name="address2"
                        className="h-10  w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input Addres2"
                        value={formData.address2}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-row gap-x-[108px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 required-field">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="h-10 w-96 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex flex-row gap-x-[88px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 required-field">
                        Country
                      </label>
                      <select
                        required
                        className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        name="country"
                        onChange={(event) =>
                          handleCountryChange(event.target.value)
                        }
                      >
                        <option>Select a country</option>
                        {countryList.map((country) => (
                          <option key={country.countryId} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-row gap-x-[33px] mb-4">
                      <label className="mb-1 font-medium font-manrope text-nowrap mt-2 required-field">
                        Admission Date
                      </label>
                      <input
                        type="date"
                        id=""
                        name="admissionDate"
                        required
                        className="h-10 w-80 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input admission date"
                        value={formData.admissionDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-row gap-x-[126px] mb-4">
                      <label className="mb-1 font-medium font-manrope mt-2 required-field">
                        Zip
                      </label>
                      <input
                        type="text"
                        id=""
                        name="zip"
                        required
                        className="h-10 w-80 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input zip"
                        value={formData.zip}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-row gap-x-[56px] mb-4">
                      <label className="mb-1 font-medium font-manrope text-nowrap mt-2 required-field">
                        Code Status
                      </label>
                      <input
                        type="text"
                        id=""
                        name="codeStatus"
                        required
                        className="h-10 w-80 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333] text-normal rounded border border-gray-200"
                        placeholder="input code status"
                        value={formData.codeStatus}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-row gap-x-[110px] mb-4">
                      <label className="mb-1 ml-3 font-medium font-manrope mt-2">
                        Email
                      </label>
                      <input
                        type="text"
                        id=""
                        name="email"
                        className="h-10 w-80 bg-[#FCFCFC]  px-3 py-2 text-sm text-[#333333]  text-normal rounded border border-gray-200"
                        placeholder="input email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mt-5 justify-center flex pl-7">
                    <button
                      onClick={() => isModalOpen(false)}
                      type="button"
                      className="w-48 px-3 py-2 hover:bg-[#D9D9D9] font-medium rounded-[7px] text-[#000] mt-2 mr-3 ring-1 ring-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-48 px-3 py-2 bg-[#1B84FF] hover:bg-[#2765AE] rounded-[7px] text-[#ffff] font-medium mt-2"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
