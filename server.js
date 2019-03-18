// Author Chebotiuk Pavlo, https://github.com/chebotiuk
// Recommended Node v10.14.1

"use strict";

const http = require('http')
const url = require('url')

const db = require('./db')
const { getRouter } = require('./lib/router')
const { routes } = require('./routes')
const { getSendFileSafeFn } = require('./lib/sendFile')

const ROOT_PUBLIC = __dirname + '/public';
const PORT = 3000
const router = getRouter(routes)
const sendPublicFileSafe = getSendFileSafeFn(ROOT_PUBLIC)

db.connect();

const server = http.createServer(function(req, res) {
  if (req.url.split('/')[1] === 'api') return router(req, res)

  if (req.url === '/') {
    return sendPublicFileSafe('index.html', res)
  }

  sendPublicFileSafe(url.parse(req.url).pathname, res);
}).listen(PORT, () => { console.log('Server is listening on port ' + PORT) });

server.on('error', err => {
  if (err.code === 'EACCES') {
    console.error(`No access to port ${port}`)
  }
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

