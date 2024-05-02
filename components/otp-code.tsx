"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";

interface OTPCodeProps {
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
  forgotPassEmail: string;
}

const OTPCode = ({ isOTP, setIsOTP, forgotPassEmail }: OTPCodeProps) => {
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const inputs = useRef<HTMLInputElement[]>([]);

  const handleOTPSubmit = (otp: any) => {
    console.log("OTP submitted:", otp);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newOTP = [...otp];
    if (value.length > 0 && /\d/.test(value)) {
      newOTP[index] = value;
      setOTP(newOTP);
      if (index < 5) {
        inputs.current[index + 1].focus();
      }
      if (index === 5) {
        handleOTPSubmit(otp.join(""));
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);
      if (index > 0 && otp[index - 1] !== "") {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLInputElement>,
    index: number
  ) => {
    if (otp[index] !== "") {
      e.stopPropagation();
    } else {
      inputs.current[index].focus();
    }
  };

  return (
    <div
      className={`flex flex-col fixed justify-center items-center lg:w-[1091px] w-full  duration-500 transition h-full z-50
                ${
                  isOTP ? " opacity-100 z-50" : "translate-x-[1000px] opacity-0"
                }`}
    >
      <h1 className="md:text-[20px] font-semibold  md:text-2xl lg:mb-3 text-white md:text-black md:mb-0 mb-3">
        Enter your verification code!
      </h1>
      <p className="mb-5">
        We’ve send the verification code on{" "}
        <span className="text-underline text-blue-400 cursor-pointer">
          <Link href={"https://mail.google.com/mail/u/0/#inbox"}>
            {forgotPassEmail}
          </Link>
        </span>
        .
      </p>
      <div className="flex gap-3">
        {otp.map((digit, index) => (
          <input
            className={`w-[83px] h-[90px] rounded-md focus:outline-none text-center text-[50px] 
            
              ${
                otp[index] !== ""
                  ? "bg-[#007C85] text-white"
                  : "bg-[#D9D9D91A]  border border-slate-500"
              }`}
            key={index}
            type="text"
            id={`otpInput${index + 1}`}
            maxLength={1}
            value={digit}
            ref={(ref: HTMLInputElement) => (inputs.current[index] = ref)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={(e) => handleClick(e, index)}
            tabIndex={-1}
          />
        ))}
      </div>
      <p className="underline text-end w-full px-[265px] my-2 cursor-pointer">Send a new code</p>
      <button
            disabled={isOTP}
            className={`
                          ${isOTP ? "cursor-not-allowed" : "cursor-pointer"}
                          inline-block w-full  max-w-[565px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
            type="submit"
          >
            Verify
          </button>
      <p
        className="cursor-pointer bottom-28 absolute"
        onClick={() => setIsOTP(!isOTP)}
      >
        Back to login
      </p>
    </div>
  );
};

export default OTPCode;
