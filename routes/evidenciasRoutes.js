import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getModulos,
  getTipoEvidencias,
} from "../controllers/evidenciasController.js";

const router = Router();

router.get(
  "/modulos/:id",
  authMiddleware,
  verificarRol(["Docente"]),
  getModulos
);
router.get(
  "/tipos",
  authMiddleware,
  verificarRol(["Docente"]),
  getTipoEvidencias
);

export default router;
