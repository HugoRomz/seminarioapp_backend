import { Periodos, CursoPeriodos } from "../models/Periodo.js";
import { Cursos, DetalleCurso } from "../models/Cursos.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { Calificaciones, Modulos } from "../models/Modulos.js";
import {
  Usuarios,
  Docente,
  UserPreregister,
  Alumno,
  Egresado,
} from "../models/Usuarios.js";

import {
  DetallesDocumentosDocente,
  Documentos,
  DocumentosDocenteEstado,
} from "../models/Documentos.js";
import { Roles } from "../models/Roles.js";
import { Op } from "sequelize";
import sequelizet from "sequelize";
import { sequelize } from "../config/db.js";

import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
} from "../Utils/index.js";

const getSeminarioActivo = async (req, res) => {
  try {
    // Busca el curso activo
    const cursoperiodo = await CursoPeriodos.findAll({
      include: [
        {
          model: Cursos,
          include: [Carreras],
        },
        Periodos,
      ],
    });

    if (cursoperiodo && cursoperiodo.length > 0) {
      for (const cp of cursoperiodo) {
        const preregistrosCount = await UserPreregister.count({
          where: { curso_periodo_id: cp.curso_periodo_id },
        });
        cp.dataValues.preregistrosCount = preregistrosCount;
      }

      const aspirantes = await Usuarios.count({
        include: [
          {
            model: Alumno,
            required: false,
          },
          {
            model: Egresado,
            required: false,
          },
          {
            model: Roles,
            where: {
              nombre_rol: "Alumno",
            },
          },
        ],
        where: {
          status: "ACTIVO",
        },
      });
      //AGREGAR ASPIRANTES AL CURSOPERIODO
      for (const cp of cursoperiodo) {
        cp.dataValues.aspirantes = aspirantes;
      }
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

const rechazarCurso = async (req, res) => {
  try {
    const { idCurso } = req.params;
    const { motivo } = req.body;

    if (!idCurso) {
      return handleBadRequestError("Falta el id del curso", res);
    }

    const curso = await CursoPeriodos.findOne({
      where: {
        curso_periodo_id: idCurso,
      },
    });

    if (!curso) {
      return handleNotFoundError("No se encontró el curso", res);
    }

    await CursoPeriodos.update(
      {
        status: "Cancelado",
        descripcion: motivo,
      },
      {
        where: {
          curso_periodo_id: idCurso,
        },
      }
    );

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar curso:", error);
    return handleInternalServerError(error, res);
  }
};

const getPeriodos = async (req, res) => {
  try {
    const periodos = await Periodos.findAll({
      where: {
        status: true,
      },
    });

    if (periodos && periodos.length > 0) {
      res.json(periodos);
    } else {
      res.status(404).json({ error: "No se encontró ningún periodo" });
    }
  } catch (error) {
    console.error("Error al buscar periodos:", error);
    return handleInternalServerError(error, res);
  }
};

const getCursos = async (req, res) => {
  try {
    const cursos = await Cursos.findAll();

    if (cursos && cursos.length > 0) {
      res.json(cursos);
    } else {
      res.status(404).json({ error: "No se encontró ningún curso" });
    }
  } catch (error) {
    console.error("Error al buscar cursos:", error);
    return handleInternalServerError(error, res);
  }
};

const createPeriodo = async (req, res) => {
  try {
    const { fechaInicio, fechaCierre } = req.body;

    if (!fechaInicio || !fechaCierre) {
      return handleBadRequestError("Faltan datos para crear el periodo", res);
    }

    const obtenerMesAño = (fecha) => {
      const fechaObj = new Date(fecha);
      const meses = [
        "ENERO",
        "FEBRERO",
        "MARZO",
        "ABRIL",
        "MAYO",
        "JUNIO",
        "JULIO",
        "AGOSTO",
        "SEPTIEMBRE",
        "OCTUBRE",
        "NOVIEMBRE",
        "DICIEMBRE",
      ];
      const mes = meses[fechaObj.getMonth()];
      const año = fechaObj.getFullYear();
      return { mes, año };
    };

    const fechaInicioFormateada = obtenerMesAño(fechaInicio);
    const fechaCierreFormateada = obtenerMesAño(fechaCierre);

    const descripcion = `${fechaInicioFormateada.mes} - ${fechaCierreFormateada.mes} ${fechaInicioFormateada.año}`;

    const newPeriodo = await Periodos.create({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaCierre,
      descripcion,
      status: true,
    });

    res.json({
      msg: `El periodo ${descripcion} se creó correctamente`,
    });
  } catch (error) {
    console.error("Error al crear periodo:", error);
    return handleInternalServerError(error, res);
  }
};

const altaCurso = async (req, res) => {
  try {
    const cursos = req.body.cursos;
    const periodo = req.body.periodos;

    for (const curso of cursos) {
      const existingCoursePeriod = await CursoPeriodos.findOne({
        where: {
          periodo_id: periodo.periodo_id,
          curso_id: curso.curso_id,
        },
      });

      if (existingCoursePeriod) {
        return handleBadRequestError(
          "El curso ya existe para este periodo",
          res
        );
      }

      await CursoPeriodos.create({
        periodo_id: periodo.periodo_id,
        curso_id: curso.curso_id,
        status: "Pendiente",
      });
    }

    res.json({
      msg: `Los cursos se crearon correctamente para el periodo ${periodo.descripcion}`,
    });
  } catch (error) {
    console.error("Error al crear cursos:", error);
    return handleInternalServerError(error, res);
  }
};

const getCursoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handleBadRequestError("Falta el id del curso", res);
    }

    const curso = await CursoPeriodos.findOne({
      where: { curso_periodo_id: id },
      include: [
        {
          model: Cursos,
          include: [{ model: Carreras }],
        },
        {
          model: Periodos,
        },
        {
          model: Modulos,
          include: [
            {
              model: Usuarios,
              attributes: ["usuario_id", "nombre", "apellido_p", "apellido_m"],

              include: [{ model: Docente }],
            },
          ],
        },
      ],
      order: [[Modulos, "fecha_inicio", "ASC"]],
    });

    if (!curso) {
      return handleNotFoundError("No se encontró el curso", res);
    }

    res.json(curso);
  } catch (error) {
    console.error("Error al buscar curso por id:", error);
    return handleInternalServerError(error, res);
  }
};

const getMateriasCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return handleBadRequestError("Falta el id del curso", res);
    }
    const materias = await DetalleCurso.findAll({
      where: {
        curso_id: id,
      },
      include: [Materias],
    });

    if (!materias) {
      return handleNotFoundError("No se encontró el curso", res);
    }

    res.json(materias);
  } catch (error) {
    console.error("Error al buscar materias de un curso:", error);
    return handleInternalServerError(error, res);
  }
};

const getDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      include: {
        model: Usuarios,
        attributes: ["nombre", "apellido_p", "apellido_m"], // Seleccionar solo el campo 'nombre' del usuario
      },
    });

    const nombreCompleto = docentes.map((docente) => {
      return {
        id: docente.usuario_id,
        nombre: `${docente.usuario.nombre} ${docente.usuario.apellido_p} ${docente.usuario.apellido_m}`,
      };
    });

    if (docentes && docentes.length > 0) {
      res.json(nombreCompleto);
    } else {
      res.status(404).json({ error: "No se encontró ningún docente" });
    }
  } catch (error) {
    console.error("Error al buscar docentes:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarCurso = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.body.length === 0) {
      return handleBadRequestError("No se enviaron datos", res);
    }

    const cursos = await CursoPeriodos.findByPk(req.body[0].curso_periodo_id);
    const DocumentosDATA = await DetallesDocumentosDocente.findAll({
      where: {
        curso_id: cursos.curso_id,
      },
      include: {
        model: Documentos,
        attributes: ["documento_id", "nombre_documento"],
      },
      attributes: ["det_docente_id"],
      transaction: t,
    });

    const estadosDocentes = [];

    for (const curso of req.body) {
      await Modulos.create({
        det_curso_id: curso.detalle_curso_id,
        usuario_id: curso.docente[0].id,
        nombre_modulo: curso.materia,
        fecha_inicio: curso.fecha_inicio,
        fecha_cierre: curso.fecha_cierre,
        curso_periodo_id: curso.curso_periodo_id,
        transaction: t,
      });

      for (const documento of DocumentosDATA) {
        estadosDocentes.push({
          det_docente_id: documento.det_docente_id,
          usuario_id: curso.docente[0].id,
          status: "PENDIENTE",
        });
      }
    }

    await DocumentosDocenteEstado.bulkCreate(estadosDocentes, {
      transaction: t,
    });

    await CursoPeriodos.update(
      {
        status: "Aceptado",
      },
      {
        where: {
          curso_periodo_id: req.body[0].curso_periodo_id,
        },
        transaction: t,
      }
    );
    await t.commit();
    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al aceptar curso:", error);

    await t.rollback();
    return handleInternalServerError(error, res);
  }
};

