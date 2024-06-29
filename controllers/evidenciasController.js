import { Usuarios } from "../models/Usuarios.js";
import { Actividad, Evidencias, TipoEvidencias } from "../models/Evidencias.js";
import { Modulos } from "../models/Modulos.js";
import { Cursos } from "../models/Cursos.js";

import { Periodos, CursoPeriodos } from "../models/Periodo.js";

import { handleNotFoundError } from "../Utils/index.js";

import sequelize from "sequelize";
import cloudinary from "../config/cloudinary.js";

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
            {
              model: Evidencias,
              attributes: [],
            },
          ],
        },
      ],
    });

    if (modulos && modulos.length > 0) {
      for (const [index, mod] of modulos.entries()) {
        if (mod.actividades && mod.actividades.length > 0) {
          await Promise.all(
            mod.actividades.map(async (actividad) => {
              const evidenciasCount = await Evidencias.count({
                where: { actividad_id: actividad.actividad_id },
              });
              actividad.dataValues.evidenciasCount = evidenciasCount;
              actividad.dataValues.index = index;
            })
          );
        }
      }
    }

    if (!modulos || modulos.length === 0) {
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

const deleteActividad = async (req, res) => {
  const { actividad_id } = req.params;

  try {
    const evidencia = await Actividad.destroy({
      where: {
        actividad_id: actividad_id,
      },
    });

    if (!evidencia) {
      throw new Error("No se encontró la actividad.");
    }

    res.json({
      msg: "La actividad se eliminó correctamente.",
    });
  } catch (error) {
    return handleInternalServerError("Error al eliminar la actividad.", res);
  }
};

const getEvidencias = async (req, res) => {
  const { actividad_id } = req.params;

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

const deleteEvidencia = async (req, res) => {
  const { evidencia_id } = req.params;

  try {
    const existingEvidencia = await Evidencias.findOne({
      where: {
        evidencias_id: evidencia_id,
      },
    });

    if (existingEvidencia && existingEvidencia.url_evidenciaPublic) {
      await cloudinary.uploader.destroy(existingEvidencia.url_evidenciaPublic);

      const evidencia = await Evidencias.destroy({
        where: {
          evidencias_id: evidencia_id,
        },
      });
    }

    res.json({
      msg: "La evidencia se eliminó correctamente.",
    });
  } catch (error) {
    return handleInternalServerError("Error al eliminar la evidencia.", res);
  }
};

const createEvidencia = async (req, res) => {
  const documentoInfoString = req.body.documentoInfo;
  const documentoInfo = JSON.parse(documentoInfoString);
  const file = req.file;

  try {
    if (documentoInfo.evidencias_id) {
      // Es editar
      if (!file) {
        const evidencia_id = documentoInfo.evidencias_id;
        const evidencia = await Evidencias.findByPk(evidencia_id);
        if (!evidencia) {
          return handleBadRequestError(
            "No se encontró la evidencia proporcionada.",
            res
          );
        }

        evidencia.descripcion = documentoInfo.descripcion;
        await evidencia.save();
        res.json({ msg: "Evidencia se actualizó correctamente" });
      } else {
        const evidencia_id = documentoInfo.evidencias_id;
        const evidencia = await Evidencias.findByPk(evidencia_id);
        if (!evidencia) {
          return handleBadRequestError(
            "No se encontró la evidencia proporcionada.",
            res
          );
        }

        const resultado = await cloudinary.uploader.upload(file.path, {
          folder: `Evidencias/Actividad-${documentoInfo.actividad_id}/`,
        });

        let urlArchivo = resultado.secure_url;
        const url_filePublic = resultado.public_id;

        // Convertir la URL del archivo a una imagen JPG utilizando la transformación de página
        if (urlArchivo.endsWith(".pdf")) {
          urlArchivo = urlArchivo
            .replace(".pdf", ".jpg")
            .replace("/upload/", "/upload/pg_1/");
        } else if (
          !urlArchivo.endsWith(".jpg") &&
          !urlArchivo.endsWith(".jpeg") &&
          !urlArchivo.endsWith(".png")
        ) {
          console.error("El archivo no es un PDF ni una imagen válida.");
          res.status(500).send("El archivo no es un PDF ni una imagen válida.");
        }

        if (evidencia.url_evidenciaPublic) {
          await cloudinary.uploader.destroy(evidencia.url_evidenciaPublic);
        }

        evidencia.descripcion = documentoInfo.descripcion;
        evidencia.url_evidencia = urlArchivo;
        evidencia.url_evidenciaPublic = url_filePublic;

        await evidencia.save();
        res.json({ msg: "Evidencia se actualizó correctamente" });
      }
    } else {
      const resultado = await cloudinary.uploader.upload(file.path, {
        folder: `Evidencias/Actividad-${documentoInfo.actividad_id}/`,
      });

      let urlArchivo = resultado.secure_url;
      const url_filePublic = resultado.public_id;

      // Convertir la URL del archivo a una imagen JPG utilizando la transformación de página
      if (urlArchivo.endsWith(".pdf")) {
        urlArchivo = urlArchivo
          .replace(".pdf", ".jpg")
          .replace("/upload/", "/upload/pg_1/");
      } else if (
        !urlArchivo.endsWith(".jpg") &&
        !urlArchivo.endsWith(".jpeg") &&
        !urlArchivo.endsWith(".png")
      ) {
        console.error("El archivo no es un PDF ni una imagen válida.");
        res.status(500).send("El archivo no es un PDF ni una imagen válida.");
      }

      await Evidencias.create({
        actividad_id: documentoInfo.actividad_id,
        descripcion: documentoInfo.descripcion,
        url_evidencia: urlArchivo,
        url_evidenciaPublic: url_filePublic,
      });
      res.json({ msg: "Evidencia se creo correctamente" });
    }
  } catch (error) {
    console.error("Error al subir el documento:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export {
  getModulos,
  getTipoEvidencias,
  createActividad,
  updateActividad,
  deleteActividad,
  getEvidencias,
  createEvidencia,
  deleteEvidencia,
};
