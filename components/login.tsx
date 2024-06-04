"use client";

import {
  getAccessToken,
  getRememberToken,
  setAccessToken,
  setRememberToken,
} from "@/app/api/login-api/accessToken";
import {
  checkTokenValidity,
  validateUser,
} from "@/app/api/login-api/loginHandler";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "./footer";
import React from "react";
import ForgotPass from "./forgot-pass";
import OTPCode from "./otp-code";
import ResetPass from "./reset-pass";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { generateOTPCode } from "@/app/api/forgot-pass-api/otp-code";

export const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAccessed, setIsAccessed] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [forgotPassEmail, setForgotPassEmail] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [twoFa, setTwoFa] = useState<boolean>(false);
  const [isResetPass, setIsResetPass] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsAccessed(false);
    }
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const rememberMeToken = getRememberToken();

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  function handleKeyDown(event: any) {
    if (event.key === "Enter" && password && email) {
      setIsSubmitted(true);
      handleLogin(event);
    }
  }

  useEffect(() => {
    const fetchToken = async () => {
      const result = await checkTokenValidity();
      console.log(result, "check");
      if (!result) {
        setRememberToken("");
      }
    };

    fetchToken();
  }, []);

  // if (getAccessToken()) {
  //   router.push("/dashboard");
  // }

  console.log(rememberMeToken, "rememberme");
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    setTwoFa(true);
    e.preventDefault();
    try {
      const signIn = await validateUser(email, password, rememberMe);

      if (signIn != false) {
        if (rememberMeToken === "") {
          const response = await generateOTPCode(email, "signIn");
          if (response) {
            setIsOTP(true);
          }
        } else if (rememberMeToken !== "") {
          router.push("/dashboard");
        }
      } else {
        // Handle invalid login
        setPassword("");
        setIsInvalid(true);
        // setTimeout(() => {
        //   setIsInvalid(false);
        // }, 5000);
      }

      // const signIn = await validateUser(email, password, rememberMe);

      // if (signIn != false && rememberMeToken===null) {
      //   const response = await generateOTPCode(email, "signIn");
      //   if (response) {
      //     setIsOTP(true);
      //   }
      // } else if (rememberMeToken){
      //   router.push('/dashboard')
    } catch (error) {
      console.error("Error during login:", error);
      // Handle error
    }
    setIsSubmitted(false);
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe); // Toggle rememberMe state
  };

  console.log("email", email);
  console.log(isAccessed, "isAccessed");
  console.log(isForgotPassword, "isForgotPassword");
  //   if (isAccessed) {
  //     return (
  //       <div className="container w-full h-full flex justify-center items-center">
  //         <Image
  //           src="/imgs/colina-logo-animation.gif"
  //           alt="logo"
  //           width={100}
  //           height={100}
  //         />
  //       </div>
  //     );
  //   }
  return (
    <div className="h-full w-full">
      {isLoaded && (
        <div className="w-full h-full flex ">
          <div className="flex bg-[#007C85] w-full lg:w-[44.4%] items-center h-full justify-center md:z-10 -z-[100]">
            <Image
              src="/imgs/login-bg.png"
              alt="login-image"
              className=" w-full h-full object-cover select-none pointer-events-none "
              width={827}
              height={1081}
              priority={true}
            />
            <div className=" hidden md:flex  absolute lg:px-32 md:px-16  flex-col gap-5 w-1/2">
              <Image
                src="/imgs/colina-logo.png"
                alt="logo"
                className=" object-cover select-none pointer-events-none -ml-2 "
                width={297}
                height={37.05}
                priority={true}
              />
              <p className="text-white lg:text-[30px]">
                The art of medicine lies in listening to what the patient’s body
                and spirit are trying to say.
              </p>
            </div>
          </div>
          <div className=" md:w-7/12 w-full h-full px-8 lg:px-0 absolute md:relative flex flex-col justify-center items-center">
            <div className=" w-full h-full flex">
              {/* Sign In */}
              <div
                className={`flex flex-col justify-center items-center lg:w-[1091px] w-full  duration-500 transition h-full 
                ${
                  isForgotPassword || isOTP || isResetPass
                    ? "-translate-x-[1000px] opacity-0 -z-50"
                    : " z-11"
                }`}
              >
                <div className="lg:w-[642.27px] md:w-[450px] w-full text-left">
                  <Image
                    src="/imgs/colina-logo.png"
                    alt="logo"
                    className=" object-cover select-none pointer-events-none -ml-[5px] md:hidden block"
                    width={200}
                    height={37.05}
                    priority={true}
                  />
                  <h2 className=" md:text-[20px] font-medium  md:text-2xl lg:mb-10 text-white md:text-[#020817] md:mb-0 mb-5">
                    Sign in to your Account
                  </h2>
                  <div
                    className={`text-[#db3956] w-full md:mb-8 mb-4 -mt-5 text-md ${
                      isInvalid ? "block" : "hidden"
                    }`}
                  >
                    <p className="">
                      Your email or password was not recognized.
                    </p>
                    <p> Please try again.</p>
                  </div>

                  <div className="mx-auto mb-4 max-w-[800px] pb-4">
                    <form
                      onSubmit={handleLogin}
                      onKeyDown={handleKeyDown}
                      name="wf-form-password"
                      method="get"
                    >
                      <div className="relative mb-4 flex flex-col">
                        <input
                          autoFocus
                          id="email"
                          type="email"
                          className={`${
                            isInvalid ? "ring-1 ring-[#db3956]" : ""
                          }  
                      h-[60px] w-full focus:bg-opacity-10 md:bg-[#D9D9D91A] bg-[#D9D9D94D] px-3 py-6 pl-5 pb-2 md:text-[#020817] text-white`}
                          value={email}
                          onFocus={handleEmailFocus}
                          onBlur={handleEmailBlur}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="email"
                          className={`absolute left-5 text-white transition-all duration-300 cursor-text select-none ${
                            isEmailFocused || email
                              ? "top-2 text-[12px] md:text-[#64748b]"
                              : "top-5 text-[15px]"
                          } ${
                            isInvalid
                              ? "md:text-[#64748b]"
                              : "md:text-[#64748b]"
                          }`}
                        >
                          {isInvalid ? "Email" : "Email"}
                        </label>
                        <p
                          className={`${
                            isInvalid ? "block" : "hidden"
                          } mt-2 text-[#db3956]`}
                        >
                          Enter a valid email
                        </p>
                      </div>

                      <div className="relative mb-4 flex flex-col">
                        <input
                          id="password"
                          type={!showPass ? "password" : "text"}
                          className={`${
                            isInvalid ? "ring-1 ring-[#db3956]" : ""
                          }  
                      h-[60px] w-full bg-opacity-10   md:bg-[#D9D9D91A] bg-[#D9D9D94D] px-3 py-6 pl-5 pb-2 text-md md:text-[#020817] text-white`}
                          value={password}
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="password"
                          className={`absolute left-5 text-white transition-all duration-300 cursor-text select-none ${
                            isPasswordFocused || password
                              ? "top-2 text-[12px] md:text-[#64748b]"
                              : "top-5 text-[15px]"
                          } ${
                            isInvalid
                              ? "md:text-[#64748b]"
                              : "md:text-[#64748b]"
                          }`}
                        >
                          {isInvalid ? "Password" : "Password"}
                        </label>
                        <p
                          className={`${
                            isInvalid ? "block" : "hidden"
                          } mt-2 text-[#db3956]`}
                        >
                          Enter your password
                        </p>
                        <div
                          className={` absolute cursor-pointer right-3 flex items-center justify-center h-full ${
                            isInvalid ? "-top-3" : ""
                          }`}
                          onClick={() => setShowPass(!showPass)}
                        >
                          <Image
                            className={`${password ? "block" : "hidden"}`}
                            src={`${
                              showPass
                                ? "/icons/show-pass.svg"
                                : "/icons/hide-pass.svg"
                            }`}
                            alt="show-pass"
                            width={18}
                            height={18}
                          />
                        </div>
                      </div>

                      <div className="flex text-white md:text-[#020817] justify-between">
                        <label className="flex items-center justify-start mb-7 l-5  md:mb-3">
                          <input
                            type="checkbox"
                            name="checkbox"
                            className="float-left mt-1 accent-[#0E646A]"
                            checked={rememberMe} // Bind checked attribute to rememberMe state
                            onChange={handleCheckboxChange} // Handle checkbox change
                          />
                          <span className="ml-2 inline-block text-[15px] cursor-pointer checkbox mt-1 select-none">
                            {" "}
                            Remember me
                          </span>
                        </label>
                        <label className="flex items-center justify-start mb-7 l-5  md:mb-3">
                          <p
                            className=" text-[15px] ml-auto inline-block cursor-pointer mt-1 "
                            onClick={() =>
                              setIsForgotPassword(!isForgotPassword)
                            }
                          >
                            Forgot Password?
                          </p>
                        </label>
                      </div>
                      <div className="mt-2">
                        <button
                          disabled={isSubmitted}
                          className={`
                          ${
                            isSubmitted
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }
                          inline-block w-full h-[60px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
                          type="submit"
                        >
                          {isSubmitted ? (
                            <div className="flex justify-center items-center w-full">
                              <Loader2 size={20} className="animate-spin" />{" "}
                              &nbsp; Signing in...
                            </div>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-full">
              <Footer />
            </div>
            {/* Forgot Pass */}
            <ForgotPass
              isForgotPassword={isForgotPassword}
              setIsForgotPassword={setIsForgotPassword}
              isInvalid={isInvalid}
              forgotPassEmail={forgotPassEmail}
              setForgotPassEmail={setForgotPassEmail}
              isEmailFocused={isEmailFocused}
              handleEmailBlur={handleEmailBlur}
              handleEmailFocus={handleEmailFocus}
              isOTP={isOTP}
              setIsOTP={setIsOTP}
            />
            {/* OTP */}
            <OTPCode
              isOTP={isOTP}
              setIsOTP={setIsOTP}
              forgotPassEmail={twoFa ? email : forgotPassEmail}
              setIsResetPass={setIsResetPass}
              isResetPass={isResetPass}
              variant={twoFa ? "signIn" : "forgotPass"}
              rememberMe={rememberMe}
            />
            {/* Reset Pass */}
            <ResetPass
              isResetPass={isResetPass}
              setIsResetPass={setIsResetPass}
              forgotPassEmail={forgotPassEmail}
              setForgotPassEmail={setForgotPassEmail}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