const getAlumnos = async (req, res) => {
  try {
    const alumnos = await Usuarios.findAll({
      attributes: ["usuario_id", "nombre", "apellido_p", "apellido_m"],
      include: [
        {
          model: Alumno,
          required: false,
        },
        {
          model: Egresado,
          required: false,
        },
        {
          model: Roles,
          where: {
            nombre_rol: "Alumno",
          },
        },
      ],
      where: {
        status: "ACTIVO",
        usuario_id: {
          [Op.notIn]: sequelize.literal(`
            (SELECT usuario_id 
             FROM calificaciones)
          `),
        },
      },
    });

    if (alumnos && alumnos.length > 0) {
      res.json(alumnos);
    } else {
      handleBadRequestError("No se encontraron alumnos", res);
    }
  } catch (error) {
    console.error("Error al buscar alumnos:", error);
    return handleInternalServerError(error, res);
  }
};

const asignarAlumnos = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const alumnos = req.body.usuario_id;

    if (!cursoId) {
      return handleBadRequestError("Falta el id del curso", res);
    }

    const modulos = await Modulos.findAll({
      where: {
        curso_periodo_id: cursoId,
      },
    });

    if (!modulos.length) {
      return handleBadRequestError(
        "No se encontraron módulos para el curso indicado",
        res
      );
    }

    for (const modulo of modulos) {
      for (const alumno of alumnos) {
        await Calificaciones.create({
          usuario_id: alumno.usuario_id,
          modulo_id: modulo.modulo_id,
          calificacion: 5,
        });
      }
    }

    res.json({
      msg: "Los alumnos se asignaron correctamente",
    });
  } catch (error) {
    console.error("Error al asignar alumnos:", error);
    return handleInternalServerError(error, res);
  }
};

const editModulo = async (req, res) => {
  try {
    const { modulo_id } = req.params;
    const { fecha_inicio, fecha_cierre } = req.body;

    if (!modulo_id) {
      return handleBadRequestError("Falta el id del módulo", res);
    }

    await Modulos.update(
      {
        fecha_inicio,
        fecha_cierre,
      },
      {
        where: {
          modulo_id,
        },
      }
    );

    res.json({
      msg: "El módulo se actualizó correctamente",
    });
  } catch (error) {
    console.error("Error al editar módulo:", error);
    return handleInternalServerError(error, res);
  }
};

const generarCalificaciones = async (req, res) => {
  const { modulo_id } = req.params;
  try {
    const calificaciones = await Calificaciones.findAll({
      include: [
        {
          model: Modulos,
          include: [
            {
              model: Usuarios,
              attributes: ["nombre", "apellido_p", "apellido_m"],
            },
            {
              model: CursoPeriodos,
              include: [
                {
                  model: Periodos,
                  attributes: ["descripcion"],
                },
                {
                  model: Cursos,
                  attributes: ["nombre_curso"],
                },
              ],
            },
          ],
          where: {
            modulo_id,
          },
        },
        {
          model: Usuarios,
          attributes: ["nombre", "apellido_p", "apellido_m"],
          include: [
            {
              model: Alumno,
              attributes: ["matricula"],
              required: false,
            },
            {
              model: Egresado,
              attributes: ["cod_egresado"],
              required: false,
            },
          ],
        },
      ],
    });

    const calificacionesFormateadas = {
      docente: `${calificaciones[0].modulo.usuario.nombre} ${calificaciones[0].modulo.usuario.apellido_p} ${calificaciones[0].modulo.usuario.apellido_m}`,
      curso: calificaciones[0].modulo.cursos_periodo.curso.nombre_curso,
      periodo: calificaciones[0].modulo.cursos_periodo.periodo.descripcion,
      calificaciones: calificaciones.map((calificacion) => ({
        nombre: `${calificacion.usuario.nombre} ${calificacion.usuario.apellido_p} ${calificacion.usuario.apellido_m}`,
        matricula: calificacion.usuario.alumno
          ? calificacion.usuario.alumno.matricula
          : calificacion.usuario.egresado.cod_egresado,
        cal_mod: calificacion.calificacion,
        proy_cal: calificacion.calificacion_proyecto,
        cal_fin: calificacion.calificacion_final,
      })),
    };

    res.json(calificacionesFormateadas);

    if (calificacionesFormateadas.length === 0) {
      return handleBadRequestError("No se encontraron calificaciones", res);
    }
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

export {
  getSeminarioActivo,
  rechazarCurso,
  createPeriodo,
  getPeriodos,
  getCursos,
  altaCurso,
  getCursoById,
  getMateriasCurso,
  getDocentes,
  aceptarCurso,
  getAlumnos,
  asignarAlumnos,
  editModulo,
  generarCalificaciones,
};
