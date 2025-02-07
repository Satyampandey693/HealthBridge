import axios from "axios";

const API_URL = "/api";

// Axios instance for default settings
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

//  Register User
export const registerUser = async (userData) => {
  // console.log("hi");
  try {
    const response = await axiosInstance.post("/registerUser", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error registering user";
  }
};

//  Login User
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/loginUser", userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error logging in";
  }
};

//  Logout User
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.get("/logoutUser", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error logging out";
  }
};

//  Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/me", { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching user profile";
  }
};
