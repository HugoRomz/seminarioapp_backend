import { transporter } from "../config/nodemailer.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import dotenv from "dotenv";

const urlfront = process.env.FRONTEND_URL;

// Obtener la ruta del directorio actual del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta absoluta del archivo de imagen
const imagePath = join(__dirname, "unach-banner.jpg");

// Función para enviar un correo cuando ya fue aceptado y debe subir documentos
export async function sendEmailVerification(
  email,
  pass,
  nombre,
  apellido_p,
  apellido_m
) {
  try {
    const info = await transporter.sendMail({
      from: '"Contacto SIGEST " <proyectoapp781@gmail.com>',
      to: email,
      subject: "SIGEST | ¡Tu solicitud ha sido aceptada!",
      html: `<html>
        <head>
            <style>
                 body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                  }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .header img {
                    width: 100%;
                    height: auto;
                  }
                  .content {
                    padding: 20px;
                  }
                  .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
                  }
                  .content h1 {
                    font-size: 20px;
                    color: #333;
                  }
                  .content p {
                    font-size: 16px;
                    color: #555;
                    line-height: 1.5;
                  }
                  .content li {
                    font-size: 16px;
                    color: #555;
                    line-height: 1.5;
                  }
                  .content strong {
                    color: #333;
                  }
            </style>
        </head>
        <body>
           <div class="container">
              <div class="header">
                <img src="cid:unach-banner" alt="Universidad Autonoma de Chiapas" />
              </div>
              <div class="content">
                <h1>¡Hola, ${nombre} ${apellido_p} ${apellido_m}!</h1>
                <p>Tu solicitud ha sido aceptada para el Seminario de Titulación.</p>
                <p>
                  Tu cuenta ya está activa en nuestro sistema.
                  <strong
                    >Accede a
                    <a href="${urlfront}" target="_blank">SIGEST</a> utilizando los
                    siguientes datos:
                  </strong>
                </p>
                <ul>
                  <li>Usuario: <strong>${email}</strong></li>
                  <li>Contraseña: <strong>${pass}</strong></li>
                </ul>
                <p>
                  Para redefinir tu contraseña, visita la página de login y haz clic en
                  .<strong>"Olvidé mi contraseña"</strong>
                </p>

                <p>
                  <strong style="color: red"
                    >Es necesario subir tus documentos lo antes posible para completar
                    tu proceso de aspirante.</strong
                  >
                </p>

                <p>
                 Atentamente,<br />Coordinación del Seminario de Titulación y Equipo Sistema de Información para la Gestión del
          Seminario de Titulación
                </p>
              </div>
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responder.</p>
              </div>
            </div>
        </body>
        </html>`,
      attachments: [
        {
          filename: "unach-banner.jpg",
          path: imagePath,
          cid: "unach-banner",
        },
      ],
    });
    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(
      `Error al enviar el correo de verificación: ${error.message}`
    );
  }
}

// Función para enviar un correo de rechazo de preregistro
export async function sendEmailRejection(email, nombres, apellidos) {
  try {
    const info = await transporter.sendMail({
      from: '"Contacto SIGEST" <proyectoapp781@gmail.com>',
      to: email,
      subject: "SIGEST | Tu preregistro ha sido rechazado",
      html: `<html>
        <head>
            <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header img {
        width: 100%;
        height: auto;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #aaa;
      }
      .content h1 {
        font-size: 20px;
        color: #333;
      }
      .content p {
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }
      .content strong {
        color: #333;
      }
    </style>
        </head>
       <body>
    <div class="container">
      <div class="header">
        <img
          src="cid:unach-banner"
          alt="Universidad Autonoma de Chiapas"
        />
      </div>
      <div class="content">
        <h1>¡Hola, ${nombres} ${apellidos}!</h1>
        <p>
          Lamentamos informarte que tu solicitud para el Seminario de Titulación
          ha sido rechazada.
        </p>
        <p>
          Esto puede deberse a varios factores, como requisitos no cumplidos,
          información incompleta o criterios de selección específicos.
        </p>
        <p>
          Atentamente,<br />Coordinación del Seminario de Titulación y Equipo Sistema de Información para la Gestión del
          Seminario de Titulación
        </p>
      </div>
      <div class="footer">
        <p>Este es un mensaje automático, por favor no responder.</p>
      </div>
    </div>
  </body>
        </html>`,
      attachments: [
        {
          filename: "unach-banner.jpg",
          path: imagePath,
          cid: "unach-banner",
        },
      ],
    });
    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(`Error al enviar el correo de rechazo: ${error.message}`);
  }
}

