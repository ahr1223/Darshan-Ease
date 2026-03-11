import api from "./api";

export const getDarshansByTemple = async (templeId: string) => {
  return api.get(`/darshans/${templeId}`);
};
