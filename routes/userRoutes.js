import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getUsuarios,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios,
  getUsuariosById,
  getPreregister,
  aceptarUsuario,
  rechazarUsuario,
  getAlumnos,
  deleteAlumnos,
  insertarAlumnos,
  updateAlumnos
} from "../controllers/userController.js";

const router = Router();

// Rutas accesibles para todos los usuarios
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuariosById);

// PREREGISTROS
router.get("/preregister", getPreregister);
router.post("/preregister",authMiddleware, verificarRol(['Administrador']), aceptarUsuario);
router.delete("/preregister/:id",authMiddleware, verificarRol(['Administrador']), rechazarUsuario);

// USUARIOS
router.post("/usuarios", createUsuarios);
router.put("/usuarios/:id", authMiddleware, verificarRol(['Administrador']), updateUsuarios);
router.delete("/usuarios/:id", authMiddleware, verificarRol(['Administrador']), deleteUsuarios);

// ALUMNOS
router.get("/alumnos",authMiddleware, verificarRol(['Administrador']), getAlumnos);
router.post("/alumnos",authMiddleware, verificarRol(['Administrador']), insertarAlumnos);
router.put("/alumnos/:id", authMiddleware, verificarRol(['Administrador']), updateAlumnos);
router.delete("/alumnos/:id", authMiddleware, verificarRol(['Administrador']), deleteAlumnos);


export default router;
