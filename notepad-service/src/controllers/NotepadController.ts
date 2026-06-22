import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { publishToQueue } from "../config/rabbitmq";
import { notepadModel } from "../models/NotepadModel";
import { userServiceClient } from "../services/UserServiceClient";
import dotenv from "dotenv";
dotenv.config();

export class NotepadController {
  async index(_req: Request, res: Response): Promise<void> {
    try {
      const notepads = await notepadModel.findAll();
      res.json({ success: true, data: notepads });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async byUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const notepads = await notepadModel.findByUserId(userId);
      res.json({ success: true, data: notepads });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const notepad = await notepadModel.findById(Number(req.params.id));
      if (!notepad) {
        res.status(404).json({ success: false, message: "Notepad not found" });
        return;
      }
      res.json({ success: true, data: notepad });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, title, content } = req.body;

      if (!user_id || !title) {
        res
          .status(422)
          .json({ success: false, message: "user_id and title are required" });
        return;
      }

      // Generate request_id unik untuk idempotency & tracking
      const requestId = randomUUID();

      // publish data mentahnya saja ke queue. Validasi user dan
      // insert ke database sepenuhnya jadi tanggung jawab worker.
      await publishToQueue(process.env.NOTEPAD_CREATE_QUEUE!, {
        request_id: requestId,
        user_id,
        title,
        content,
      });

      res.status(202).json({
        success: true,
        data: { request_id: requestId },
        message: "Notepad sedang diproses",
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * Endpoint baru — client cek status pakai request_id yang dia simpan
   * dari response awal saat create.
   */
  async checkStatus(req: Request, res: Response): Promise<void> {
    try {
      const requestId = req.params.requestId as string;
      const notepad = await notepadModel.findByRequestId(requestId);

      if (!notepad) {
        // Bisa jadi masih di antrian, belum diproses worker sama sekali
        res.json({ success: true, data: { status: "pending" } });
        return;
      }

      res.json({ success: true, data: notepad });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { title, content } = req.body;
      const ok = await notepadModel.update(Number(req.params.id), {
        title,
        content,
      });

      if (!ok) {
        res
          .status(404)
          .json({ success: false, message: "Notepad not found or no changes" });
        return;
      }
      res.json({ success: true, message: "Notepad updated" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const ok = await notepadModel.delete(Number(req.params.id));
      if (!ok) {
        res.status(404).json({ success: false, message: "Notepad tidak ditemukan" });
        return;
      }
      res.json({ success: true, message: "Notepad deleted" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const notepadController = new NotepadController();
