import { Router } from "express";
import { userController } from "../controllers/UserController";

const router = Router();

router.get("/users",        (req, res) => userController.index(req, res));
router.get("/users/:id",    (req, res) => userController.show(req, res));
router.post("/users",       (req, res) => userController.store(req, res));
router.put("/users/:id",    (req, res) => userController.update(req, res));
router.delete("/users/:id", (req, res) => userController.destroy(req, res));

export default router;