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
  rechazarUsuario
} from "../controllers/userController.js";

const router = Router();

// Rutas accesibles para todos los usuarios
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuariosById);

router.get("/preregister", getPreregister);
router.post("/preregister",authMiddleware, verificarRol(['Administrador']), aceptarUsuario);
router.delete("/preregister/:id",authMiddleware, verificarRol(['Administrador']), rechazarUsuario);

router.post("/usuarios", authMiddleware, verificarRol(['Administrador']), createUsuarios);
router.put("/usuarios/:id", authMiddleware, verificarRol(['Administrador']), updateUsuarios);
router.delete("/usuarios/:id", authMiddleware, verificarRol(['Administrador']), deleteUsuarios);


export default router;
