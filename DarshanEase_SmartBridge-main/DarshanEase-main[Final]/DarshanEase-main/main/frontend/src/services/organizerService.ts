import api from "./api";

export const addTemple = async (data: {
  templeName: string;
  description: string;
  location: string;
  openTime: string;
  closeTime: string;
  image?: string;
  liveStreamUrl?: string;
}) => api.post("/temples", data);

export const addDarshan = async (data: {
  templeId: string;
  darshanName: string;
  description: string;
  openTime: string;
  closeTime: string;
  normalPrice: number;
  vipPrice: number;
}) => api.post("/darshans", data);

export const getMyTemples = async () => api.get("/temples");

export const updateTemple = async (id: string, data: any) => api.put(`/temples/${id}`, data);
export const deleteDarshan = async (id: string) => api.delete(`/darshans/${id}`);
export const deleteTemple = async (id: string) => api.delete(`/temples/${id}`);
export const getOrganizerBookings = async () => api.get("/bookings/organizer");
