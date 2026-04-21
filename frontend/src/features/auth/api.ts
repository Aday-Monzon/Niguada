import { apiClient } from "../../lib/api/client";
import { AuthSession, User } from "../../types/domain";

export const authApi = {
  login(payload: { email: string; password: string }) {
    return apiClient.post<AuthSession>("/auth/login", payload);
  },
  me() {
    return apiClient.get<User>("/auth/me");
  }
};
