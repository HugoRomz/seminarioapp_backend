import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
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

router.route("/usuarios").get(getUsuarios).post(createUsuarios);

router
  .route("/usuarios/:id")
  .get(getUsuariosById)
  .put(updateUsuarios)
  .delete(deleteUsuarios);

router.post("/login", login);
router.post("/preregistro", preregistro);


// Requiere JWT

router.get('/user', authMiddleware, user)

export default router;
