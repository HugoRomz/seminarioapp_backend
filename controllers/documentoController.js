import {
  Usuarios,
  Alumno,
  Egresado,
  UserPreregister,
  Docente,
} from "../models/Usuarios.js";
import { Usuarios_Roles } from "../models/Usuarios_Roles.js";
import { Roles } from "../models/Roles.js";
import { Cursos } from "../models/Cursos.js";
import { Periodos, CursoPeriodos } from "../models/Periodo.js";
import {
  sendEmailComentariosDoc,
  sendEmailAceptado,
} from "../emails/authEmailService.js";
import {
  DocumentosAlumnoEstado,
  Documentos,
  DetallesDocumentosAlumno,
  DocumentosDocenteEstado,
  DetallesDocumentosDocente,
} from "../models/Documentos.js";
import {
  handleNotFoundError,
  handleInternalServerError,
  separarApellidos,
  generatePassword,
} from "../Utils/index.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary.js";

const user = async (req, res) => {
  const { user } = req;
  res.json(user);
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

const getAlumnos = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarios = await Usuarios.findAll({
      attributes: { exclude: ["token", "password"] },
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
        {
          model: DocumentosAlumnoEstado,
          required: false,
          include: [
            {
              model: DetallesDocumentosAlumno,
              include: [
                {
                  model: Documentos,
                  attributes: ["nombre_documento"], // Only include document name
                },
              ],
            },
          ],
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

const getDocentes = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      include: [
        {
          model: Roles,
          where: { nombre_rol: "Docente" },
          through: { attributes: [] },
        },
        {
          model: Docente,
          required: false,
        },
        {
          model: DocumentosDocenteEstado,
          required: false,
          include: [
            {
              model: DetallesDocumentosDocente,
              include: [
                {
                  model: Documentos,
                  attributes: ["nombre_documento"], // Only include document name
                },
              ],
            },
          ],
        },
      ],
      // Uncomment and modify the following line if you want to filter active users only
      // where: {
      //   status: "ACTIVO",
      // },
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener docentes:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const getCursoDocumentos = async (req, res) => {
  const { id } = req.params;
  try {
    const documentos = await DocumentosAlumnoEstado.findAll({
      where: { usuario_id: id },
      include: [
        {
          model: DetallesDocumentosAlumno,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"],
            },
          ],
        },
      ],
    });

    res.json(documentos);
  } catch (error) {
    console.error("Error al obtener documentos del curso:", error);
    res.status(500).send("Error interno del servidor");
  }
};
const subirDocumentos = async (req, res) => {
  try {
    // Accede al archivo subido por Multer desde req.file
    const file = req.file;

    // Asegúrate de que req.body.documentoInfo está presente y es una cadena JSON válida
    const documentoInfoString = req.body.documentoInfo;
    const documento = JSON.parse(documentoInfoString);

    // Extrae usuario_id del objeto documento
    const usuarioId = documento.usuario_id;

    // Sube el archivo a Cloudinary y especifica la carpeta
    const resultado = await cloudinary.uploader.upload(file.path, {
      folder: `Documentos/Alumnos/${usuarioId}`, // Carpeta personalizada para el alumno
      resource_type: "auto", // Asegura que Cloudinary detecte el tipo de archivo correctamente
    });

    // Verifica que la URL segura ha sido generada
    if (!resultado.secure_url) {
      throw new Error(
        "No se ha podido obtener la URL segura del archivo subido"
      );
    }

    let urlArchivo = resultado.secure_url;
    const url_filePublic = resultado.public_id;

    // Convertir la URL del PDF a una imagen JPG utilizando la transformación de página
    if (urlArchivo.endsWith(".pdf")) {
      urlArchivo = urlArchivo
        .replace(".pdf", ".jpg")
        .replace("/upload/", "/upload/pg_1/");
    }

    // Busca un documento existente
    const existingDocumento = await DocumentosAlumnoEstado.findOne({
      where: {
        alumno_estado_id: documento.alumno_estado_id,
        usuario_id: usuarioId,
      },
    });

    // Si existe un documento existente y tiene una URL de archivo, elimina el archivo anterior de Cloudinary
    if (existingDocumento && existingDocumento.url_file) {
      const publicId = existingDocumento.url_file
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Actualiza la información del documento en la base de datos
    await DocumentosAlumnoEstado.update(
      {
        url_file: urlArchivo,
        url_filePublic: url_filePublic,
        status: "PENDIENTE",
      },
      {
        where: {
          usuario_id: usuarioId,
          alumno_estado_id: documento.alumno_estado_id,
        },
      }
    );

    // Envía una respuesta al cliente con el mensaje de éxito
    res.json({ message: "Documento subido correctamente" });
  } catch (error) {
    console.error("Error al subir el documento:", error);
    res.status(500).send("Error interno del servidor");
  }
};

const updateDocumentoStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const documento = await DocumentosAlumnoEstado.findByPk(id);
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await DocumentosAlumnoEstado.update(
      {
        status: "REVISADO",
        comentarios: "Revisado",
      },
      {
        where: { alumno_estado_id: id },
      }
    );
    res.json({ message: "Estatus actualizado" });
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

const agregarComentarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;

    if (!id) {
      return handleBadRequestError("Falta el id del documento", res);
    }

    const documento = await DocumentosAlumnoEstado.findOne({
      where: {
        alumno_estado_id: id,
      },
      include: [
        {
          model: DetallesDocumentosAlumno,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"], // Only include document name
            },
          ],
        },
        {
          model: Usuarios,
          attributes: ["email_usuario", "nombre"], // Include user email for notification
        },
      ],
    });

    if (!documento) {
      return handleNotFoundError("No se encontró el documento", res);
    }

    // // Eliminar el archivo físico si existe
    // if (documento.url_file) {
    //   const filePath = path.join(
    //     "public/Documentos/Alumnos",
    //     documento.url_file
    //   );
    //   try {
    //     fs.unlinkSync(filePath);
    //     console.log("Archivo eliminado correctamente");
    //   } catch (err) {
    //     console.error("Error al eliminar el archivo:", err);
    //   }
    // }
    if (documento.url_filePublic) {
      console.log(documento.url_filePublic);
      try {
        await cloudinary.uploader.destroy(documento.url_filePublic);
        console.log("Archivo eliminado correctamente de Cloudinary");
      } catch (err) {
        console.error("Error al eliminar el archivo de Cloudinary:", err);
      }
    }

    // Actualizar el estado del documento en la base de datos
    await DocumentosAlumnoEstado.update(
      {
        status: "RECHAZADO",
        comentarios: comentarios,
        url_file: null,
        url_filePublic: null,
      },
      {
        where: {
          alumno_estado_id: id,
        },
      }
    );

    // Enviar correo electrónico con los comentarios
    const email = documento.usuario.dataValues.email_usuario;
    const nombreUsuario = documento.usuario.dataValues.nombre;
    const nombreDocumento =
      documento.det_doc_alumno.documento.dataValues.nombre_documento;

    await sendEmailComentariosDoc(
      email,
      nombreUsuario,
      nombreDocumento,
      comentarios
    );

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarDocUsuario = async (req, res) => {
  try {
    const { curp } = req.body;

    const Preregistro = await UserPreregister.findOne({ where: { curp } });

    if (!Preregistro) {
      return handleNotFoundError("Usuario no encontrado", res);
    }

    const egresadoData = Preregistro.egresado;
    if (egresadoData === true) {
      const egresado = {
        cod_egresado: Preregistro.id_estudiante,
        trabajando: Preregistro.trabajando,
        especializado: Preregistro.lugar_trabajo,
        usuario_id: req.body.usuario_id,
      };
      const newEgresado = await Egresado.create(egresado);
    } else if (egresadoData === false) {
      const alumno = {
        matricula: Preregistro.id_estudiante,
        usuario_id: req.body.usuario_id,
      };
      const newAlumno = await Alumno.create(alumno);
    }

    await Usuarios.update(
      {
        status: "ACTIVO",
      },
      {
        where: {
          usuario_id: req.body.usuario_id,
        },
      }
    );
    const email_usuario = Preregistro.email_usuario;
    const nombre_usuario = Preregistro.nombres;

    await sendEmailAceptado(email_usuario, nombre_usuario);

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al aceptar:", error);
    return handleInternalServerError(error, res);
  }
};

const updateDocumentoStatusDocente = async (req, res) => {
  const { id } = req.params;
  try {
    const documento = await DocumentosDocenteEstado.findByPk(id);
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await DocumentosDocenteEstado.update(
      {
        status: "REVISADO",
        comentarios: "Revisado",
      },
      {
        where: { docente_estado_id: id },
      }
    );
    res.json({ message: "Estatus actualizado" });
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

const agregarComentariosDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentarios } = req.body;

    if (!id) {
      return handleBadRequestError("Falta el id del documento", res);
    }

    const documento = await DocumentosDocenteEstado.findOne({
      where: {
        docente_estado_id: id,
      },
      include: [
        {
          model: DetallesDocumentosDocente,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"], // Solo incluir el nombre del documento
            },
          ],
        },
        {
          model: Usuarios,
          attributes: ["email_usuario", "nombre"], // Incluir el correo electrónico del usuario para la notificación
        },
      ],
    });

    if (!documento) {
      return handleNotFoundError("No se encontró el documento", res);
    }

    // // Eliminar el archivo físico si existe
    // if (documento.url_file) {
    //   const filePath = path.join(
    //     "public/Documentos/Docentes",
    //     documento.url_file
    //   );
    //   try {
    //     fs.unlinkSync(filePath);
    //     console.log("Archivo eliminado correctamente");
    //   } catch (err) {
    //     console.error("Error al eliminar el archivo:", err);
    //   }
    // }

    if (documento.url_filePublic) {
      console.log(documento.url_filePublic);
      try {
        await cloudinary.uploader.destroy(documento.url_filePublic);
        console.log("Archivo eliminado correctamente de Cloudinary");
      } catch (err) {
        console.error("Error al eliminar el archivo de Cloudinary:", err);
      }
    }

    // Actualizar el estado del documento en la base de datos
    await DocumentosDocenteEstado.update(
      {
        status: "RECHAZADO",
        comentarios: comentarios,
        url_file: null,
        url_filePublic: null,
      },
      {
        where: {
          docente_estado_id: id,
        },
      }
    );

    // Enviar correo electrónico con los comentarios
    const email = documento.usuario.dataValues.email_usuario;
    const nombreUsuario = documento.usuario.dataValues.nombre;
    const nombreDocumento =
      documento.det_doc_docente.documento.dataValues.nombre_documento;

    await sendEmailComentariosDoc(
      email,
      nombreUsuario,
      nombreDocumento,
      comentarios
    );

    res.json({
      msg: "La operación se realizó correctamente",
    });
  } catch (error) {
    console.error("Error al rechazar documento:", error);
    return handleInternalServerError(error, res);
  }
};

