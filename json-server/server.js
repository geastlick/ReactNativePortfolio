const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require('path')
const axios = require('axios').default;

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, './db.json'))
const middlewares = jsonServer.defaults()
const cert = fs.readFileSync('public.pem');
const auth = require('./oauth')
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, cert, {
    audience: auth.CLIENT_ID,
    issuer: auth.ISSUER
  }, (err, decode) => decode !== undefined ?  decode : err)
}

function getUser(payload) {
  return { name: payload.name, email: payload.email };
}

server.post('/auth/login', (req, res) => {
  const {username, password} = req.body
  axios.post(auth.TOKEN_URL, {
    grant_type: auth.GRANT_TYPE,
    username: username,
    password: password,
    client_id: auth.CLIENT_ID,
    realm: auth.REALM
  })
  .then(response => {
    const data=response.data;
    const payload=verifyToken(data.id_token)
    if(!payload.message) {
      console.log('login - verifyToken passed')
      const user = getUser(payload);
      res.status(200).json({access_token: data.id_token, user});
    } else {
      console.log('login - verifyToken failed')
      res.status(401).json({status: 401, message: 'Incorrect email or password'})
    }
  })
  .catch(error => {
    console.log('login - ' + error)
    res.status(401).json({status: 401, message: 'Incorrect email or password'})
  });
})

server.get('/auth/user', (req, res) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    console.log('user - Bad authorization header')
    const status = 401
    const message = 'Bad authorization header'
    res.status(status).json({status, message})
    return
  }
  try {
     const token = req.headers.authorization.split(' ')[1];
     const payload=verifyToken(token)
     if(!payload.message) {
        console.log('user - Token is valid')
        const user = getUser(payload)
        console.log(user)
        res.status(200).json({user})
      } else {
        console.log('user - Token failed verify', payload.message)
        res.status(401).json({status: 401, message: 'Incorrect email or password'})
      }
     } catch (err) {
        console.log('user - Error: ' + err)
        const status = 401
        const message = 'Error: access_token is not valid'
        res.status(status).json({status, message})
  }
})

server.use(/^(?!\/auth|\/images).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    console.log('protected - bad header')
    const status = 401
    const message = 'Bad authorization header'
    res.status(status).json({status, message})
    return
  }
  try {
    const payload=verifyToken(req.headers.authorization.split(' ')[1])
    if (!payload.message) {
      console.log('protected - Token passed verify')
      next()
    } else {
      console.log('protected - Token failed verify', payload.message)
    }
  } catch (err) {
    console.log('protected - Error: ' + err)
    const status = 401
    const message = 'Error: access_token is not valid'
    res.status(status).json({status, message})
  }
})

server.use(middlewares)
server.use('/api', router)
server.listen(3006, '192.168.2.163', () => {
  console.log('JSON Server is running on 3006')
})