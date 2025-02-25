import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (credentials) => {
    try {
        console.log("Login request payload:", credentials); // Debugging için ekledik
        const response = await axios.post(`${API_URL}/login`, JSON.stringify(credentials), {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        console.log("Login response:", response.data); // Dönen token'ı görmek için ekledik

        localStorage.setItem("token", response.data.token); // Token'ı kaydet
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};
