import axios, { AxiosError } from "axios";
import {
  getRememberToken,
  setAccessToken,
  setRememberToken,
  setUserDetail,
} from "./accessToken";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function checkTokenValidity(): Promise<any> {
  try {
    const rememberToken = getRememberToken();
    const response = await fetch(`${apiUrl}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${rememberToken}`,
      },
    });

    if (response.ok) {
      const data = await response;
      if (data) {
        return true;
      } else {
        console.log(false);
        console.log("mali");
        return false; // Access token not available
      }
    } else {
      console.log("mali2");
      return false; // User is not valid
    }
  } catch (error: any) {
    console.log(error, "error");
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(axiosError.message, "axiosError.message");
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        window.alert("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred.")
        );
      }
      if (axiosError.response?.status === 404) {
        console.log(error);
        return Promise.reject(new Error("Connection Error"));
      }
    }

    return false;
  }
}

export async function validateUser(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<{ accessToken: string; userDetail: any } | any> {
  try {
    const expiresIn = rememberMe ? "30d" : "1d";
    const requestData = {
      username: email.toLocaleLowerCase(),
      password: password,
      tokenExpiresIn: expiresIn,
    };
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.expiryToken;
      const userDetail = data.userDetail;

      if (accessToken) {
        setUserDetail(userDetail);
        if (getRememberToken()) {
          setAccessToken(accessToken);
          return accessToken;
        }

        return accessToken;
      } else {
        console.log(false);
        console.log("mali");
        return false; // Access token not available
      }
    } else {
      console.log("mali2");
      return false; // User is not valid
    }
  } catch (error: any) {
    console.log(error, "error");
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(axiosError.message, "axiosError.message");
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        window.alert("Connection refused or network error occurred.");
        return Promise.reject(
          new Error("Connection refused or network error occurred.")
        );
      }
      if (axiosError.response?.status === 404) {
        console.log(error);
        return Promise.reject(new Error("Connection Error"));
      }
    }

    return false;
  }
}
