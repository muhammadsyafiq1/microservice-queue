import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { connectRabbitMQ } from "./config/rabbitmq";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.get("/health", (_req, res) => {
  res.json({ service: "notepad-service", status: "running" });
});

async function start() {
  // Konek RabbitMQ saat startup, supaya error ketahuan dari awal
  await connectRabbitMQ();

  app.listen(PORT, () => {
    console.log(`[Notepad Service] running on http://localhost:${PORT}`);
  });
}

start();