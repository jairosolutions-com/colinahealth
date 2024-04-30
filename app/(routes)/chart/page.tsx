"use client";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { fetchPatientPrescriptions } from "@/app/api/patients-api/patientTimeGraph";
import { PrnModalContent } from "@/components/modal-content/prn-modal-content";
import { ScheduledModalContent } from "@/components/modal-content/scheduled-modal-content";
import PatientCard from "@/components/patientCard";
import Modal from "@/components/reusable/modal";
import { ErrorModal } from "@/components/shared/error";
import { SuccessModal } from "@/components/shared/success";
import TimeGraph from "@/components/timeGraph";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChartPage() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
  if (!getAccessToken()) {
    router.replace("/login");
  }
  
  const { toast } = useToast();
  const [patientList, setPatientList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gotoError, setGotoError] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPatients, setTotalPatients] = useState<number>(1);
  const [patientUuid, setPatientUuid] = useState<string>("");
  const [PRNData, setPRNData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAschOpen, setIsAschOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [medicationLogUuid, setMedicationLogUuid] = useState("");
  const [aschData, setAschData] = useState<any[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [endLineHeight, setEndLineHeight] = useState(0);
  console.log(patientName, "patientName");

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
          className={`flex border border-px items-center justify-center  w-[49px]  ${
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

  const patientWithMedicationLogsToday = patientList?.filter((patient) => {
    // Assuming medicationlogs is an array and you want to check if any of the logs were created today
    return patient.medicationlogs.some((log: any) => {
      // Explicitly define the type of 'log' as 'any'
      // Check if the createdAt of any medication log is today's date
      const createdAtDate = new Date(log.createdAt);
      const today = new Date();
      return createdAtDate.toDateString() === today.toDateString();
    });
  });

  const isModalOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isOpen) {
      document.body.style.overflow = "visible";
      setPRNData([]);
    }
  };

  const isAschModalOpen = (isAschOpen: boolean) => {
    setIsAschOpen(isAschOpen);
    if (isAschOpen) {
      document.body.style.overflow = "hidden";
    } else if (!isAschOpen) {
      document.body.style.overflow = "visible";
    }
  };
  console.log(term);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientListWithPrescription = await fetchPatientPrescriptions(
          term,
          currentPage,
          router
        );
        setPatientList(patientListWithPrescription.data);
        setTotalPages(patientListWithPrescription.totalPages);
        setTotalPatients(patientListWithPrescription.totalCount);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.message);
        console.log("error");
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
  }, [currentPage, isOpen, term, isAschOpen]);
  console.log(totalPages, "totalPages");

  const [id, setId] = useState("");
  const searchParams = useSearchParams();
  useEffect(() => {
    if (id) {
      isModalOpen(true);
    }
  }, [id]);
  const handlePRNClicked = (patientId: string) => {
    setId(patientId); // Update state first
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: patientId,
    });
    router.replace(newUrl, { scroll: true }); // Update URL immediately
  };

  const onSuccess = () => {
    setIsSuccessOpen(true);
    setIsEdit(false);
    isModalOpen(false);
    isAschModalOpen(false);
  };
  const onFailed = () => {
    setIsErrorOpen(true);
    setIsEdit(false);
  };
  interface Modalprops {
    label: string;
    isOpen: boolean;
    isModalOpen: (isOpen: boolean) => void;
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }
  console.log(patientWithMedicationLogsToday, "patientWithMedicationLogsToday");
  return (
    <div className=" w-full px-[150px]">
      <div className="w-full flex-col  flex justify-center items-center">
        {patientWithMedicationLogsToday.length == 0 && !term ? (
          <div className="w-full h-screen flex  flex-col justify-center items-center -mt-14">
            <p className="mt-10"> No Data Yet</p>{" "}
            <span> Create a prescription for patient </span>
          </div>
        ) : (
          <div className="bg-[#F4F4F4] h-[827px] max-h-[827px] w-full">
            <div className="top-section w-full pt-24 pl-5">
              <div>
                <img
                  src="/icons/search-icon.svg"
                  alt="search-icon"
                  className="absolute ml-2 mt-4"
                />
                <input
                  type="text"
                  className="w-[419px] rounded-md h-[45px] pl-7 mb-2"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex flex-col w-[250px] justify-between">
                <h1 className=" -mb-8 font-semibold">
                  {" "}
                  Time Chart {" - "}
                  <span className="text-gray-500">
                    Total of {totalPatients} Patients
                  </span>
                </h1>
              </div>
            </div>
            {patientWithMedicationLogsToday.length == 0 && term ? (
              <div className="w-full h-full py-80 flex items-center  justify-center font-thin  ">
                No Patient Found
              </div>
            ) : (
              <div className="w-full relative overflow-hidden flex">
                <div className="md:w-2/6  sticky top-0">
                  <div className="w-full">
                    <PatientCard
                      patientWithMedicationLogsToday={
                        patientWithMedicationLogsToday
                      }
                      setIsLoading={setIsLoading}
                      setPatientUuid={setPatientUuid}
                      isModalOpen={isModalOpen}
                      setPatientName={setPatientName}
                    />
                  </div>
                </div>
                <div className="md:w-4/6 h-full md:block hidden overflow-y-hidden ">
                  <div className="w-full h-full ">
                    <TimeGraph
                      patientWithMedicationLogsToday={
                        patientWithMedicationLogsToday
                      }
                      setMedicationLogUuid={setMedicationLogUuid}
                      isAschModalOpen={isAschModalOpen}
                      setPatientName={setPatientName}
                      setAschData={setAschData}
                      setEndLineHeight={setEndLineHeight}
                    />
                  </div>
                </div>
                <div className=" relative  z-50 r-0">
                  <div
                    className="absolute w-1 bg-[#d9d9d9] endLine "
                    style={{ height: endLineHeight + "px", right: 0 }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white  w-full">
          {/* pagination */}
          {totalPages == 0 ? (
            <div></div>
          ) : (
            <div className="mt-5 w-full">
              <div className="flex items-start justify-between text-start">
                <p className="font-medium size-[18px] w-[138px] ">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-end justify-end">
                  <nav>
                    <div className="flex -space-x-px text-sm">
                      <div>
                        <button
                          onClick={goToPreviousPage}
                          className="flex border border-px items-center justify-center  w-[77px] h-full"
                        >
                          Prev
                        </button>
                      </div>
                      {renderPageNumbers()}

                      <div className="ml-5">
                        <button
                          onClick={goToNextPage}
                          className="flex border border-px items-center justify-center  w-[77px] h-full"
                        >
                          Next
                        </button>
                      </div>
                      <form onSubmit={handleGoToPage}>
                        <div className="flex pl-5 ">
                          <input
                            className={`ipt-pagination appearance-none  text-center border ring-1 ${
                              gotoError ? "ring-red-500" : "ring-gray-300"
                            } border-gray-100`}
                            type="text"
                            placeholder="-"
                            pattern="\d*"
                            value={pageNumber}
                            onChange={handlePageNumberChange}
                            onKeyPress={(e) => {
                              // Allow only numeric characters (0-9), backspace, and arrow keys
                              if (
                                !/[0-9\b]/.test(e.key) &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <div className="pl-5">
                            <button type="submit" className="btn-pagination ">
                              Go{" "}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {isOpen && (
          <Modal
            content={
              <PrnModalContent
                isModalOpen={isModalOpen}
                uuid={patientUuid}
                name={patientName}
                setIsUpdated={""}
                isOpen={isOpen}
                isEdit={isEdit}
                PRNData={PRNData}
                label="charting"
                onSuccess={onSuccess}
                onFailed={onFailed}
                setErrorMessage={setError}
              />
            }
            isModalOpen={isModalOpen}
          />
        )}
        {isAschOpen && (
          <Modal
            content={
              <ScheduledModalContent
                aschData={aschData}
                isModalOpen={isAschModalOpen}
                uuid={medicationLogUuid}
                name={patientName}
                isOpen={isAschOpen}
                isEdit={isEdit}
                scheduledMedData={""}
                setIsUpdated={""}
                label="charting"
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
            isUpdated=""
            setIsUpdated={setIsUpdated}
          />
        )}
        {isErrorOpen && (
          <ErrorModal
            label="Scheduled Log already exist"
            isAlertOpen={isErrorOpen}
            toggleModal={setIsErrorOpen}
            isEdit={isEdit}
            errorMessage={error}
          />
        )}
      </div>
    </div>

    // <div className="App w-full h-full pt-24  md:overflow-hidden md:px-[145px] px-5">
    //   {patientWithMedicationLogsToday.length == 0 && !term ? (
    //     <div className="w-full h-full flex justify-center items-center -mt-10">
    //       No Data Yet
    //     </div>
    //   ) : (
    //     <div
    //       className={`w-full h-full ${
    //         patientWithMedicationLogsToday.length == 0 && term
    //           ? "bg-[#F4F4F4]"
    //           : ""
    //       }`}
    //     >
    //       <div className="w-full flex items-end lg:mt-14 -mt-8 md:py-5 lg:py-0 bg-[#F4F4F4] ">
    //         <div className="absolute text-start p-title md:ml-5 pt-2 -mb-8 justify-start  flex flex-col items-start gap-1 z-10">
    //           <img
    //             src="/icons/search-icon.svg"
    //             alt="search-icon"
    //             className="absolute ml-1 mt-4"
    //           />
    //           <input
    //             type="text"
    //             className="w-[419px] -ml-3 pl-10 h-[45px]  outline-none  pt-[14px] lg:mt-32 ring-[1px] ring-[#E7EAEE] py-3 text-sm font-thin rounded-md"
    //             placeholder="Search by reference no. or name..."
    //             value={term}
    //             onChange={(e) => {
    //               setTerm(e.target.value);
    //               setCurrentPage(1);
    //             }}
    //           />
    //           <h1 className="-ml-3 w-full "> Time Chart</h1>
    //         </div>
    //       </div>
    //       {patientWithMedicationLogsToday.length == 0 && term ? (
    //         <div className="flex items-center  justify-center font-thin text-3xl w-full h-full -mt-10">
    //           No Patient Found
    //         </div>
    //       ) : (
    //         <div className="w-full h-full flex flex-col ">
    //           <div className="flex md:flex-row flex-col pt-24 bg-[#F4F4F4]">
    //             <div className="md:w-2/6 h-full sticky top-0 pt-10">
    //               <PatientCard
    //                 patientWithMedicationLogsToday={
    //                   patientWithMedicationLogsToday
    //                 }
    //                 setIsLoading={setIsLoading}
    //                 setPatientUuid={setPatientUuid}
    //                 isModalOpen={isModalOpen}
    //                 setPatientName={setPatientName}
    //               />
    //             </div>
    //             {/* Ensuring TimeGraph's height adjusts based on PatientCard's height */}
    //             <div className="md:w-4/6 h-full md:block hidden   overflow-y-hidden ">
    //               <div className="w-full h-full pt-[25px] ">
    //                 {" "}
    //                 <TimeGraph
    //                   patientWithMedicationLogsToday={
    //                     patientWithMedicationLogsToday
    //                   }
    //                   setMedicationLogUuid={setMedicationLogUuid}
    //                   isAschModalOpen={isAschModalOpen}
    //                   setPatientName={setPatientName}
    //                   setAschData={setAschData}
    //                   setEndLineHeight={setEndLineHeight}
    //                 />
    //               </div>
    //             </div>
    //
    //           </div>

    //   )}
    // </div>
  );
}
