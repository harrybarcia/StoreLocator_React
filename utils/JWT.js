const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
  console.log('req.headers', req.headers);
  const authHeader = req.headers['cookie']
  console.log("1", authHeader)
  const token = authHeader.split('=')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken