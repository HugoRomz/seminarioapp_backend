import { Usuarios, UserPreregister } from "../models/Usuarios.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  generateJWT,
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
    const usuarios = await UserPreregister.findAll();
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




export {
  getUsuarios,
  getPreregister,
  getUsuariosById,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios
};