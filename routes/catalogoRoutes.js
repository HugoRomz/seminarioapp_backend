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
} from "../controllers/catalogoController.js";

const router = Router();

// PREREGISTROS
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

export default router;
