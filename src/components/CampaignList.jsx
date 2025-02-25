import React, { useEffect, useState } from "react";
import { getCampaigns } from "../api/campaigns";

const CampaignList = ({ token }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchCampaigns();
        }
    }, [token]);

    const fetchCampaigns = async () => {
        try {
            const data = await getCampaigns(token);
            setCampaigns(data);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
            {loading ? (
                <p>Loading campaigns...</p>
            ) : (
                <div>
                    {campaigns.map((campaign) => (
                        <div key={campaign.id}>
                            <h2>{campaign.name}</h2>
                            <p>{campaign.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignList;
