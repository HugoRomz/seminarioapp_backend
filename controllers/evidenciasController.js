import { Usuarios } from "../models/Usuarios.js";
import { Actividad, Evidencias, TipoEvidencias } from "../models/Evidencias.js";
import { Modulos } from "../models/Modulos.js";
import { Cursos } from "../models/Cursos.js";

import { Periodos, CursoPeriodos } from "../models/Periodo.js";

import { handleNotFoundError } from "../Utils/index.js";

import {
  handleBadRequestError,
  handleInternalServerError,
} from "../Utils/index.js";

const getModulos = async (req, res) => {
  const { id } = req.params;
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
          model: Actividad,
          attributes: [
            "actividad_id",
            "nombre_actividad",
            "descripcion",
            "fecha_entrega",
          ],
          include: [
            {
              model: TipoEvidencias,
              attributes: ["tipo_evidencia_id", "nombre_tipo_ev"],
            },
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

const getTipoEvidencias = async (req, res) => {
  try {
    const tipoEvidencias = await TipoEvidencias.findAll({});

    if (!tipoEvidencias) {
      return handleNotFoundError("No se encontró tipo evidencias", res);
    }

    res.json(tipoEvidencias);
  } catch (error) {
    console.error("Error al buscar tipo evidencias:", error);
    return handleInternalServerError(error, res);
  }
};

const createActividad = async (req, res) => {
  const {
    nombre_actividad,
    fecha_entrega,
    tipo_evidencia_id,
    modulo_id,
    descripcion,
  } = req.body;

  try {
    const evidencia = await Actividad.create({
      modulo_id,
      nombre_actividad,
      fecha_entrega,
      tipo_evidencia_id,
      descripcion,
    });
    res.json({
      msg: "La actividad se creó correctamente.",
    });
  } catch (error) {
    console.error("Error al crear la actividad:", error);
    return handleInternalServerError(error, res);
  }
};

const updateActividad = async (req, res) => {
  const {
    actividad_id,
    nombre_actividad,
    fecha_entrega,
    tipo_evidencia_id,
    descripcion,
  } = req.body;

  try {
    const actividad = await Actividad.update(
      {
        nombre_actividad,
        fecha_entrega,
        tipo_evidencia_id,
        descripcion,
      },
      {
        where: {
          actividad_id,
        },
      }
    );

    res.json({
      msg: "La actividad se actualizó correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar la actividad:", error);
    return handleInternalServerError(error, res);
  }
};

const deleteEvidencia = async (req, res) => {
  const { evidencia_id } = req.params;

  try {
    const evidencia = await Actividad.destroy({
      where: {
        evidencia_id,
      },
    });

    res.json({
      msg: "La evidencia se eliminó correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar la evidencia:", error);
    return handleInternalServerError(error, res);
  }
};

const getEvidencias = async (req, res) => {
  const { actividad_id } = req.params;
  console.log(actividad_id);
  try {
    const evidencias = await Evidencias.findAll({
      where: {
        actividad_id,
      },
      include: [
        {
          model: Actividad,
          attributes: ["nombre_actividad"],
        },
      ],
    });

    if (!evidencias) {
      return handleNotFoundError("No se encontraron evidencias", res);
    }

    res.json(evidencias);
  } catch (error) {
    console.error("Error al buscar evidencias:", error);
    return handleInternalServerError(error, res);
  }
};

export {
  getModulos,
  getTipoEvidencias,
  createActividad,
  updateActividad,
  getEvidencias,
};
