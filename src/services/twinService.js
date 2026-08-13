import api from "../api/axios";

export async function issueTwinAccessToken(vehicleId) {
  const response = await api.post(
    `/api/twin-frames/cars/${encodeURIComponent(vehicleId)}/access-token`,
  );
  return response.data;
}
