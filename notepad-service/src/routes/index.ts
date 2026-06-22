import { Router } from "express";
import { notepadController } from "../controllers/NotepadController";

const router = Router();

router.get("/notepads",              (req, res) => notepadController.index(req, res));
router.get("/notepads/:id",          (req, res) => notepadController.show(req, res));
router.get("/users/:userId/notepads", (req, res) => notepadController.byUser(req, res));
router.post("/notepads",             (req, res) => notepadController.store(req, res));
router.put("/notepads/:id",          (req, res) => notepadController.update(req, res));
router.delete("/notepads/:id",       (req, res) => notepadController.destroy(req, res));
router.get("/notepads/status/:requestId", (req, res) => notepadController.checkStatus(req, res));

export default router;