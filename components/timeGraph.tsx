"use client";
import { merge } from "chart.js/helpers";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const TimeGraph = ({
  patientWithMedicationLogsToday,
  patientList,
}: {
  patientWithMedicationLogsToday: any;
  patientList: any;
}) => {
  const [currentTime, setCurrentTime] = useState(moment().format("HHmm"));
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("HHmm"));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentTime]);
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
  };

  // Example usage:

  console.log("linePosition:", linePosition);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [linePosition]);

  const mergedPatientList = patientList.map((patient: any) => {
    // Check if patient has medication logs available
    const medicationLogs = patientWithMedicationLogsToday.find(
      (p: any) => p.id === patient.id // Assuming there's an ID field for comparison
    );

    // If medication logs exist for this patient, replace the patient data with medication log data
    if (medicationLogs) {
      return {
        ...patient,
        prescriptions: medicationLogs.prescriptions,
      };
    } else {
      return patient; // If no medication logs, return original patient data
    }
  });
  console.log(mergedPatientList, "mergedPatientList");
  return (
    <div className="overflow-x-auto w-[300vh] h-full">
      <table className="w-full ">
        <thead>
          <tr className="">
            {colData.map((col, index) => (
              <th
                key={col.name}
                className={`text-lg text-center border-b ${
                  index !== colData.length - 1
                    ? "border-r border-solid border-black border-b"
                    : ""
                }`}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patientList.map(
            (data: { prescriptions: any[] }, dataIndex: number) => (
              <tr key={`row_${dataIndex}`} className="truncate">
                {colData.map((col, colIndex) => {
                  const prescriptions = data.prescriptions.filter(
                    (prescription) => {
                      if (prescription.frequency === "Once Daily") {
                        return col.time === "0800";
                      } else if (prescription.frequency === "Twice Daily") {
                        if (prescription.interval === "1") {
                          return col.time === "0800" || col.time === "0900";
                        } else if (prescription.interval === "2") {
                          return col.time === "0800" || col.time === "1000";
                        } else if (prescription.interval === "3") {
                          return col.time === "0800" || col.time === "1100";
                        } else if (prescription.interval === "4") {
                          return col.time === "0800" || col.time === "1200";
                        } else if (prescription.interval === "5") {
                          return col.time === "0800" || col.time === "1300";
                        } else if (prescription.interval === "6") {
                          return col.time === "0800" || col.time === "1400";
                        } else if (prescription.interval === "7") {
                          return col.time === "0800" || col.time === "1500";
                        } else if (prescription.interval === "8") {
                          return col.time === "0800" || col.time === "1600";
                        } else if (prescription.interval === "9") {
                          return col.time === "0800" || col.time === "1700";
                        } else if (prescription.interval === "10") {
                          return col.time === "0800" || col.time === "1800";
                        } else if (prescription.interval === "11") {
                          return col.time === "0800" || col.time === "1900";
                        } else if (prescription.interval === "12") {
                          return col.time === "0800" || col.time === "2000";
                        }
                      } else if (prescription.frequency === "Thrice Daily") {
                        if (prescription.interval === "1") {
                          return (
                            col.time === "0800" ||
                            col.time === "0900" ||
                            col.time === "1000"
                          );
                        } else if (prescription.interval === "2") {
                          return (
                            col.time === "0800" ||
                            col.time === "1000" ||
                            col.time === "1200"
                          );
                        } else if (prescription.interval === "3") {
                          return (
                            col.time === "0800" ||
                            col.time === "1100" ||
                            col.time === "1400"
                          );
                        } else if (prescription.interval === "4") {
                          return (
                            col.time === "0800" ||
                            col.time === "1200" ||
                            col.time === "1600"
                          );
                        } else if (prescription.interval === "5") {
                          return (
                            col.time === "0800" ||
                            col.time === "1300" ||
                            col.time === "1800"
                          );
                        } else if (prescription.interval === "6") {
                          return (
                            col.time === "0800" ||
                            col.time === "1400" ||
                            col.time === "2000"
                          );
                        } else if (prescription.interval === "7") {
                          return (
                            col.time === "0800" ||
                            col.time === "1500" ||
                            col.time === "2200"
                          );
                        } else if (prescription.interval === "8") {
                          return (
                            col.time === "0800" ||
                            col.time === "1600" ||
                            col.time === "0000"
                          );
                        }
                      } else if (
                        prescription.frequency === "Four Times Daily"
                      ) {
                        if (prescription.interval === "1") {
                          return (
                            col.time === "0800" ||
                            col.time === "0900" ||
                            col.time === "1000" ||
                            col.time === "1100"
                          );
                        } else if (prescription.interval === "2") {
                          return (
                            col.time === "0800" ||
                            col.time === "1000" ||
                            col.time === "1200" ||
                            col.time === "1400"
                          );
                        } else if (prescription.interval === "3") {
                          return (
                            col.time === "0800" ||
                            col.time === "1100" ||
                            col.time === "1400" ||
                            col.time === "1700"
                          );
                        } else if (prescription.interval === "4") {
                          return (
                            col.time === "0800" ||
                            col.time === "1200" ||
                            col.time === "1600" ||
                            col.time === "2000"
                          );
                        } else if (prescription.interval === "5") {
                          return (
                            col.time === "0800" ||
                            col.time === "1300" ||
                            col.time === "1800" ||
                            col.time === "2300"
                          );
                        }
                      } else if (
                        prescription.frequency === "Five Times Daily"
                      ) {
                        if (prescription.interval === "1") {
                          return (
                            col.time === "0800" ||
                            col.time === "0900" ||
                            col.time === "1000" ||
                            col.time === "1100" ||
                            col.time === "1200"
                          );
                        } else if (prescription.interval === "2") {
                          return (
                            col.time === "0800" ||
                            col.time === "1000" ||
                            col.time === "1200" ||
                            col.time === "1400" ||
                            col.time === "1600"
                          );
                        } else if (prescription.interval === "3") {
                          return (
                            col.time === "0800" ||
                            col.time === "1100" ||
                            col.time === "1400" ||
                            col.time === "1700" ||
                            col.time === "2000"
                          );
                        } else if (prescription.interval === "4") {
                          return (
                            col.time === "0800" ||
                            col.time === "1200" ||
                            col.time === "1600" ||
                            col.time === "2000" ||
                            col.time === "2400"
                          );
                        }
                      }
                      return false;
                    }
                  );

                  return (
                    <td
                      key={`cell_${dataIndex}_${colIndex}`}
                      className="text-lg text-center whitespace-nowrap overflow-hidden border-r border-solid border-black"
                      style={{ width: "100px" }} // set a fixed width, for example 100px
                    >
                      {prescriptions.map((prescription, index) => (
                        <div
                          key={`${dataIndex}_${colIndex}_${index}`}
                          className=" border-solid border-black"
                        >
                          {prescription.name}
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
      <div className="relative">
        <div
          ref={lineRef}
          className="absolute w-px h-screen bg-red-500 mt-[-12rem]"
          style={linePosition}
        ></div>
      </div>
    </div>
  );
};

export default TimeGraph;
