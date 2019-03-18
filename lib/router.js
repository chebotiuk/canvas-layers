const url = require('url')

const getRouter = routes => {
  const matching = []
  for (const key in routes) {
    if (key.includes('*')) {
      const regexp = new RegExp(key.replace(/\*/g, '(.*)'))
      const route = routes[key]
      matching.push([regexp, route])
      delete routes[key]
    }
  }

  return (req, res) => {
    let params
    let route = routes[req.url]
    if (!route) {
      for (let i = 0; i < matching.length; i++) {
        const regexp = matching[i]
        params = req.url.match(regexp[0])
        if (params) {
          params.shift()
          route = regexp[1]
          break
        }
      }
    }

    req.params = params
    req.query = url.parse(req.url, true)['query']

    return route(req, res)
  }
}

exports.getRouter = getRouter
