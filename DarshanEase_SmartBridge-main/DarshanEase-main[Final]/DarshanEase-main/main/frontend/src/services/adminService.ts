import api from "./api";

export const getAllUsers = async () => api.get("/admin/users");
export const getAllBookings = async () => api.get("/admin/bookings");
export const getAllOrganizers = async () => api.get("/admin/organizers");
