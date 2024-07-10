import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
    createInvitation
} from "../controllers/tesinaController.js";

const router = Router();

router.post(
    "/invitaciones",
    authMiddleware,
    verificarRol(["Alumno"]),
    createInvitation
);

export default router;
