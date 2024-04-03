"use client";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const TimeGraph = () => {
  const [currentTime, setCurrentTime] = useState(moment().format("HHmm"));
  const lineRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    console.log("Updating currentTime:", currentTime);
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format("HHmm"));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [currentTime]);

  const colData = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    const timeLabel = hour + "00";
    colData.push({
      name: timeLabel,
      time: moment().set("hour", i).set("minute", 0).format("HHmm"),
    });
  }
  const specificData = [
    { name: "Data 1", startTime: "1400", endTime: "1499" },
    { name: "Data 2", startTime: "0900", endTime: "0999" },
    { name: "Data 3", startTime: "1400", endTime: "1499" },
    // Add more data as needed
  ];

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
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Adjust hours for PM
    const adjustedHours = period.toUpperCase() === "PM" ? hours + 12 : hours;

    // Calculate the total time in "hundreds"
    const totalTimeInMinutes = adjustedHours * 60 + minutes;
    const totalTimeInHundreds = Math.round((totalTimeInMinutes * 100) / 60);

    // Adjust for 2400 if the time is 12:00 AM
    return totalTimeInHundreds === 0 ? 2400 : totalTimeInHundreds;
  }
  const hundredsTime = convertTimeToHundreds(timeStrings).toString();
  console.log(hundredsTime); // Output: 1650
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
        inline: "center"
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
            {specificData.map((data) =>
              parseInt(col.time) >= parseInt(data.startTime) &&
              parseInt(col.time) <= parseInt(data.endTime) ? (
                <div key={data.name} className="">
                  {data.name}
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeGraph;
