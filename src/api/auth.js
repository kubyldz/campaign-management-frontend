import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (credentials) => {
    try {
        console.log("Login request payload:", credentials);
        const response = await axios.post(`${API_URL}/login`, JSON.stringify(credentials), {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        console.log("Login response:", response.data);

        localStorage.setItem("token", response.data.token);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};
