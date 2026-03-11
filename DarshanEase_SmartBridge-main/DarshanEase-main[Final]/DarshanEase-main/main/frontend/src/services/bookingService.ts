import api from "./api";

export const createBooking = async (data: {
  templeId: string;
  darshanId: string;
  bookingDate: string;
  darshanTime: string;
  tickets: number;
  ticketType: "NORMAL" | "VIP";
}) => api.post("/bookings", data);

export const getUserBookings = async () => api.get("/bookings/user");

export const cancelBooking = async (bookingId: string) => api.put(`/bookings/${bookingId}/cancel`);
