import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function searchPatientList(
  term: string,
  currentPage: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC",
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    term: term,
    page: currentPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };
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

    const response = await axios.post(
      `${apiUrl}/patient-information/list`,
      requestData,
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

export async function addPatient(
  patient: any,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const patientData = {
    patient: patient,
  };
  console.log(patientData.patient, "patientData");
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
    const response = await axios.post(
      `${apiUrl}/patient-information/`,
      patientData.patient,
      { headers }
    );
    console.log(response, "response");

    // Handle the response data
    const addPatient = response.data;

    console.log("api patientADD", addPatient);
    return addPatient;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      // Unauthorized access, navigate to login page and clear headers
      setAccessToken("");
      onNavigate(router, "/login");

      return Promise.reject(new Error("Unauthorized access"));
    }
    if ((error as AxiosError).response?.status === 409) {
      return Promise.reject(new Error("Patient already exist"));
    }
    console.error(
      "Error fetching patient list:",
      (error as AxiosError).message
    );
  }
}
