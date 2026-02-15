import axios from "axios";

const API_URL = "http://localhost:8080/api";

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
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Function to get a user by ID
export const getUserById = async (id) => {
    try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/register-user", userData);
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
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Address Management Functions

// Function to add address to user
export const addAddress = async (userId, addressData) => {
  try {
    const response = await api.post(`/users/${userId}/addresses`, addressData);
    return response.data;
  } catch (error) {
    console.error(`Error adding address to user ${userId}:`, error);
    throw error;
  }
};

// Function to update address
export const updateAddress = async (userId, addressId, addressData) => {
  try {
    const response = await api.put(`/users/${userId}/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error(`Error updating address ${addressId}:`, error);
    throw error;
  }
};

// Function to delete address
export const deleteAddress = async (userId, addressId) => {
  try {
    const response = await api.delete(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    throw error;
  }
};