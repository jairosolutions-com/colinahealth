import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPrescriptionByPatient(
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
      `${apiUrl}/prescriptions/list/${patientUuid}`,
      requestData,
      { headers }
    );

    console.log(response.data);
    const createdPrescription = response.data;
    console.log(createdPrescription, "patient prescription after search");
    return createdPrescription;
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

export async function createPrescriptionOfPatient(
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
      `${apiUrl}/prescriptions/${patientId}`,
      formData,
      { headers }
    );
    const createdPrescription = response.data;

    return createdPrescription;
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

export async function addPrescriptionFile(
  prescriptionUuid: string,
  formData: FormData
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post(
      `${apiUrl}/prescriptions/${prescriptionUuid}/uploadfiles`,
      formData,
      { headers }
    );

    const prescriptionFileInserted = response.data;
    console.log(
      "Prescription files uploaded successfully:",
      prescriptionFileInserted
    );

    return prescriptionFileInserted;
  } catch (error: any) {
    console.error("Error uploading prescription files:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
}

export async function deletePrescriptionFile(
  prescriptionUuid: string,
  fileUUID: string
): Promise<any> {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.patch(
      `${apiUrl}/prescriptions/files/delete/${fileUUID}`,
      {},
      { headers }
    );
    console.log(response, "prescriptionFileDeleted");

    return response.data;
  } catch (error) {
    console.error("Error deleting prescription files:", error);
    throw error;
  }
}

export async function updatePrescriptionOfPatient(
  prescriptionUuid: string,
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

    const response = await axios.patch(
      `${apiUrl}/prescriptions/update/${prescriptionUuid}`,
      formData,
      { headers }
    );
    const updatedPrescription = response.data;

    return updatedPrescription;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error((error as AxiosError).message);
  }
}
// FILES
export async function fetchPrescriptionFiles(
  prescriptionUuid: string,
  router: any
): Promise<any> {
  const requestData = {
    prescriptionUuid: prescriptionUuid.toUpperCase(),
  };
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error("Unauthorized Access");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(
      `${apiUrl}/prescriptions/${prescriptionUuid}/files`,
      { headers }
    );

    return response;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      onNavigate(router, "/login");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error fetching prescription files:",
      (error as AxiosError).message
    );
  }
}

export async function getCurrentPrescriptionFileCountFromDatabase(
  prescriptionUuid: string
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
      `${apiUrl}/prescriptions/${prescriptionUuid}/files/count`,
      { headers }
    );

    return response.data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      setAccessToken("");
      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error fetching prescription files count:",
      (error as AxiosError).message
    );
  }
}
