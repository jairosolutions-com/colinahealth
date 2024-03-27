import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchNotesByPatient(
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
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/notes/list/${patientUuid}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const patientNotes = response.data;
    console.log(patientNotes, "patient notes after search");
    return patientNotes;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching patient notes:",
      (error as AxiosError).message
    );
  }
}


export async function createNotesOfPatient(patientId: string, formData: any, router: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the Notes
    const response = await axios.post(`${apiUrl}/notes/${patientId}`, formData, { headers });
    const createdNotes = response.data;

    return createdNotes;
  } catch (error) {
    console.error("Error creating Notes:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}


export async function updateNotesOfPatient(
  prescriptionUuid: string, 
  formData: any, 
  router: any): 
  Promise<any> {
  try {
    console.log(formData, "formdata")
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the Notes
    const response = await axios.patch(
      `${apiUrl}/notes/update/${prescriptionUuid}`, 
    formData, 
    { headers });
    const updatedSurgery= response.data;

    return updatedSurgery;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      (error as AxiosError).message
    );
  }
}

