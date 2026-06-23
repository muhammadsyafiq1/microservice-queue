import { Request, Response, NextFunction } from "express";
import { httpRequestsTotal, httpRequestDuration } from "../metrics";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Setelah response selesai dikirim, catat metricnya apa saja
  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000; // convert ke detik
    const route = req.path.split("/")[1] || "unknown"; // ambil "users" dari "/users/123"

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    });

    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode.toString() },
      duration
    );
  });

  next();
}