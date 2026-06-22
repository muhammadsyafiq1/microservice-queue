import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

router.use(
  "/notepads",
  createProxyMiddleware({
    target: process.env.NOTEPAD_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/notepads${path}`, 
    on: {
      proxyReq: (_proxyReq, req) => {
        console.log(`[Gateway] Forwarding ${req.method} ${req.url} → Notepad Service`);
      },
    },
  })
);

export default router;