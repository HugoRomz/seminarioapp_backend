import jwt from "jsonwebtoken";
import { Usuarios, Alumno, Egresado, Docente } from "../models/Usuarios.js";
import { Roles } from "../models/Roles.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";

const authMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario y sus roles
      const user = await Usuarios.findOne({
        where: { usuario_id: decoded.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Roles,
            through: { attributes: [] },
          },
          {
            model: Alumno,
            required: false,
          },
          {
            model: Egresado,
            required: false,
          },
          {
            model: Docente,
            required: false,
          },
        ],
      });

      if (!user) {
        return res.status(403).json({ msg: "No autorizado" });
      }

      req.user = user;
      next();
    } catch {
      const error = new Error("Token no válido");
      res.status(403).json({ msg: error.message });
    }
  } else {
    const error = new Error("Token no válido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default authMiddleware;