const aceptarDocUsuarioDocente = async (req, res) => {
  try {
    const { curp, usuario_id } = req.body;

    // Buscar el usuario por CURP
    const usuario = await Usuarios.findOne({ where: { curp } });

    if (!usuario) {
      return handleNotFoundError("Usuario no encontrado", res);
    }

    // Buscar al docente por usuario_id
    const docente = await Docente.findOne({
      where: { usuario_id: usuario.usuario_id },
    });

    if (!docente) {
      return handleNotFoundError("Docente no encontrado", res);
    }

    // Actualizar el estado del usuario a "ACTIVO"
    await Usuarios.update(
      {
        status: "ACTIVO",
      },
      {
        where: {
          usuario_id: usuario_id,
        },
      }
    );

    res.json({ message: "Docente aceptado y usuario actualizado a ACTIVO" });
  } catch (error) {
    console.error("Error al aceptar docente:", error);
    return handleInternalServerError(error, res);
  }
};

const getCursoDocumentosDocente = async (req, res) => {
  const { id } = req.params;
  try {
    const documentos = await DocumentosDocenteEstado.findAll({
      where: { usuario_id: id },
      include: [
        {
          model: DetallesDocumentosDocente,
          include: [
            {
              model: Documentos,
              attributes: ["nombre_documento"],
            },
          ],
        },
      ],
    });

    res.json(documentos);
  } catch (error) {
    console.error("Error al obtener documentos del curso:", error);
    res.status(500).send("Error interno del servidor");
  }
};
const subirDocumentosDocente = async (req, res) => {
  try {
    // Accede al archivo subido por Multer desde req.file
    const file = req.file;

    const documentoInfoString = req.body.documentoInfo;
    const documento = JSON.parse(documentoInfoString);

    // Sube el archivo a Cloudinary y especifica la carpeta
    const resultado = await cloudinary.uploader.upload(file.path, {
      folder: `Documentos/Docentes/${documento.usuario_id}`, // Carpeta personalizada para el docente
    });

    let urlArchivo = resultado.secure_url;
    const url_filePublic = resultado.public_id;

    // Convertir la URL del PDF a una imagen JPG utilizando la transformación de página
    if (urlArchivo.endsWith(".pdf")) {
      urlArchivo = urlArchivo
        .replace(".pdf", ".jpg")
        .replace("/upload/", "/upload/pg_1/");
    }
    // Busca un documento existente
    const existingDocumento = await DocumentosDocenteEstado.findOne({
      where: {
        docente_estado_id: documento.docente_estado_id,
        usuario_id: documento.usuario_id,
      },
    });

    // Si existe un documento existente y tiene una URL de archivo, elimina el archivo anterior de Cloudinary
    if (existingDocumento && existingDocumento.url_file) {
      await cloudinary.uploader.destroy(existingDocumento.url_file);
    }

    // Actualiza la información del documento en la base de datos
    await DocumentosDocenteEstado.update(
      {
        url_file: urlArchivo,
        url_filePublic: url_filePublic,
        status: "PENDIENTE",
      },
      {
        where: {
          usuario_id: documento.usuario_id,
          docente_estado_id: documento.docente_estado_id,
        },
      }
    );

    // Envía una respuesta al cliente con el mensaje de éxito
    res.json({ message: "Documento subido correctamente" });
  } catch (error) {
    console.error("Error al subir el documento:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export {
  user,
  getPeriodos,
  getAlumnos,
  getCursoDocumentos,
  subirDocumentos,
  updateDocumentoStatus,
  agregarComentarios,
  aceptarDocUsuario,
  agregarComentariosDocente,
  getDocentes,
  updateDocumentoStatusDocente,
  aceptarDocUsuarioDocente,
  getCursoDocumentosDocente,
  subirDocumentosDocente,
};
