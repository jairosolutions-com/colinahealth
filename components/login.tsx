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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "./footer";
import React from "react";
import ForgotPass from "./forgot-pass";
import OTPCode from "./otp-code";
import ResetPass from "./reset-pass";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { generateOTPCode } from "@/app/api/forgot-pass-api/otp-code";
import Cookies from "js-cookie";

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

  useEffect(() => {
    if (getAccessToken()) {
      router.push("/dashboard");
    }
  }, [isSubmitted]);

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
          const accessToken = signIn.accessToken;
          Cookies.set("accessToken", accessToken, { expires: 1 ,path: '/' });
          setAccessToken(signIn.accessToken); 
          router.push("/dashboard");
        }
      } else {
        // Handle invalid login
        setPassword("");
        setIsInvalid(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    setIsSubmitted(false);
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe); // Toggle rememberMe state
  };

  return (
    <div className="h-full w-full">
      {isLoaded && (
        <div className="flex h-full w-full">
          <div className="-z-[100] flex h-full w-full items-center justify-center bg-[#007C85] md:z-10 lg:w-[44.4%]">
            <Image
              src="/imgs/login-bg.png"
              alt="login-image"
              className="pointer-events-none h-full w-full select-none object-cover"
              width={827}
              height={1081}
              priority={true}
            />
            <div className="absolute hidden w-1/2 flex-col gap-5 md:flex md:px-16 lg:px-32">
              <Image
                src="/imgs/colina-logo.png"
                alt="logo"
                className="pointer-events-none -ml-2 select-none object-cover"
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
          <div className="absolute flex h-full w-full flex-col items-center justify-center px-8 md:relative md:w-7/12 lg:px-0">
            <div className="flex h-full w-full">
              {/* Sign In */}
              <div
                className={`flex h-full w-full flex-col items-center justify-center transition duration-500 lg:w-[1091px] ${
                  isForgotPassword || isOTP || isResetPass
                    ? "-z-50 -translate-x-[1000px] opacity-0"
                    : "z-11"
                }`}
              >
                <div className="w-full text-left md:w-[450px] lg:w-[642.27px]">
                  <Image
                    src="/imgs/colina-logo.png"
                    alt="logo"
                    className="pointer-events-none -ml-[5px] block select-none object-cover md:hidden"
                    width={200}
                    height={37.05}
                    priority={true}
                  />
                  <h2 className="mb-5 font-medium text-white md:mb-0 md:text-2xl md:text-[20px] md:text-[#020817] lg:mb-10">
                    Sign in to your Account
                  </h2>
                  <div
                    className={`text-md -mt-5 mb-4 w-full text-[#db3956] md:mb-8 ${
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
                          } h-[60px] w-full bg-[#D9D9D94D] px-3 py-6 pb-2 pl-5 text-white focus:bg-opacity-10 md:bg-[#D9D9D91A] md:text-[#020817]`}
                          value={email}
                          onFocus={handleEmailFocus}
                          onBlur={handleEmailBlur}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="email"
                          className={`absolute left-5 cursor-text select-none text-white transition-all duration-300 ${
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
                          } text-md h-[60px] w-full bg-[#D9D9D94D] bg-opacity-10 px-3 py-6 pb-2 pl-5 text-white md:bg-[#D9D9D91A] md:text-[#020817]`}
                          value={password}
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="password"
                          className={`absolute left-5 cursor-text select-none text-white transition-all duration-300 ${
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
                          className={`absolute right-3 flex h-full cursor-pointer items-center justify-center ${
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

                      <div className="flex justify-between text-white md:text-[#020817]">
                        <label className="l-5 mb-7 flex items-center justify-start md:mb-3">
                          <input
                            type="checkbox"
                            name="checkbox"
                            className="float-left mt-1 accent-[#0E646A]"
                            checked={rememberMe} // Bind checked attribute to rememberMe state
                            onChange={handleCheckboxChange} // Handle checkbox change
                          />
                          <span className="checkbox ml-2 mt-1 inline-block cursor-pointer select-none text-[15px]">
                            {" "}
                            Remember me
                          </span>
                        </label>
                        <label className="l-5 mb-7 flex items-center justify-start md:mb-3">
                          <p
                            className="ml-auto mt-1 inline-block cursor-pointer text-[15px]"
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
                          className={` ${
                            isSubmitted
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } inline-block h-[60px] w-full items-center bg-[#007C85] px-6 py-3 text-center text-[15px] font-normal text-white transition duration-300 ease-in-out hover:bg-[#0E646A]`}
                          type="submit"
                        >
                          {isSubmitted ? (
                            <div className="flex w-full items-center justify-center">
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
            <div className="hidden w-full md:block">
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
