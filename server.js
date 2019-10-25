const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const PORT = 4000;
var http = require('http').createServer(app);
const io = require('socket.io')(http);
require('./api/apiConfig');
const SECRET_KEY = "EMOCHAT_SECRET_KEY";
var u_socket = require('./api/resource.js');
const bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let file_type = file.mimetype.split('/');
    cb(null, 'emovideo'+'-'+Date.now()+'.'+file_type[1]);
  }
})

var write_file = multer({ storage: storage })


// all routes
const routes = require('./routes');

app.use((req,res,next)=>{
  // Website you wish to allow to connect
  var allowedOrigins = 'http://localhost:3000';
	var origin = req.headers.origin;
	if(allowedOrigins == origin){
     res.setHeader('Access-Control-Allow-Origin', origin);
	}

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

const con = require('./connection.js').MYSQL_CON;
app.use(cookieParser());
app.use((req,res,next)=>{
  if(req.cookies.jwt !== undefined){
    jwt.verify(req.cookies.jwt,SECRET_KEY,{audience:"jwt_"+process.env.TS},(err,user_obj)=>{
      if(err){
        if(req.originalUrl === "/" || req.originalUrl === "/Registration"){
          next();
        }
        else{
          res_obj = {api_err : "",page_name : "LogIn"};
          res.json(res_obj);
          res.end();
        }
      }else{
        req.body.ser_user_id = user_obj.user_id;
        req.body.ser_user_u_name = user_obj.user_u_name;
        req.body.write_file = write_file;
        next();
      }
    });
  }else{
    if(req.originalUrl === "/" || req.originalUrl === "/Registration"){
      next();
    }
    else{
      res_obj = {api_err : "",page_name : "LogIn"};
      res.json(res_obj);
      res.end();
    }
  }
});

io.on('connection', function(socket){
  let new_user_id = 0;
  io.emit('newUser',u_socket.active_user); 
  socket.on('newUser',(cur_user)=>{
    new_user_id = cur_user['user_id'];
    u_socket.active_user[cur_user['user_id']] = cur_user['user_u_name'];
    u_socket.user_socket[cur_user['user_id']] = socket;
    io.emit('newUser',u_socket.active_user);    
  });
  socket.on('disconnect',()=>{
    delete u_socket.active_user[new_user_id];
    delete u_socket.user_socket[new_user_id];
    io.emit('newUser',u_socket.active_user); 
  });
});

u_socket.SEvents.on("newVideo",()=>{
  io.emit('newVideo');
});

u_socket.SEvents.on("newMsg",(u_id,msg_obj)=>{
  u_socket.user_socket[u_id].emit('newMsg', msg_obj);
});

// add all the routes
routes.routes(app);

http.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))