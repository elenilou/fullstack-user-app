import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

//Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get("");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Function to get a user by ID
export const getUserById = async (id) => {
    try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Failed to create user");
    }
    throw error;
  }
};

// Function to update a user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};