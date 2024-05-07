import axios, { AxiosError } from "axios";
import { setResetPassToken } from "./reset-pass-token";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function generateOTPCode(
  email: string,
): Promise<any> {
  const requestData = {
    email: email,
  }
  try {
    const response = await axios.post(
      `${apiUrl}/users/generate-otp`,
      requestData,
      { }
    );

    console.log(response.data);
    const otpCode = response.data;
    return otpCode;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(error,'wew')
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred.")
        );
      }
      if (axiosError.message == "Request failed with status code 404"){
        return Promise.reject(
          new Error("User not found.")
        );
      }
    }
    return Promise.reject(error);
  }
}

export async function verifyOTPCode(
    userOTP: string,
    email: string,
  ): Promise<any> {
    const requestData = {
        userOTP: userOTP,
        email: email,
    }
    try {
      const response = await axios.post(
        `${apiUrl}/users/verify-otp`,
        requestData,
        { }
      );
      const otpCode = response.data;
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