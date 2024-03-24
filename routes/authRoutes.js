import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  login,
  preregistro,
  user
} from "../controllers/authController.js";

const router = Router();


router.post("/login", login);
router.post("/preregistro", preregistro);

// Ruta protegida para obtener información del usuario autenticado
router.get('/user', authMiddleware, user);

export default router;
