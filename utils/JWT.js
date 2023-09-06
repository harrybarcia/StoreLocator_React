const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
  console.log('req.headers', req.headers);
  console.log('---');
  console.log('req.headers split', req.headers['cookie'].split('=')[8]);
  console.log('cookie :access token pour postman', req.headers['cookie'].split('=')[1]);
  // console.log('bearer token pour postman', req.headers['authorization'].split(' ')[1]);
  console.log('---');
  console.log('---');
  const authHeader = req.headers['cookie']
  // const token = authHeader && authHeader.split('=')[1]

  const token = authHeader && authHeader.split('=')[3] || authHeader.split('=')[1]
  if (token == null) return res.sendStatus(401)
  // console.log('token', token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log('---');
    
    console.log("token", token)
    console.log('---');
    console.log("secret: ", process.env.ACCESS_TOKEN_SECRET)
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken