import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js"
import { Roles } from "../models/Roles.js"
import { sendEmailRejection, sendEmailVerification } from "../emails/authEmailService.js";
import { sequelize } from "../config/db.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  separarApellidos,
  generatePassword
} from "../Utils/index.js";

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
        status: true
      }
    });
    res.json(usuarios);
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
  if (Object.values(req.body).includes("")) {
    return handleNotFoundError("Algunos campos están vacíos", res);
  }

  const t = await sequelize.transaction();

  try {
    const { apellidoPaterno, apellidoMaterno } = separarApellidos(req.body.apellidos);
    const password = generatePassword(req.body.matricula);
    const usuario_id = req.body.matricula.toUpperCase();

    const usuarioNuevo = {
      usuario_id: usuario_id,
      nombre: req.body.nombres, 
      apellido_p: apellidoPaterno,
      apellido_m: apellidoMaterno,
      telefono_usuario: null,
      email_usuario: req.body.email_usuario,
      password: password
    };

    const UserExist = await Usuarios.findOne({
      where: { usuario_id },
    }, { transaction: t });

    if (UserExist) {
      await t.rollback();
      return handleNotFoundError(
        "El usuario ya existe, por favor verifícalo",
        res
      );
    }

    const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t }); 
    const { email_usuario } = newUsuario;

    await sendEmailVerification(email_usuario, password);

    const preregisterExist =  await UserPreregister.update({ status: false }, {
      where: { matricula: usuario_id },
      transaction: t
    });

   
    
    if (!preregisterExist) {
      await t.rollback();
      return handleNotFoundError(
        "Preregistro no encontrado con la matricula proporcionada",
        res
      );
    }


    const rolAlumno = await Roles.findOne({
      where: { nombre_rol: 'Alumno' } 
    }, { transaction: t });

    if (!rolAlumno) {
      await t.rollback();
      throw new Error("Rol 'Alumno' no encontrado");
    }

    await Usuarios_Roles.create({
      usuarioUsuarioId: newUsuario.usuario_id, 
      roleRolId: rolAlumno.rol_id
    }, { transaction: t });
    
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
      where: { id:id },
    });

    console.log(UserEmail);
    sendEmailRejection(UserEmail.email_usuario)

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
      usuario_id,
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
      password,
    } = req.body;

    const UserExist = await Usuarios.findOne({
      where: { usuario_id },
    });
    if (UserExist) {
      return handleNotFoundError(
        "El usuario ya esta existe, verificalo porfavor",
        res
      );
    }

    const newUsuario = await Usuarios.create({
      usuario_id,
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
      include: [{
        model: Roles,
        where: { rol_id: 3 }, // Utiliza el ID del rol directamente
        through: { attributes: [] } // No incluir atributos de la tabla intermedia
      }],
      where: {
        status: 'ACTIVO' // Asegurándonos de que el usuario está activo, si es necesario
      }
    });
    
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const deleteAlumnos = async (req, res) => {
  try {
    const { id } = req.params;

    await Usuarios.destroy({
      where: {
        usuario_id: id,
      },
    });
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

  console.log(req.body);
  const t = await sequelize.transaction();

  try {
    const usuario_id = req.body.usuario_id.toUpperCase();

    const usuarioNuevo = {
      usuario_id: usuario_id,
      nombre: req.body.nombre, 
      apellido_p: req.body.apellido_p,
      apellido_m: req.body.apellido_m,
      telefono_usuario: req.body.telefono_usuario,
      email_usuario: req.body.email_usuario,
      password: req.body.password
    };

    const UserExist = await Usuarios.findOne({
      where: { usuario_id },
    }, { transaction: t });

    if (UserExist) {
      await t.rollback();
      return handleNotFoundError(
        "El usuario ya existe, por favor verifícalo",
        res
      );
    }

    const newUsuario = await Usuarios.create(usuarioNuevo, { transaction: t }); 
 
    const rolAlumno = await Roles.findOne({
      where: { nombre_rol: 'Alumno' } 
    }, { transaction: t });

    if (!rolAlumno) {
      await t.rollback();
      throw new Error("Rol 'Alumno' no encontrado");
    }

    await Usuarios_Roles.create({
      usuarioUsuarioId: newUsuario.usuario_id, 
      roleRolId: rolAlumno.rol_id
    }, { transaction: t });
    
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

const updateAlumnos = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      usuario_id,
      nombre,
      apellido_p,
      apellido_m,
      telefono_usuario,
      email_usuario,
      password
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
    usuario.password = password

    await usuario.save();

    res.json({
      msg: "El Usuario se editó correctamente",
    });
  } catch (error) {
    return handleInternalServerError(error, res);
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
  updateAlumnos
};