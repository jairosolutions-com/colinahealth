"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";

interface OTPCodeProps {
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
  forgotPassEmail: string;
  setIsResetPass: (value: boolean) => void;
  isResetPass: boolean;
}

const OTPCode = ({ isOTP, setIsOTP, forgotPassEmail,setIsResetPass,isResetPass }: OTPCodeProps) => {
  const [otp, setOTP] = useState(new Array(6).fill(""));
  const inputs = useRef<HTMLInputElement[]>([]);
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    subject: false,
    message: false,
  });

  const handleOTPSubmit = (otp: any) => {
    console.log("OTP submitted:", otp);
  };

  const handleVerify = () => {
    // let newErrors = {
    //   subject: false,
    //   message: false,
    // };
    // let hasError = false;

    // for (const [key, value] of Object.entries(formData)) {
    //   if (value.trim() === "") {
    //     newErrors = { ...newErrors, [key]: true };
    //     hasError = true;
    //   }
    // }

    // setErrors(newErrors);

    // if (!hasError) {
    //   setIsLoading(true);
    // }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsResetPass(true);
    setIsOTP(false)
    // const data = {
    //   emailAddress: forgotPassEmail,
    //   subject: String(e.target.subject?.value),
    //   message: String(e.target.message?.value),
    // };

    // if (data.emailAddress != "" && data.subject != "" && data.message != "") {
    //   const response = await fetch("/api/send-email", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (response.ok) {
    //     // formData.emailAddress = "";
    //     // formData.firstName = "";
    //     // formData.lastName = "";
    //     setIsLoading(false);
    //     // onSuccess();
    //     // setToastMessage("Email Sent Successfully.");
    //     // setShowToast(true);
    //   }

    //   if (!response.ok) {
    //     // setInvalidEmail(true);
    //     setIsLoading(false);
    //     // onFailed();
    //     // setShowToast(true);
    //     // setToastMessage("Something went wrong.");
    //   }
    // }
    setIsVerify(false);
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
        setCurrentInputIndex(index + 1);
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
  console.log(currentInputIndex, "currentInputIndex");

  return (
    <div
      className={`flex flex-col fixed justify-center items-center lg:w-[1091px] w-full  duration-500 transition h-full 
                ${
                  isOTP ? " opacity-100 z-50" 
                  : isResetPass? "-translate-x-[1000px] opacity-0"
                  : "translate-x-[1000px] opacity-0 z-50"
                }`}
    >
      <h1 className="md:text-[20px] font-semibold  md:text-2xl lg:mb-3 text-white md:text-black md:mb-0 mb-3">
        Enter your verification code!
      </h1>
      <p className="mb-5">
        We’ve sent the verification code to{" "}
        <span className="text-underline text-blue-400 cursor-pointer">
          <Link href={"https://mail.google.com/mail/u/0/#inbox"}>
            {forgotPassEmail}
          </Link>
        </span>
        .
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsVerify(true);
          handleSubmit(e);
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
              } ${currentInputIndex === index ? "border-blue-500" : ""}`}
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
        <p className="underline text-end w-full  my-2 cursor-pointer">
          Send a new code
        </p>
        <button
          disabled={isVerify}
          onClick={handleVerify}
          className={`
                          ${isVerify ? "cursor-not-allowed" : "cursor-pointer"}
                          inline-block w-full  max-w-[565px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
          type="submit"
        >
          Verify
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
