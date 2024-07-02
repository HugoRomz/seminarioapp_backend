import { Roles } from "../models/Roles.js";
import { Usuarios, Docente } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";

export async function createAdmin() {
  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await Usuarios.findOne({
      where: { email_usuario: "admin@unach.mx" },
    });
    if (existingUser) {
      console.log(
        "El usuario ya existe en la base de datos. No se realizará ninguna acción."
      );
      return;
    }
    const usuario = await Usuarios.create({
      nombre: "Admin",
      apellido_p: "is",
      apellido_m: "trador",
      curp: "NULL",
      telefono_usuario: "0000000000",
      email_usuario: "admin@unach.mx",
      password: "root",
      status: "ACTIVO",
    });

    const adminRole = await Roles.findOne({
      where: { nombre_rol: "Administrador" },
    });

    // Asigna los roles al usuario
    await Usuarios_Roles.bulkCreate([
      { usuarioUsuarioId: usuario.usuario_id, roleRolId: adminRole.rol_id },
    ]);

    console.log("Usuario Admin creado correctamente.");
    return usuario;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}
