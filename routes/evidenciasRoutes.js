import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getModulos,
  getTipoEvidencias,
  createEvidencia,
  updateEvidencia,
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
router.post(
  "/evidencias",
  authMiddleware,
  verificarRol(["Docente"]),
  createEvidencia
);
router.put(
  "/evidencias",
  authMiddleware,
  verificarRol(["Docente"]),
  updateEvidencia
);

export default router;
