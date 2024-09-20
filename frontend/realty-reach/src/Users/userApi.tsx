import { useAuth0 } from "@auth0/auth0-react";
const API_BASE_URL = "http://localhost:5073/api/user"; // Replace with your actual backend API URL

// Helper function to get Auth0 token
async function getAuthToken(): Promise<string> {
  const { getAccessTokenSilently } = useAuth0();
  return await getAccessTokenSilently();
}

// Get user by userId
export async function getUser(userId: string) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const user = await response.json();
  return user;
}

// Create a new user
export async function createUser() {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const newUser = await response.json();
  return newUser;
}

// Update user information
export async function updateUser(userId: string, updateUserDto: any) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateUserDto),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return true;
}

// Delete a user
export async function deleteUser(userId: string) {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return true;
}
0