"use client";
import { merge } from "chart.js/helpers";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TimeGraph = ({
  patientWithMedicationLogsToday,
  patientList,
}: {
  patientWithMedicationLogsToday: any;
  patientList: any;
}) => {
  const [currentTime, setCurrentTime] = useState(moment().format("HHmm"));
  const [tableHeight, setTableHeight] = useState<number>(0);
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
  console.log(patientList, "patientlist");

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

  // Example usage:

  console.log("linePosition:", linePosition);

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
  }, [linePosition]);

  return (
    <div className="w-[350vh] h-full">
      <div className=" relative">
        <div
          ref={lineRef}
          className="absolute w-px bg-red-500 "
          style={linePosition}
        ></div>
      </div>
      <table
        className="w-full time-graph-table h-full   "
        style={{ tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            {colData.map((col, index) => (
              <th
                key={col.time}
                className={`text-lg text-center border-b ${
                  index !== colData.length - 1
                    ? "text-center border-x border-solid border-black border-b text-nowrap text-ellipsis overflow-hidden"
                    : ""
                }`}
                style={{
                  maxWidth: "200px",
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

                  return (
                    <td
                      key={`${dataIndex}_${col.time}`}
                      className="text-center border-x border-solid border-black border-b text-nowrap text-ellipsis overflow-hidden max-h-[50px] "
                    >
                      {logsInColumn.map((log: any, logIndex: number) => (
                        <div
                          className="cursor-pointer"
                          key={`${dataIndex}_${col.time}_${logIndex}`}
                        >
                          <HoverCard>
                            <HoverCardTrigger>
                              {log.medicationLogsName}
                            </HoverCardTrigger>

                            <HoverCardContent>
                              {log.medicationLogsName}
                              <br />
                              {log.medicationLogsTime}
                              <br />
                              {log.medicationLogStatus}
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeGraph;
