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
  agregarComentariosDocente,
  getDocentes,
  updateDocumentoStatusDocente,
  aceptarDocUsuarioDocente,
  getCursoDocumentosDocente,
  subirDocumentosDocente,
} from "../controllers/documentoController.js";

const router = Router();

// Ruta protegida para obtener información del usuario autenticado
router.get("/user", authMiddleware, user);

router.get("/cursoDocumento/:id", getCursoDocumentos);
router.post("/subir", subirDocumentos);

router.get("/cursoDocumentoDocente/:id", getCursoDocumentosDocente);
router.post("/subirDocDocente", subirDocumentosDocente);

// ALUMNOS

router.put(
  "/comentarios/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  agregarComentarios
);

router.get("/alumnos", getAlumnos);

router.put(
  "/actualizarEstado/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateDocumentoStatus
);

router.post("/aceptarDocUsuario/:id", aceptarDocUsuario);

// DOCENTES

router.get("/docentes", getDocentes);

router.put(
  "/actualizarEstadoDocente/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateDocumentoStatusDocente
);

router.put(
  "/comentariosDocente/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  agregarComentariosDocente
);

router.post("/aceptarDocUsuarioDocente/:id", aceptarDocUsuarioDocente);

export default router;
