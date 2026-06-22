interface NotepadCreatedEvent {
  notepad_id: number;
  title: string;
  user_id: number;
  user_name: string;
  user_email: string;
  event: string;
}

/**
 * Simulasi proses kirim notifikasi.
 * Di real-world, ini bisa diganti kirim email (nodemailer),
 * push notification (FCM), atau SMS (Twilio).
 */
export async function handleNotepadCreated(data: NotepadCreatedEvent): Promise<void> {
  console.log("[Notification Service] Processing event:", data.event);

  // Simulasi delay seperti proses kirim email sungguhan (tidak instan)
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(
    `[Notification Service] Notifikasi terkirim ke ${data.user_email}: ` +
    `"Halo ${data.user_name}, notepad '${data.title}' berhasil dibuat!"`
  );
}