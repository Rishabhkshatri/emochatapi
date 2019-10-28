let auth = require('../require/auth.js')

exports.logInCheck = (req,res)=>{
	let req_data = req.body;
	let con = req.pool;
	let res_obj;
	is_valid = true;

	if(req_data['ser_user_id'] !== undefined && req_data['ser_user_u_name'] !== undefined){
		let user_obj = {user_id : req_data['ser_user_id'],user_u_name : req_data['ser_user_u_name']};
		res_obj = {api_err : "",page_name : "Chat",data:{view : "user_list"}};
		res_obj['data']['cur_user'] = user_obj;
		res.json(res_obj);
		res.end();
		return;
	}

	if(req_data['email'] === undefined || req_data['email'].length === 0){
		is_valid = false;
	}else if(req_data['password'] === undefined || req_data['password'].length === 0){
		is_valid = false;
	}
	if(is_valid){
		let sql_user = `SELECT user_id,user_u_name,show_video_all FROM temo_user WHERE user_email=$1 AND user_password=$2`;
		con.query(sql_user,[req_data['email'],req_data['password']],(err,sql_res,fields)=>{
			if(err){
				res_obj = {api_err : "Server Error",page_name : "LogIn"};
				res.json(res_obj);
				res.end();
			}else{
				sql_res = sql_res.rows;
				if(sql_res.length == 1){
					let user_obj = {user_id : sql_res[0]['user_id'],user_u_name : sql_res[0]['user_u_name']};
					auth.authSet(user_obj,res);
				}else{
					res_obj = {api_err : "Incorrect email and password",page_name : "LogIn"};
					res.json(res_obj);
					res.end();
				}
			}
		});
	}else{
		res_obj = {api_err : "Incorrect data",page_name : "LogIn"};
		res.json(res_obj);
		res.end();
	}
};