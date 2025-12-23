import { apiRequest } from "./http";
import type { UsersDefaultResponse } from "./types";

export type LoginBody = { email: string; password: string };
export type SignupBody = { email: string; username: string; password: string; repeat_password: string };

export const api = {
  async login(body: LoginBody): Promise<UsersDefaultResponse> {
    return apiRequest<UsersDefaultResponse>("/api/v1/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async signup(body: SignupBody): Promise<UsersDefaultResponse> {
    return apiRequest<UsersDefaultResponse>("/api/v1/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async me(): Promise<UsersDefaultResponse> {
    // GET /api/v1/ — возвращает username+city (без user_id)
    return apiRequest<UsersDefaultResponse>("/api/v1/", { method: "GET" });
  },

  async logout(): Promise<void> {
    await apiRequest<void>("/api/v1/logout", { method: "POST" });
  },
};
