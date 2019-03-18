const db = require('./db')

const routes = {
  '/api/data/*': (req, res) => {
    const [ collectionIndex ] = req.params
    const data = db.getCollectionByIndex(collectionIndex)

    if (!data) return sendHttpError(new HttpError(404), res)

    res.writeHead(200, 'OK', {'Content-Type': 'application/json; charset=utf-8'})
    res.end(JSON.stringify(data))
  }
};

exports.routes = routes;
