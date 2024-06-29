import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getModulos,
  getTipoEvidencias,
  createActividad,
  updateActividad,
  getEvidencias,
  deleteEvidencia,
  createEvidencia,
  deleteActividad,
} from "../controllers/evidenciasController.js";
import upload from "../middleware/multer.js";

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
router.delete(
  "/actividad/:actividad_id",
  authMiddleware,
  verificarRol(["Docente"]),
  deleteActividad
);
router.get(
  "/:actividad_id",
  authMiddleware,
  verificarRol(["Docente"]),
  getEvidencias
);
router.delete(
  "/evidencia/:evidencia_id",
  authMiddleware,
  verificarRol(["Docente"]),
  deleteEvidencia
);

router.post(
  "/evidencia",
  authMiddleware,
  verificarRol(["Docente"]),
  upload.single("documento"),
  createEvidencia
);

export default router;
