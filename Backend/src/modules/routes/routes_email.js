// routes/email_routes.js
const express = require('express');
const router = express.Router();
const enviarCorreo = require('../send_email/controller');

// Middleware para validar campos comunes
const validarCamposCorreo = (req, res, next) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ 
      error: "Faltan campos requeridos", 
      detalles: "Se requieren email y name" 
    });
  }
  
  // Validación básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: "Formato de email inválido" 
    });
  }
  
  next();
};

// Ruta para competidores
router.post('/competitor', validarCamposCorreo, async (req, res) => {
  const { email, name, competicion } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ 
      error: "Faltan campos requeridos",
      detalles: "Se requieren email y nombre" 
    });
  }
  
const resultado = await enviarCorreo({
  to: email,
  subject: `¡Ya eres competidor!`,
  text: `Hola ¡${name}!, has sido registrado como competidor en el gestor de competiciones.
Te queremos felicitar, por ser parte de ${competicion}. Espera novedades por parte del instructor encargado.

Tu contraseña es tu número de documento de identidad.
Si necesitas recuperarla o cambiarla, ingresa a: www.talentorisaralda.com/recuperar-contrasena`,

  html: `
    <p>Hola <strong>¡${name}!</strong>,</p>
    <p>¡Bienvenido(a) como <strong>competidor</strong> en el gestor de competiciones!</p>
    <p>Te queremos felicitar por ser parte de <strong>${competicion}</strong>.</p>
    <p>Tu contraseña es tu número de <strong>documento de identidad</strong>.</p>
    <p>Si necesitas recuperarla o cambiarla, haz clic aquí:<br>
    <a href="https://www.talentorisaralda.com/recuperar-contrasena">www.talentorisaralda.com/recuperar-contrasena</a></p>
    <p>Espera novedades por parte del instructor encargado.</p>
    <p>Saludos cordiales,<br><strong>Equipo de Gestión de Competiciones</strong></p>
  `,
});

  
  if (resultado.success) {
    res.status(200).json({ message: "Correo enviado correctamente al COMPETIDOR" });
  } else {
    res.status(500).json({ error: "Error al enviar correo - Competidor", detalle: resultado.error });
  }
});

// Ruta para aspirantes
router.post('/aspirant', validarCamposCorreo, async (req, res) => {
  const { email, name } = req.body;
  
  const resultado = await enviarCorreo({
      to: email,
      subject: `¡Te elegimos como aspirante!`,
      text: `Hola ¡${name}!, has sido registrado como aspirante en nuestra plataforma.
  Ser aspirante significa que quedas en reserva, por si algún competidor no puede ir a la habilidad elegida.
  Te agradecemos por seguir participando y estar disponible para futuras oportunidades.

  Tu contraseña es tu número de documento de identidad.
  Si necesitas recuperarla o cambiarla, ingresa a: www.talentorisaralda.com/recuperar-contrasena

  Sigue atento a las novedades del instructor.`,

    html: `
      <p>Hola <strong>${name}</strong>,</p>
      <p>¡Bienvenido(a) como <strong>aspirante</strong> en nuestra plataforma!</p>
      <p>Ser <strong>aspirante</strong> significa que quedas en reserva, por si algún competidor no puede asistir a la habilidad elegida.</p>
      <p>Te agradecemos sinceramente por seguir participando y estar disponible para futuras oportunidades.</p>
      <p>Tu contraseña es tu número de <strong>documento de identidad</strong>.</p>
      <p>Si necesitas recuperarla o cambiarla, haz clic aquí:<br>
      <a href="https://www.talentorisaralda.com/recuperar-contrasena">www.talentorisaralda.com/recuperar-contrasena</a></p>
      <p>Sigue atento a las novedades del instructor.</p>
      <p>Saludos cordiales,<br><strong>Equipo de Gestión de Competiciones</strong></p>
    `
  });
  
  if (resultado.success) {
    res.status(200).json({ message: "Correo enviado correctamente al ASPIRANTE" });
  } else {
    res.status(500).json({ error: "Error al enviar correo al ASPIRANTE", detalle: resultado.error });
  }
});

// Ruta para eliminar participantes
router.post('/delete', validarCamposCorreo, async (req, res) => {
  const { email, name, competicion } = req.body;
  
  if (!competicion) {
    return res.status(400).json({ 
      error: "Falta el campo competicion" 
    });
  }
  
  const resultado = await enviarCorreo({
    to: email,
    subject: `Gracias por tu interés en ${competicion}`,
    text: `Hola ¡${name}!, agradecemos tu interés en participar en ${competicion}.
     En esta ocasión no has sido seleccionado como competidor, pero esperamos contar contigo en futuras ediciones.`,
    html: `
      <p>Hola <strong>${name}</strong>,</p>
      <p>Gracias por tu interés en <strong>${competicion}</strong>.</p>
      <p>En esta ocasión no has sido seleccionado como competidor, pero queremos agradecerte sinceramente por postularte.</p>
      <p>¡Esperamos contar contigo en próximas ediciones!</p>
      <p>Saludos cordiales,<br><strong>Equipo de Gestión de Competiciones</strong></p>
    `
  });
  
  if (resultado.success) {
    res.status(200).json({ message: "Correo de rechazo enviado correctamente - ELIMINAR" });
  } else {
    res.status(500).json({ error: "Error al enviar correo de ELIMINAR", detalle: resultado.error });
  }
});

module.exports = router;