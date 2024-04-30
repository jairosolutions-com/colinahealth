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
      throw new Error("Unauthorized Access");
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
    const { patientId, id, ...patientPrescriptionsNoId } = response.data;
    console.log(patientPrescriptionsNoId, "patient prescription after search");
    return patientPrescriptionsNoId;
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

export async function createLabResultOfPatient(
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

    // Make the API request to create the allergy
    const response = await axios.post(
      `${apiUrl}/lab-results/${patientId}`,
      formData,
      { headers }
    );
    const createdLabResult = response.data;

    return createdLabResult;
  } catch (error) {
    console.error("Error creating LabResult:", error);
    throw error; // Rethrow the error to handle it in the component
  }
}

export async function addLabFile(
  labResultUuid: string,
  formData: any,
  router: any
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    // Set headers
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data", // Axios should set this automatically, but specify it just in case
    };

    // Log the FormData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData key: ${key}, value: ${value}`);
    }

    // Make the API request to upload files
    const response = await axios.post(
      `${apiUrl}/lab-results/${labResultUuid}/uploadfiles`,
      formData,
      { headers }
    );

    const labFileInserted = response.data;
    console.log("Lab files uploaded successfully:", labFileInserted);

    return labFileInserted;
  } catch (error: any) {
    console.error("Error uploading lab files:", error);

    // Log error details for troubleshooting
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error; // Rethrow the error to handle it in the calling function
  }
}
// Function to delete files associated with a lab result
export async function deleteLabFiles(
  labResultUuid: string,
  fileUUID: string
): Promise<any> {
  try {
    // Retrieve the access token from local storage
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    // Define the headers for the request, including the Authorization header
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Define the request data with the array of fileUUIDs
    const response = await axios.patch(
      `${apiUrl}/lab-results/files/delete/${fileUUID}`,
      {},
      {
        headers,
      }
    );
    console.log(response, "labFileInserted");

    // Return the response data if the deletion is successful
    return response.data;
  } catch (error) {
    console.error("Error deleting files:", error);
    throw error; // Rethrow the error to handle it in the calling component
  }
}

export async function updateLabResultOfPatient(
  labResultUuid: string,
  formData: any,
  router: any
): Promise<any> {
  try {
    console.log(formData, "Form Data");
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the allergy
    const response = await axios.patch(
      `${apiUrl}/lab-results/update/${labResultUuid}`,
      formData,
      { headers }
    );
    const updatedLabResult = response.data;

    return updatedLabResult;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error((error as AxiosError).message);
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
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/lab-results/${labResultUuid}/files`,
      { headers }
    );

    console.log(response.data, "api fetch lab result files");
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

export async function getCurrentFileCountFromDatabase(
  labResultUuid: string
): Promise<any> {
  console.log(labResultUuid);
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/lab-results/${labResultUuid}/files/count`,
      { headers }
    );

    console.log(response.data, "api fetch COUNT");
    return response.data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching lab result files:",
      (error as AxiosError).message
    );
  }
}
