import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import verificarRol from "../middleware/verificarRol.js";

import {
  getMaterias,
  getCarreras,
  insertarMateria,
  updateMateria,
  deleteMateria,
  insertarCarreras,
  updateCarreras,
  deleteCarreras,
  getRoles,
  insertarRol,
  updateRol,
  deleteRol,
  getPeriodos,
  insertarPeriodo,
  updatePeriodo,
  deletePeriodo,
  getCursos,
  insertarCursos,
  updateCursos,
  findDocumentos,
  insertarDocumento,
  updateDocumento,
  deleteDocumento,
  asignarDocumentos,
  getTipoEvidencias,
  insertarTipoEvidencia,
  updateTipoEvidencia,
  deleteTipoEvidencia,
  getUsuarios,
  insertarUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/catalogoController.js";

const router = Router();

// MATERIAS
router.get(
  "/materias",
  authMiddleware,
  verificarRol(["Administrador"]),
  getMaterias
);
router.post(
  "/materias",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarMateria
);
router.put(
  "/materias/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateMateria
);
router.delete(
  "/materias/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteMateria
);

router.get(
  "/carreras",
  authMiddleware,
  verificarRol(["Administrador"]),
  getCarreras
);
router.post(
  "/carreras",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarCarreras
);
router.put(
  "/carreras/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateCarreras
);
router.delete(
  "/carreras/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteCarreras
);

// ROLES
router.get("/roles", authMiddleware, verificarRol(["Administrador"]), getRoles);
router.post(
  "/roles",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarRol
);
router.put(
  "/roles/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateRol
);
router.delete(
  "/roles/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteRol
);

// Periodos
router.get(
  "/periodos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getPeriodos
);
router.post(
  "/periodos",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarPeriodo
);
router.put(
  "/periodos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updatePeriodo
);
router.delete(
  "/periodos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deletePeriodo
);

// TIPO EVIDENCIAS
router.get(
  "/tipoEvidencias",
  authMiddleware,
  verificarRol(["Administrador"]),
  getTipoEvidencias
);
router.post(
  "/tipoEvidencias",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarTipoEvidencia
);
router.put(
  "/tipoEvidencias/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateTipoEvidencia
);
router.delete(
  "/tipoEvidencias/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteTipoEvidencia
);

// USUARIOS
router.get(
  "/usuarios",
  authMiddleware,
  verificarRol(["Administrador"]),
  getUsuarios
);
router.post(
  "/usuarios",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarUsuario
);
router.put(
  "/usuarios/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateUsuario
);
router.delete(
  "/usuarios/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteUsuario
);

router.get(
  "/cursos",
  authMiddleware,
  verificarRol(["Administrador"]),
  getCursos
);

router.post(
  "/cursos",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarCursos
);
router.put(
  "/cursos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateCursos
);

router.get(
  "/documentos",
  authMiddleware,
  verificarRol(["Administrador"]),
  findDocumentos
);
router.post(
  "/documentos",
  authMiddleware,
  verificarRol(["Administrador"]),
  insertarDocumento
);
router.put(
  "/documentos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  updateDocumento
);
router.delete(
  "/documentos/:id",
  authMiddleware,
  verificarRol(["Administrador"]),
  deleteDocumento
);

router.post(
  "/asginarDocumentos",
  authMiddleware,
  verificarRol(["Administrador"]),
  asignarDocumentos
);

export default router;
