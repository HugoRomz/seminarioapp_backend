import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { Cursos, DetalleCurso } from "../models/Cursos.js";
import {
  Documentos,
  DetallesDocumentosAlumno,
  DetallesDocumentosDocente,
} from "../models/Documentos.js";

import { TipoEvidencias } from "../models/Evidencias.js";

import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
  handleBadRequestError,
  generatePassword,
} from "../Utils/index.js";
import { CursoPeriodos, Periodos } from "../models/Periodo.js";
import { Roles } from "../models/Roles.js";
import { Usuarios } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { sequelize } from "../config/db.js";

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
    const { nombre_materia, descripcion, creditos } = req.body;

    const newMateria = await Materias.create({
      nombre_materia,
      descripcion,
      creditos,
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

const getRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll();

    if (roles && roles.length > 0) {
      res.json(roles);
    } else {
      console.log("No hay roles asignadas");
      res.status(404).json({ error: "No se encontró ningúna materia activa" });
    }
  } catch (error) {
    console.error("Error al buscar roles:", error);
    return res.status(500).json({ error: "Ocurrió un error al buscar roles" });
  }
};

const insertarRol = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_rol } = req.body;

    const newMateria = await Roles.create({
      nombre_rol,
    });

    res.json({
      msg: "El rol se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError("Error al crear el Rol", res);
  }
};

const updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_rol } = req.body;

    await Roles.update(
      {
        nombre_rol,
      },
      { where: { rol_id: id }, individualHooks: true }
    );

    res.json({
      msg: "El rol se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    return handleInternalServerError("Error al editar rol", res);
  }
};

const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;

    await Roles.destroy({
      where: {
        rol_id: id,
      },
    });
    res.json({
      msg: "El rol se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError("Error al eliminar el Rol", res);
  }
};

const getPeriodos = async (req, res) => {
  try {
    const periodos = await Periodos.findAll();

    if (periodos && periodos.length > 0) {
      res.json(periodos);
    } else {
      res.status(404).json({ error: "No se encontró ningúna materia activa" });
    }
  } catch (error) {
    console.error("Error al buscar periodos:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar periodos" });
  }
};

const insertarPeriodo = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.body;

    console.log(fecha_inicio, fecha_fin);
    console.log(req.body);

    if (!fecha_inicio || !fecha_fin) {
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

    const fechaInicioFormateada = obtenerMesAño(fecha_inicio);
    const fechaCierreFormateada = obtenerMesAño(fecha_fin);

    const descripcion = `${fechaInicioFormateada.mes} - ${fechaCierreFormateada.mes} ${fechaInicioFormateada.año}`;

    const newPeriodo = await Periodos.create({
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
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

const updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin } = req.body;

    if (!fecha_inicio || !fecha_fin) {
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

    const fechaInicioFormateada = obtenerMesAño(fecha_inicio);
    const fechaCierreFormateada = obtenerMesAño(fecha_fin);

    const descripcion = `${fechaInicioFormateada.mes} - ${fechaCierreFormateada.mes} ${fechaInicioFormateada.año}`;

    await Periodos.update(
      {
        fecha_inicio,
        fecha_fin,
        descripcion,
        status: true,
      },
      { where: { periodo_id: id }, individualHooks: true }
    );

    res.json({
      msg: `El periodo ${descripcion} se editó correctamente`,
    });
  } catch (error) {
    console.error("Error al actualizar el periodo:", error);
    return handleInternalServerError("Error al editar periodo", res);
  }
};

const deletePeriodo = async (req, res) => {
  try {
    const { id } = req.params;

    await Periodos.destroy({
      where: {
        periodo_id: id,
      },
    });
    res.json({
      msg: "El período se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError("Error al eliminar el período", res);
  }
};

const getCursos = async (req, res) => {
  try {
    const cursos = await Cursos.findAll({
      include: [
        {
          model: DetalleCurso,
          include: [Materias],
        },
        Carreras,
        {
          model: CursoPeriodos,
          include: [
            {
              model: Periodos,
              where: {
                status: true,
              },
            },
          ],
        },
        { model: DetallesDocumentosAlumno, include: [Documentos] },
        { model: DetallesDocumentosDocente, include: [Documentos] },
      ],
    });

    if (cursos && cursos.length > 0) {
      res.json(cursos);
    } else {
      console.log("No hay cursos creados");
      res.status(404).json({ error: "No se encontró ningún curso activo" });
    }
  } catch (error) {
    console.error("Error al buscar cursos:", error);
    return res.status(500).json({ error: "Ocurrió un error al buscar cursos" });
  }
};
const insertarCursos = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_curso, materias } = req.body;
    const { carrera_id } = req.body.carrera;

    const newCurso = await Cursos.create({
      nombre_curso,
      carrera_id,
    });
    materias.forEach(async (materia) => {
      await DetalleCurso.create({
        curso_id: newCurso.curso_id,
        materia_id: materia.materia_id,
      });
    });

    res.json({
      msg: "El curso se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateCursos = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_curso } = req.body;

    const { carrera_id } = req.body.carrera;

    // Actualiza la información del usuario en la tabla Usuarios
    await Cursos.update(
      {
        nombre_curso,
        carrera_id,
      },
      { where: { curso_id: id }, individualHooks: true }
    );

    // await DetalleCurso.destroy({
    //   where: {
    //     curso_id: id,
    //   },
    // });

    // materias.forEach(async (materia) => {
    //   await DetalleCurso.create({
    //     curso_id: id,
    //     materia_id: materia,
    //   });
    // });

    res.json({
      msg: "El curso se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar el curso" });
  }
};

const findDocumentos = async (req, res) => {
  try {
    const documentos = await Documentos.findAll();
    if (documentos && documentos.length > 0) {
      res.json(documentos);
    } else {
      console.log("No hay documentos ");
      res
        .status(404)
        .json({ error: "No se encontró ningúna documento activo" });
    }
  } catch (error) {
    console.error("Error al buscar documentos:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar documentos" });
  }
};

const insertarDocumento = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_documento } = req.body;
    const destinatario = req.body.destinatario[0].code;

    console.log(req.body);
    console.log(destinatario);

    const newDocumento = await Documentos.create({
      nombre_documento,
      destinatario,
    });

    res.json({
      msg: "El documento se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError("Error al crear el documento", res);
  }
};

const updateDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_documento } = req.body;
    const destinatario = req.body.destinatario[0].code;

    await Documentos.update(
      {
        nombre_documento,
        destinatario,
      },
      { where: { documento_id: id }, individualHooks: true }
    );

    res.json({
      msg: "El documento se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    return handleInternalServerError("Error al editar documento", res);
  }
};

const deleteDocumento = async (req, res) => {
  try {
    const { id } = req.params;

    await Documentos.destroy({
      where: {
        documento_id: id,
      },
    });
    res.json({
      msg: "El documento se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError("Error al eliminar el documento", res);
  }
};

const asignarDocumentos = async (req, res) => {
  try {
    const datos = req.body;
    let detallesAlumnos = [];
    let detallesDocentes = [];

    for (const dato of datos) {
      if (dato.tipo === "Alumno" || dato.tipo === "Egresado") {
        dato.documento_id.forEach((documento_id) => {
          detallesAlumnos.push({
            documento_id: documento_id.documento_id,
            curso_id: dato.curso_id,
            egresado: dato.tipo === "Egresado", // true si es egresado, false si es alumno
          });
        });
      } else if (dato.tipo === "Docente") {
        dato.documento_id.forEach((documento_id) => {
          detallesDocentes.push({
            documento_id: documento_id.documento_id,
            curso_id: dato.curso_id,
          });
        });
      }
    }

    if (detallesAlumnos.length > 0) {
      await DetallesDocumentosAlumno.bulkCreate(detallesAlumnos);
    }

    if (detallesDocentes.length > 0) {
      await DetallesDocumentosDocente.bulkCreate(detallesDocentes);
    }

    res.json({
      msg: "Los documentos se asignaron correctamente",
    });
  } catch (error) {
    console.error("Error al asignar documentos:", error);
    res.status(500).json({ error: "Ocurrió un error al asignar documentos" });
  }
};

const getTipoEvidencias = async (req, res) => {
  try {
    const tipoEvidencias = await TipoEvidencias.findAll();

    if (tipoEvidencias && tipoEvidencias.length > 0) {
      res.json(tipoEvidencias);
    } else {
      console.log("No hay tipoEvidencias asignadas");
      res.status(404).json({ error: "No se encontró ningúna materia activa" });
    }
  } catch (error) {
    console.error("Error al buscar tipoEvidencias:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar tipoEvidencias" });
  }
};

const insertarTipoEvidencia = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const { nombre_tipo_ev, descripcion } = req.body;

    const newTipoEvidencia = await TipoEvidencias.create({
      nombre_tipo_ev,
      descripcion,
    });

    res.json({
      msg: "El tipo de evidencia se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(
      "Error al crear el tipo de evidencia",
      res
    );
  }
};

const updateTipoEvidencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_tipo_ev, descripcion } = req.body;

    await TipoEvidencias.update(
      {
        nombre_tipo_ev,
        descripcion,
      },
      { where: { tipo_evidencia_id: id }, individualHooks: true }
    );

    res.json({
      msg: "El tipo de evidencia se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar el tipo de evidencia:", error);
    return handleInternalServerError("Error al editar tipo de evidencia", res);
  }
};

