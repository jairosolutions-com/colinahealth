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
      throw new Error("Access token not found in local storage");
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
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      // Unauthorized access, navigate to login page and clear headers
      onNavigate(router, "/login");
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error fetching patient overview:",
      (error as AxiosError).message
    );
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
      throw new Error("Access token not found in local storage");
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
