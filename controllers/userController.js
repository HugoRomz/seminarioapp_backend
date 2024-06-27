import {
  Usuarios,
  Alumno,
  UserPreregister,
  Docente,
  Egresado,
} from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { Roles } from "../models/Roles.js";
import {
  sendEmailRejection,
  sendEmailVerification,
} from "../emails/authEmailService.js";
import { sequelize } from "../config/db.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  separarApellidos,
  generatePassword,
} from "../Utils/index.js";

import { Carreras } from "../models/Carreras.js";
import { Cursos } from "../models/Cursos.js";
import { Periodos, CursoPeriodos } from "../models/Periodo.js";
import {
  DetallesDocumentosAlumno,
  DocumentosAlumnoEstado,
} from "../models/Documentos.js";

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.json(usuarios);
  } catch (error) {
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

const getPreregister = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarios = await UserPreregister.findAll({
      include: [
        {
          model: CursoPeriodos,
          include: [
            {
              model: Cursos,
            },
          ],
          where: {
            periodo_id: id,
          },
        },
      ],
    });

    // Mapeamos los usuarios para agregar el nombre de la carrera
    const usuariosConCarrera = await Promise.all(
      usuarios.map(async (usuario) => {
        // Aquí obtenemos el nombre de la carrera basado en el ID de carrera almacenado en el usuario
        const carrera = await Carreras.findOne({
          where: {
            carrera_id: usuario.carrera,
          },
          attributes: ["nombre_carrera"], // Seleccionamos solo el nombre de la carrera
        });
        // Creamos un nuevo objeto con la información del usuario y el nombre de la carrera
        return {
          ...usuario.toJSON(),
          nombre_carrera: carrera ? carrera.nombre_carrera : null, // Agregamos el nombre de la carrera al objeto del usuario
        };
      })
    );

    res.json(usuariosConCarrera);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getUsuariosById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuarios.findByPk(id);

    if (!usuario) {
      return handleNotFoundError("El Usuario no existe", res);
    }

    res.json(usuario);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const aceptarUsuario = async (req, res) => {
  const curso_id = req.body.cursos_periodo.curso_id;
  let det_doc_alumno = [];

  const t = await sequelize.transaction();

  try {
    const { apellidoPaterno, apellidoMaterno } = separarApellidos(
      req.body.apellidos
    );

    const password = generatePassword();
    const usuarioNuevo = {
      nombre: req.body.nombres,
      apellido_p: apellidoPaterno,
      apellido_m: apellidoMaterno,
      telefono_usuario: req.body.telefono,
      email_usuario: req.body.email_usuario,
      curp: req.body.curp,
      password: password,
      status: "PENDIENTE",
      cursos_periodo_id: req.body.cursos_periodo.periodo_id,
    };
    const UserExist = await Usuarios.findOne(
      {
        where: { curp: req.body.curp },
      },
      { transaction: t }
    );
    if (UserExist) {
      await t.rollback();
      return handleNotFoundError(
        "El usuario ya existe, por favor verifícalo",
        res
      );
    }
    const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t });

    const preregisterExist = await UserPreregister.update(
      { status: false },
      {
        where: { curp: req.body.curp },
        transaction: t,
      }
    );
    if (!preregisterExist) {
      await t.rollback();
      return handleNotFoundError(
        "Preregistro no encontrado con la matricula proporcionada",
        res
      );
    }
    const rolAlumno = await Roles.findOne(
      {
        where: { nombre_rol: "Alumno" },
      },
      { transaction: t }
    );
    if (!rolAlumno) {
      await t.rollback();
      throw new Error("Rol 'Alumno' no encontrado");
    }
    await Usuarios_Roles.create(
      {
        usuarioUsuarioId: newUsuario.usuario_id,
        roleRolId: rolAlumno.rol_id,
      },
      { transaction: t }
    );

    if (req.body.egresado === true) {
      det_doc_alumno = await DetallesDocumentosAlumno.findAll(
        {
          where: {
            curso_id: curso_id,
            egresado: true,
          },
        },
        { transaction: t }
      );
    } else if (req.body.egresado === false) {
      det_doc_alumno = await DetallesDocumentosAlumno.findAll(
        {
          where: {
            curso_id: curso_id,
            egresado: false,
          },
        },
        { transaction: t }
      );
    }
    //necesito guardar los documentos que se le asignaron al alumno
    const documentos = det_doc_alumno.map((doc) => {
      return {
        det_alumno_id: doc.det_alumno_id,
        usuario_id: newUsuario.usuario_id,
        status: "PENDIENTE",
        comentarios: "",
        url_file: "",
      };
    });

    await DocumentosAlumnoEstado.bulkCreate(documentos, { transaction: t });

    const { email_usuario, nombre, apellido_p, apellido_m } = newUsuario;
    await sendEmailVerification(
      email_usuario,
      password,
      nombre,
      apellido_p,
      apellido_m
    );

    await t.commit();
    res.json({
      msg: "El Usuario se creó correctamente",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error al aceptar usuario:", error);
    return handleInternalServerError(error, res);
  }
};

const rechazarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const UserEmail = await UserPreregister.findOne({
      where: { id: id },
    });

    console.log(UserEmail);
    sendEmailRejection(
      UserEmail.email_usuario,
      UserEmail.nombres,
      UserEmail.apellidos
    );

    await UserPreregister.destroy({
      where: {
        id: id,
      },
    });

    res.json({
      msg: "El registro se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const createUsuarios = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  try {
    const {
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
      password,
    } = req.body;

    const newUsuario = await Usuarios.create({
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
      password,
    });

    res.json({
      msg: "El Usuario se creo correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const updateUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      usuario_id,
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
    } = req.body;

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      return handleNotFoundError("El Usuario no existe", res);
    }
    usuario.usuario_id = usuario_id;
    usuario.nombre = nombre;
    usuario.apellido_p = apellido_p;
    usuario.apellido_m = apellido_m;
    usuario.telefono_usuario = telefono_usuario;
    usuario.email_usuario = email_usuario;

    await usuario.save();

    res.json(usuario);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const deleteUsuarios = async (req, res) => {
  try {
    const { id } = req.params;

    await Usuarios.destroy({
      where: {
        usuario_id: id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getAlumnos = async (req, res) => {
  try {
    const { id } = req.params;
    // Busca usuarios con el rol de "Alumno", que sabemos tiene el ID 3
    const usuarios = await Usuarios.findAll({
      attributes: { exclude: ['token'] },
      include: [
        {
          model: Roles,
          where: { nombre_rol: "Alumno" },
          through: { attributes: [] },
        },
        {
          model: Alumno,
          required: false,
        },
        {
          model: Egresado,
          required: false,
        },
        {
          model: CursoPeriodos,
          include: [
            {
              model: Cursos,
            },
          ],
          where: {
            periodo_id: id,
          },
        },
      ],
      where: {
        status: "ACTIVO",
      },
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const deleteAlumnos = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminar usuario de la tabla Usuarios
    await Usuarios.update(
      {
        status: "DESACTIVADO",
      },
      { where: { usuario_id: id } }
    );
    // // Eliminar alumno asociado en la tabla Alumno
    // await Alumno.destroy({
    //   where: {
    //     usuario_id: usuario_id.id,
    //   },
    // });
    // // Eliminar las relaciones de roles asociadas al usuario
    // await Usuarios_Roles.destroy({
    //   where: {
    //     usuarioUsuarioId: usuario_id.id,
    //   },
    // });

    res.json({
      msg: "El Usuario se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const insertarAlumnos = async (req, res) => {
  return handleNotFoundError("Función no implementada", res);
  // if (Object.values(req.body).includes("")) {
  //   return handleNotFoundError("Algunos campos están vacíos", res);
  // }

  // const t = await sequelize.transaction();
  // let det_doc_alumno = [];

  // try {
  //   // generar contraseña
  //   // Crear nuevo usuario
  //   const usuarioNuevo = {
  //     nombre: req.body.nombre,
  //     apellido_p: req.body.apellido_p,
  //     apellido_m: req.body.apellido_m,
  //     telefono_usuario: req.body.telefono_usuario,
  //     email_usuario: req.body.email_usuario,
  //     curp: req.body.curp,
  //     password: req.body.password,
  //     status: "PENDIENTE",
  //   };

  //   // Verificar si el usuario ya existe
  //   const UserExist = await Usuarios.findOne(
  //     {
  //       where: { curp: req.body.curp },
  //     },
  //     { transaction: t }
  //   );

  //   if (UserExist) {
  //     await t.rollback();
  //     return handleNotFoundError(
  //       "El usuario ya existe, por favor verifícalo",
  //       res
  //     );
  //   }

  //   // Crear nuevo usuario en la base de datos
  //   const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t });

  //   // // Enviar correo de verificación
  //   // const { email_usuario } = newUsuario;
  //   // await sendEmailVerification(email_usuario, password);

  //   // Asignar rol de Alumno
  //   const rolAlumno = await Roles.findOne(
  //     {
  //       where: { nombre_rol: "Alumno" },
  //     },
  //     { transaction: t }
  //   );

  //   if (!rolAlumno) {
  //     await t.rollback();
  //     throw new Error("Rol 'Alumno' no encontrado");
  //   }

  //   await Usuarios_Roles.create(
  //     {
  //       usuarioUsuarioId: newUsuario.usuario_id,
  //       roleRolId: rolAlumno.rol_id,
  //     },
  //     { transaction: t }
  //   );

  //   // Obtener documentos según si es egresado o no
  //   if (req.body.esEgresado) {
  //     det_doc_alumno = await DetallesDocumentosAlumno.findAll(
  //       {
  //         where: {
  //           curso_id: req.body.curso_id,
  //           egresado: true,
  //         },
  //       },
  //       { transaction: t }
  //     );
  //   } else {
  //     det_doc_alumno = await DetallesDocumentosAlumno.findAll(
  //       {
  //         where: {
  //           curso_id: req.body.curso_id,
  //           egresado: false,
  //         },
  //       },
  //       { transaction: t }
  //     );
  //   }

  //   // Asignar documentos al alumno
  //   const documentos = det_doc_alumno.map((doc) => {
  //     return {
  //       det_alumno_id: doc.det_alumno_id,
  //       usuario_id: newUsuario.usuario_id,
  //       status: "PENDIENTE",
  //       comentarios: "",
  //       url_file: "",
  //     };
  //   });

  //   await DocumentosAlumnoEstado.bulkCreate(documentos, { transaction: t });

  //   // Confirmar la transacción
  //   await t.commit();
  //   res.json({
  //     msg: "El Usuario se creó correctamente",
  //   });
  // } catch (error) {
  //   await t.rollback();
  //   console.error("Error al crear usuario:", error);
  //   return handleInternalServerError(error, res);
  // }
};
const updateAlumnos = async (req, res) => {
  const { id } = req.params;
  const {
    usuario_id,
    curp,
    nombre,
    apellido_p,
    apellido_m,
    telefono_usuario,
    email_usuario,
    password,
    esEgresado,
  } = req.body;

  let matricula = "";

  if (req.body.alumno) {
    matricula = req.body.alumno.matricula;
  } else if (req.body.egresado) {
    matricula = req.body.egresado.cod_egresado;
  }

  const t = await sequelize.transaction();

  try {
    const usuario = await Usuarios.findByPk(id);
    usuario.nombre = nombre;
    usuario.apellido_p = apellido_p;
    usuario.apellido_m = apellido_m;
    usuario.curp = curp;
    usuario.telefono_usuario = telefono_usuario;
    usuario.email_usuario = email_usuario;
    usuario.password = password;
    await usuario.save({ transaction: t });

    if (req.body.esEgresado) {
      const egresado = await Egresado.findOne({ where: { usuario_id: id } });
      egresado.cod_egresado = matricula;
      await egresado.save({ transaction: t });
    } else {
      // No es egresado, entonces actualiza en la tabla Alumno
      const alumno = await Alumno.findOne({ where: { usuario_id: id } });
      alumno.matricula = matricula;
      await alumno.save({ transaction: t });
    }

    await t.commit();

    res.json({
      msg: "El Usuario se editó correctamente",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar el Usuario:", error);
    return res.status(500).json({
      error: "Ocurrió un error al actualizar el Usuario",
    });
  }
};

const getDocentes = async (req, res) => {
  try {
    // Busca usuarios con el rol de "Docente", que sabemos tiene el ID 3
    const usuarios = await Usuarios.findAll({
      include: [
        {
          model: Roles,
          where: { nombre_rol: "Docente" },
          through: { attributes: [] },
        },
        {
          model: Docente,
        },
      ],
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const deleteDocentes = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminar usuario de la tabla Usuarios
    await Usuarios.update(
      {
        status: "DESACTIVADO",
      },
      { where: { usuario_id: id } }
    );
    // // Eliminar alumno asociado en la tabla Alumno
    // await Docente.destroy({
    //   where: {
    //     usuario_id: usuario_id.id,
    //   },
    // });
    // // Eliminar las relaciones de roles asociadas al usuario
    // await Usuarios_Roles.destroy({
    //   where: {
    //     usuarioUsuarioId: usuario_id.id,
    //   },
    // });

    res.json({
      msg: "El Usuario se elimino correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const insertarDocentes = async (req, res) => {
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  const t = await sequelize.transaction();

  try {
    const num_plaza = req.body.num_plaza.toUpperCase();
    console.log(num_plaza);

    const usuarioNuevo = {
      nombre: req.body.nombre,
      apellido_p: req.body.apellido_p,
      apellido_m: req.body.apellido_m,
      curp: req.body.curp,
      telefono_usuario: req.body.telefono_usuario,
      email_usuario: req.body.email_usuario,
      password: req.body.password,
      status: "PENDIENTE",
    };

    const UserExist = await Docente.findOne(
      {
        where: { num_plaza },
      },
      { transaction: t }
    );

    if (UserExist) {
      await t.rollback();
      return handleNotFoundError(
        "El usuario ya existe, por favor verifícalo",
        res
      );
    }

    const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t });

    const rolDocente = await Roles.findOne(
      {
        where: { nombre_rol: "Docente" },
      },
      { transaction: t }
    );

    if (!rolDocente) {
      await t.rollback();
      throw new Error("Rol 'Alumno' no encontrado");
    }

    await Usuarios_Roles.create(
      {
        usuarioUsuarioId: newUsuario.usuario_id,
        roleRolId: rolDocente.rol_id,
      },
      { transaction: t }
    );

    await t.commit();

    await Docente.create({
      num_plaza,
      usuario_id: newUsuario.usuario_id,
    });

    res.json({
      msg: "El Usuario se creó correctamente",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error al aceptar usuario:", error);
    return handleInternalServerError(error, res);
  }
};
const updateDocentes = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      usuario_id,
      num_plaza,
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
      password,
    } = req.body;

    // Actualiza la información del usuario en la tabla Usuarios
    await Usuarios.update(
      {
        usuario_id,
        nombre,
        apellido_p,
        apellido_m,
        telefono_usuario,
        email_usuario,
        password,
      },
      { where: { usuario_id: id }, individualHooks: true }
    );

    // Actualiza la información del alumno en la tabla Alumno
    await Docente.update(
      {
        num_plaza,
      },
      { where: { usuario_id: id } }
    );

    res.json({
      msg: "El Usuario se editó correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar el Usuario:", error);
    return res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar el Usuario" });
  }
};

export {
  getUsuarios,
  getPreregister,
  getUsuariosById,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios,
  aceptarUsuario,
  rechazarUsuario,
  getAlumnos,
  deleteAlumnos,
  insertarAlumnos,
  updateAlumnos,
  getDocentes,
  deleteDocentes,
  insertarDocentes,
  updateDocentes,
  getPeriodos,
};
