import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function fetchPatientPrescriptions(
  currentPage: number,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    page: currentPage,
  };
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setAccessToken("");
      onNavigate(router, "/login");
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/patient-information/prescriptions`,
      requestData,
      { headers }
    );

    const patientList = response.data;
    return patientList;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching patient list:",
      (error as AxiosError).message
    );
  }
}
