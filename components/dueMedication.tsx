"use client";
import React from "react";
import { onNavigate } from "@/actions/navigation";
import DropdownMenu from "@/components/dropdown-menu";
import Edit from "@/components/shared/buttons/view";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorModal } from "@/components/shared/error";
import { SuccessModal } from "@/components/shared/success";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import Add from "@/components/shared/buttons/add";
import DownloadPDF from "@/components/shared/buttons/downloadpdf";
import Modal from "@/components/reusable/modal";
import { DemographicModalContent } from "@/components/modal-content/demographic-modal-content";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import Image from "next/image";
import Pagination from "@/components/shared/pagination";
import { fetchProfileImages } from "@/app/api/patients-api/patientProfileImage.api";
import ResuableTooltip from "@/components/reusable/tooltip";
import DueMedicationLoader from "./loaders/dueMedicationLoader";
import PdfDownloader from "./pdfDownloader";

const DueMedication = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [dueMedSortBy, setDueMedSortBy] = useState(
    "medicationlogs.medicationLogsTime"
  );
  const [patientList, setPatientList] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPatient, setTotalPatient] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pageNumber, setPageNumber] = useState("");
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [dueMedTotalPages, setDueMedTotalPages] = useState(0);
  const [totalDueMedication, setTotalDueMedication] = useState(0);
  const [patientImages, setPatientImages] = useState<any[]>([]);
  const [dueMedicationList, setDueMedicationList] = useState<
    {
      patient_uuid: string;
      medicationlogs_medicationLogsName: string;
      patient_firstName: string;
      patient_lastName: string;
      patient_middleName: string;
      medicationlogs_medicationLogsDate: string;
      medicationlogs_medicationLogsTime: string;
      medicationlogs_uuid: string;
    }[]
  >([]);
  const isEdit = false;
  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "Name") {
      setDueMedSortBy("patient.firstName");
    } else if (option == "Due Med UID") {
      setDueMedSortBy("medicationlogs.uuid");
    } else if (option == "Time") {
      setDueMedSortBy("medicationlogs.medicationLogsTime");
    } else if (option == "Medication") {
      setDueMedSortBy("medicationlogs.medicationLogsName");
    }
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Name", onClick: handleSortOptionClick },
    { label: "Due Med UID", onClick: handleSortOptionClick },
    { label: "Time", onClick: handleSortOptionClick },
    { label: "Medication", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dueMedicationList = await fetchDueMedication(
          term,
          currentPage,
          dueMedSortBy,
          sortOrder as "ASC" | "DESC",
          5,
          router
        );

        const uniquePatientUuids = new Set(
          dueMedicationList.data.map(
            (patient: { patient_uuid: any }) => patient.patient_uuid
          )
        );

        const patientUuids = Array.from(uniquePatientUuids);
        setDueMedicationList(dueMedicationList.data);
        setTotalPages(dueMedicationList.totalPages);
        setTotalDueMedication(dueMedicationList.totalCount);
        setIsLoading(false);
        const profileImagesResponse = await fetchProfileImages(
          patientUuids as string[]
        );
        if (profileImagesResponse) {
          const patientImagesData = profileImagesResponse.map((image: any) => {
            // Convert the image data buffer to a data URL if available
            if (image.data) {
              const buffer = Buffer.from(image.data);
              const dataUrl = `data:image/jpeg;base64,${buffer.toString(
                "base64"
              )}`;
              return {
                patientUuid: image.patientUuid,
                data: dataUrl,
              };
            } else {
              // If no data URL is available, return an empty object
              return {
                patientUuid: image.patientUuid,
                data: "",
              };
            }
          });
          setPatientImages(patientImagesData);
          console.log(patientImagesData, "patientImagesData");
        }
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, [currentPage, term, dueMedSortBy, sortOrder]);

  const handlePatientClick = (patientId: any) => {
    const lowercasePatientId = patientId.toLowerCase();
    setIsLoading(true);
    onNavigate(
      router,
      `/patient-overview/${lowercasePatientId}/medical-history/allergies`
    );
  };

  if (isLoading) {
    return <DueMedicationLoader />;
  }
  console.log("patientList", patientList);

  const onSuccess = () => {
    setIsSuccessOpen(true);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
  };
  return (
    <div className="w-full px-[150px] pt-[90px] flex flex-col justify-between h-full">
      <div className="w-full h-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center h-full">
            <p className="p-title flex ">Due Medication</p>
            {/* number of patiens */}
            <p className="sub-title ">
              Total of {totalDueMedication == 0 ? "0" : totalDueMedication} Due
              Medication{totalDueMedication > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-row justify-end">
            <PdfDownloader 
            props={[
              "Name",
              "Uuid",
              "Medication",
              "Date",
              "Time",
            ]}
            variant={"Due Medication Table"}/>
          </div>
        </div>

        <div className="w-full sm:rounded-lg items-center mt-4">
          <div className="w-full justify-between flex items-center bg-[#F4F4F4] h-[75px]">
            <form className="mr-5 relative">
              {/* search bar */}
              <label className=""></label>
              <div className="flex flex-col">
                <input
                  className="py-3 px-5 m-5 w-[573px] outline-none h-[47px] pt-[14px] ring-[1px] ring-[#E7EAEE] sub-title rounded pl-10 relative bg-[#fff] bg-no-repeat "
                  type="text"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      // Add your search logic here
                    }
                  }}
                />
                <Image
                  src="/svgs/search.svg"
                  alt="Search"
                  width={18.75}
                  height={18.75}
                  className=" w-[18.75px] h-[18.75px] pointer-events-none absolute top-9 left-8"
                />
              </div>
            </form>

            <div className="flex w-full justify-end items-center gap-[12px] mr-3">
              <p className="text-[#191D23] opacity-[60%] font-semibold text-[15px]">
                Order by
              </p>
              <DropdownMenu
                options={optionsOrderedBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                  },
                }))}
                open={isOpenOrderedBy}
                width={"165px"}


