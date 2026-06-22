import { Registry, Counter, Histogram, collectDefaultMetrics } from "prom-client";

export const register = new Registry();

// Metrics default Node.js (CPU usage, memory, event loop lag, dll) — otomatis
collectDefaultMetrics({ register });

// Custom metric — hitung total request masuk, dikelompokkan per route dan status code
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests received by API Gateway",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Custom metric — ukur berapa lama tiap request diproses
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});