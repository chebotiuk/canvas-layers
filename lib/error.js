const http = require('http')
const util = require('util')

function HttpError(status, message) {
  Error.captureStackTrace(this, HttpError);

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || 'Error';
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

const sendHttpError = (err, res) => {
  if (!err instanceof HttpError) {
    console.error(err);
    err = new HttpError(500);
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = err.status;
  res.statusMessage = err.message;
  res.end(JSON.stringify(err))
}

exports.HttpError = HttpError;
exports.sendHttpError = sendHttpError;
