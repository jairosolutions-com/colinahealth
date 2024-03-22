import axios, { AxiosError } from "axios";
import { onNavigate } from "@/actions/navigation";
import { getAccessToken, setAccessToken } from "../login-api/accessToken";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to get the access token from local storage

export async function fetchCountryList(
  router: any // Pass router instance as a parameter
): Promise<any> {
  const requestData = {
  };

  try {
    const accessToken = getAccessToken(); // Retrieve access token from local storage
    if (!accessToken) {
      throw new Error("Access token not found in local storage");
    }

    // Set the Authorization header with the JWT token
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the API request to fetch the patient list
    const response = await axios.get(
      `${apiUrl}/countries`,
      { headers }
    );

    // Handle the response data
    const countryList = response.data;

    console.log("api coutnry list", countryList);
    return countryList;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      // Unauthorized access, navigate to login page and clear headers
      setAccessToken("");
      onNavigate(router, "/login");

      return Promise.reject(new Error("Unauthorized access"));
    }
    console.error(
      "Error fetching patient list:",
      (error as AxiosError).message
    );
  }
}