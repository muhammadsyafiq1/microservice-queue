import dotenv from "dotenv";
import { consumeQueue } from "./config/rabbitmq";
import { handleNotepadCreated } from "./handlers/notepadHandler";

dotenv.config();

async function start() {
  console.log("[Notification Service] Worker starting...");

  await consumeQueue(process.env.NOTEPAD_QUEUE!, handleNotepadCreated);
}

start().catch((err) => {
  console.error("[Notification Service] Failed to start:", err.message);
  process.exit(1);
});