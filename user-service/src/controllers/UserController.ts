import { Request, Response } from "express";
import { userModel } from "../models/UserModel";

export class UserController {
  async index(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userModel.findAll();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async show(req: Request, res: Response): Promise<void> {
    try {
      const user = await userModel.findById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async store(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email) {
        res.status(422).json({ success: false, message: "email and name are required" });
        return;
      }

      const id = await userModel.create({ name, email, phone });
      res.status(201).json({ success: true, data: { id }, message: "User created" });
    } catch (err: any) {
      // Error duplicate email dari MySQL unique constraint
      if (err.code === "ER_DUP_ENTRY") {
        res.status(409).json({ success: false, message: "Email already registered" });
        return;
      }
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone } = req.body;
      const ok = await userModel.update(Number(req.params.id), { name, email, phone });

      if (!ok) {
        res.status(404).json({ success: false, message: "User not found or no changes" });
        return;
      }
      res.json({ success: true, message: "User updated" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async destroy(req: Request, res: Response): Promise<void> {
    try {
      const ok = await userModel.delete(Number(req.params.id));
      if (!ok) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.json({ success: true, message: "User deleted" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const userController = new UserController();