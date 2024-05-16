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
  generateCodEgresado,
} from "../Utils/index.js";

import {Carreras} from "../models/Carreras.js";
import {Cursos} from "../models/Cursos.js";
import {CursoPeriodos} from "../models/Periodo.js";

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.json(usuarios);
  } catch (error) {
    return handleInternalServerError(error, res);
  }
};

const getPreregister = async (req, res) => {
  try {
    const usuarios = await UserPreregister.findAll({
      where: {
        status: true,
      },
      include: [
        {
          model: CursoPeriodos,
          include: [
            {
              model: Cursos,
            },
          ],
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
      password: password,
    };

//Poner curp

    const UserExist = await Usuarios.findOne(
      {
        where: { email_usuario: req.body.email_usuario },
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

  if (req.body.egresado === true) {
    const egresado = {
      cod_egresado: generateCodEgresado(),
      trabajando:  req.body.trabajando,
      especializado: req.body.lugar_trabajo,
      usuario_id: newUsuario.usuario_id
    };
    const newEgresado = await Egresado.create(egresado, { transaction: t });

  } else if (req.body.egresado === false) {
    const alumno = {
      matricula: req.body.id_estudiante,
      usuario_id: newUsuario.usuario_id
    };
    const newAlumno = await Alumno.create(alumno, { transaction: t });
  }
    const { email_usuario } = newUsuario;

    await sendEmailVerification(email_usuario, password);

    const preregisterExist = await UserPreregister.update(
      { status: false },
      {
        where: { email_usuario: req.body.email_usuario },
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
    sendEmailRejection(UserEmail.email_usuario);

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
    // Busca usuarios con el rol de "Alumno", que sabemos tiene el ID 3
    const usuarios = await Usuarios.findAll({
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
      ],
      // where: {
      //   status: "ACTIVO", // Asegurándonos de que el usuario está activo, si es necesario
      // },
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
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  const t = await sequelize.transaction();

  try {
    const matricula = req.body.matricula.toUpperCase();

    const usuarioNuevo = {
      nombre: req.body.nombre,
      apellido_p: req.body.apellido_p,
      apellido_m: req.body.apellido_m,
      telefono_usuario: req.body.telefono_usuario,
      email_usuario: req.body.email_usuario,
      password: req.body.password,
    };

    let UserExist;
    if (req.body.esEgresado) {
      UserExist = await Egresado.findOne(
        {
          where: { cod_egresado: matricula },
        },
        { transaction: t }
      );
    } else {
      UserExist = await Alumno.findOne(
        {
          where: { matricula },
        },
        { transaction: t }
      );
    }

    if (UserExist) {
      await t.rollback();
      return handleNotFoundError(
        "El usuario ya existe, por favor verifícalo",
        res
      );
    }

    const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t });

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

    if (req.body.esEgresado) {
      await Egresado.create(
        {
          cod_egresado: matricula,
          usuario_id: newUsuario.usuario_id,
        },
        { transaction: t }
      );
    } else {
      await Alumno.create(
        {
          matricula,
          usuario_id: newUsuario.usuario_id,
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
    console.error("Error al crear usuario:", error);
    return handleInternalServerError(error, res);
  }
};
const updateAlumnos = async (req, res) => {
  const { id } = req.params;
  const {
    usuario_id,
    matricula,
    nombre,
    apellido_p,
    apellido_m,
    telefono_usuario,
    email_usuario,
    password,
    esEgresado,
  } = req.body;

  const t = await sequelize.transaction();

  try {
    // Actualiza la información del usuario en la tabla Usuarios
    await Usuarios.update(
      {
        nombre,
        apellido_p,
        apellido_m,
        telefono_usuario,
        email_usuario,
        password,
      },
      { where: { usuario_id: id }, transaction: t }
    );

    // Determina en qué tabla hacer la actualización según el tipo de usuario
    if (req.body.esEgresado) {
      // Es un egresado, entonces actualiza en la tabla Egresado
      await Egresado.update(
        {
          cod_egresado: matricula,
        },
        { where: { usuario_id: id }, transaction: t }
      );
    } else {
      // No es egresado, entonces actualiza en la tabla Alumno
      await Alumno.update(
        {
          matricula,
        },
        { where: { usuario_id: id }, transaction: t }
      );
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
    console.error("Error al obtener alumnos:", error);
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
      telefono_usuario: req.body.telefono_usuario,
      email_usuario: req.body.email_usuario,
      password: req.body.password,
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
};
