import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function fetchScheduledMedByPatient(
  patientUuid: string,
  term: string,
  currentPage: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC",
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    patientUuid: patientUuid.toUpperCase(),
    term: term,
    page: currentPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };
  try {
    console.log("searchPatient", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/medication-logs/${patientUuid}/asch`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const { patientId, id, ...patientScheduledMedNoId } = response.data;
    console.log(patientScheduledMedNoId, "patient ScheduledMed after search");
    return patientScheduledMedNoId;
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

export async function createScheduledMedOfPatient(
  patientId: string,
  formData: any,
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

    // Make the API request to create the SchedMed
    const response = await axios.post(
      `${apiUrl}/medication-logs/${patientId}`,
      formData,
      { headers }
    );
    const createdSchedMed = response.data;

    return createdSchedMed;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    } else {
      console.error((error as AxiosError).message);
      throw error;
    }
  }
}

export async function updateScheduledMedOfPatient(
  SchedMedUuid: string,
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

    // Make the API request to create the SchedMed
    const response = await axios.patch(
      `${apiUrl}/medication-logs/update/${SchedMedUuid}`,
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

// for dropdown med list

export async function fetchPrescriptionsOfPatient(
  patientUuid: string,

  router: any // Pass router instance as a parameter
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/prescriptions/sched-meds-name/${patientUuid}`,
      {},
      { headers }
    );

    console.log(response.data, "response.data");
    const prescriptionList = response.data;
    console.log(prescriptionList, "patient prescriptionList after search");
    return prescriptionList;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching patient ScheduledMed:",
      (error as AxiosError).message
    );
  }
}