checkBox=false
                label={"Select"}
              />
              <p className="text-[#191D23] opacity-[60%] font-semibold text-[15px]">
                Sort by
              </p>
              <DropdownMenu
                options={optionsSortBy.map(({ label, onClick }) => ({
                  label,
                  onClick: () => {
                    onClick(label);
                    console.log("label", label);
                  },
                }))}
                open={isOpenSortedBy}
                width={"165px"}


checkBox=false
                label={"Choose  "}
              />
            </div>
          </div>

          {/* START OF TABLE */}
          <div>
            <table className="w-full h-full justify-center items-start">
              <thead className=" text-left rtl:text-right">
                <tr className="uppercase !font-semibold sub-title border-b border-[#E7EAEE] h-[70px]">
                  <td className="px-6 py-5 ">Name</td>
                  <td className="px-6 py-5 w-[300px]">DUE MED UID</td>
                  <td className="px-6 py-5">Medication</td>
                  <td className="px-6 py-5 w-[200px]">Date</td>
                  <td className="px-6 py-5 w-[200px]">Time</td>
                </tr>
              </thead>
              <tbody>
                {dueMedicationList.length === 0 && (
                  <tr>
                    <td className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                      <p className="text-[15px] font-normal text-gray-700  text-center">
                        No Due Medication Found!
                      </p>
                    </td>
                  </tr>
                )}
                {dueMedicationList.map((dueMedication, index) => (
                  <tr
                    key={index}
                    className=" group  bg-white hover:bg-[#F4F4F4] border-b text-[15px]"
                  >
                    <td className="px-6 py-5 flex items-center gap-2">
                      {patientImages.some(
                        (image) =>
                          image.patientUuid === dueMedication.patient_uuid
                      ) ? (
                        // Render the matched image
                        <div>
                          {patientImages.map((image, imgIndex) => {
                            if (
                              image.patientUuid === dueMedication.patient_uuid
                            ) {
                              return (
                                <div key={imgIndex}>
                                  {image.data ? (
                                    // Render the image if data is not empty
                                    <div className=" min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]">
                                      <Image
                                        className="rounded-full object-cover min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]"
                                        src={image.data} // Use the base64-encoded image data directly
                                        alt=""
                                        width={45}
                                        height={45}
                                      />
                                    </div>
                                  ) : (
                                    // Render the stock image (.svg) if data is empty
                                    <Image
                                      className="rounded-full min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]"
                                      src="/imgs/user.png"
                                      alt=""
                                      width={45}
                                      height={45}
                                    />
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        // Render a placeholder image if no matching image found
                        // Only render stock image when images are loaded
                        <div>
                          <Image
                            className="rounded-full min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]"
                            src="/imgs/loading.gif" // Show loading gif while fetching images
                            alt="Loading"
                            width={45}
                            height={45}
                          />
                        </div>
                      )}
                      <span className="w-[300px] truncate">
                        <ResuableTooltip
                          text={`${dueMedication.patient_firstName} ${""}
                        ${dueMedication.patient_lastName}`}
                        />
                      </span>
                    </td>
                    <td className="px-6 py-5 w-[300px] truncate">
                      <ResuableTooltip
                        text={dueMedication.medicationlogs_uuid}
                      />
                    </td>
                    <td className="px-6 py-5 truncate">
                      <ResuableTooltip
                        text={dueMedication.medicationlogs_medicationLogsName}
                      />
                    </td>
                    <td className="px-6 py-5 w-[200px]">
                      {dueMedication.medicationlogs_medicationLogsDate}
                    </td>
                    <td className="px-6 py-5 w-[200px]">
                      {dueMedication.medicationlogs_medicationLogsTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* END OF TABLE */}
        </div>
      </div>
      {/* pagination */}
      <div className="">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DueMedication;
