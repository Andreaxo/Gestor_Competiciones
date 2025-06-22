const response = require('./responses');

function errors(err, req, res, next) {
    console.error('[error]', err);

    const message = err.message || 'Error Interno';
    const status = err.statusCode || 500;

    response.error(req, res, message, status);
}

function errorHandler(err, req, res, next) {
    console.error('[error]', err);

    const message = err.message || 'Error Interno';
    const status = err.statusCode || 500;

    response.error(req, res, message, status);
}

module.exports = {
    errors,
    errorHandler
};