import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Assumed alert record shape (backend didn't publish a schema — adjust
 * field names below if your actual API differs):
 * {
 *   id, rule_id, rule_name, severity, category, status,
 *   user_name, user_email,
 *   description, detection_metadata, source_event,
 *   triggered_at, created_at, resolved_at
 * }
 *
 * Assumed /alerts/stats shape:
 * { total, open, in_progress, resolved, false_positive, critical, high, medium, low }
 */

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getAlerts() {
  return api.get("/alerts").then((res) => res.data);
}

export function getAlertById(id) {
  return api.get(`/alerts/${id}`).then((res) => res.data);
}

export function updateAlertStatus(id, status) {
  return api.patch(`/alerts/${id}/status`, { status }).then((res) => res.data);
}

export function getAlertStats() {
  return api.get("/alerts/stats").then((res) => res.data);
}

export default {
  getAlerts,
  getAlertById,
  updateAlertStatus,
  getAlertStats,
};