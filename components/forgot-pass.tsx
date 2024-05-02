import React from "react";
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
  return (
    <div
      className={`flex flex-col fixed justify-center items-center lg:w-[1091px] w-full  duration-500 transition h-full z-50
                ${
                  isForgotPassword
                    ? " opacity-100 z-50"
                    : isOTP
                    ? "-translate-x-[1000px] opacity-0 -z-10"
                    : "translate-x-[1000px] opacity-0 "
                }`}
    >
      <h1 className="md:text-[20px] font-semibold  md:text-2xl lg:mb-3 text-white md:text-black md:mb-0 mb-3">
        Forgot Password?
      </h1>
      <p className="mb-5">
        Enter your email below to receive your password reset instructions.
      </p>
      <div className="relative mb-4 flex flex-col max-w-[642.27px] w-full">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            setIsOTP(!isOTP);
            setIsForgotPassword(!isForgotPassword);
          }}
        >
          <div className="w-full h-full">
            <input
              autoFocus
              id="email"
              type="email"
              className={`${isInvalid ? "ring-1 ring-red-400" : ""}  
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
              } ${isInvalid ? "md:text-[#928989]" : "md:text-[#928989]"}`}
            >
              {isInvalid ? "Email" : "Email"}
            </label>
            <p
              className={`${isInvalid ? "block" : "hidden"} mt-2 text-red-500`}
            >
              Enter a valid email
            </p>
          </div>

          <button
            disabled={isOTP}
            className={`
                          ${isOTP ? "cursor-not-allowed" : "cursor-pointer"}
                          inline-block w-full  max-w-[642.27px] text-[15px] items-center bg-[#007C85] px-6 py-3 text-center font-normal text-white hover:bg-[#0E646A] transition duration-300 ease-in-out`}
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
      <p
        className="cursor-pointer bottom-28 absolute"
        onClick={() => setIsForgotPassword(!isForgotPassword)}
      >
        Back to login
      </p>
    </div>
  );
};

export default ForgotPass;
