import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import { user, getAlumnos } from "../controllers/documentoController.js";

const router = Router();

// Ruta protegida para obtener información del usuario autenticado
router.get("/user", verificarRol(["Alumno"]), authMiddleware, user);

router.get("/cursoDocumento/:id", authMiddleware, verificarRol, user);

// ALUMNOS
router.get(
  "/alumnos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getAlumnos
);

export default router;
