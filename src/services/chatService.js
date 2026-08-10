import api from "../api/axios";

const CHAT_TIMEOUT_MS = 60_000;

export const chatService = {
  sendMessage: async ({ message, conversationId, vehicleId = null }) => {
    const response = await api.post(
      "/api/v1/chat/messages",
      {
        vehicleId,
        message,
        conversationId,
      },
      { timeout: CHAT_TIMEOUT_MS },
    );

    return response.data;
  },
};
