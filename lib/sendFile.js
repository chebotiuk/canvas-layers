const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const { sendHttpError } = require('./error')

const once = fn => (...args) => {
  if (!fn) return
  const res = fn(...args)
  fn = null
  return res
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
    '.json': 'application/json'
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

const getSendFileSafeFn = folderPath => (filePath, res) => {
  try {
    filePath = decodeURIComponent(filePath);
  } catch(e) {
    res.statusCode = 400;
    return res.end('Bad Request');
  }

  if (~filePath.indexOf('\0')) {
    res.statusCode = 400;
    return res.end('Bad Request');
  }
    
  filePath = path.normalize(path.join(folderPath, filePath));

  if (!~filePath.indexOf(path.normalize(folderPath))) {
    res.statusCode = 404;
    return res.end('File not found');
  }

  fs.stat(filePath, function(err, stats) {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      return res.end('File not found');
    }

    sendFile(filePath, res);
  });
}

exports.sendFile = sendFile;
exports.getSendFileSafeFn = getSendFileSafeFn;
