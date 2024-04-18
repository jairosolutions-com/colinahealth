import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchLabResultsByPatient(
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
      `${apiUrl}/lab-results/list/${patientUuid}`,
      requestData,
      { headers }
    );
    console.log(response.data);
    const { patientId, id, ...patientLabResult } = response.data;
    console.log(patientLabResult, "patient patientLabResult after search");
    return patientLabResult;
  } catch (error:any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.message === "Network Error") {
        // Handle network error
        console.error("Connection refused or network error occurred.");
        return Promise.reject(new Error("Connection refused or network error occurred."));
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



export async function createLabResultOfPatient(patientId: string, formData: any, router: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the allergy
    const response = await axios.post(`${apiUrl}/lab-results/${patientId}`, formData, { headers });
    const createdLabResult = response.data;

    return createdLabResult;
  } catch (error) {
    console.error("Error creating LabResult:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}

export async function addLabFile(  labResultUuid: string,
  formData:any, router: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the allergy
    const response = await axios.post(`${apiUrl}/lab-results/${labResultUuid}/upload`, formData, { headers });
    
    const labFileInserted = response.data;
    console.log(labFileInserted, "labFileInserted");

    return labFileInserted;
    
  } catch (error) {
    console.error("Error creating LabResult:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}


export async function updateLabResultOfPatient(
  labResultUuid: string,
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

    // Make the API request to create the allergy
    const response = await axios.patch(
      `${apiUrl}/lab-results/update/${labResultUuid}`,
      formData,
      { headers });
    const updatedLabResult = response.data;

    return updatedLabResult ;
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

export async function fetchLabResultFiles(
  labResultUuid: string,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    labResultUuid: labResultUuid.toUpperCase(),
  };
  console.log(labResultUuid);
  try {
    console.log("searchPatient", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/lab-results/${labResultUuid}/files`,
      { headers }
    );

    console.log(response.data, 'api fetch lab result files');
    return response;

  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching lab result files:",
      (error as AxiosError).message
    );
  }
}

