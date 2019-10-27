var getChats = require('./apiGetChats');
var u_socket = require('./resource.js');
var tokenAnalyzer = require('./apiToneAnalyzer');
exports.sendMsg = (req,res)=>{
	let req_data = req.body;
	let con = req.pool;
	let res_obj;
	is_valid = true;
	if(req_data['ser_user_id'] === undefined || req_data['ser_user_id'].length === 0){
		is_valid = false;
	}else if(req_data['r_user_id'] === undefined || req_data['r_user_id'].length === 0){
		is_valid = false;
	}else if(req_data['msg_text'] === undefined || req_data['msg_text'].length === 0){
		is_valid = false;
	}

	if(is_valid){
		let insert_user = `INSERT INTO temo_chat (s_user_id,r_user_id,message,message_tone) VALUES ('${req_data['ser_user_id']}','${req_data['r_user_id']}','${req_data['msg_text']}','${req_data['tone_id']}') RETURNING *`;
		con.query(insert_user,(err,sql_res)=>{
			if(err){
				res_obj = {api_err : "Server Error",page_name : "LogIn"};
				res.json(res_obj);
				res.end();
			}else{
				sql_res = sql_res.rows[0];
				msg_obj = {
					chat_id : sql_res.chat_id,
					s_user_id : parseInt(req_data['ser_user_id']),
					r_user_id : parseInt(req_data['r_user_id']),
					message : req_data['msg_text']
				};
				tokenAnalyzer.tokenAnalyzer(con,msg_obj);
				console.log('abc');
				u_socket.SEvents.emit("newMsg",req_data['ser_user_id'],msg_obj);
				u_socket.SEvents.emit("newMsg",req_data['r_user_id'],msg_obj);
				res.json({api_err : ""});
				res.end();
			}
		});
	}else{
		res_obj = {api_err : "Incorrect data",page_name : "LogIn"};
		res.json(res_obj);
		res.end();
	}
}
