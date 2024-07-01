import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { onNavigate } from "@/actions/navigation";
import moment from "moment";
import TimeGraph from "./timeGraph";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import ResuableTooltip from "./reusable/tooltip";
// import MobileTimeGraph from "./mobileTimeGraph";

const PatientCard = ({
  patientWithMedicationLogsToday,
  setPatientUuid,
  setPatientName,
  isModalOpen,
  setIsLoading,
}: {
  patientWithMedicationLogsToday: any;
  setPatientUuid: any;
  setPatientName: any;
  isModalOpen: any;
  setIsLoading: any;
}) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(moment().format("HHmm"));
  // Function to get distinct allergy types
  const getDistinctAllergyTypes = (allergies: any[]) => {
    const distinctTypes: string[] = [];
    allergies?.forEach((allergy: any) => {
      if (!distinctTypes.includes(allergy.type)) {
        distinctTypes.push(allergy.type);
      }
    });
    return distinctTypes.join(", ");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("HHmm"));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentTime]);
  // Function to get medication types and their counts
  const getPRNCount = (medicationLogs: any[]) => {
    const medicationTypes: { [key: string]: number } = {};

    // Count the occurrences of each medication type
    medicationLogs.forEach((log: any) => {
      if (log.medicationType === "PRN") {
        if (!medicationTypes[log.medicationType]) {
          medicationTypes[log.medicationType] = 1;
        } else {
          medicationTypes[log.medicationType]++;
        }
      }
    });

    return medicationTypes;
  };
  const handlePatientClick = (patientId: any) => {
    const lowercasePatientId = patientId.toLowerCase();

    router.replace(
      `/patient-overview/${lowercasePatientId}/medication/scheduled`,
    );
  };

  return (
    <div className="mt-[46px] w-full pl-3">
      <div className="right-0 flex w-full flex-col items-center bg-[#F4F4F4] md:border-r md:border-dashed md:border-r-black">
        <p className="chart-header absolute right-10 top-2 font-light">Prior</p>
        {patientWithMedicationLogsToday.map((patient: any, index: number) => (
          <div className={`w-full`} key={index}>
            <div className="relative right-0 flex h-[203px] w-full flex-row rounded-lg border-2 border-b-8 border-l-8 border-[#F4F4F4] bg-white">
              <div
                className="h-full w-4/6 min-w-[250px] cursor-pointer"
                onClick={() => {
                  setIsLoading(true);
                  handlePatientClick(patient.uuid);
                }}
              >
                <div className="mt-2 flex w-full flex-row p-3 pl-5">
                  <div className="max-h-[60px] min-h-[60px] min-w-[60px] max-w-[60px] rounded-full bg-[#007C854D] p-1">
                    <Image
                      className="rounded-full"
                      src="/imgs/drake.png"
                      alt="Patient"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="ml-5 flex w-full max-w-[250px] flex-col truncate">
                    <p className="flex w-full items-start justify-start truncate text-[20px] font-medium">
                      <ResuableTooltip
                        text={`${patient.firstName} ${patient.middleName} ${patient.lastName}`}
                      />
                    </p>
                    <p className="flex justify-start text-[15px]">
                      {patient.age} years old - {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="ml-5 mt-2 flex h-full max-w-[2500px] flex-col items-start justify-start gap-1 pb-5 pr-5">
                  <p>
                    Attending -{" "}
                    <span className="text-[#64748B]">Nurse Name</span>
                  </p>
                  <p className="flex max-w-[250px] items-start justify-start truncate text-ellipsis">
                    Allergies - {"  "}
                    <span className="flex max-w-[250px] items-start justify-start truncate text-ellipsis text-[#64748B]">
                      {getDistinctAllergyTypes(patient.allergies).length > 0
                        ? getDistinctAllergyTypes(patient.allergies)
                        : "None"}
                    </span>
                  </p>
                  <p>
                    Code -{" "}
                    <span
                      className={`${
                        patient.codeStatus == "DNR"
                          ? "text-[#DB3956]"
                          : "text-[#1B84FF]"
                      }`}
                    >
                      {patient.codeStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="relative flex h-full w-1/6 flex-col items-center justify-between border-l-4 border-solid border-[#F4F4F4]">
                <div className="gray-1 flex h-full w-full cursor-pointer flex-col items-center justify-center border-b-4 border-[#F4F4F4]">
                  <Image
                    src="/icons/chart-order.svg"
                    alt="order"
                    width={28}
                    height={28}
                    className="pointer-events-none select-none"
                  />
                  Orders
                  <p
                    className={`pointer-events-none absolute -z-[0] -mr-7 -mt-7 flex h-4 w-4 select-none items-center justify-center rounded-full bg-[#DB3956] text-[10px] text-white ${
                      patient.medicationlogs.length === 0 ? "hidden" : ""
                    }`}
                  >
                    {patient.medicationlogs.length}
                  </p>
                </div>

                <div
                  className="gray-1 flex h-full w-full cursor-pointer flex-col items-center justify-center border-b-4 border-[#F4F4F4]"
                  onClick={() => {
                    setPatientUuid(patient.uuid);
                    isModalOpen(true);
                    setPatientName(`${patient.firstName} ${patient.lastName}`);
                  }}
                >
                  <Image
                    src="/icons/chart-prn.svg"
                    alt="prn"
                    width={24}
                    height={24}
                    className="pointer-events-none select-none"
                  />
                  PRN
                  {Object.entries(getPRNCount(patient.medicationlogs)).map(
                    ([type, count]) => (
                      <span
                        key={type}
                        className={`pointer-events-none absolute z-10 -mr-7 -mt-7 flex h-4 w-4 select-none items-center justify-center rounded-full bg-[#DB3956] text-[10px] text-white ${
                          count === 0 ? "hidden" : ""
                        }`}
                      >
                        {count}
                      </span>
                    ),
                  )}
                </div>
                <div className="gray-1 flex h-full w-full cursor-pointer flex-row items-center justify-center gap-1 border-[#F4F4F4]">
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src="/icons/chart-status.svg"
                      alt="status"
                      width={20}
                      height={20}
                      className="pointer-events-none select-none"
                    />
                    A
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src="/icons/chart-status.svg"
                      alt="status"
                      width={20}
                      height={20}
                      className="pointer-events-none select-none"
                    />
                    S
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src="/icons/chart-status.svg"
                      alt="status"
                      width={20}
                      height={20}
                      className="pointer-events-none select-none"
                    />
                    D
                  </div>
                </div>
              </div>

              <div className="overflow flex h-full w-[127px] flex-col items-center justify-center overflow-hidden border-l-2 border-solid border-[#F4F4F4] bg-[#007C851A]">
                {patient.medicationlogs.length !== 0 &&
                  patient.medicationlogs.some(
                    (log: any) =>
                      log.medicationLogStatus === "pending" &&
                      moment(log.medicationLogsTime, "HH:mm").format("HHmm") <=
                        currentTime,
                  ) && (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center"
                    >
                      <HoverCard>
                        <HoverCardTrigger>
                          <div
                            className={`cursor-pointer rounded-full bg-[#FACC15] p-1.5`}
                          >
                            <Image
                              src="icons/card-list.svg"
                              alt="list"
                              width={24}
                              height={24}
                              className="pointer-events-none select-none"
                            />
                            <div className="absolute -mt-6 ml-5 h-full">
                              <span className="pointer-events-none absolute flex h-4 w-4 select-none items-center justify-center rounded-full bg-[#DB3956] text-[10px] font-light text-white">
                                {
                                  patient.medicationlogs.filter(
                                    (log: any) =>
                                      log.medicationLogStatus === "pending" &&
                                      moment(
                                        log.medicationLogsTime,
                                        "HH:mm",
                                      ).format("HHmm") <= currentTime,
                                  ).length
                                }
                              </span>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="">
                          <div className="">
                            {patient.medicationlogs
                              .filter(
                                (log: {
                                  medicationLogStatus: string;
                                  medicationLogsTime: any;
                                }) =>
                                  log.medicationLogStatus === "pending" &&
                                  moment(
                                    log.medicationLogsTime,
                                    "HH:mm",
                                  ).format("HHmm") <= currentTime,
                              )
                              .map(
                                (
                                  log: {
                                    [x: string]: ReactNode;
                                    medicationLogsName:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | React.ReactPortal
                                      | React.PromiseLikeOfReactNode
                                      | null
                                      | undefined;
                                    medicationType:
                                      | string
                                      | number
                                      | boolean
                                      | React.ReactElement<
                                          any,
                                          | string
                                          | React.JSXElementConstructor<any>
                                        >
                                      | Iterable<React.ReactNode>
                                      | React.ReactPortal
                                      | React.PromiseLikeOfReactNode
                                      | null
                                      | undefined;
                                  },
                                  logIndex: React.Key | null | undefined,
                                ) => (
                                  <div key={logIndex} className="text-start truncate">
                                    <ResuableTooltip text={`${log.medicationLogsName} - ${" "}
                                    ${log.medicationType} - ${" "}
                                    ${log.medicationLogStatus}`} />
                                  </div>
                                ),
                              )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  )}
              </div>
            </div>
            {/* <MobileTimeGraph patient={patient.medicationlogs}/> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientCard;
