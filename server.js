const express = require('express');
const app = express();
var http = require('http').createServer(app);
var write_file = require('./require/parser.js').reqParser(app);
const PORT = process.env.PORT || 4000;

// register the socket
var u_socket = require('./require/socket.js');
u_socket.SEvents.emit('startSocket',http);

// valid client list
var allowedOrigins = ['http://localhost:3000','https://emchat.herokuapp.com'];

app.use((req,res,next)=>{
  // check the validity of client in preflight request
	var origin = req.headers.origin;
	if(allowedOrigins.indexOf(origin) > -1){
     res.setHeader('Access-Control-Allow-Origin', origin);
	}

  // header to allow CORS
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// auth regitration in app.use
require('./require/auth').authCheck(app);

// connect with database
const con = require('./connection.js').PG_POOL;

// attach db connection and multer
app.use((req,res,next)=>{
  req.pool = con;
  req.write_file = write_file;
  next();
});

// all routes and add all the routes
const routes = require('./routes');
routes.routes(app);

http.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))