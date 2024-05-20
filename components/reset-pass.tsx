"use client";
import { resetPassword } from "@/app/api/forgot-pass-api/reset-pass";
import React, { useState } from "react";
import { toast as sonner } from "sonner";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { setResetPassToken } from "@/app/api/forgot-pass-api/reset-pass-token";
import { Loader2 } from "lucide-react";
interface ResetPassProps {
  isResetPass: boolean;
  setIsResetPass: (value: boolean) => void;
  forgotPassEmail: string;
  setForgotPassEmail: any;
}

const ResetPass = ({
  isResetPass,
  setIsResetPass,
  forgotPassEmail,
  setForgotPassEmail,
}: ResetPassProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordFocused, setIsNewPasswordFocused] =
    useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleNewPasswordFocus = () => {
    setIsNewPasswordFocused(true);
  };

  const handleNewPasswordBlur = () => {
    setIsNewPasswordFocused(false);
  };

  const handleConfirmPasswordFocus = () => {
    setIsConfirmPasswordFocused(true);
  };

  const handleConfirmPasswordBlur = () => {
    setIsConfirmPasswordFocused(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitted(true);
    try {
      if (newPassword !== confirmPassword) {
        setIsInvalid(true);
      } else {
        if (newPassword !== "" && confirmPassword !== "") {
          const response = await resetPassword(forgotPassEmail, newPassword);

          if (response) {
            console.log("Password Changed.");
            sonner.success("Password Successfully Changed.");
            setIsResetPass(false);
            setResetPassToken("");
            setForgotPassEmail("");
            setNewPassword("");
            setConfirmPassword("");
            setShowConfirmPass(false);
            setShowNewPass(false);
          }
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Password change failed. Please try again.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              window.location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    }
    setTimeout(() => {
      setIsInvalid(false);
    }, 3000);

    setIsSubmitted(false);
  };

  return (
    <div
      className={`flex flex-col fixed justify-center items-center px-[30px] lg:w-[1091px] w-full  duration-500 transition h-full 
              ${
                isResetPass
                  ? " opacity-100 z-50"
                  : "translate-x-[1000px] opacity-0 -z-50"
              }`}
    >
      <h1 className="md:text-[20px] font-semibold  md:text-2xl lg:mb-3 text-white md:text-black md:mb-0 mb-3">
        Reset your Password?
      </h1>
      <p className="mb-5 text-white md:text-black">
        Enter your new password below, were just being extra safe.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col justify-center items-center "
      >
        <div className="relative mb-4 flex flex-col max-w-[642.27px] w-full">
          <input
            id="password"
            type={!showNewPass ? "password" : "text"}
            className={`${isInvalid ? "ring-1 ring-red-400" : ""}  
                      h-[60px] w-full bg-opacity-10   md:bg-[#D9D9D91A] bg-[#D9D9D94D] px-3 py-6 pl-5 pb-2 text-md md:text-[#333333] text-white`}
            value={newPassword}
            onFocus={handleNewPasswordFocus}
            onBlur={handleNewPasswordBlur}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label
            htmlFor="password"
            className={`absolute left-5 text-white transition-all duration-300 cursor-text select-none ${
              isNewPasswordFocused || newPassword
                ? "top-2 text-[12px] md:text-[#333333]"
                : "top-5 text-[15px]"
            } ${isInvalid ? "md:text-[#928989]" : "md:text-[#928989]"}`}
          >
            {isInvalid ? "New Password" : "New Password"}
          </label>
          <p className={`${isInvalid ? "block" : "hidden"} mt-2 text-red-500`}>
            Enter your password
          </p>
          <div
            className={` absolute cursor-pointer right-3 flex items-center justify-center h-full ${
              isInvalid ? "-top-3" : ""
            }`}
            onClick={() => setShowNewPass(!showNewPass)}
          >
            <img
              className={`${newPassword ? "block" : "hidden"}`}
              src={`${
                showNewPass ? "/icons/show-pass.svg" : "/icons/hide-pass.svg"
              }`}
              alt="show-pass"
              width={25}
            />
          </div>
        </div>

        <div className="relative mb-4 flex flex-col max-w-[642.27px] w-full">
          <input
            id="password"
            type={!showConfirmPass ? "password" : "text"}
            className={`${isInvalid ? "ring-1 ring-red-400" : ""}  
                      h-[60px] w-full bg-opacity-10   md:bg-[#D9D9D91A] bg-[#D9D9D94D] px-3 py-6 pl-5 pb-2 text-md md:text-[#333333] text-white`}
            value={confirmPassword}
            onFocus={handleConfirmPasswordFocus}
            onBlur={handleConfirmPasswordBlur}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label
            htmlFor="password"
            className={`absolute left-5 text-white transition-all duration-300 cursor-text select-none ${
              isConfirmPasswordFocused || confirmPassword
                ? "top-2 text-[12px] md:text-[#333333]"
                : "top-5 text-[15px]"
            } ${isInvalid ? "md:text-[#928989]" : "md:text-[#928989]"}`}
          >
            {isInvalid ? "Confirm Password" : "Confirm Password"}
          </label>
          <p className={`${isInvalid ? "block" : "hidden"} mt-2 text-red-500`}>
            Enter your password
          </p>
          <div
            className={` absolute cursor-pointer right-3 flex items-center justify-center h-full ${
              isInvalid ? "-top-3" : ""
            }`}
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            <img
              className={`${confirmPassword ? "block" : "hidden"}`}
              src={`${
                showConfirmPass
                  ? "/icons/show-pass.svg"
                  : "/icons/hide-pass.svg"
              }`}
              alt="show-pass"
              width={25}
            />
          </div>
        </div>
        {isInvalid && <p className="text-red-500 pb-2 text-start max-w-[642.27px] w-full">Password does not match.</p>}
        <button
          disabled={isSubmitted}
          className={`
                          ${
                            isSubmitted
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }
                          inline-block w-full  max-w-[642.27px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
          type="submit"
        >
          {isSubmitted ? (
            <div className="flex justify-center items-center w-full">
              <Loader2 size={20} className="animate-spin" /> &nbsp; Resetting...
            </div>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
      <p
        className="cursor-pointer bottom-28 absolute text-white md:text-black"
        onClick={() => {
          setIsResetPass(!isResetPass);
        }}
      >
        Back to login
      </p>
    </div>
  );
};

export default ResetPass;
