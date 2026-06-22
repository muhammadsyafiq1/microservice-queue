import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export class UserServiceClient {
  /**
   * Cek apakah user_id valid dengan HTTP call ke User Service.
   * Kalau user ada, return data user-nya.
   * Kalau tidak ada atau User Service down, return null.
   */
  async getUserById(userId: number): Promise<UserResponse | null> {
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`, {
        timeout: 5000,
      });

      if (response.data.success) {
        return response.data.data as UserResponse;
      }
      return null;
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn(`[Notepad Service] User ${userId} not found`);
        return null;
      }
      console.error(`[Notepad Service] Failed to reach User Service:`, err.message);
      throw new Error("User Service is unavailable");
    }
  }
}

export const userServiceClient = new UserServiceClient();