const deleteTipoEvidencia = async (req, res) => {
  try {
    const { id } = req.params;

    await TipoEvidencias.destroy({
      where: {
        tipo_evidencia_id: id,
      },
    });
    res.json({
      msg: "El tipo de evidencia se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(
      "Error al eliminar el tipo de evidencia",
      res
    );
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      attributes: { exclude: ["password", "token"] },
      include: [Roles],
    });

    if (usuarios && usuarios.length > 0) {
      res.json(usuarios);
    } else {
      console.log("No hay usuarios asignadas");
      res.status(404).json({ error: "No se encontró ningúna materia activa" });
    }
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al buscar usuarios" });
  }
};

const insertarUsuario = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  const t = await sequelize.transaction();

  try {
    const password = generatePassword();

    const usuarioNuevo = {
      nombre: req.body.nombre,
      apellido_p: req.body.apellido_p,
      apellido_m: req.body.apellido_m,
      telefono_usuario: req.body.telefono_usuario,
      email_usuario: req.body.email_usuario,
      curp: req.body.curp,
      password: password,
      status: "ACTIVO",
    };

    const UserExist = await Usuarios.findOne({
      where: { curp: req.body.curp },
      transaction: t,
    });

    if (UserExist) {
      await t.rollback();
      return handleNotFoundError("Ya existe un usuario con la misma CURP", res);
    }

    const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t });

    const roles = req.body.roles;

    for (let i = 0; i < roles.length; i++) {
      await Usuarios_Roles.create(
        {
          usuarioUsuarioId: newUsuario.usuario_id,
          roleRolId: roles[i],
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.json({
      msg: "El Usuario se creó correctamente",
    });
  } catch (error) {
    await t.rollback();
    return handleInternalServerError("Error al crear el usuario", res);
  }
};
const updateUsuario = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
      curp,
      roles,
      password,
      status,
    } = req.body;

    const usuario = await Usuarios.findByPk(id);

    if (!usuario) {
      await t.rollback();
      return handleNotFoundError("El usuario no existe", res);
    }

    if (curp !== usuario.curp) {
      const existingUserWithCurp = await Usuarios.findOne({
        where: { curp },
      });

      if (existingUserWithCurp) {
        await t.rollback();
        return res.status(400).json({
          msg: "La CURP ya está registrada por otro usuario",
        });
      }
    }

    usuario.nombre = nombre;
    usuario.apellido_p = apellido_p;
    usuario.apellido_m = apellido_m;
    usuario.telefono_usuario = telefono_usuario;
    usuario.email_usuario = email_usuario;
    usuario.curp = curp;
    usuario.status = status;

    if (password) {
      usuario.password = password;
    }
    await usuario.save({ transaction: t });

    // Obtener roles actuales del usuario
    const currentRoles = await Usuarios_Roles.findAll({
      where: { usuarioUsuarioId: id },
      transaction: t,
    });

    const currentRoleIds = currentRoles.map((role) => role.roleRolId);
    const newRoleIds = roles;

    // Comparar los roles actuales con los nuevos roles
    const rolesChanged =
      currentRoleIds.length !== newRoleIds.length ||
      !currentRoleIds.every((roleId) => newRoleIds.includes(roleId));

    if (rolesChanged) {
      console.log("Roles cambiados");
      await Usuarios_Roles.destroy({
        where: { usuarioUsuarioId: id },
        transaction: t,
      });

      for (let i = 0; i < roles.length; i++) {
        await Usuarios_Roles.create(
          {
            usuarioUsuarioId: id,
            roleRolId: roles[i],
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    res.json({
      msg: "El Usuario se editó correctamente",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar el usuario:", error);
    return handleInternalServerError("Error al editar usuario", res);
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await Usuarios.update(
      {
        status: "INACTIVO",
      },
      { where: { usuario_id: id }, individualHooks: true }
    );

    res.json({
      msg: "El usuario se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(
      "Error al eliminar el tipo de evidencia",
      res
    );
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
  getRoles,
  insertarRol,
  updateRol,
  deleteRol,
  getPeriodos,
  insertarPeriodo,
  updatePeriodo,
  deletePeriodo,
  getCursos,
  insertarCursos,
  updateCursos,
  findDocumentos,
  insertarDocumento,
  updateDocumento,
  deleteDocumento,
  asignarDocumentos,
  getTipoEvidencias,
  insertarTipoEvidencia,
  updateTipoEvidencia,
  deleteTipoEvidencia,
  getUsuarios,
  insertarUsuario,
  updateUsuario,
  deleteUsuario,
};
