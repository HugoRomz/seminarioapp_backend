import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getModulos,
  updateCalificacion,
  getAsesorados,
} from "../controllers/docenteController.js";

const router = Router();

router.get(
  "/modulos/:id",
  authMiddleware,
  verificarRol(["Docente"]),
  getModulos
);
router.put(
  "/calificaciones/:id",
  authMiddleware,
  verificarRol(["Docente"]),
  updateCalificacion
);

router.get(
  "/asesorados/:id",
  authMiddleware,
  verificarRol(["Docente"]),
  getAsesorados
);

export default router;
