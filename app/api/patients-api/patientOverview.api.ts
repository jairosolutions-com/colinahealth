import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function fetchPatientOverview(
  patientId: string,
  router: any
): Promise<any> {
  try {
    const accessToken = getAccessToken(); // Retrieve access token from local storage
    if (!accessToken) {
      onNavigate(router, "/login");
      setAccessToken("");
      throw new Error("Unauthorized Access");
    }

    // Set the Authorization header with the JWT token
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to fetch the patient list
    const response = await axios.get(
      `${apiUrl}/patient-information/overview/${patientId}`,
      { headers }
    );

    // Handle the response data
    const patientOverview = response.data;
    return patientOverview;
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

export async function searchPatientOverview(
  term: string,
  patientId: number,
  router: any
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/patient-information/overview/${patientId}`,
      { headers }
    );

    const patientOverview = response.data;
    return patientOverview;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      onNavigate(router, "/login");
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching patient overview:",
      (error as AxiosError).message
    );
  }
}
