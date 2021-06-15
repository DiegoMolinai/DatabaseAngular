const dbFile = 'db.json'
const keyJWT = "BX]e_,r)g8$w'nMn"
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router(dbFile)
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(jsonServer.bodyParser)

// Add custom routes before JSON Server router
server.post('/login', (req, res) => {
  let correo = req.body.correo;
  let password = req.body.password;  
  let usuarios = router.db.get("Usuarios").value();
  let findUser = false;

  usuarios.forEach( usuario =>{
    if( correo == usuario.usuario && password == usuario.contrasena ){
      console.log(usuario);
      findUser = true;
      const token = jwt.sign(usuario, keyJWT , {
        expiresIn: 1440
      });
      const id = usuario.id;
      const esadmin = usuario.esadmin;
      res.jsonp({token:token,id:id,esadmin:esadmin})
    }
  });

  if(!findUser){
    res.sendStatus(401);
    

  }
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
server.use(router)
server.listen(4100, () => {
  console.log('JSON Server is running')
})