"use client";
import { onNavigate } from "@/actions/navigation";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import Image from "next/image";
import { fetchProfileImages } from "@/app/api/patients-api/patientProfileImage.api";
import ResuableTooltip from "./reusable/tooltip";
import DBDueMedicationLoader from "./loaders/DBDueMedicationLoader";

const DBDueMedication = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [term, setTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dueMedSortBy, setDueMedSortBy] = useState(
    "medicationlogs.medicationLogsTime"
  );
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoading2, setIsLoading2] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [patientDueMedImages, setDueMedPatientImages] = useState<any[]>([]);
  const [dueMedicationList, setDueMedicationList] = useState<
    {
      patient_uuid: string;
      medicationlogs_medicationLogsName: string;
      patient_firstName: string;
      patient_lastName: string;
      patient_middleName: string;
      medicationlogs_medicationLogsDate: string;
      medicationlogs_medicationLogsTime: string;
    }[]
  >([]);
  const [dueMedTotalPages, setDueMedTotalPages] = useState(0);
  const [totalDueMedication, setTotalDueMedication] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dueMedicationList = await fetchDueMedication(
          term,
          currentPage,
          dueMedSortBy,
          sortOrder as "ASC" | "DESC",
          3,
          router
        );

        // Filter data by distinct medicationLogsName for each patient
        const filteredData = dueMedicationList.data.reduce(
          (
            acc: { [key: string]: any },
            currentItem: {
              patient_uuid: string;
              medicationlogs_medicationLogsName: string;
            }
          ) => {
            const key = `${currentItem.patient_uuid}-${currentItem.medicationlogs_medicationLogsName}`;
            if (!acc[key]) {
              acc[key] = currentItem;
            }
            return acc;
          },
          {}
        );

        const filteredArray: {
          patient_uuid: string;
          medicationlogs_medicationLogsName: string;
          patient_firstName: string;
          patient_lastName: string;
          patient_middleName: string;
          medicationlogs_medicationLogsDate: string;
          medicationlogs_medicationLogsTime: string;
        }[] = Object.values(filteredData);
        const limitedArray = filteredArray.slice(0, 5);

        const uniquePatientUuids = new Set(
          dueMedicationList.data.map(
            (patient: { patient_uuid: any }) => patient.patient_uuid
          )
        );

        const patientUuids = Array.from(uniquePatientUuids);

        setDueMedicationList(limitedArray);
        setDueMedTotalPages(dueMedicationList.totalPages);
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
          setDueMedPatientImages(patientImagesData);
          console.log(patientImagesData, "patientImagesData");
        }
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, [currentPage]);

  const formatTime = (timeString: string) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number);

    // Format the hours part into 12-hour format
    let formattedHours = hours % 12 || 12; // Convert 0 to 12
    const ampm = hours < 12 ? "am" : "pm"; // Determine if it's AM or PM

    // If minutes is undefined or null, set it to 0
    const formattedMinutes =
      minutes !== undefined ? minutes.toString().padStart(2, "0") : "00";

    // Return the formatted time string
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };
  const formatDate = (dateOfSurgery: string | number | Date) => {
    // Create a new Date object from the provided createdAt date string
    const date = new Date(dateOfSurgery);

    // Get the month, day, and year
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate;
  };

  return (
    <div className="w-full h-full">
      {dueMedicationList.length > 0 ? (
        <div className="w-full border-[1px] border-[#E4E4E7] py-3 select-none px-5 bg-white">
          <div className="">
            <p className="p-title ">
              Due Medication
              <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
            </p>
            <p className="font-normal text-[15px] text-[#71717A] pt-3 mb-3">
              Total of {totalDueMedication} due medication
              <span>{dueMedicationList.length > 1 ? "s" : ""}</span>
            </p>
          </div>
          <div>
            {dueMedicationList.map((dueMedication, index) => (
              <div
                key={index}
                className="w-full flex flex-row h-[70px] mb-1 px-2 rounded-md hover:bg-slate-100 cursor-pointer justify-between"
              >
                <div className="flex w-3/4">
                  <div className="flex mr-3 items-center ">
                    {patientDueMedImages.some(
                      (image) =>
                        image.patientUuid === dueMedication.patient_uuid
                    ) ? (
                      // Render the matched image
                      <div>
                        {patientDueMedImages.map((image, imgIndex) => {
                          if (
                            image.patientUuid === dueMedication.patient_uuid
                          ) {
                            return (
                              <div key={imgIndex}>
                                {image.data ? (
                                  // Render the image if data is not empty
                                  <div className=" min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]">
                                    <Image
                                      className="rounded-full object-cover w-12 h-12"
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
                  </div>
                  <div className="flex w-4/6">
                    <div className="flex flex-col justify-center gap-1">
                      <p className="font-bold text-[15px] truncate hover:text-wrap">
                        <ResuableTooltip
                          text={`${dueMedication.patient_firstName}${" "}${
                            dueMedication.patient_middleName
                          }${" "}${dueMedication.patient_lastName}`}
                        />
                      </p>
                      <p className="text-[#71717A] font-normal text-[15px]">
                        <ResuableTooltip
                          text={dueMedication.medicationlogs_medicationLogsName}
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-1/4  flex flex-col justify-center items-end text-end gap-1">
                  <p className="font-semibold text-[15px] flex">
                    {formatDate(
                      dueMedication.medicationlogs_medicationLogsDate
                    )}
                  </p>
                  <p className="text-[#71717A] font-medium text-[15px] ml-4">
                    {formatTime(
                      dueMedication.medicationlogs_medicationLogsTime
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* // : ( //{" "}
          <div className="flex items-center text-center justify-center font-normal text-[15px] w-full h-full -mt-10">
            // No Due Medication/s // <br />
            //{" "}
          </div>
          // ) */}
          <div
            onClick={() => {
              setIsLoading(true);
              router.push("/due-medications");
            }}
            className="group flex w-fit cursor-pointer items-center hover:text-[#007C85] font-semibold text-[15px] text-[#71717A] mt-3"
          >
            SEE ALL DUE
            <svg
              className="text-[#71717A] ml-2 group-hover:text-[#007C85]"
              width="17"
              height="14"
              viewBox="0 0 10 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.14795 2.15826L8.7739 8.78421L2.14795 15.4102"
                stroke="currentColor"
                strokeWidth="2.43402"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : (
        <DBDueMedicationLoader />
      )}
    </div>
  );
};

export default DBDueMedication;
