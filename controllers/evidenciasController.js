import { Usuarios } from "../models/Usuarios.js";
import { Evidencias, TipoEvidencias } from "../models/Evidencias.js";
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
          model: Evidencias,
          attributes: ["evidencia_id", "nombre_evidencia", "fecha_entrega"],
          include: [
            {
              model: TipoEvidencias,
              attributes: [
                "tipo_evidencia_id",
                "nombre_tipo_ev",
                "descripcion",
              ],
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

const createEvidencia = async (req, res) => {
  const { nombre_evidencia, fecha_entrega, tipo_evidencia_id, modulo_id } =
    req.body;

  try {
    const evidencia = await Evidencias.create({
      modulo_id,
      nombre_evidencia,
      fecha_entrega,
      tipo_evidencia_id,
    });
    res.json({
      msg: "La evidencia se creó correctamente.",
    });
  } catch (error) {
    console.error("Error al crear la evidencia:", error);
    return handleInternalServerError(error, res);
  }
};

const updateEvidencia = async (req, res) => {
  const { evidencia_id, nombre_evidencia, fecha_entrega, tipo_evidencia_id } =
    req.body;

  try {
    const evidencia = await Evidencias.update(
      {
        nombre_evidencia,
        fecha_entrega,
        tipo_evidencia_id,
      },
      {
        where: {
          evidencia_id,
        },
      }
    );

    res.json({
      msg: "La evidencia se actualizó correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar la evidencia:", error);
    return handleInternalServerError(error, res);
  }
};

export { getModulos, getTipoEvidencias, createEvidencia, updateEvidencia };
