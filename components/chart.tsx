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
import ChartLoader from "./loaders/ChartLoader";
import LoadingGif from "./loaders/LoadingGif";

const Chart = () => {
  const router = useRouter();
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
          router,
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
    return <LoadingGif />;
    // <ChartLoader />;
  }
  return (
    <div className="h-full w-full px-[150px]">
      <div className="flex h-full w-full flex-col items-center justify-center pt-20">
        {patientWithMedicationLogsToday.length == 0 && !term ? (
          <div className="flex h-screen w-full flex-col items-center justify-center">
            <p className="mt-10"> No Data Yet</p>{" "}
            <span> Create a prescription for patient </span>
          </div>
        ) : (
          <div className="w-full bg-[#F4F4F4]">
            <div className="top-section w-full pl-5 pt-5">
              <div>
                <Image
                  src="/icons/search-icon.svg"
                  alt="search-icon"
                  className="absolute ml-2 mt-4"
                  width={13.35}
                  height={13.35}
                />
                <input
                  type="text"
                  className="placeholder-text h-[45px] w-[419px] rounded-md pl-7"
                  placeholder="Search by reference no. or name..."
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex w-full flex-col justify-between">
                <h1 className="-mb-8 text-[20px] font-medium">
                  <p className="absolute mt-2.5">
                    {" "}
                    Time Chart {" - "}
                    <span className="chart-header">
                      Total of {totalPatients} Patients
                    </span>
                  </p>
                </h1>
              </div>
            </div>
            {patientWithMedicationLogsToday.length == 0 && term ? (
              <div className="flex h-full w-full items-center justify-center font-thin">
                No Patient Found
              </div>
            ) : (
              <div className="relative flex w-full overflow-hidden">
                <div className="sticky top-0 md:w-2/6">
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
                <div className="hidden h-full overflow-y-hidden md:block md:w-4/6">
                  <div className="h-full w-full">
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
                <div className="r-0 relative">
                  <div
                    className="endLine absolute w-[5px] bg-[#d9d9d9]"
                    style={{ height: endLineHeight + "px", right: 0 }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 w-full bg-white">
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
};

export default Chart;
