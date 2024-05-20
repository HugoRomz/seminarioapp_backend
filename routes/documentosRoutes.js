import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  user,
  getAlumnos,
  getCursoDocumentos,
} from "../controllers/documentoController.js";

const router = Router();

// Ruta protegida para obtener información del usuario autenticado
router.get("/user", authMiddleware, user);

router.get("/cursoDocumento/:id", getCursoDocumentos);

// ALUMNOS
router.get("/alumnos", authMiddleware, getAlumnos);


export default router;
