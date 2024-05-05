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
      `/patient-overview/${lowercasePatientId}/medical-history/allergies`
    );
  };

  return (
    <div className="w-full pl-3 mt-[46px] ">
      <div className="flex w-full  flex-col  bg-[#F4F4F4] items-center  md:border-dashed md:border-r md:border-r-black   right-0 ">
        <p className="absolute top-2 right-10 text-lg text-gray-500 font-light ">
          Prior
        </p>
        {patientWithMedicationLogsToday.map((patient: any, index: number) => (
          <div
            className={`

          w-full `}
            key={index}
          >
            <div className="flex flex-row  bg-white border-2 border-b-8 border-l-8  h-[203px] w-full rounded-lg border-[#F4F4F4] right-0">
              <div
                className="w-4/6 h-full cursor-pointer min-w-[250px] "
                onClick={() => {
                  setIsLoading(true);
                  handlePatientClick(patient.uuid);
                }}
              >
                <div className="flex p-3 pl-5 flex-row w-full mt-2">
                  <div className="rounded-full min-w-[60px] min-h-[60px] max-h-[60px] max-w-[60px] p-1 bg-[#007C854D]">
                    <Image
                      className="rounded-full"
                      src="/imgs/drake.png"
                      alt="Patient"
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="ml-5 max-w-[250px]  flex flex-col truncate text-ellipsis ">
                    <p className=" font-semibold text-lg justify-start items-start flex truncate text-ellipsis">
                      {patient.firstName} {patient.middleName}{" "}
                      {patient.lastName}
                    </p>
                    <p className="flex text-sm justify-start">
                      {patient.age} years old - {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="max-w-[2500px] h-full flex flex-col justify-start items-start gap-1 mt-2 ml-5 pr-5 pb-5">
                  <p>
                    Attending -{" "}
                    <span className="text-gray-400">Nurse Name</span>
                  </p>
                  <p className="truncate text-ellipsis max-w-[250px] flex justify-start items-start">
                    Allergies - {"  "}
                    <span className="max-w-[250px] flex justify-start items-start text-gray-400 truncate text-ellipsis">
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
                          ? "text-red-600"
                          : "text-blue-400"
                      }`}
                    >
                      {patient.codeStatus}
                    </span>
                  </p>
                </div>
              </div>

              <div className="h-full w-1/6 border-[#F4F4F4] border-l-4 border-solid flex justify-between items-center flex-col">
                <div className="h-full w-full flex flex-col border-[#F4F4F4] border-b-4 text-xs items-center justify-center  cursor-pointer">
                  <Image
                    src="/icons/chart-order.svg"
                    alt="order"
                    width={20}
                    height={20}
                    className="pointer-events-none select-none"
                  />
                  Orders
                  <p
                    className={`absolute flex justify-center items-center h-4 w-4 text-white bg-red-500 text-xs pointer-events-none select-none -mt-7 -mr-7  rounded-full -z-[0] ${
                      patient.medicationlogs.length === 0 ? "hidden" : ""
                    }`}
                  >
                    {patient.medicationlogs.length}
                  </p>
                </div>

                <div
                  className="h-full w-full flex flex-col border-[#F4F4F4] border-b-4 text-xs items-center justify-center  cursor-pointer"
                  onClick={() => {
                    setPatientUuid(patient.uuid);
                    isModalOpen(true);
                    setPatientName(`${patient.firstName} ${patient.lastName}`);
                  }}
                >
                  <Image
                    src="/icons/chart-prn.svg"
                    alt="prn"
                    width={20}
                    height={20}
                    className="pointer-events-none select-none"
                  />
                  PRN
                  {Object.entries(getPRNCount(patient.medicationlogs)).map(
                    ([type, count]) => (
                      <span
                        key={type}
                        className={`absolute flex justify-center items-center z-10 h-4 w-4 text-white bg-red-500 text-xs select-none pointer-events-none -mt-7 -mr-7 rounded-full ${
                          count === 0 ? "hidden" : ""
                        }`}
                      >
                        {count}
                      </span>
                    )
                  )}
                </div>
                <div className="h-full w-full flex flex-row border-[#F4F4F4] text-xs items-center gap-1 justify-center  cursor-pointer">
                  <div>
                    <Image
                      src="/icons/chart-status.svg"
                      alt="status"
                      width={15}
                      height={15}
                      className="pointer-events-none select-none"
                    />
                    A
                  </div>
                  <div>
                    <Image
                      src="/icons/chart-status.svg"
                      alt="status"
                      width={15}
                      height={15}
                      className="pointer-events-none select-none"
                    />
                    S
                  </div>
                  <div>
                    <Image
                      src="/icons/chart-status.svg"
                      alt="status"
                      width={15}
                      height={15}
                      className="pointer-events-none select-none"
                    />
                    D
                  </div>
                </div>
              </div>

              <div className="h-full w-[127px] border-[#F4F4F4] border-l-2 border-solid flex justify-center overflow overflow-hidden items-center flex-col bg-[#007C851A] ">
                {patient.medicationlogs.length !== 0 &&
                  patient.medicationlogs.some(
                    (log: any) =>
                      log.medicationLogStatus === "pending" &&
                      moment(log.medicationLogsTime, "HH:mm").format("HHmm") <=
                        currentTime
                  ) && (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center"
                    >
                      <HoverCard>
                        <HoverCardTrigger>
                          <div
                            className={`bg-[#FACC15] rounded-full p-1.5 cursor-pointer`}
                          >
                            <Image
                              src="icons/card-list.svg"
                              alt="list"
                              width={20}
                              height={20}
                              className="pointer-events-none select-none"
                            />
                            <div className=" h-full  absolute -mt-6 ml-5">
                              <span className="absolute flex justify-center items-center h-4 w-4 text-xs font-light rounded-full bg-red-600 text-white pointer-events-none select-none">
                                {
                                  patient.medicationlogs.filter(
                                    (log: any) =>
                                      log.medicationLogStatus === "pending" &&
                                      moment(
                                        log.medicationLogsTime,
                                        "HH:mm"
                                      ).format("HHmm") <= currentTime
                                  ).length
                                }
                              </span>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
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
                                    "HH:mm"
                                  ).format("HHmm") <= currentTime
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
                                  logIndex: React.Key | null | undefined
                                ) => (
                                  <div key={logIndex} className=" text-start">
                                    {log.medicationLogsName} -{" "}
                                    {log.medicationType} -{" "}
                                    {log.medicationLogStatus}
                                  </div>
                                )
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
