import API from "./api";

export const getActivityLogs = async () => {
    const response = await API.get("/activity-logs");
    return response.data;
};

export const getActivityLogById = async (id) => {
    const response = await API.get(`/activity-logs/${id}`);
    return response.data;
};