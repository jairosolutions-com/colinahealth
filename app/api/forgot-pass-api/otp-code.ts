import axios, { AxiosError } from "axios";
import { setResetPassToken } from "./reset-pass-token";
import { setAccessToken, setRememberToken } from "../login-api/accessToken";
import { redirect } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateOTPCode(
  email: string,
  variant: string
): Promise<any> {
  const requestData = {
    email: email,
    variant: variant,
  };
  try {
    const response = await axios.post(
      `${apiUrl}/users/generate-otp`,
      requestData,
      {}
    );

    console.log(response.data);
    const otpCode = response.data;
    return otpCode;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(error, "wew");
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred.")
        );
      }
      if (axiosError.message == "Request failed with status code 404") {
        return Promise.reject(new Error("User not found."));
      }
    }
    return Promise.reject(error);
  }
}

export async function verifyOTPCode(
  userOTP: string,
  email: string,
  variant: string,
  rememberMe: boolean
): Promise<any> {
  const expiresIn = rememberMe ? "30d" : "1d";
  const requestData = {
    userOTP: userOTP,
    email: email,
    variant: variant,
    expiresIn: expiresIn,
  };
  try {
    const response = await axios.post(
      `${apiUrl}/users/verify-otp`,
      requestData,
      {}
    );
    const otpCode = response.data;
    if (rememberMe) {
      setRememberToken(otpCode.expiryToken);
    }
    if (variant === "signIn") {
      setAccessToken(otpCode.expiryToken);
    }
    setResetPassToken(otpCode.expiryToken);
    console.log(otpCode);
    return otpCode;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred.")
        );
      }
    }
    return Promise.reject(error);
  }
}
