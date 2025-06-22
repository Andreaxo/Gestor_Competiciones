const Joi = require('joi');

const loginSchema = Joi.object({
email: Joi.string().email().required().messages({
    'string.email': 'El correo debe ser un email válido',
    'any.required': 'El correo es obligatorio'
    }),
password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es obligatoria'
    })
});

function validateLogin(req, res, next) {
const { error } = loginSchema.validate(req.body);
if (error) {
    return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = { validateLogin };
