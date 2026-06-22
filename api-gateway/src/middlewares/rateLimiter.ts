import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000, // total limit untuk semua endpoint di belakang gateway
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later" },
  // Counter disimpan di Redis, BUKAN di memory aplikasi.
  // Penting kalau nanti API Gateway di-scale jadi banyak instance —
  // semua instance akan baca-tulis ke Redis yang sama, jadi limitnya
  // tetap akurat across semua instance, bukan hitung sendiri-sendiri.
  store: new RedisStore({
    // @ts-expect-error — ioredis compatible
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});