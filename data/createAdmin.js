import { Roles } from "../models/Roles.js";
import { Usuarios, Docente } from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";

export async function createAdmin() {
  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await Usuarios.findOne({
      where: { email_usuario: "rosa.aguilar@unach.mx" },
    });
    if (existingUser) {
      console.log(
        "El usuario ya existe en la base de datos. No se realizará ninguna acción."
      );
      return;
    }
    const usuario = await Usuarios.create({
      nombre: "Rosa Isela",
      apellido_p: "Lopez",
      apellido_m: "Aguilar",
      curp: "AULR920123MCHGSL07",
      telefono_usuario: "9620000000",
      email_usuario: "rosa.aguilar@unach.mx",
      password: "root",
      status: "ACTIVO",
    });

    const adminRole = await Roles.findOne({
      where: { nombre_rol: "Administrador" },
    });
    const docenteRole = await Roles.findOne({
      where: { nombre_rol: "Docente" },
    });

    // Asigna los roles al usuario
    await Usuarios_Roles.bulkCreate([
      { usuarioUsuarioId: usuario.usuario_id, roleRolId: adminRole.rol_id },
      { usuarioUsuarioId: usuario.usuario_id, roleRolId: docenteRole.rol_id },
    ]);

    await Docente.create({
      num_plaza: "xxxxx",
      licenciatura: "Licenciatura",
      maestria: "Maestría",
      doctorado: "Doctorado",
      usuario_id: usuario.usuario_id,
    });

    console.log("Usuario creado correctamente.");
    return usuario;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    throw error;
  }
}
