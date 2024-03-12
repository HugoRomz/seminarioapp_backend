import { Router } from "express";
import {
  getUsuarios,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios,
  getUsuariosById,
  login,
  preregistro,
} from "../controllers/authController.js";

const router = Router();

router.route("/usuarios").get(getUsuarios).post(createUsuarios);

router
  .route("/usuarios/:id")
  .get(getUsuariosById)
  .put(updateUsuarios)
  .delete(deleteUsuarios);

router.post("/login", login);
router.post("/preregistro", preregistro);

export default router;
