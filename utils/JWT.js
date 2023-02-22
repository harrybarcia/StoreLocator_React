
const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
  
  const authHeader = req.headers['cookie']
  // const token = authHeader && authHeader.split('=')[8]
  const token = authHeader && authHeader.split('=')[8] || authHeader.split('=')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log('---');
    req.user = user? user : null;
    next()
  })
}

module.exports = authenticateToken