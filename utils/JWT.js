const jwt = require('jsonwebtoken')
function authenticateToken(req, res, next) {
  console.log('req.headers', req.headers);
  const authHeader = req.headers['cookie']
  console.log(authHeader.split('=')[1])
  console.log(req.headers)
  // console.log("1", authHeader.split(';')[1].split('=')[1])
  // const token = authHeader.split(';')[1].split('=')[1]
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjFAZ21haWwuY29tIiwidXNlcklkIjoiNjRmYTcxZDI5ZGY1YTFmNGI4Y2Y1ODJmIiwiaWF0IjoxNjk4Nzc0NjM0LCJleHAiOjE2OTg3ODkwMzR9.p1gv4enAXivD68tmj_bHXcydLrwg_M7WUnQdI3EOVk0"
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = authenticateToken