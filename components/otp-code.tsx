"use client";
import {
  generateOTPCode,
  verifyOTPCode,
} from "@/app/api/forgot-pass-api/otp-code";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface OTPCodeProps {
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
  forgotPassEmail: string;
  setIsResetPass: (value: boolean) => void;
  isResetPass: boolean;
}

const OTPCode = ({
  isOTP,
  setIsOTP,
  forgotPassEmail,
  setIsResetPass,
  isResetPass,
}: OTPCodeProps) => {
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const inputs = useRef<HTMLInputElement[]>([]);
  const [isVerify, setIsVerify] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [isNewCode, setIsNewCode] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [isError, setIsError] = useState<boolean>(false);
  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value.length > 0 && /\d/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      if (index < 5) {
        inputs.current[index + 1].focus();
        setCurrentInputIndex(index + 1);
      }
    }
  };

  useEffect(() => {
    if (!otp.includes("")) {
      handleSubmit();
    }
  }, [otp]);

  console.log(otp);
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);
      setIsError(false);
      if (index > 0 && otp[index - 1] !== "") {
        inputs.current[index - 1].focus();
        setCurrentInputIndex(index - 1);
      }
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLInputElement>,
    index: number
  ) => {
    setCurrentInputIndex(index);
    inputs.current[index].focus();
  };

  const handleSubmit = async () => {
    setIsVerify(true);
    try {
      console.log(otp.join(""));
      if (otp.findLastIndex((digit) => digit === "") !== -1) {
        console.log("Please fill all the fields");
        return;
      } else {
        const response = await verifyOTPCode(otp.join(""), forgotPassEmail);
        if (response.isValid) {
          setIsResetPass(true);
          setIsOTP(false);
          setOTP(new Array(6).fill(""));

          // onSuccess();
          // setToastMessage("Email Sent Successfully.");
          // setShowToast(true);
        } else {
          setIsError(true);
        }
      }
    } catch (error) {
      console.error(error);
      // Display error message to the user
    } finally {
      setIsVerify(false);
    }
  };

  const handleSendNewCode = async (e: any) => {
    e.preventDefault();
    setIsNewCode(true);
    setCountdown(60); // Reset countdown to 60 seconds
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clear interval after 1 minute (60 seconds)
    setTimeout(() => {
      clearInterval(intervalId);
      setIsNewCode(false);
    }, 60000);
    try {
      if (forgotPassEmail !== "") {
        const response = await generateOTPCode(forgotPassEmail);

        if (response) {
          console.log("Email Sent Successfully.");
        }
      }
    } catch (error: any) {
      // Handle error
    }
  };

  function maskEmail(email: string): string {
    const segments = email.split("@");
    const username = segments[0];
    const domain = segments[1];

    const maskedUsername =
      username.charAt(0) +
      "*".repeat(Math.max(0, username.length - 2)) +
      username.slice(-1);
    const maskedDomain =
      domain?.charAt(0) +
      "*".repeat(Math.max(0, domain?.length - 5)) +
      domain?.slice(-4);

    return maskedUsername + "@" + maskedDomain;
  }

  const maskedEmail = maskEmail(forgotPassEmail);

  return (
    <div
      className={`flex flex-col fixed justify-center md:px-0 px-[30px] items-center lg:w-[1091px] md:w-full  duration-500 transition h-full 
                ${
                  isOTP
                    ? " opacity-100 z-50"
                    : isResetPass
                    ? "-translate-x-[1000px] opacity-0"
                    : "translate-x-[1000px] opacity-0 z-50"
                }`}
    >
      <h1 className="md:text-[20px] font-semibold  md:text-2xl lg:mb-3 text-white md:text-black md:mb-0 mb-3">
        Enter your verification code!
      </h1>
      <p className="mb-5">We’ve sent the verification code to {maskedEmail}.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsVerify(true);
          handleSubmit();
        }}
      >
        <div className="flex gap-3">
          {otp.map((digit, index) => (
            <input
              className={`w-[83px] h-[90px] rounded-md focus:outline-none text-center text-[50px] 
              
              ${
                otp[index] !== ""
                  ? "bg-[#007C85] text-white"
                  : "bg-[#D9D9D91A]  border border-slate-500"
              } 
              ${isError ? "border-red-500 border bg-red-500" : ""}
              ${currentInputIndex === index ? "border-blue-500" : ""}`}
              key={index}
              type="text"
              id={`otpInput${index + 1}`}
              maxLength={1}
              value={digit}
              ref={(ref: HTMLInputElement) => (inputs.current[index] = ref)}
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={(e) => handleClick(e, index)}
              tabIndex={-1}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          {isError && (
            <p className="text-red-500 w-full">Verification code not valid!</p>
          )}
          {isNewCode ? (
            <p className="text-end w-full my-2 cursor-pointer">
              Send a new code in: {countdown} seconds.
            </p>
          ) : (
            <p
              className="underline text-end w-full my-2 cursor-pointer"
              onClick={handleSendNewCode}
            >
              Send a new code.
            </p>
          )}
        </div>

        <button
          disabled={isVerify}
          className={`
                          ${isVerify ? "cursor-not-allowed" : "cursor-pointer"}
                          inline-block w-full  max-w-[565px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
          type="submit"
        >
          {isVerify ? (
            <div className="flex justify-center items-center w-full">
              <Loader2 size={20} className="animate-spin" /> &nbsp; Verifying...
            </div>
          ) : (
            "Verify"
          )}
        </button>
      </form>
      <p
        className="cursor-pointer bottom-28 absolute"
        onClick={() => {
          setIsOTP(!isOTP);
        }}
      >
        Back to login
      </p>
    </div>
  );
};

export default OTPCode;
