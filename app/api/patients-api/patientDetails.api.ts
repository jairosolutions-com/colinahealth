import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function fetchPatientDetails(
  patientId: string,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const patientUuid = patientId.toUpperCase();
  try {
    const accessToken = getAccessToken(); // Retrieve access token from local storage
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    // Set the Authorization header with the JWT token
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to fetch the patient list
    const response = await axios.get(
      `${apiUrl}/patient-information/fullInfo/${patientUuid}`,
      { headers }
    );

    // Handle the response data
    const patientDetails = response;

    console.log("api patientDetails", patientDetails);
    return patientDetails;
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

export async function updatePatient(
  patientId: string,
  formData: any,
  router: any
): Promise<any> {
  try {
    console.log(formData, "formdata");
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the allergy
    const response = await axios.patch(
      `${apiUrl}/patient-information/update/${patientId}`,
      formData,
      { headers }
    );
    const updatedSurgery = response.data;

    return updatedSurgery;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error((error as AxiosError).message);
  }
}
