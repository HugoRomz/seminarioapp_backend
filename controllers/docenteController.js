import { Carreras } from "../models/Carreras.js";
import { Cursos } from "../models/Cursos.js";
import { Modulos } from "../models/Modulos.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import {
  handleBadRequestError,
  handleInternalServerError,
} from "../Utils/index.js";

const getModulos = async (req, res) => {
  const { id } = req.params;
  console.log("ID:", id);
  try {
    const modulos = await Modulos.findAll({
      where: {
        usuario_id: id,
      },
      include: [
        {
          model: CursoPeriodos,
          include: [
            {
              model: Cursos,
              attributes: ["nombre_curso"],
              include: [
                {
                  model: Carreras,
                  attributes: ["nombre_carrera"], // Solo obtener el nombre de la carrera
                },
              ],
            },
            {
              model: Periodos,
              attributes: ["descripcion"],
            },
          ],
          attributes: ["status"],
          where: {
            status: "Aceptado",
          },
        },
      ],
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
