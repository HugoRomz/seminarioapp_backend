import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";

import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
} from "../Utils/index.js";
import { where } from "sequelize";

const getMaterias = async (req, res) => {
  try {
    // Busca el curso activo
    const materias = await Materias.findAll();

    if (materias && materias.length > 0) {
      res.json(materias);
    } else {
      console.log("No hay materias asignadas");
      res.status(404).json({ error: "No se encontró ningúna materia activa" });
    }
  } catch (error) {
    console.error("Error al buscar materias:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar materias" });
  }
};

const insertarMateria = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_materia } = req.body;

    const newMateria = await Materias.create({
      nombre_materia,
    });

    res.json({
      msg: "La materia se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { materia_id, nombre_materia } = req.body;

    // Actualiza la información del usuario en la tabla Usuarios
    await Materias.update(
      {
        materia_id,
        nombre_materia,
      },
      { where: { materia_id: id }, individualHooks: true }
    );

    res.json({
      msg: "La materia se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la materia:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar la materia" });
  }
};

const deleteMateria = async (req, res) => {
  try {
    const { id } = req.params;

    await Materias.destroy({
      where: {
        materia_id: id,
      },
    });
    res.json({
      msg: "La materia se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getCarreras = async (req, res) => {
  try {
    const carreras = await Carreras.findAll();
    carreras;
    if (carreras && carreras.length > 0) {
      res.json(carreras);
    } else {
      console.log("No hay carreras asignadas");
      res.status(404).json({ error: "No se encontró ningúna carrera activa" });
    }
  } catch (error) {
    console.error("Error al buscar carreras:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar carreras" });
  }
};

const insertarCarreras = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_carrera } = req.body;

    const newCarrera = await Carreras.create({
      nombre_carrera,
    });

    res.json({
      msg: "La carrera se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateCarreras = async (req, res) => {
  try {
    const { id } = req.params;
    const { carrera_id, nombre_carrera } = req.body;

    // Actualiza la información del usuario en la tabla Usuarios
    await Carreras.update(
      {
        carrera_id,
        nombre_carrera,
      },
      { where: { carrera_id: id }, individualHooks: true }
    );

    res.json({
      msg: "La carrera se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar la carrera:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar la carrera" });
  }
};

const deleteCarreras = async (req, res) => {
  try {
    const { id } = req.params;

    await Carreras.destroy({
      where: {
        carrera_id: id,
      },
    });
    res.json({
      msg: "La carrera se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

export {
  getCarreras,
  getMaterias,
  insertarMateria,
  updateMateria,
  deleteMateria,
  insertarCarreras,
  updateCarreras,
  deleteCarreras,
};
