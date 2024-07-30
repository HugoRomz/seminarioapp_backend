import { Carreras } from "../models/Carreras.js";
import { Cursos } from "../models/Cursos.js";
import { Modulos, Calificaciones } from "../models/Modulos.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import { Proyectos, Tesinas } from "../models/Tesinas.js";
import { Usuarios } from "../models/Usuarios.js";
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
                  attributes: ["nombre_carrera"],
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
        {
          model: Calificaciones,
          include: [
            {
              model: Usuarios,
              attributes: ["usuario_id", "nombre", "apellido_p", "apellido_m"],
            },
          ],
          attributes: [
            "calificacion_id",
            "calificacion",
            "calificacion_proyecto",
            "calificacion_final",
          ],
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

const updateCalificacion = async (req, res) => {
  const { id } = req.params;
  const { calificacion, calificacion_proyecto } = req.body;
  try {
    const calificacionUpdate = await Calificaciones.findOne({
      where: {
        calificacion_id: id,
      },
    });
    if (!calificacionUpdate) {
      return handleBadRequestError(
        "No se pudo encontrar la calificación.",
        res
      );
    }
    calificacionUpdate.calificacion = calificacion;
    calificacionUpdate.calificacion_proyecto = calificacion_proyecto;
    await calificacionUpdate.save();

    if (!calificacionUpdate) {
      return handleBadRequestError(
        "No se pudo actualizar la calificación.",
        res
      );
    }
    res.json({
      msg: "Calificación actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar la calificación:", error);
    return handleInternalServerError(error, res);
  }
};

const getAsesorados = async (req, res) => {
  const { id } = req.params;
  try {
    const tesinas = await Tesinas.findAll({
      where: {
        usuario_id_docente: id,
      },
      attributes: [
        "nombre_tesina",
        "resenia_tesina",
        "status",
        "url_documento",
      ],
      include: [
        {
          model: Usuarios,
          as: "Docente",
          attributes: ["nombre", "apellido_p", "apellido_m"],
        },
        {
          model: Usuarios,
          as: "Alumno",
          attributes: ["nombre", "apellido_p", "apellido_m"],
        },
        {
          model: Proyectos,
          attributes: [
            "proyecto_id",
            "nombre_proyecto",
            "descripcion_proyecto",
            "url_documento",
            "status",
          ],
        },
      ],
    });

    res.json(tesinas);
  } catch (error) {
    console.error("Error al obtener los asesorados:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarProyecto = async (req, res) => {
  const { id } = req.params;
  try {
    const proyecto = await Proyectos.findOne({
      where: {
        proyecto_id: id,
      },
    });
    if (!proyecto) {
      return handleBadRequestError("No se pudo encontrar el proyecto.", res);
    }
    proyecto.status = "ACEPTADO";
    await proyecto.save();

    res.json({
      msg: "Proyecto aceptado correctamente.",
    });
  } catch (error) {
    console.error("Error al aceptar el proyecto:", error);
    return handleInternalServerError(error, res);
  }
};

const rechazarProyecto = async (req, res) => {
  const { proyecto_id, comentario } = req.body;

  console.log(comentario);
  try {
    const proyecto = await Proyectos.findOne({
      where: {
        proyecto_id,
      },
    });
    if (!proyecto) {
      return handleBadRequestError("No se pudo encontrar el proyecto.", res);
    }

    await Proyectos.destroy({
      where: {
        proyecto_id,
      },
    });

    res.json({
      msg: "Proyecto rechazado correctamente.",
    });
  } catch (error) {
    console.error("Error al rechazar el proyecto:", error);
    return handleInternalServerError(error, res);
  }
};

export {
  getModulos,
  updateCalificacion,
  getAsesorados,
  aceptarProyecto,
  rechazarProyecto,
};
