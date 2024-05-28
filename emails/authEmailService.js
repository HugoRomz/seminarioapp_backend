import { transporter } from "../config/nodemailer.js";

// Función para enviar un correo de verificación
export async function sendEmailVerification(email, pass) {
    try {
        const info = await transporter.sendMail({
            from: '"SeminarioApp" <proyectoapp781@gmail.com>',
            to: email,
            subject: "SIGEST - Aceptado",
            html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                }
                h1 {
                    color: #007BFF;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                ul li {
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>¡Bienvenido/a al Seminario de Titulación!</h1>
                <p>Hola, nos complace informarte que tu solicitud ha sido recibida.</p>
                <p>Aquí están los detalles de tu cuenta para acceder a nuestra aplicación:</p>
                <ul>
                    <li>Usuario: <strong>${email}</strong></li>
                    <li>Contraseña: <strong>${pass}</strong></li>
                </ul>
                <p>Te recomendamos cambiar tu contraseña después de tu primer inicio de sesión por seguridad.</p>
                <p>¡Esperamos verte pronto!</p>
                <div class="footer">
                    <p>Este es un mensaje automático, por favor no responder.</p>
                </div>
            </div>
        </body>
        </html>`,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error(
            `Error al enviar el correo de verificación: ${error.message}`
        );
    }
}

// Función para enviar un correo de rechazo
export async function sendEmailRejection(email) {
    try {
        const info = await transporter.sendMail({
            from: '"SeminarioApp" <proyectoapp781@gmail.com>',
            to: email,
            subject: "SIGEST - Rechazado",
            html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                }
                h1 {
                    color: #d9534f; /* Rojo para indicar el rechazo */
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Solicitud de Participación Rechazada</h1>
                <p>Lamentamos informarte que tu solicitud para el Seminario de Titulación ha sido rechazada.</p>
                <p>Esto puede deberse a varios factores, incluyendo pero no limitado a requisitos incompletos, información faltante o criterios de selección.</p>
                <p>Si tienes preguntas o deseas más información, por favor contacta a la administración.</p>
                <div class="footer">
                    <p>Este es un mensaje automático, por favor no responder.</p>
                </div>
            </div>
        </body>
        </html>`,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error(`Error al enviar el correo de rechazo: ${error.message}`);
    }
}

// Función para enviar un correo de preregistro
export async function sendEmailPreregister(email) {
    try {
        const info = await transporter.sendMail({
            from: '"SeminarioApp" <proyectoapp781@gmail.com>',
            to: email,
            subject: "SIGEST - Preregistro",
            html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                }
                h1 {
                    color: #007BFF;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Preregistro Completo</h1>
                <p>Hola, gracias por completar tu preregistro para el Seminario de Titulación.</p>
                <p>Te contactaremos pronto con más detalles.</p>
                <div class="footer">
                    <p>Este es un mensaje automático, por favor no responder.</p>
                </div>
            </div>
        </body>
        </html>`,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error(`Error al enviar el correo de preregistro: ${error.message}`);
    }
}

export async function sendEmailComentariosDoc(email, nombreUsuario, nombreDocumento, comentarios) {
    try {
        const info = await transporter.sendMail({
            from: '"SeminarioApp" <proyectoapp781@gmail.com>',
            to: email,
            subject: 'Rechazo de Documento - SIGEST',
            html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                }
                h1 {
                    color: #d9534f;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
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
                <h1>Documento Rechazado</h1>
                <p>Hola ${nombreUsuario},</p>
                <p>Lamentamos informarte que tu documento <span class="document-name">${nombreDocumento}</span> ha sido rechazado.</p>
                <p>Motivo del rechazo: <span class="rejection-reason">${comentarios}</span></p>
                <p>Por favor, revisa el documento y vuelve a enviarlo para su revisión.</p>
                <div class="footer">
                    <p>Este es un mensaje automático, por favor no responder.</p>
                </div>
            </div>
        </body>
        </html>`,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error(`Error al enviar el correo de rechazo del documento: ${error.message}`);
    }
    
}

export async function sendEmailRecuperarContrasena(email, nombreUsuario, token) {
    try {
        const info = await transporter.sendMail({
            from: '"SeminarioApp" <proyectoapp781@gmail.com>',
            to: email,
            subject: 'Reestablecer contraseña - SIGEST',
            html: `<html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                }
                h1 {
                    color: #5bc0de;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #aaa;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    font-size: 16px;
                    color: #fff;
                    background-color: #5bc0de;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .btn:hover {
                    background-color: #31b0d5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reestablecer Contraseña</h1>
                <p>Hola ${nombreUsuario},</p>
                <p>Hemos recibido una solicitud para reestablecer tu contraseña.</p>
                <p>Por favor, haz clic en el siguiente botón para reestablecer tu contraseña:</p>
                <a href="${process.env.FRONTEND_URL}/auth/nuevacontrasena/${token}" class="btn">Reestablecer Contraseña</a>
                <div class="footer">
                    <p>Este es un mensaje automático, por favor no responder.</p>
                </div>
            </div>
        </body>
        </html>`,
        });
        console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.error(`Error al enviar el correo de reestablecimiento de contraseña: ${error.message}`);
    }
}
