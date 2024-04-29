"use client";

import { onNavigate } from "@/actions/navigation";
import {
  getAccessToken,
  setAccessToken,
} from "@/app/api/login-api/accessToken";
import { validateUser } from "@/app/api/login-api/loginHandler";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "./footer";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isAccessed, setIsAccessed] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/dashboard");
      console.log("true");
    } else {
      setIsAccessed(false);
      console.log("false");
    }
  }, []);

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
    if (event.key === 'Enter' && password && email) {
      setIsSubmitted(true);
      handleLogin(event)
    }
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();
    try {
      const accessToken = await validateUser(email, password, rememberMe);
      if (accessToken) {
        // Redirect to patient-list if login successful
        router.replace("/dashboard");
      } else {
        // Handle invalid login
        setPassword("");
        setIsInvalid(true);
        setTimeout(() => {
          setIsInvalid(false);
        }, 2000);
      }
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

  if (isAccessed) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img src="/imgs/colina-logo-animation.gif" alt="logo" width={100} />
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <section className="w-full h-full">
        <div className="w-full  md:h-screen flex">
          <div className="flex w-full items-center max-h-screen justify-center overflow-hidden">
            <img
              src="/imgs/login-image.png"
              alt="Your Image"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          </div>

          <div className="w-[1091px] h-full flex flex-col">
            <div className=" w-full h-full ">
              <div className="flex flex-col justify-center items-center w-[1091px]  h-full ">
                <div className="w-[542.27px] text-left">
                  <h2 className=" text-[20px] font-semibold  md:text-2xl lg:mb-10">
                    Sign in to your Account
                  </h2>
                  <div
                    className={`text-red-500 w-full md:mb-8 mb-4 -mt-5 text-md ${
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
                            isInvalid ? "ring-1 ring-red-400" : ""
                          }  
                      h-[60px] w-full bg-opacity-10 bg-[#FFFFFF] px-3 py-6 pl-5 pb-2 text-md text-[#333333]`}
                          value={email}
                          onFocus={handleEmailFocus}
                          onBlur={handleEmailBlur}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="email"
                          className={`absolute left-5 transition-all duration-300 cursor-text select-none ${
                            isEmailFocused || email
                              ? "top-2 text-[12px] text-[#333333]"
                              : "top-5 text-[15px]"
                          } ${isInvalid ? "text-[#928989]" : "text-[#928989]"}`}
                        >
                          {isInvalid ? "Email" : "Email"}
                        </label>
                        <p
                          className={`${
                            isInvalid ? "block" : "hidden"
                          } mt-2 text-red-500`}
                        >
                          Enter a valid email
                        </p>
                      </div>

                      <div className="relative mb-4 flex flex-col">
                        <input
                          id="password"
                          type={!showPass ? "password" : "text"}
                          className={`${
                            isInvalid ? "ring-1 ring-red-400" : ""
                          }  
                      h-[60px] w-full bg-opacity-10 bg-[#FFFFFF] px-3 py-6 pl-5 pb-2 text-md text-[#333333]`}
                          value={password}
                          onFocus={handlePasswordFocus}
                          onBlur={handlePasswordBlur}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label
                          htmlFor="password"
                          className={`absolute left-5 transition-all duration-300 cursor-text select-none ${
                            isPasswordFocused || password
                              ? "top-2 text-[12px] text-[#333333]"
                              : "top-5 text-[15px]"
                          } ${isInvalid ? "text-[#928989]" : "text-[#928989]"}`}
                        >
                          {isInvalid ? "Password" : "Password"}
                        </label>
                        <p
                          className={`${
                            isInvalid ? "block" : "hidden"
                          } mt-2 text-red-500`}
                        >
                          Enter your password
                        </p>
                        <div
                          className={` absolute cursor-pointer right-3 flex items-center justify-center h-full ${
                            isInvalid ? "-top-3" : ""
                          }`}
                          onClick={() => setShowPass(!showPass)}
                        >
                          <img
                            className={`${password ? "block" : "hidden"}`}
                            src={`${
                              showPass
                                ? "/icons/show-pass.svg"
                                : "/icons/hide-pass.svg"
                            }`}
                            alt="show-pass"
                            width={25}
                          />
                        </div>
                      </div>

                      {/* COMMENT MUNA KAY DILI PA WORKING */}

                      <div className="flex">
                        <label className="mb-3 flex items-center justify-start pb-4 pl-5 font-medium md:mb-3">
                          <input
                            type="checkbox"
                            name="checkbox"
                            className="float-left -ml-[20px] mt-1 accent-[#0E646A]"
                            checked={rememberMe} // Bind checked attribute to rememberMe state
                            onChange={handleCheckboxChange} // Handle checkbox change
                          />
                          <span className="ml-2 inline-block font-medium text-[15px] cursor-pointer checkbox mt-1 select-none">
                            {" "}
                            Remember me
                          </span>
                        </label>
                        <p className="font-medium text-[15px] ml-auto inline-block cursor-pointer mt-1 ">
                          Forgot Password?
                        </p>
                      </div>
                      <div>
                        <button
                          disabled={isSubmitted}
                          className={`
                          ${
                            isSubmitted
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }
                          inline-block w-full  text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
                          type="submit"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </section>
    </div>
  );
};
export default Login;
