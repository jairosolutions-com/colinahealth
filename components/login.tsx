"use client";

import { onNavigate } from "@/actions/navigation";
import { useRouter } from "next/navigation";

export const Login = () => {
  const router = useRouter();
  return (
    <div>
      <section>
        <div className="grid gap-0 md:h-screen md:grid-cols-2">
          <div className="flex items-center justify-center overflow-hidden">
            <img
              src="/imgs/Bimage.png"
              alt="Your Image"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex mt-40 justify-center md:px-5 md:py-10 lg:py-32 ">
            <div className="w-[542.27px] text-left">
              <h2 className="mb-4 text-1xl font-medium md:mb-10 md:text-2xl lg:mb-10">
                Sign in to your Account
              </h2>

              <div className="mx-auto mb-4 max-w-[800px] pb-4">
                <form name="wf-form-password" method="get">
                  <div className="relative">
                    <input
                      type="email"
                      className="mb-4 h-9 w-full bg-opacity-60 bg-[#D9D9D9] px-3 py-6 pl-5 text-sm text-[#333333]"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="relative mb-4">
                    <input
                      type="password"
                      className="mb-4 h-9 w-full bg-opacity-60 bg-[#D9D9D9] px-3 py-6 pl-5 text-sm text-[#333333]"
                      placeholder="Password"
                    />
                  </div>
                  <label className="mb-3 flex items-center justify-start pb-4 pl-5 font-medium md:mb-3">
                    <input
                      type="checkbox"
                      name="checkbox"
                      className="float-left -ml-[20px] mt-1"
                    />
                    <span className="ml-2 inline-block cursor-pointer text-sm checkbox mt-1">
                      {" "}
                      <a href="#" className="font-normal text-[#0b0b1f]">
                        Remember me
                      </a>
                    </span>
                    <span className="ml-auto inline-block cursor-pointer text-sm checkbox mt-1 ">
                      Forgot Password?
                    </span>
                  </label>
                  <div>
                    <div
                      className="inline-block w-full cursor-pointer items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out"
                      onClick={() => onNavigate(router, "/patient-list")}
                    >
                      Sign In
                    </div>
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
