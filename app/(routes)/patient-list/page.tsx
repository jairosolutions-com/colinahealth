"use client";

import { onNavigate } from "@/actions/navigation";
import { searchPatientList } from "@/app/api/patients-api/patientList.api";
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
import Image from "next/image";
import { fetchProfileImages } from "@/app/api/patients-api/patientProfileImage.api";
import Pagination from "@/components/shared/pagination";
import ResuableTooltip from "@/components/reusable/tooltip";
import PdfDownloader from "@/components/pdfDownloader";

export default function PatientPage() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          width={100}
          height={100}
          alt="logo"
        />
      </div>
    );
  }

  const { toast } = useToast();
  const [isOpenOrderedBy, setIsOpenOrderedBy] = useState(false);
  const [isOpenSortedBy, setIsOpenSortedBy] = useState(false);
  const [sortBy, setSortBy] = useState("firstName");
  const [patientList, setPatientList] = useState<any[]>([]);
  const [patientId, setPatientId] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPatient, setTotalPatient] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pageNumber, setPageNumber] = useState("");
  const [gotoError, setGotoError] = useState(false);
  const [term, setTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const isEdit = false;
  const [patientImages, setPatientImages] = useState<any[]>([]);

  const handleOrderOptionClick = (option: string) => {
    if (option === "Ascending") {
      setSortOrder("ASC");
    } else {
      setSortOrder("DESC");
    }
  };

  const handleSortOptionClick = (option: string) => {
    if (option == "Age") {
      setSortBy("age");
    } else if (option == "Name") {
      setSortBy("firstName");
    } else if (option == "Gender") {
      setSortBy("gender");
    }
    console.log(sortBy, "ooption");
  };

  const optionsOrderedBy = [
    { label: "Ascending", onClick: handleOrderOptionClick },
    { label: "Descending", onClick: handleOrderOptionClick },
  ];
  const optionsSortBy = [
    { label: "Name", onClick: handleSortOptionClick },
    { label: "Age", onClick: handleSortOptionClick },
    { label: "Gender", onClick: handleSortOptionClick },
  ]; // end of orderby & sortby function

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle going to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToPage = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    const pageNumberInt = parseInt(pageNumber, 10);

    // Check if pageNumber is a valid number and greater than 0
    if (
      !isNaN(pageNumberInt) &&
      pageNumberInt <= totalPages &&
      pageNumberInt > 0
    ) {
      setCurrentPage(pageNumberInt);

      console.log("Navigate to page:", pageNumberInt);
    } else {
      setGotoError(true);
      setTimeout(() => {
        setGotoError(false);
      }, 3000);
      console.error("Invalid page number:", pageNumber);
    }
  };

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(e.target.value);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`flex ring-1 ring-gray-300 items-center justify-center  w-[49px]  ${
            currentPage === i ? "btn-pagination" : ""
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await searchPatientList(
          term,
          currentPage,
          sortBy,
          sortOrder as "ASC" | "DESC",
          5,
          router
        );

        // Update patient list
        setPatientList(response.data);
        setTotalPages(response.totalPages);
        setTotalPatient(response.totalCount);
        setIsLoading(false);
        // Get UUIDs of all patients
        const patientUuids = response.data.map(
          (patient: { uuid: any }) => patient.uuid
        );
        if (patientUuids.length === 0) {
          setPatientImages([]);
          return;
        }
        // Fetch profile images for all patients
        const profileImagesResponse = await fetchProfileImages(patientUuids);

        // Buffer the images and store them in an array
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
        }

        if (response.data.length === 0) {
          setPatientList([]);
          setIsLoading(false);
        }
      } catch (error: any) {
        setError(error.message);
        console.log("error", error.message);
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
    };

    fetchData();
  }, [term, sortOrder, currentPage, sortBy, isSuccessOpen]);

  const handlePatientClick = (patientId: any) => {
    const lowercasePatientId = patientId.toLowerCase();
    setIsLoading(true);
    router.replace(
      `/patient-overview/${lowercasePatientId}/medication/scheduled`
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
      </div>
    );
  }
  console.log("patientList", patientList);

  const onSuccess = () => {
    setIsSuccessOpen(true);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
  };

  return (
    <div className="w-full  px-[150px] pt-[90px] flex flex-col justify-between h-full">
      <div className="w-full h-full">
        <div className="flex justify-between items-center">
          <div className="flex flex-col ">
            <p className="p-title">Patients Lists Records</p>
            {/* number of patiens */}
            <p className="sub-title w-[1157px] h-[22px]">
              Total of {patientList.length == 0 ? "0" : totalPatient} Patients
            </p>
          </div>
          <div className="flex flex-row justify-end gap-2">
            <Add onClick={() => isModalOpen(true)}></Add>
            <PdfDownloader
              props={["Uuid", "Name", "Age", "Gender"]}
              variant={"Patient List Table"}
            />
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
                label={"Choose  "}
              />
            </div>
          </div>

          {/* START OF TABLE */}
          <div>
            <table className="w-full justify-center items-start">
              <thead className="text-left rtl:text-right !font-semibold sub-title">
                <tr className="uppercase  border-b border-[#E7EAEE] h-[70px]">
                  <th className="px-6 py-3 !font-semibold">Name</th>
                  <th className="px-6 py-3 !font-semibold">Patient UID</th>
                  <th className="px-6 py-3 !font-semibold">Age</th>
                  <th className="px-6 py-3 !font-semibold">Gender</th>

                  <th className="px-20 py-3 items-center !font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientList.length === 0 && (
                  <tr>
                    <td className="border-1 w-[180vh] py-5 absolute flex justify-center items-center">
                      <p className="text-[15px] font-normal text-gray-700 flex text-center">
                        No Patient Found! <br />
                      </p>
                    </td>
                  </tr>
                )}

                {patientList.map((patient, index) => (
                  <tr
                    key={index}
                    className="group bg-white hover:bg-[#F4F4F4] border-b"
                  >
                    <td className="flex items-center gap-5 px-6 py-5">
                      {/* Check if any matching image found for the patient */}
                      {patientImages.some(
                        (image) => image.patientUuid === patient.uuid
                      ) ? (
                        // Render the matched image
                        <div>
                          {patientImages.map((image, imgIndex) => {
                            if (image.patientUuid === patient.uuid) {
                              return (
                                <div key={imgIndex}>
                                  {image.data ? (
                                    // Render the image if data is not empty
                                    <div className=" min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]">
                                      <Image
                                        className="rounded-full object-cover w-12 h-12"
                                        src={image.data} // Use the base64-encoded image data directly
                                        alt=""
                                        width={48}
                                        height={48}
                                      />
                                    </div>
                                  ) : (
                                    // Render the stock image (.svg) if data is empty
                                    <Image
                                      className="rounded-full  min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]"
                                      src="/imgs/user-no-icon.svg"
                                      alt=""
                                      width={48}
                                      height={48}
                                    />
                                  )}
                                </div>
                              );
                            }
                          })}
                        </div>
                      ) : (
                        // Render a placeholder image if no matching image found
                        <div>
                          <Image
                            className="rounded-full min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]"
                            src="/imgs/loading.gif" // Show loading gif while fetching images
                            alt="Loading"
                            width={48}
                            height={48}
                          />
                        </div>
                      )}

                      <p className="overflow-hidden">
                        <ResuableTooltip
                          text={`${patient.firstName} ${patient.lastName}`}
                        />
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <ResuableTooltip text={patient.uuid} />
                    </td>
                    <td className="px-6 py-5">{patient.age}</td>
                    <td className="px-6 py-5">{patient.gender}</td>
                    <td className="px-[70px]">
                      <p onClick={() => handlePatientClick(patient.uuid)}>
                        <Edit></Edit>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* END OF TABLE */}
        </div>
        {/* pagination */}

        {isOpen && (
          <Modal
            content={
              <DemographicModalContent
                isModalOpen={isModalOpen}
                isOpen={isOpen}
                label="sample label"
                onSuccess={onSuccess}
                onFailed={onFailed}
                setErrorMessage={setError}
              />
            }
            isModalOpen={isModalOpen}
          />
        )}
        {isSuccessOpen && (
          <SuccessModal
            label="Success"
            isAlertOpen={isSuccessOpen}
            toggleModal={setIsSuccessOpen}
            setIsUpdated=""
            isUpdated=""
          />
        )}
        {isErrorOpen && (
          <ErrorModal
            label="Patient already exist"
            isAlertOpen={isErrorOpen}
            toggleModal={setIsErrorOpen}
            isEdit={isEdit}
            errorMessage={error}
          />
        )}
      </div>
      <div className=" bg-white ">
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
}
