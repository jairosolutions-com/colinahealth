import axios, { AxiosError } from "axios";
import { getResetPassToken } from "./reset-pass-token";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function resetPassword(
  email: string,
  resetPassword: string
): Promise<any> {
  const requestData = {
    password: resetPassword,
  };
  try {
    const accessToken = getResetPassToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.patch(
      `${apiUrl}/users/reset-pass/${email}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const resetPass = response.data;
    return resetPass;
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
