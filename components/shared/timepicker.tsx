import React, { useState } from "react";

const TimePicker = () => {
  const [time, setTime] = useState("");

  const handleChange = (e: any) => {
    setTime(e.target.value);
  };

  return (
    <form className="max-w-[20rem]">
      <div className="relative">
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
          <svg
            className={`w-4 h-4 ${time ? "text-gray-300" : "hidden"}`}
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M3 12C3 6.477 7.477 2 13 2s10 4.477 10 10-4.477 10-10 10S3 17.523 3 12Zm12-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L14 11.586V8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <input
          type={time ? "time" : "text"} //
          id="time"
          className={`border leading-none border-gray-300 ${
            time ? "text-xs" : "text-xs"
          } rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          onChange={handleChange}
          value={time}
          placeholder="Select Time"
          onClick={() => setTime("time")}
          required
        />
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12C3 6.477 7.477 2 13 2s10 4.477 10 10-4.477 10-10 10S3 17.523 3 12Zm12-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L14 11.586V8Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                opacity="0.5"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#878787"
              ></path>{" "}
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                fill="#878787"
              ></path>{" "}
            </g>
          </svg>
        </div>
      </div>
    </form>
  );
};

export default TimePicker;
