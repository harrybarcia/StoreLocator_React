
const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
  console.log('req.headers', req.headers);
  console.log('---');
  console.log('req.headers split', req.headers['cookie'].split('=')[2]);
  console.log('req.headers split postman', req.headers['cookie'].split('=')[1]);
  
  console.log('---');
  console.log('---');
  const authHeader = req.headers['cookie']
  const token = authHeader && authHeader.split('=')[2]
  // const token = authHeader && authHeader.split('=')[1]
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log('---');
    
    console.log("token", token)
    console.log('---');
    console.log(process.env.ACCESS_TOKEN_SECRET)
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken