import API from "./api";

export const getAlerts = async () => {
    const response = await API.get("/alerts");
    return response.data;
};

export const getAlertById = async (id) => {
    const response = await API.get(`/alerts/${id}`);
    return response.data;
};

export const updateAlertStatus = async (id, status) => {
    const response = await API.patch(
        `/alerts/${id}/status`,
        { status }
    );

    return response.data;
};