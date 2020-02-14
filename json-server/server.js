const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, './json/db.json'))
const userdb = JSON.parse(fs.readFileSync(path.join(__dirname, './db/users.json'), 'UTF-8'))
const middlewares = jsonServer.defaults()
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

const SECRET_KEY = '123456789'
const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated(username, password){
  return userdb.users.findIndex(user => user.username === username && user.password === password) !== -1
}

function getUser(username) {
  const user = userdb.users.filter(user => username === user.username)[0];
  return { username: user.username, name: user.name, email: user.email };
}

server.post('/auth/login', (req, res) => {
  const {username, password} = req.body
  if (isAuthenticated(username, password) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }
  const access_token = createToken({username})
  const user = getUser(username);
  res.status(200).json({access_token, user})
})

server.get('/auth/user', (req, res) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Bad authorization header'
    res.status(status).json({status, message})
    return
  }
  try {
     const token = req.headers.authorization.split(' ')[1];
     verifyToken(token)
     const user = getUser(token.payload);
     res.status(200).json({user})
     } catch (err) {
    const status = 401
    const message = 'Error: access_token is not valid'
    res.status(status).json({status, message})
  }
})

server.use(/^(?!\/auth|\/images).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Bad authorization header'
    res.status(status).json({status, message})
    return
  }
  try {
     verifyToken(req.headers.authorization.split(' ')[1])
     next()
  } catch (err) {
    const status = 401
    const message = 'Error: access_token is not valid'
    res.status(status).json({status, message})
  }
})

server.use(middlewares)
server.use('/api', router)
server.listen(3006, () => {
  console.log('JSON Server is running on 3006')
})