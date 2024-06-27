import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getModulos,
  getTipoEvidencias,
  createActividad,
  updateActividad,
  getEvidencias,
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
  "/actividad",
  authMiddleware,
  verificarRol(["Docente"]),
  createActividad
);
router.put(
  "/actividad",
  authMiddleware,
  verificarRol(["Docente"]),
  updateActividad
);
router.get(
  "/:actividad_id",
  authMiddleware,
  verificarRol(["Docente"]),
  getEvidencias
);

export default router;
