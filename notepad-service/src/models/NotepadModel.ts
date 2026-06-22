import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface Notepad extends RowDataPacket {
  id: number;
  request_id: string;
  user_id: number;
  title: string;
  content: string | null;
  status: "pending" | "completed" | "failed";
  created_at: Date;
  updated_at: Date;
}

export class NotepadModel {
  async findAll(): Promise<Notepad[]> {
    const [rows] = await pool.query<Notepad[]>(
      `SELECT * FROM notepads ORDER BY id DESC`
    );
    return rows;
  }

  async findByUserId(userId: number): Promise<Notepad[]> {
    const [rows] = await pool.query<Notepad[]>(
      `SELECT * FROM notepads WHERE user_id = ? ORDER BY id DESC`,
      [userId]
    );
    return rows;
  }

  async findById(id: number): Promise<Notepad | null> {
    const [rows] = await pool.query<Notepad[]>(
      `SELECT * FROM notepads WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  }

  /**
   * Cek status berdasarkan request_id — dipakai client untuk tracking
   * status notepad yang baru dia submit, karena dia belum punya `id`.
   */
  async findByRequestId(requestId: string): Promise<Notepad | null> {
    const [rows] = await pool.query<Notepad[]>(
      `SELECT * FROM notepads WHERE request_id = ? LIMIT 1`,
      [requestId]
    );
    return rows[0] ?? null;
  }

  /**
   * satu satunya method untuk insert notepad baru.
   * Dipanggil HANYA dari worker.ts, tidak pernah dipanggil dari controller.
   */
  async create(data: {
    request_id: string;
    user_id: number;
    title: string;
    content?: string;
    status: "completed" | "failed";
  }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO notepads (request_id, user_id, title, content, status) VALUES (?, ?, ?, ?, ?)`,
      [data.request_id, data.user_id, data.title, data.content ?? null, data.status]
    );
    return result.insertId;
  }

  async update(id: number, data: { title?: string; content?: string }): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title) { fields.push("title = ?"); values.push(data.title); }
    if (data.content !== undefined) { fields.push("content = ?"); values.push(data.content); }

    if (fields.length === 0) return false;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE notepads SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM notepads WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

export const notepadModel = new NotepadModel();