// Author Chebotiuk Pavlo, https://github.com/chebotiuk
// Recommended Node v10.14.1

"use strict";

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const zlib = require('zlib');
const util = require('util');

const ROOT_PUBLIC = __dirname + '/public';
const PORT = 3000

const once = fn => (...args) => {
  if (!fn) return
  const res = fn(...args)
  fn = null
  return res
}

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

function getMimeType(filePath) {
  const basicMimeExtMap = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.bmp': 'image/bmp',
    '.json': 'application/json',
  }

  const extname = path.extname(filePath)
  return basicMimeExtMap[extname]
}

function sendFile(filePath, res) {
  const errorHandler = once(err => { sendHttpError(err, res) })

  const mime = getMimeType(filePath);
  res.setHeader('Content-Type', mime + '; charset=utf-8');
  res.setHeader('Content-Encoding', 'gzip')

  const rs = fs.createReadStream(filePath);
  const gs = zlib.createGzip()

  rs.pipe(gs);
  gs.pipe(res)

  rs.on('error', errorHandler)
  gs.on('error', errorHandler)

  res.on('close', function() {
    rs.destroy();
  });
}

function sendFileSafe(filePath, res) {
  try {
    filePath = decodeURIComponent(filePath);
  } catch(e) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  if (~filePath.indexOf('\0')) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }
    
  filePath = path.normalize(path.join(ROOT_PUBLIC, filePath));

  if (!~filePath.indexOf(path.normalize(ROOT_PUBLIC))) {
    res.statusCode = 404;
    res.end('File not found');
    return;
  }

  fs.stat(filePath, function(err, stats) {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    sendFile(filePath, res);
  });
}

http.createServer(function(req, res) {
  if (req.url === '/') {
    return sendFileSafe('index.html', res)
  }

  sendFileSafe(url.parse(req.url).pathname, res);
}).listen(PORT, () => { console.log('Server is listening on port ' + PORT) });
