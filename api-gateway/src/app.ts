import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { globalLimiter } from "./middlewares/rateLimiter";
import { metricsMiddleware } from "./middlewares/metricsMiddleware";
import { register } from "./metrics";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(metricsMiddleware);   
app.use(globalLimiter);

// Endpoint khusus untuk Prometheus "menanyakan" metrics dari API Gateway. Endpoint ini tidak dilindungi rate limiter
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.use("/", router);

app.get("/health", (_req, res) => {
  res.json({ service: "api-gateway", status: "running" });
});

app.listen(PORT, () => {
  console.log(`[API Gateway] running on http://localhost:${PORT}`);
});