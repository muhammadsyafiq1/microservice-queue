import { Router } from "express";
import userRoutes from "./userRoutes";
import notepadRoutes from "./notepadRoutes";

const router = Router();

router.use(userRoutes);
router.use(notepadRoutes);

export default router;