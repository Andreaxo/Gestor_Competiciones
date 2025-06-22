const { check } = require("express-validator");
const { validateHelper } = require("./validatorHelper");

const validateCreate = [
    check("name").exists().withMessage("El nombre es obligatorio").notEmpty(),
    check("lastName").exists().withMessage("El apellido es obligatorio").notEmpty(),
    check("birthdate")
        .exists().withMessage("La fecha de nacimiento es obligatoria")
        .notEmpty().withMessage("La fecha de nacimiento no puede estar vacía")
        .custom(value => {
            const fechaIngresada = new Date(value);
            const hoy = new Date();
            if (fechaIngresada > hoy) {
                throw new Error("La fecha de nacimiento no puede ser en el futuro.");
            }
            return true;
        }),
    check("rol").exists().withMessage("El rol es obligatorio").notEmpty(),
    check("documentNumber").exists().withMessage("El número de documento es obligatorio").notEmpty(),
    check("documentType").exists().withMessage("El tipo de documento es obligatorio").notEmpty(),
    check("email").exists().withMessage("El email es obligatorio").isEmail().withMessage("Debe ser un email válido"),
    check("phone").exists().withMessage("El teléfono es obligatorio").isNumeric().withMessage("El teléfono debe contener solo números"),
    check("competitionName").exists().withMessage("El nombre de la competencia es obligatorio").notEmpty(),
    check("strategyCompetition").exists().withMessage("La estrategia de la competencia es obligatoria").notEmpty(),

    validateHelper 
];

module.exports = { validateCreate };
