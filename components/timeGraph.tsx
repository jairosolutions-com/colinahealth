"use client";
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
  const colData = [];
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

  return (
    <div className="w-[300vh] relative ">
      <div className="relative h-full">
        <div
          ref={lineRef}
          className="absolute  w-px h-screen bg-red-500 mt-[-5rem]"
          style={linePosition}
        ></div>
      </div>
      <div className="flex w-full justify-evenly divide-x divide-solid divide-black ">
        {colData.map((col) => (
          <div key={col.name} className="text-lg text-center w-full">
            {col.name}
            {patientWithMedicationLogsToday.map((data: any) => {
              return data.medicationlogs.map((medLog: any, index: number) => {
                const medicationLogsTime = parseInt(
                  medLog.medicationLogsTime.replace(":", "")
                );
                const colTime = parseInt(col.time);
                if (
                  colTime <= medicationLogsTime &&
                  colTime + 99 >= medicationLogsTime
                ) {
                  return (
                    <div key={`${data.name}_${index}`} className="">
                      {medLog.medicationLogsName}
                    </div>
                  );
                } else {
                  return null;
                }
              });
            })}
            <div className="text-red-700">
              {patientList.map((data: any) => {
                return data.prescriptions.map(
                  (prescription: any, index: number) => {
                    // Check frequency
                    if(prescription.frequency === "Once Daily"){
                      if(col.time ==="0800"){
                        return (
                          <React.Fragment key={`${data.name}_${index}`}>
                            {col.time === "0800" && (
                              <div className="">{prescription.name}</div>
                            )}
                          </React.Fragment>
                        );
                      }
                    }
                    else if (prescription.frequency === "Twice Daily") {
                      if (prescription.interval === "1") {
                        if (col.time === "0800" || col.time === "0900") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "0900" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "2") {
                        if (col.time === "0800" || col.time === "1000") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1000" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "3") {
                        if (col.time === "0800" || col.time === "1100") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1100" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "4") {
                        if (col.time === "0800" || col.time === "1200") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1200" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "5") {
                        if (col.time === "0800" || col.time === "1300") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1300" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "6") {
                        if (col.time === "0800" || col.time === "1400") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1400" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "7") {
                        if (col.time === "0800" || col.time === "1500") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1500" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "8") {
                        if (col.time === "0800" || col.time === "1600") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1600" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "9") {
                        if (col.time === "0800" || col.time === "1700") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1700" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "10") {
                        if (col.time === "0800" || col.time === "1800") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1800" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "11") {
                        if (col.time === "0800" || col.time === "1900") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "1900" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      } else if (prescription.interval === "12") {
                        if (col.time === "0800" || col.time === "2000") {
                          return (
                            <React.Fragment key={`${data.name}_${index}`}>
                              {col.time === "0800" && (
                                <div className="">{prescription.name}</div>
                              )}
                              {col.time === "2000" && (
                                <div className="">{prescription.name}</div>
                              )}
                            </React.Fragment>
                          );
                        }
                      }
                    }
                    
                    // Add more conditions for other frequencies if needed
                    return null; // Return null for prescriptions not meeting the conditions
                  }
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeGraph;
