import api from "./api";

export const getTemples = async () => {
  return api.get("/temples");
};

export const getTempleById = async (id: string) => {
  return api.get(`/temples/${id}`);
};
