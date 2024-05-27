import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import { getModulos } from "../controllers/docenteController.js";

const router = Router();

router.get(
  "/modulos/:id",
  authMiddleware,
  verificarRol(["Docente"]),
  getModulos
);

export default router;
