import { Carreras } from "../models/Carreras.js";
import { Cursos } from "../models/Cursos.js";
import { Modulos, Calificaciones } from "../models/Modulos.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import { Usuarios } from "../models/Usuarios.js";
import {
  handleBadRequestError,
  handleInternalServerError,
} from "../Utils/index.js";

const getModulos = async (req, res) => {
  const { id } = req.params;
  console.log("ID:", id);
  try {
    const modulos = await Calificaciones.findAll({
      where: {
        usuario_id: id,
      },
      include: {
        model: Modulos,
        attributes: ["nombre_modulo"],
        include: {
          model: Usuarios,
          attributes: ["nombre", "apellido_p", "apellido_m"],
        },
      },
    });
    if (!modulos) {
      return handleBadRequestError(
        "No se encontraron módulos activos para el usuario proporcionado.",
        res
      );
    }

    res.json(modulos);
  } catch (error) {
    console.error("Error al obtener los módulos:", error);
    return handleInternalServerError(error, res);
  }
};

export { getModulos };
