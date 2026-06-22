import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/db";

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  async findAll(): Promise<User[]> {
    const [rows] = await pool.query<User[]>(
      `SELECT * FROM users ORDER BY id DESC`
    );
    return rows;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<User[]>(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ?? null;
  }

  async create(data: { name: string; email: string; phone?: string }): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`,
      [data.name, data.email, data.phone ?? null]
    );
    return result.insertId;
  }

  async update(id: number, data: { name?: string; email?: string; phone?: string }): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) { fields.push("name = ?"); values.push(data.name); }
    if (data.email) { fields.push("email = ?"); values.push(data.email); }
    if (data.phone !== undefined) { fields.push("phone = ?"); values.push(data.phone); }

    if (fields.length === 0) return false;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

export const userModel = new UserModel();