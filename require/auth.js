/*
  JWT Auth Set and Check 
*/
const jwt = require('jsonwebtoken');
process.env.TS = Date.now();
const SECRET_KEY = "EMOCHAT_SECRET_KEY";

// JWT Token verification
exports.authCheck = (app)=>{
  let res_obj = {};
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
}

// JWT Token Creation
exports.authSet = (user_obj,res)=>{
  let res_obj = {};
  jwt.sign(user_obj,SECRET_KEY,{expiresIn: 60 * 60,audience:"jwt_"+process.env.TS},(err,token)=>{
    if(err){    
      res_obj = {api_err : "Server Error",page_name : "LogIn"};
    }else{
      res.cookie("jwt",token,);
      res_obj = {api_err : "",page_name : "Chat",data:{view : "user_list"}};
      res_obj['data']['cur_user'] = user_obj;
    }
    res.json(res_obj);
    res.end();
  });
}