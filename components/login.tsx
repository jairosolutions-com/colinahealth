"use client";

import { onNavigate } from "@/actions/navigation";
import {
  getAccessToken,
  setAccessToken,
} from "@/app/api/login-api/accessToken";
import { validateUser } from "@/app/api/login-api/loginHandler";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const Login = () => {
  const router = useRouter();
  if (getAccessToken()) {
    onNavigate(router, "/dashboard");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const accessToken = await validateUser(email, password, rememberMe);
      if (accessToken) {
        // Redirect to patient-list if login successful
        setAccessToken(accessToken);
        onNavigate(router, "/dashboard");
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
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe); // Toggle rememberMe state
  };

  console.log("email", email);

  return (
    <div>
      <section>
        <div className="grid gap-0 md:h-screen md:grid-cols-2">
          <div className="flex items-center max-h-screen justify-center overflow-hidden">
            <img
              src="/imgs/login-image.png"
              alt="Your Image"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex mt-40 justify-center md:px-5 md:py-10 lg:py-32 ">
            <div className="w-[542.27px] text-left">
              <h2 className="mb-4 text-[20px] font-semibold md:mb-10 md:text-2xl lg:mb-10">
                Sign in to your Account
              </h2>

              <div className="mx-auto mb-4 max-w-[800px] pb-4">
                <form
                  onSubmit={handleLogin}
                  name="wf-form-password"
                  method="get"
                >
                  <div className="relative mb-4 flex">
                    <input
                      id="email"
                      type="email"
                      className={`${
                        isInvalid ? "ring-1 ring-red-400" : ""
                      }  h-9 w-full bg-opacity-10 bg-[#D9D9D9] px-3 py-6 pl-5 text-[15px] text-[#333333]`}
                      placeholder={`${
                        isInvalid ? "Invalid Email!" : "Email Address"
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <div
                      className={`${
                        isInvalid ? "block" : "hidden"
                      } absolute right-3 flex items-center justify-center h-full `}
                    >
                      <img
                        className=""
                        src="/icons/invalidIcon.svg"
                        alt="invalid"
                        width={25}
                      />
                    </div>
                  </div>
                  <div className="relative mb-4 flex">
                    <input
                      id="password"
                      type="password"
                      className={`${
                        isInvalid ? "ring-1 ring-red-400" : ""
                      }  h-9 w-full bg-opacity-10 bg-[#D9D9D9] px-3 py-6 pl-5 text-[15px] text-[#333333]`}
                      placeholder={`${
                        isInvalid ? "Invalid Password!" : "Password"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div
                      className={`${
                        isInvalid ? "block" : "hidden"
                      } absolute right-3 flex items-center justify-center h-full `}
                    >
                      <img
                        className=""
                        src="/icons/invalidIcon.svg"
                        alt="invalid"
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
                        className="float-left -ml-[20px] mt-1"
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
                      className="inline-block w-full cursor-pointer text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out"
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
      </section>
    </div>
  );
};
export default Login;
