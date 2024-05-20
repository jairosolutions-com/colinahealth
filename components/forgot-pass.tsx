import { generateOTPCode } from "@/app/api/forgot-pass-api/otp-code";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
interface ForgotPassProps {
  isForgotPassword: boolean;
  setIsForgotPassword: (value: boolean) => void;
  isInvalid: boolean;
  forgotPassEmail: string;
  setForgotPassEmail: (value: string) => void;
  isEmailFocused: boolean;
  handleEmailFocus: () => void;
  handleEmailBlur: () => void;
  isOTP: boolean;
  setIsOTP: (value: boolean) => void;
}
const ForgotPass = ({
  isForgotPassword,
  setIsForgotPassword,
  isInvalid,
  forgotPassEmail,
  setForgotPassEmail,
  isEmailFocused,
  handleEmailFocus,
  handleEmailBlur,
  isOTP,
  setIsOTP,
}: ForgotPassProps) => {
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSent(true);

    try {
      if (forgotPassEmail !== "") {
        const response = await generateOTPCode(forgotPassEmail,'forgotPass');

        if (response) {
          setIsError(false);
          setIsSent(false);
          setIsOTP(!isOTP);
          setIsForgotPassword(!isForgotPassword);
          console.log("Email Sent Successfully.");
          // onSuccess();
          // setToastMessage("Email Sent Successfully.");
          // setShowToast(true);
        }
      }
    } catch (error:any) {
        if(error.message === 'User not found.'){
          setIsError(true);
        }
    }
    setIsSent(false);
  };

  return (
    <div
      className={`flex flex-col fixed justify-center items-center  md:w-[825.24px] lg:w-[1091px] sm:w-full px-10 md:px-0  duration-500 transition h-full 
                ${
                  isForgotPassword
                    ? " opacity-100 z-50"
                    : isOTP
                    ? "-translate-x-[1000px] opacity-0 -z-10"
                    : "translate-x-[1000px] opacity-0 -z-10"
                }`}
    >
      <h1 className="md:text-[20px] font-semibold  md:text-2xl lg:mb-3 text-white md:text-black md:mb-0 mb-3">
        Forgot Password?
      </h1>
      <p className="text-white md:text-black mb-5">
        Enter your email below to receive your password reset instructions.
      </p>
      <div className="relative mb-4 flex flex-col md:max-w-[642.27px] w-full">
        <form
          action=""
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="w-full h-full">
            <input
              id="email"
              type="email"
              className={`${isError ? "ring-1 ring-red-400" : ""}  
                      h-[60px] w-full focus:bg-opacity-10 md:bg-[#D9D9D91A] bg-[#D9D9D94D] px-3 py-6 pl-5 pb-2 text-md md:text-[#333333] text-white`}
              value={forgotPassEmail}
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
              onChange={(e) => setForgotPassEmail(e.target.value)}
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-5 text-white transition-all duration-300 cursor-text select-none ${
                isEmailFocused || forgotPassEmail
                  ? "top-2 text-[12px] md:text-[#333333]"
                  : "top-5 text-[15px]"
              } ${isError ? "md:text-[#928989]" : "md:text-[#928989]"}`}
            >
              {isError ? "Email" : "Email"}
            </label>
            <p
              className={`${isError ? "block" : "hidden"} mt-2 text-red-500`}
            >
              User email not found. Please try again.
            </p>
          </div>

          <button
            disabled={isSent}
            className={`
                          ${isSent ? "cursor-not-allowed" : "cursor-pointer"}
                          inline-block w-full  max-w-[642.27px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
            type="submit"
          >
            {isSent ? (
              <div className="flex justify-center items-center w-full">
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </div>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
      <p
        className="cursor-pointer bottom-28 absolute text-white md:text-black"
        onClick={() => setIsForgotPassword(!isForgotPassword)}
      >
        Back to login
      </p>
    </div>
  );
};

export default ForgotPass;
