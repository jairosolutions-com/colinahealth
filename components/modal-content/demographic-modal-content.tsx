"use client";
import { fetchCountryList } from "@/app/api/country-api/countryList.api";
import { addPatient } from "@/app/api/patients-api/patientList.api";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import { addPatientProfileImage } from "@/app/api/patients-api/patientProfileImage.api";
interface Modalprops {
  label: string;
  isOpen: boolean;
  isModalOpen: (isOpen: boolean) => void;
  setErrorMessage: any;
  onSuccess: () => void;
  onFailed: () => void;
}
interface UserIcon {
  file: any; // Assuming file property exists for the key
  filename: string;
  data: Uint8Array;
  img_uuid: string;
}
export const DemographicModalContent = ({
  label,
  isOpen,
  isModalOpen,
  setErrorMessage,
  onSuccess,
  onFailed,
}: Modalprops) => {
  const { toast } = useToast();
  const [selectedCodeStatus, setSelectedCodeStatus] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [countryList, setCountryList] = useState<any[]>([]);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    if (name === "age" && !/^\d*$/.test(value)) {
      return; // Don't update state
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    // Call the addPatient API function here
    e.preventDefault();
    setIsSubmitted(true);
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
      const getUuid = patientList.uuid;
      console.log("patientList UUID:", getUuid);
      if (selectedFiles && selectedFiles.length > 0) {
        // Iterate through each selected file
        for (let i = 0; i < selectedFiles.length; i++) {
          const userIconFormData = new FormData();
          userIconFormData.append(
            "profileimage",
            selectedFiles[i],
            fileNames[i]
          );

          // Add lab file
          const addUserIcon = await addPatientProfileImage(
            getUuid,
            userIconFormData
          );

          console.log(
            `Icon FILE ${fileNames[i]} added successfully:`,
            addUserIcon
          );
        }
      } else {
        console.warn("No files selected to upload");
      }
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
    setIsSubmitted(false);
  };

  const handleCountryChange = (countryId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      country: countryId,
    }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: gender,
    }));
  };

  const handleCodeStatusChange = (codeStatus: string) => {
    setFormData((prevData) => ({
      ...prevData,
      codeStatus: codeStatus,
    }));
  };
  console.log(error, "error");
  // Define a state to track the selected filenames
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [iconFile, seticonFile] = useState<any>(); //

  const [selectedFiles, setSelectedLabFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);

  const toggleMaxSizeToast = (): void => {
    setIsSubmitted(false);
    toast({
      variant: "destructive",
      title: "File Size Too Big!",
      description: `Total size of selected files exceeds the limit of 15MB!`,
    });
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitted(true);
    const files = e.target.files;
    const MAX_FILE_SIZE_MB = 15;
    if (files) {
      const totalSize = Array.from(files).reduce(
        (acc, file) => acc + file.size,
        0
      );
      const totalSizeMB = totalSize / (1024 * 1024); // Convert bytes to MB

      if (totalSizeMB > MAX_FILE_SIZE_MB) {
        toggleMaxSizeToast();
        e.target.value = ""; // Clear the input field
      }
    }
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      const newFileNames: string[] = [];
      const newFileTypes: string[] = [];

      Array.from(files).forEach((file) => {
        if (file) {
          // Add file, name, and type to arrays
          newFiles.push(file);
          newFileNames.push(file.name);
          newFileTypes.push(file.type.split("/")[1]);
          console.log(iconFile, "iconFile iconFile iconFile");
          // Set selected file names
          setSelectedFileNames(newFileNames);
          console.log(selectedFileNames, "selected file names");
          // You can handle base64 conversion here if needed
        }
      });

      // Update state variables with arrays

      setSelectedLabFiles(newFiles);
      setFileNames(newFileNames);
      setFileTypes(newFileTypes);
    } else {
      console.warn("No files selected");
    }
    setIsSubmitted(false);
  };
  useEffect(() => {
    // Initialize selected file names array
    setSelectedFileNames([]);
    if (iconFile > 0) {
      selectedFileNames.push(iconFile.filename);
      console.log(selectedFileNames, "selected file names");
      console.log(iconFile, "iconFile iconFile iconFile");
      // Set selected file names
      setSelectedFileNames(selectedFileNames);
    } else {
      // Log a message when there are no files in iconFile
      console.log("No files in iconFile");
      // Optionally, you can clear the selectedFileNames state here
      setSelectedFileNames([]);
    }
  }, [iconFile, setSelectedFileNames]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await fetchCountryList(router);
        setCountryList(countries);
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
        console.error("Error fetching country list:");
      }
    };

    fetchData();
  }, []);
  console.log(formData, "formData");

  return (
    <>
      <div className="w-[1200px] h-[642px]">
        <form className="" onSubmit={handleSubmit}>
          <div className="bg-[#ffffff] w-full h-[70px] flex flex-col justify-start rounded-md">
            <div className="items-center flex justify-between px-8">
              <h2 className="p-title text-left text-[#071437] mt-5 w-full pl-2">
                Patient Demographic
              </h2>
              <X
                onClick={() => {
                  isSubmitted ? null : isModalOpen(false);
                }}
                className={`
                ${isSubmitted && " cursor-not-allowed"}
                w-6 h-6  text-black flex items-center mt-4 mr-1 cursor-pointer`}
              />
            </div>
            <p className="text-sm pl-10 text-gray-600 pb-10 pt-2">
              Add patient demographic and make sure to submit.
            </p>
            <div className="flex place-items-end mr-4"></div>
          </div>
          <div className=" mb-9 pt-4">
            <div className="h-[600px] max-h-[470px] md:px-10 mt-5">
              <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input first name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Middle Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input middle name"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-lg font-bold leading-6 text-gray-900 required-field"
                    >
                      Age
                    </label>
                    <div className="mt-1 mr-4">
                      <input
                        type="text"
                        required
                        className="block w-[174px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6 appearance-none"
                        placeholder="input age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-lg font-bold leading-6 text-gray-900 required-field"
                      >
                        Gender
                      </label>
                      <div className="mt-1 relative">
                        <select
                          id="status"
                          className="block w-[173px] h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          onChange={(e) => handleGenderChange(e.target.value)}
                          style={{ cursor: "pointer" }}
                          name="lastName"
                        >
                          <option value="">select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <Image
                          className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                          width={20}
                          height={20}
                          src={"/svgs/chevron-up.svg"}
                          alt={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Date of Birth
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                    <Image
                      className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                      width={20}
                      height={20}
                      src={"/svgs/calendark.svg"}
                      alt={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Address 1
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input address 1"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Address 2
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input address 2 (optional)"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-lg font-bold leading-6 text-gray-900 required-field"
                    >
                      City
                    </label>
                    <div className="mt-1 mr-4">
                      <input
                        type="text"
                        required
                        className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                        placeholder="input city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-lg font-bold leading-6 text-gray-900 required-field"
                      >
                        State
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          required
                          className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                          placeholder="input state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Country
                  </label>
                  <div className="mt-1 relative">
                    <select
                      required
                      className="block cursor-pointer w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                    <Image
                      className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                      width={20}
                      height={20}
                      src={"/svgs/chevron-up.svg"}
                      alt={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Zip
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Code Status
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="status"
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6 cursor-pointer"
                      name="codeStatus"
                      onChange={(e) => handleCodeStatusChange(e.target.value)}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">select status</option>
                      <option value="DNR" className="text-red-500">
                        DNR
                      </option>
                      <option value="FULL CODE" className="text-blue-500">
                        FULL CODE
                      </option>
                    </select>
                    <Image
                      className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                      width={20}
                      height={20}
                      src={"/svgs/chevron-up.svg"}
                      alt={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Admission Date
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400t sm:text-sm sm:leading-6"
                      placeholder="input addmission date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleChange}
                    />
                    <Image
                      className="absolute top-0 right-0 mt-3.5 mr-3 pointer-events-none"
                      width={20}
                      height={20}
                      src={"/svgs/calendark.svg"}
                      alt={""}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-lg font-bold leading-6 text-gray-900 required-field"
                  >
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      className="block w-full h-12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      placeholder="input phone number"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="imageUpload"
                    className="relative h-[70px] w-full bg-[#daf3f5] border-[#007C85] border-dashed border-2 flex justify-center items-center rounded-md cursor-pointer text-center text-[#101828] font-bold mt-1.5"
                  >
                    {selectedFileNames.length > 0 ? (
                      // If files are selected, display filein.svg
                      <Image
                        className="w-10 h-10 mr-1"
                        width={50}
                        height={50}
                        src={"/svgs/filein.svg"}
                        alt=""
                      />
                    ) : (
                      // If no files are selected, display folder-add.svg
                      <Image
                        className="w-10 h-10 mr-1"
                        width={50}
                        height={50}
                        src={"/svgs/gallery-export.svg"}
                        alt=""
                      />
                    )}
                    <div className="flex pb-5">
                      {selectedFileNames.length > 0 ? (
                        <>
                          <p className="">File Attached.</p>
                          <p className="underline decoration-solid text-blue-500 ml-1">
                            Replace
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="">Drag & Drop files or</p>
                          <p className="underline decoration-solid text-blue-500 ml-1">
                            Browse
                          </p>
                        </>
                      )}
                    </div>
                    <span className="text-sm font-normal absolute bottom-2 text-[#667085] ml-10 pb-1">
                      {selectedFileNames.length === 0 ? (
                        // Display "Support PNG & JPG" if no files are attached
                        <span>Support PNG & JPG</span>
                      ) : (
                        // Display the file name if one file is attached, or the number of files if more than one are attached
                        <span>{selectedFileNames[0]}</span>
                      )}
                    </span>
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e)}
                  />
                </div>
              </div>
            </div>
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
                disabled={isSubmitted}
                type="submit"
                className={`
                 ${isSubmitted && " cursor-not-allowed"}
                 w-[150px] h-[45px] px-3 py-2 bg-[#007C85] hover:bg-[#03595B]  text-[#ffff] font-medium  rounded-sm`}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