// Función para enviar un correo de preregistro
export async function sendEmailPreregister(email, nombres, apellidos) {
  try {
    const info = await transporter.sendMail({
      from: '"Contacto SIGEST" <proyectoapp781@gmail.com>',
      to: email,
      subject: "SIGEST | Tu preregistro ha sido completado",
      html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header img {
                    width: 100%;
                    height: auto;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
                }
                .content h1 {
                    font-size: 20px;
                    color: #333;
                }
                .content p {
                    font-size: 16px;
                    color: #555;
                    line-height: 1.5;
                }
                .content strong {
                    color: #333;
                }
            </style>
        </head>
       <body>
            <div class="container">
            <div class="header">
                <img
                src="cid:unach-banner"
                alt="Universidad Autonoma de Chiapas"
                />
            </div>
            <div class="content">
                <h1>¡Hola, ${nombres} ${apellidos}!</h1>
                <p>
                Tu preregistro fue un éxito y ahora estás en la espera de ser aceptado.
                </p>
                <p>
                <strong
                    >Quédate atento(a) a tu correo electrónico, estaremos enviando los
                    próximos pasos en las siguientes días.</strong
                >
                </p>
                <p>
                También puedes recomendar el seminario a otros alumnos que quieran
                optar por esta opción de titulación, ayudando así a que más personas
                conozcan esta modalidad.
                </p>
                  <p>
          Atentamente,<br />Coordinación del Seminario de Titulación y Equipo Sistema de Información para la Gestión del
          Seminario de Titulación
        </p>
            </div>
            <div class="footer">
                <p>Este es un mensaje automático, por favor no responder.</p>
            </div>
            </div>
        </body></html>`,
      attachments: [
        {
          filename: "unach-banner.jpg",
          path: imagePath,
          cid: "unach-banner",
        },
      ],
    });
    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(`Error al enviar el correo de preregistro: ${error.message}`);
  }
}

export async function sendEmailComentariosDoc(
  email,
  nombreUsuario,
  nombreDocumento,
  comentarios
) {
  try {
    const info = await transporter.sendMail({
      from: '"Contacto SIGEST" <proyectoapp781@gmail.com>',
      to: email,
      subject: "SIGEST | Rechazo de Documento",
      html: `<html>
        <head>
            <style>
                 body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header img {
        width: 100%;
        height: auto;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #aaa;
      }
      .content h1 {
        font-size: 20px;
        color: #333;
      }
      .content p {
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }
      .content strong {
        color: #333;
      }
      .document-name {
        font-weight: bold;
        color: #5bc0de;
      }
      .rejection-reason {
        font-weight: bold;
        color: #d9534f;
      }
            </style>
        </head>
        <body>
            <div class="container">
      <div class="header">
        <img src="cid:unach-banner" alt="Universidad Autonoma de Chiapas" />
      </div>
      <div class="content">
        <h1>¡Hola, ${nombreUsuario}!</h1>
        <p>
          Lamentamos informarte que tu documento
          <span class="document-name">${nombreDocumento}</span> ha sido
          rechazado.
        </p>
        <p>
          Motivo del rechazo:
          <span class="rejection-reason">${comentarios}</span>
        </p>
        <p>Por favor, revisa el documento y vuelve a enviarlo para su revisión.</p>
        <p>
          Atentamente,<br />Coordinación del Seminario de Titulación y Equipo Sistema de Información para la Gestión del
          Seminario de Titulación
        </p>
      </div>
      <div class="footer">
        <p>Este es un mensaje automático, por favor no responder.</p>
      </div>
    </div>
        </body>
        </html>`,
      attachments: [
        {
          filename: "unach-banner.jpg",
          path: imagePath,
          cid: "unach-banner",
        },
      ],
    });
    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(
      `Error al enviar el correo de rechazo del documento: ${error.message}`
    );
  }
}

export async function sendEmailRecuperarContrasena(
  email,
  nombreUsuario,
  token
) {
  try {
    const info = await transporter.sendMail({
      from: '"Contacto SIGEST" <proyectoapp781@gmail.com>',
      to: email,
      subject: "SIGEST | Restablecer contraseña",
      html: `<html>
        <head>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header img {
                width: 100%;
                height: auto;
              }
              .content {
                padding: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;
                color: #aaa;
              }
              .content h1 {
                font-size: 20px;
                color: #333;
              }
              .content p {
                font-size: 16px;
                color: #555;
                line-height: 1.5;
              }
              .content strong {
                color: #333;
              }
              .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #fff;
                background-color: #00294f;
                text-decoration: none;
                border-radius: 5px;
              }

              a:visited {
                  color: #fff;
              }
              a:active {
                  color: #fff;
              }
              .btn:hover {
                background-color: #00396D;
              }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
              <img src="cid:unach-banner" alt="Universidad Autonoma de Chiapas" />
            </div>
            <div class="content">
              <h1>¡Hola, ${nombreUsuario}!</h1>
              <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
              <p>
                Por favor, haz clic en el siguiente botón para
                <strong>Restablecer tu contraseña: </strong>
              </p>
              <a href="${urlfront}/auth/nuevacontrasena/${token}" class="btn"
                >Restablecer Contraseña</a
              >
              <p>En caso que no hayas sido tú, puedes ignorar este e-mail.</p>
              <p>
                Atentamente,<br />Coordinación del Seminario de Titulación y Equipo Sistema de Información para la Gestión del
          Seminario de Titulación
              </p>
            </div>
            <div class="footer">
              <p>Este es un mensaje automático, por favor no responder.</p>
            </div>
          </div>
        </body>
        </html>`,
      attachments: [
        {
          filename: "unach-banner.jpg",
          path: imagePath,
          cid: "unach-banner",
        },
      ],
    });
    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(
      `Error al enviar el correo de reestablecimiento de contraseña: ${error.message}`
    );
  }
}

// Función para enviar un correo de documento aceptado y se a convertido en alumno
export async function sendEmailAceptado(email, nombre_usuario) {
  try {
    const info = await transporter.sendMail({
      from: '"Contacto SIGEST" <proyectoapp781@gmail.com>',
      to: email,
      subject: "SIGEST | Documentación y Solicitud Aceptada",
      html: `<html>
          <head>
              <style>
                  body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header img {
        width: 100%;
        height: auto;
      }
      .content {
        padding: 20px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #aaa;
      }
      .content h1 {
        font-size: 20px;
        color: #333;
      }
      .content p {
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }
      .content strong {
        color: #333;
      }
              </style>
          </head>
          <body>
              <div class="container">
          <div class="header">
            <img src="cid:unach-banner" alt="Universidad Autonoma de Chiapas" />
          </div>
          <div class="content">
            <h1>¡Hola, ${nombre_usuario}!</h1>
            <p>
              ¡Estamos encantados de informarte que tu solicitud para el Seminario
              de Titulación ha sido aceptada!
            </p>
            <p>
              <strong
                >Todos tus documentos han sido revisados y aprobados con
                éxito.</strong
              >
            </p>
            <p>
              Actualmente estamos en el proceso de asignación de participantes al
              seminario. Te contactaremos pronto con más detalles sobre la fecha y
              hora de tu participación.
            </p>
            <p>
              Si tienes alguna pregunta o necesitas más información, no dudes en
              ponerte en contacto con nosotros.
            </p>
            <p>
              Atentamente,<br />Coordinación del Seminario de Titulación y Equipo Sistema de Información para la Gestión del
          Seminario de Titulación
            </p>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático, por favor no responder.</p>
          </div>
        </div>
          </body>
          </html>`,
      attachments: [
        {
          filename: "unach-banner.jpg",
          path: imagePath,
          cid: "unach-banner",
        },
      ],
    });
    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(`Error al enviar el correo de rechazo: ${error.message}`);
  }
}
