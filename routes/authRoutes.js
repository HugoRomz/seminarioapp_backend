import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getUsuarios,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios,
  getUsuariosById,
  login,
  preregistro,
  user
} from "../controllers/authController.js";

const router = Router();

// Rutas accesibles para todos los usuarios
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuariosById);

router.post("/login", login);
router.post("/preregistro", preregistro);

// Rutas que requieren autenticación y ser administrador
router.post("/usuarios", authMiddleware, verificarRol(['Administrador']), createUsuarios);
router.put("/usuarios/:id", authMiddleware, verificarRol(['Administrador']), updateUsuarios);
router.delete("/usuarios/:id", authMiddleware, verificarRol(['Administrador']), deleteUsuarios);

// Ruta protegida para obtener información del usuario autenticado
router.get('/user', authMiddleware, user);

export default router;
