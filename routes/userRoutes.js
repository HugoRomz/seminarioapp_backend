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
  getPeriodos,
  deleteAlumnos,
  insertarAlumnos,
  updateAlumnos,
  getDocentes,
  deleteDocentes,
  insertarDocentes,
  updateDocentes,
} from "../controllers/userController.js";

const router = Router();

// Rutas accesibles para todos los usuarios
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuariosById);

router.get(
  "/periodo",
  authMiddleware,
  verificarRol(["Administrador"]),
  getPeriodos
);

// PREREGISTROS
router.get("/preregister", getPreregister);
router.post(
  "/preregister",
  authMiddleware,
  verificarRol(["Administrador"]),
  aceptarUsuario
);
router.delete(
  "/preregister/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  rechazarUsuario
);

// USUARIOS
router.post("/usuarios", createUsuarios);
router.put(
  "/usuarios/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateUsuarios
);
router.delete(
  "/usuarios/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteUsuarios
);

// ALUMNOS
router.get(
  "/alumnos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getAlumnos
);
router.post(
  "/alumnos",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarAlumnos
);
router.put(
  "/alumnos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateAlumnos
);
router.delete(
  "/alumnos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteAlumnos
);

// Docentes
router.get(
  "/docentes",
  authMiddleware,
  verificarRol(["Administrador"]),
  getDocentes
);
router.post(
  "/docentes",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarDocentes
);
router.put(
  "/docentes/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateDocentes
);
router.delete(
  "/docentes/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteDocentes
);

export default router;
