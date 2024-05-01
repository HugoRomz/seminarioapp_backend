import { Periodos, CursoPeriodos } from "../models/Periodo.js";
import { Cursos, DetalleCurso } from "../models/Cursos.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";

import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
} from "../Utils/index.js";
import { where } from "sequelize";

const getSeminarioActivo = async (req, res) => {
  try {
    // Busca el curso activo
    const cursoperiodo = await CursoPeriodos.findAll({
      include: [
        {
          model: Cursos,
          include: [
            {
              model: DetalleCurso,
              include: [Materias],
            },
            Carreras,
          ],
        },
      ],
    });

    if (cursoperiodo && cursoperiodo.length > 0) {
      res.json(cursoperiodo);
    } else {
      console.log("No hay nada");
      res.status(404).json({ error: "No se encontró ningún curso activo" });
    }
  } catch (error) {
    console.error("Error al buscar curso activo:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar el curso activo" });
  }
};

export { getSeminarioActivo };
