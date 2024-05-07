import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFormsByPatient(
  patientUuid: string,
  term: string,
  currentPage: number,
  sortBy: string,
  sortOrder: "ASC" | "DESC",
  isArchived: boolean,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    patientUuid: patientUuid.toUpperCase(),
    term: term,
    page: currentPage,
    sortBy: sortBy,
    sortOrder: sortOrder,
    isArchived
  };
  try {
    console.log("forms", requestData);
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.post(
      `${apiUrl}/forms/list/${patientUuid}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const patientForms = response.data;
    console.log(patientForms, "patient forms after search");
    return patientForms;
  } catch (error: any) {
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
    console.error("Error searching patient forms:", error.message);
    return Promise.reject(error);
  }
}


export async function createFormsOfPatient(patientId: string, formData: any, router: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to create the Notes
    const response = await axios.post(`${apiUrl}/forms/${patientId}`, formData, { headers });
    const createdForms = response.data;

    return createdForms;
  } catch (error: any) {
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
    console.error("Error searching patient forms:", error.message);
    return Promise.reject(error);
  }
}

// fetchform
export async function fetchFormFiles(
  formViewUuid: string,
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
    formViewUuid: formViewUuid.toUpperCase(),
  };
  console.log(formViewUuid);
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
      `${apiUrl}/forms/${formViewUuid}/files`,
      { headers }
    );

    console.log(response.data, 'api fetch form files');
    return response;

  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching form files:",
      (error as AxiosError).message
    );
  }
}
// fetchform

// Add
export async function addFormFile(formsUuid: string, formData: any, router: any): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    // Set headers
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',  // Axios should set this automatically, but specify it just in case
    };

    // Log the FormData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData key: ${key}, value: ${value}`);
    }

    // Make the API request to upload files
    const response = await axios.post(`${apiUrl}/forms/${formsUuid}/uploadfiles`, formData, { headers });

    const formFileInserted = response.data;
    console.log("Form files uploaded successfully:", formFileInserted);

    return formFileInserted;
  } catch (error: any) {
    console.error("Error uploading form files:", error);

    // Log error details for troubleshooting
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error; // Rethrow the error to handle it in the calling function
  }
}
// Add

// Delete
export async function deleteFormFiles(formsUuid: string, fileUUID: string): Promise<any> {
  try {
    // Retrieve the access token from local storage
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    // Define the headers for the request, including the Authorization header
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Define the request data with the array of fileUUIDs
    const response = await axios.patch(`${apiUrl}/forms/files/delete/${fileUUID}`, {}, {
      headers,
    });
    console.log(response, "formFileInserted");

    // Return the response data if the deletion is successful
    return response.data;

  } catch (error) {
    console.error("Error deleting files:", error);
    throw error; // Rethrow the error to handle it in the calling component
  }
}
// Delete

// Fetch
export async function getCurrentFileCountFromDatabase(
  formsUuid: string,
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
      `${apiUrl}/forms/${formsUuid}/files/count`,
      { headers }
    );

    console.log(response.data, 'api fetch COUNT');
    return response.data;

  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error searching form files:",
      (error as AxiosError).message
    );
  }
}
// Fetch

export async function updateFormsOfPatient(
  formsUuid: string,
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
      `${apiUrl}/forms/update/${formsUuid}`,
      formData,
      { headers });
    const updatedSurgery = response.data;

    return updatedSurgery;
  } catch (error: any) {
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
    console.error("Error searching patient forms:", error.message);
    return Promise.reject(error);
  }
}

