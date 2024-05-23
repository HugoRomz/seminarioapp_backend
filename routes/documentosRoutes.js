import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  user,
  getAlumnos,
  getCursoDocumentos,
  subirDocumentos,
  updateDocumentoStatus,
  agregarComentarios,
  aceptarDocUsuario,
} from "../controllers/documentoController.js";

const router = Router();

// Ruta protegida para obtener información del usuario autenticado
router.get("/user", authMiddleware, user);

router.get("/cursoDocumento/:id", getCursoDocumentos);
router.post("/subir", subirDocumentos);

router.put("/comentarios/:id", authMiddleware, verificarRol(["Administrador"]), agregarComentarios);

// ALUMNOS
router.get("/alumnos", getAlumnos);

router.put("/actualizarEstado/:id", authMiddleware, verificarRol(["Administrador"]), updateDocumentoStatus);

router.post('/aceptarDocUsuario/:id', aceptarDocUsuario);

export default router;
