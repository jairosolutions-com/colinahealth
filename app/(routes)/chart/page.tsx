"use client";
import Image from "next/image";
import { getAccessToken } from "@/app/api/login-api/accessToken";
import { fetchPatientPrescriptions } from "@/app/api/patients-api/patientTimeGraph";
import { PrnModalContent } from "@/components/modal-content/prn-modal-content";
import { ScheduledModalContent } from "@/components/modal-content/scheduled-modal-content";
import PatientCard from "@/components/patientCard";
import Modal from "@/components/reusable/modal";
import { ErrorModal } from "@/components/shared/error";
import Pagination from "@/components/shared/pagination";
import { SuccessModal } from "@/components/shared/success";
import TimeGraph from "@/components/timeGraph";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { formUrlQuery } from "@/lib/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChartPage() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/imgs/colina-logo-animation.gif"
          width={100}
          height={100}
          alt="loading"
        />
      </div>
    );
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
      <div className="container w-full h-full flex justify-center items-center ">
        <Image
          src="/imgs/colina-logo-animation.gif"
          alt="logo"
          width={100}
          height={100}
        />
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
                <Image
                  src="/icons/search-icon.svg"
                  alt="search-icon"
                  className="absolute ml-2 mt-4"
                  width={20}
                  height={20}
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
              <div className="w-full h-full  flex items-center  justify-center font-thin  ">
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
                <div className=" relative  r-0">
                  <div
                    className="absolute w-1 bg-[#d9d9d9] endLine "
                    style={{ height: endLineHeight + "px", right: 0 }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white  w-full mt-5">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            setCurrentPage={setCurrentPage}
          />
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
  );
}
