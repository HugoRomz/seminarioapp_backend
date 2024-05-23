import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  login,
  preregistro,
  user,
  getCarreras,
  getCursosPeriodos,
  recuperarcontrasena,
} from "../controllers/authController.js";

const router = Router();

// Rutas sin proteccion
router.post("/login", login);
router.post("/preregistro", preregistro);
router.post("/recuperarcontrasena", recuperarcontrasena);
// Rutas para Preregistro
router.get("/carreras", getCarreras);
router.get("/cursosPeriodos", getCursosPeriodos);

// Ruta protegida para obtener información del usuario autenticado
router.get("/user", authMiddleware, user);

export default router;
