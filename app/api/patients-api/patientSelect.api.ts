import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function selectPatient(

  router: any // Pass router instance as a parameter
): Promise<any> {

  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setAccessToken("");
      onNavigate(router, "/login");
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/patient-information/select`,
      { headers }
    );

    const patientList = response.data;
    return patientList;
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
      if (axiosError.response?.status === 401) {
        setAccessToken("");
        onNavigate(router, "/login");
        return Promise.reject(new Error("Unauthorized access"));
      }
    }
    console.error("Error searching patient list:", error.message);
    return Promise.reject(error);
  }
}