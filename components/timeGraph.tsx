"use client";
import { merge } from "chart.js/helpers";
import moment from "moment";
import Image from "next/image";
import React, { ReactNode, useEffect, useRef, useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ResuableTooltip from "./reusable/tooltip";

const TimeGraph = ({
  patientWithMedicationLogsToday,
  setMedicationLogUuid,
  isAschModalOpen,
  setPatientName,
  setAschData,
  setEndLineHeight,
}: {
  patientWithMedicationLogsToday: any;
  setMedicationLogUuid: any;
  isAschModalOpen: any;
  setPatientName: any;
  setAschData: any;
  setEndLineHeight: any;
}) => {
  const [currentTime, setCurrentTime] = useState(moment().format("HHmm"));
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const lineRef = useRef<HTMLDivElement>(null);

  console.log("Updating currentTime:", currentTime);
  const colData: { name: string; time: string }[] = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    const timeLabel = hour + "00";
    colData.push({
      name: timeLabel,
      time: moment().set("hour", i).set("minute", 0).format("HHmm"),
    });
  }
  console.log(patientWithMedicationLogsToday, "timegraph");

  const currentDate = new Date();
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Convert hours to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Add leading zeros to minutes if needed
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

  // Concatenate hours, minutes, and AM/PM to form the time string
  const timeStrings = `${hours}:${minutesString} ${ampm}`;
  console.log(timeStrings, "timeStrings");

  function convertTimeToHundreds(timeString: string): number {
    // Split the time string into hours, minutes, and AM/PM
    const [time, period] = timeString.split(" ");
    const [hoursStr, minutesStr] = time.split(":");

    // Convert hours and minutes to numbers
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Adjust hours for PM, but not for 12:00 PM
    if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }

    // Calculate the total time in "hundreds"
    const totalTimeInMinutes = hours * 60 + minutes;
    const totalTimeInHundreds = Math.round((totalTimeInMinutes * 100) / 60);

    // Adjust for 2400 if the time is 12:00 AM
    return totalTimeInHundreds === 0 ? 2400 : totalTimeInHundreds;
  }

  console.log(timeStrings, "timeStrings");
  const hundredsTime = convertTimeToHundreds(timeStrings).toString();
  console.log(hundredsTime);
  const linePosition = {
    left: `${(parseInt(hundredsTime.substring(0, 10)) / 2400) * 100}%`,
    height: tableHeight + "px",
  };

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("HHmm"));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentTime]);

  useEffect(() => {
    const table = document.querySelector(".time-graph-table");
    if (table) {
      setTableHeight(table.clientHeight);
      if (lineRef.current) {
        // Here we directly set the height of the line position element
        lineRef.current.style.height = table.clientHeight + "px";
      }
    }
  }, [patientWithMedicationLogsToday]); // Re-calculate height when table content changes

  useEffect(() => {
    // Calculate line position height after the table height has been set
    const table = document.querySelector(".time-graph-table");
    if (table) {
      setTableHeight(table.clientHeight);
      if (lineRef.current) {
        lineRef.current.style.height = table.clientHeight + "px";
      }
    }
  }, []); // Run once after component is mounted

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    setEndLineHeight(tableHeight);
  }, [linePosition]);

  // Event handler for when mouse enters the line
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  // Event handler for when mouse leaves the line
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  console.log(patientWithMedicationLogsToday.length, "lenght");
  return (
    <div className="w-full  ">
      <div className="w-[320vh] h-full overflow-hidden ">
        <div className=" relative z-10">
          <div
            ref={lineRef}
            className="absolute w-1 bg-red-500 "
            style={linePosition}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showTooltip && (
              
              <div
                className="fixed"
                style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
              >
                <ResuableTooltip text={timeStrings}/>
              </div>
              
            )}
          </div>
        </div>

        <table
          className="w-full time-graph-table h-full   "
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="max-h-[20px]">
              {colData.map((col, index) => (
                <th
                  key={col.time}
                  className={`text-lg text-center border-b font-light text-gray-500  border-x border-[#191D23]  border-opacity-60   h-12 max-h-[20px] ${
                    index !== colData.length - 1
                      ? "text-center border-solid  max-h-[20px]  text-nowrap text-ellipsis overflow-hidden"
                      : ""
                  }`}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patientWithMedicationLogsToday.map(
              (data: any, dataIndex: number) => (
                <tr key={dataIndex}>
                  {colData.map((col) => {
                    const logsInColumn = data.medicationlogs.filter(
                      (medLog: any) => {
                        const medicationLogsTime = parseInt(
                          medLog.medicationLogsTime.replace(":", "")
                        );
                        const colTime = parseInt(col.time);

                        return (
                          colTime <= medicationLogsTime &&
                          medicationLogsTime < colTime + 100
                        );
                      }
                    );
                    const isLastColumn =
                      dataIndex === patientWithMedicationLogsToday.length - 1;
                    return (
                      <td
                        key={`${dataIndex}_${col.time}`}
                        className={`h-[204px] text-center border-x border-dashed  border-black overflow text-nowrap text-ellipsis overflow-hidden  ${
                          parseInt(col.time) <= parseInt(currentTime) - 100
                            ? "bg-[#E4E4E4] "
                            : "bg-white"
                        }`}
                        // style={{ maxHeight: "20px" }} // Set fixed height for table cells
                      >
                        <div
                          className={`h-full  ${
                            isLastColumn &&
                            patientWithMedicationLogsToday.length != 1
                              ? "border-b-[10px] "
                              : patientWithMedicationLogsToday.length === 1
                              ? "border-b-0"
                              : "border-b-[10px]"
                          }  border-solid border-[#F4F4F4] flex flex-col justify-center items-center`}
                        >
                          {logsInColumn.length >= 1 ? (
                            <div className="max-h-[15px] flex-col gap-2 text-ellipsis flex  justify-center items-center ">
                              <HoverCard>
                                <HoverCardTrigger>
                                  <div className="flex">
                                    <div className="cursor-pointer relative flex items-center justify-center">
                                      {logsInColumn.some(
                                        (log: {
                                          medicationLogStatus: string;
                                        }) =>
                                          log.medicationLogStatus !== "pending"
                                      ) && (
                                        <Image
                                          src="/icons/chart-done.svg"
                                          alt="chart-done"
                                          width={30}
                                          height={30}
                                          className="pointer-events-none select-none"
                                        />
                                      )}{" "}
                                      {/* Calculate the count of logs where status is not pending */}
                                      {/* Render the count */}
                                      {logsInColumn.filter(
                                        (log: {
                                          medicationLogStatus: string;
                                        }) =>
                                          log.medicationLogStatus !== "pending"
                                      ).length !== 0 && (
                                        <span className="absolute h-4 w-4 -mt-10 pointer-events-none select-none -right-2 top-11 text-xs font-light rounded-full bg-red-600 text-white">
                                          {
                                            logsInColumn.filter(
                                              (log: {
                                                medicationLogStatus: string;
                                              }) =>
                                                log.medicationLogStatus !==
                                                "pending"
                                            ).length
                                          }
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </HoverCardTrigger>
                                {/* Conditionally render HoverCardContent if there are logs with status other than pending */}
                                {logsInColumn.some(
                                  (log: { medicationLogStatus: string }) =>
                                    log.medicationLogStatus !== "pending"
                                ) && (
                                  <HoverCardContent>
                                    {logsInColumn
                                      .filter(
                                        (log: {
                                          medicationLogStatus: string;
                                        }) =>
                                          log.medicationLogStatus !== "pending"
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
                                          <div
                                            key={logIndex}
                                            className="text-start"
                                          >
                                            {log.medicationLogsName} -{" "}
                                            {log.medicationType} -{" "}
                                            {log.medicationLogStatus}
                                          </div>
                                        )
                                      )}
                                  </HoverCardContent>
                                )}
                              </HoverCard>

                              {/* FOR PENDING PRESCRIPTIONS */}

                              {logsInColumn.filter(
                                (log: { medicationLogStatus: string }) =>
                                  log.medicationLogStatus === "pending"
                              ).length !== 0 && (
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <div>
                                      <div className="cursor-pointer relative flex items-center justify-center">
                                        <Image
                                          src={`${
                                            parseInt(col.time) <=
                                            parseInt(currentTime) - 100
                                              ? "/icons/chart-list-red.svg"
                                              : "/icons/chart-list.svg"
                                          }`}
                                          alt="list"
                                          width={30}
                                          height={30}
                                          className="pointer-events-none select-none"
                                        />
                                        {/* Calculate the count of logs where status is not pending */}
                                        {/* Render the count */}
                                        {logsInColumn.filter(
                                          (log: {
                                            medicationLogStatus: string;
                                          }) =>
                                            log.medicationLogStatus ===
                                            "pending"
                                        ).length !== 0 && (
                                          <span className="absolute h-4 w-4 -mt-10 pointer-events-none select-none -right-2 top-11 text-xs font-light rounded-full bg-red-600 text-white">
                                            {
                                              logsInColumn.filter(
                                                (log: {
                                                  medicationLogStatus: string;
                                                }) =>
                                                  log.medicationLogStatus ===
                                                  "pending"
                                              ).length
                                            }
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </HoverCardTrigger>
                                  <HoverCardContent>
                                    {logsInColumn
                                      .filter(
                                        (log: {
                                          medicationLogStatus: string;
                                        }) =>
                                          log.medicationLogStatus === "pending"
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
                                          <div
                                            key={logIndex}
                                            data-uuid={log.uuid}
                                            onClick={() => {
                                              setMedicationLogUuid(log.uuid);
                                              isAschModalOpen(true);
                                              setPatientName(
                                                `${data.firstName} ${data.lastName}`
                                              );
                                              setAschData(log);
                                            }}
                                            className="cursor-pointer hover:text-[#83C5CA] text-start"
                                          >
                                            {log.medicationLogsName} -{" "}
                                            {log.medicationType} -{" "}
                                            {log.medicationLogStatus}
                                          </div>
                                        )
                                      )}
                                  </HoverCardContent>
                                </HoverCard>
                              )}
                            </div>
                          ) : (
                            logsInColumn.map(
                              (
                                log: {
                                  medicationLogStatus:
                                    | string
                                    | number
                                    | boolean
                                    | React.ReactElement<
                                        any,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | React.PromiseLikeOfReactNode
                                    | null
                                    | undefined;
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
                                    | React.PromiseLikeOfReactNode
                                    | null
                                    | undefined;
                                  medicationLogsTime: string;
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
                                //For single prescription logs

                                <HoverCard key={logIndex}>
                                  <HoverCardTrigger>
                                    <div
                                      className="cursor-pointer max-h-[15px] relative flex items-center justify-center"
                                      key={`${dataIndex}_${col.time}_${logIndex}`}
                                    >
                                      {log.medicationLogStatus === "pending" ? (
                                        <span>{log.medicationLogsName}</span>
                                      ) : (
                                        <span>
                                          <Image
                                            src="/icons/chart-done.svg"
                                            alt="done"
                                            width={50}
                                            height={50}
                                            className="pointer-events-none select-none"
                                            //
                                          />
                                        </span>
                                      )}
                                    </div>
                                  </HoverCardTrigger>
                                  <HoverCardContent>
                                    {log.medicationLogsName}
                                    <br />
                                    {formatTime(log.medicationLogsTime)}
                                    <br />
                                    {log.medicationLogStatus}
                                    <br />
                                    {log.medicationType}
                                  </HoverCardContent>
                                </HoverCard>
                              )
                            )
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeGraph;
