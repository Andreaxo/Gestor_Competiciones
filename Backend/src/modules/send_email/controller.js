// send_email/controller.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// // Verificación de la existencia de las variables de entorno

// Configuración correcta del transportador SMTP
const transporter = nodemailer.createTransport({
  host: "mail.talentorisaralda.com",  // Usa el valor directamente
  port: 587,                          // Puerto para STARTTLS
  secure: false,                      // false para STARTTLS (no SSL directo)
  auth: {
    user: "noreply@talentorisaralda.com",  // Tu correo autenticado
    pass: "$B{}wsviNjSE",                  // Tu contraseña
  },
  connectionTimeout: 10000,  // 10 segundos
  greetingTimeout: 5000,     // 5 segundos
  socketTimeout: 10000,      // 10 segundos
  tls: {
    rejectUnauthorized: false, // ⚠️ Ignora verificación de certificado SSL (temporal)
  }
});


// Verificar la conexión
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al conectar con el servidor SMTP:', error);
  } else {
  }
});

const enviarCorreo = async ({ to, subject, text, html }) => {
  try {
    // Validación básica
    if (!to || !subject || (!text && !html)) {
      throw new Error('Faltan campos requeridos (to, subject, y text o html)');
    }

    const info = await transporter.sendMail({
      from: '"Gestor de Competiciones" <noreply@talentorisaralda.com>',
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return { success: false, error: error.message || 'Error desconocido' };
  }
};

module.exports = enviarCorreo;