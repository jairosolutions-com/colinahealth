import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPatientProfileImage(patientUuid: string, router: any) {
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

        const response = await axios.get(
            `${apiUrl}/patient-information/${patientUuid}/profile-image`,
            { headers }
        );

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.message === 'Network Error') {
                console.error('Connection refused or network error occurred.');
                throw new Error('Connection refused or network error occurred.');
            }
            if (axiosError.response?.status === 401) {
                throw new Error('Unauthorized access');
            }
        }
        console.error('Error fetching patient profile image:', error.message);
        return null; // Return null or undefined for other errors
    }
}
export async function fetchProfileImages(patientUuids: string[]) {
    try {
        const accessToken = getAccessToken();
        if (!accessToken) {
            setAccessToken('');
            throw new Error('Unauthorized Access');
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.post(`${apiUrl}/patient-information/profile-images`, {
            patientUuids,
        }, { headers });

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.message === 'Network Error') {
                console.error('Connection refused or network error occurred.');
                throw new Error('Connection refused or network error occurred.');
            }
            if (axiosError.response?.status === 401) {
                throw new Error('Unauthorized access');
            }
        }
        console.error('Error fetching patient profile images:', error.message);
        return null; // Return null or undefined for other errors
    }
}
export async function addPatientProfileImage(patientUuid: string,
    formData: any,) {
    try {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("Unauthorized Access");
        }
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
        };
        for (let [key, value] of formData.entries()) {
            console.log(`FormData key: ${key}, value: ${value}`);
        }
        await axios.post(`${apiUrl}/patient-information/${patientUuid}/upload-profile-image`, formData, {
            headers,
        });
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.message === 'Network Error') {
                console.error('Connection refused or network error occurred.');
                throw new Error('Connection refused or network error occurred.');
            }
            if (axiosError.response?.status === 401) {
                throw new Error('Unauthorized access');
            }
        }
        console.error('Error adding patient profile image:', error.message);
        throw new Error('Error adding patient profile image');
    }
}

export async function updatePatientProfileImage(patientUuid: string, formData: any) {
    try {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("Unauthorized Access");
        }
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
        };
        for (let [key, value] of formData.entries()) {
            console.log(`FormData key: ${key}, value: ${value}`);
        }

        await axios.patch(`${apiUrl}/patient-information/${patientUuid}/update-profile-image`, formData, {
            headers,
        });
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.message === 'Network Error') {
                console.error('Connection refused or network error occurred.');
                throw new Error('Connection refused or network error occurred.');
            }
            if (axiosError.response?.status === 401) {
                throw new Error('Unauthorized access');
            }
        }
        console.error('Error updating patient profile image:', error.message);
        throw new Error('Error updating patient profile image');
    }
}
