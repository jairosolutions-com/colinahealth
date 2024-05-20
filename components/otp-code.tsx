"use client";
import {
  generateOTPCode,
  verifyOTPCode,
} from "@/app/api/forgot-pass-api/otp-code";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface OTPCodeProps {
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
  forgotPassEmail: string;
  setIsResetPass: (value: boolean) => void;
  isResetPass: boolean;
  variant: string;
  rememberMe: boolean;
}

const OTPCode = ({
  isOTP,
  setIsOTP,
  forgotPassEmail,
  setIsResetPass,
  isResetPass,
  variant,
  rememberMe,
}: OTPCodeProps) => {
  const router = useRouter();
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const inputs = useRef<HTMLInputElement[]>([]);
  const [isVerify, setIsVerify] = useState(false);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [isNewCode, setIsNewCode] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (value.length > 0 && /\d/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      for (let i = 0; i < index; i++) {
        if (inputs.current[i].value === "") {
          setCurrentInputIndex(i);
          inputs.current[i].focus();
          return;
        }
      }
      // If all previous inputs are not empty, find the first empty input
      const nextInputIndex = inputs.current.findIndex(
        (input) => input.value === ""
      );
      if (nextInputIndex !== -1) {
        setCurrentInputIndex(nextInputIndex);
        inputs.current[nextInputIndex].focus();
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
      if (newOTP[index] === "") {
        // If the current input is empty, delete the previous input
        if (index > 0) {
          newOTP[index - 1] = "";
          setCurrentInputIndex(index - 1);
          inputs.current[index - 1].focus();
        }
      } else {
        // If the current input is not empty, delete the current input
        newOTP[index] = "";
        setIsError(false);
        if (index > 0 && otp[index - 1] !== "") {
          inputs.current[index - 1].focus();
          setCurrentInputIndex(index - 1);
        }
      }
      setOTP(newOTP);
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target as HTMLInputElement;
    if (value.length > 0) {
      // Find the next empty input field
      let nextInputIndex = index + 1;
      while (
        nextInputIndex < inputs.current.length &&
        inputs.current[nextInputIndex].value !== ""
      ) {
        nextInputIndex++;
      }
      if (nextInputIndex < inputs.current.length) {
        setCurrentInputIndex(nextInputIndex);
        inputs.current[nextInputIndex].focus();
      }
    } else {
      // If the input field is empty, focus on it
      setCurrentInputIndex(index);
      inputs.current[index].focus();
    }
  };

  console.log(variant, "var");
  const handleSubmit = async () => {
    setIsVerify(true);
    try {
      console.log(otp.join(""));
      if (otp.findLastIndex((digit) => digit === "") !== -1) {
        console.log("Please fill all the fields");
        return;
      } else {
        const response = await verifyOTPCode(
          otp.join(""),
          forgotPassEmail,
          variant,
          rememberMe
        );
        if (response.isValid) {
          if (variant === "signIn") {
            router.push("/dashboard");
          }
          if (variant === "forgotPass") {
            setIsResetPass(true);
            setIsOTP(false);
            setOTP(new Array(6).fill(""));
          }
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
    setIsSending(true);
    try {
      if (forgotPassEmail !== "") {
        const response = await generateOTPCode(forgotPassEmail, variant);
        setIsSending(false);
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
      className={`flex flex-col fixed justify-center md:px-0 px-[30px] items-center lg:max-w-[560px] md:w-full max-w-[400px]  duration-500 transition h-full 
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
      <p className="mb-5 text-white md:text-black md:px-0 text-center">
        We’ve sent the verification code to {maskedEmail}.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsVerify(true);
          handleSubmit();
        }}
        className="flex flex-col items-center justify-center w-full"
      >
        <div className="flex md:gap-3 gap-1  items-center justify-center text-center">
          {otp.map((digit, index) => (
            <input
              className={`md:max-w-[83px] md:max-h-[90px]  max-w-[50px] max-h-[57px] rounded-md focus:outline-none text-center text-[50px] 
              
              ${
                otp[index] !== ""
                  ? "bg-[#007C85] text-white"
                  : "md:bg-[#D9D9D91A] bg-white border border-slate-500"
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

        <div className="flex justify-between items-center w-full">
          {isError && (
            <p className="text-red-500 w-full">Verification code not valid!</p>
          )}
          {isSending ? (
            <p className="text-end w-full my-2 cursor-pointer text-white md:text-black">
              Sending...
            </p>
          ) : isNewCode ? (
            <p className="text-end w-full my-2 cursor-pointer text-white md:text-black">
              Send a new code in: {countdown} seconds.
            </p>
          ) : (
            <p
              className="underline text-end w-full my-2 cursor-pointer text-white md:text-black"
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
                          inline-block w-full  md:max-w-[565px] max-w-[400px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
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
        className="cursor-pointer bottom-28 absolute text-white md:text-black"
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
