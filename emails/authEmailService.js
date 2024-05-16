import { createTransport } from '../config/nodemailer.js'

export async function sendEmailVerification(email, pass) {
    const transporter = createTransport(
        "sandbox.smtp.mailtrap.io",
    2525,
    "746ac9d1d24816",
    "f0fc956e7b5912"
    )

    const info = await transporter.sendMail({
        from: '"SeminarioApp" <tuCorreo@ejemplo.com>', // Asegúrate de que este correo coincida con tu cuenta de Gmail utilizada en el transporter
        to: 'correo@correo.com', // Correo del destinatario
        subject: 'SIGEST - Aceptado',
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
                <p>Hola, nos complace informarte que tu solicitud ha sido aceptada.</p>
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
        </html>` // Usando HTML para el cuerpo del correo
    })
    console.log("Mensaje enviado: %s", info.messageId);
}


export async function sendEmailRejection(email) {
    const transporter = createTransport(
        "sandbox.smtp.mailtrap.io",
    2525,
    "746ac9d1d24816",
    "f0fc956e7b5912"
    )
    


    const info = await transporter.sendMail({
        from: '"SeminarioApp" <tuCorreo@ejemplo.com>', // Asegúrate de que este correo coincida con tu cuenta de Gmail utilizada en el transporter
        to: 'correo@correo.com', // Correo del destinatario
        subject: 'SIGEST - Rechazado',
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
        </html>` // Correo adaptado para indicar rechazo
    });

    console.log("Mensaje enviado: %s", info.messageId);
}

export async function sendEmailPreregister(email) {
    const transporter = createTransport(
        "sandbox.smtp.mailtrap.io",
    2525,
    "746ac9d1d24816",
    "f0fc956e7b5912"
    )
    


    const info = await transporter.sendMail({
        from: '"SeminarioApp" <tuCorreo@ejemplo.com>', // Asegúrate de que este correo coincida con tu cuenta de Gmail utilizada en el transporter
        to: 'correo@correo.com', // Correo del destinatario
        subject: 'SIGEST - Rechazado',
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
        </html>` // Correo adaptado para indicar rechazo
    });

    console.log("Mensaje enviado: %s", info.messageId);
}