import api from "./api";

export const createDonation = async (data: { templeId: string; amount: number; message?: string }) => {
  return await api.post("/donations", data);
};

export const getUserDonations = async () => {
  return await api.get("/donations/user");
};
