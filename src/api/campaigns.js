import axios from "axios";

const API_URL = "http://localhost:8080/api/campaigns";

export const getCampaigns = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("JWT Token not found! Please login first.");
        throw new Error("JWT Token not found! Please login first.");
    }

    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
    }
};

