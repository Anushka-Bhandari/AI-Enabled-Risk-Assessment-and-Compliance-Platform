import API from "./authService";

export const getDashboard = () => {
    return API.get("/dashboard");
};

export const getAnalytics = () => {
    return API.get("/dashboard/analytics");
};