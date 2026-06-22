import dotenv from "dotenv";
dotenv.config();

import { consumeQueue, publishToQueue } from "./config/rabbitmq";
import { notepadModel } from "./models/NotepadModel";
import { userServiceClient } from "./services/UserServiceClient";

interface CreateNotepadJob {
  request_id: string;
  user_id: number;
  title: string;
  content?: string;
}

async function processCreateNotepad(data: CreateNotepadJob): Promise<void> {
  console.log(`[Worker] Processing request ${data.request_id} for user ${data.user_id}`);

  // Validasi user dulu — sebelum ada insert apapun ke database
  let user;
  try {
    user = await userServiceClient.getUserById(data.user_id);
  } catch (err) {
    console.error(`[Worker] Cannot reach User Service for request ${data.request_id}`);
    // Tidak ada insert sama sekali — request ini dianggap gagal total,
    // tidak meninggalkan jejak "pending" yang menggantung di database
    return;
  }

  if (!user) {
    console.warn(`[Worker] User ${data.user_id} not found, request ${data.request_id} dibuang`);
    return;
  }

  // Dikerjakan worker
  // menumpuk di queue saat ini.
  const notepadId = await notepadModel.create({
    request_id: data.request_id,
    user_id: data.user_id,
    title: data.title,
    content: data.content,
    status: "completed",
  });

  console.log(`[Worker] Notepad #${notepadId} created (request ${data.request_id})`);

  // Publish event untuk Notification Service 
  await publishToQueue(process.env.NOTEPAD_CREATED_QUEUE!, {
    notepad_id: notepadId,
    title: data.title,
    user_id: user.id,
    user_name: user.name,
    user_email: user.email,
    event: "notepad.created",
  });
}

async function start() {
  console.log("[Notepad Worker] Starting...");
  await consumeQueue(process.env.NOTEPAD_CREATE_QUEUE!, processCreateNotepad);
}

start().catch((err) => {
  console.error("[Notepad Worker] Failed to start:", err.message);
  process.exit(1);
});