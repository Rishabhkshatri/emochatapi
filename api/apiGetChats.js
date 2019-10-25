exports.getChats = (req,res)=>{
	let req_data = req.body;
	let res_obj;
	is_valid = true;
	if(req_data['ser_user_id'] === undefined){
		is_valid = false;
	}else if(req_data['r_user_id'] === undefined){
		is_valid = false;
	}
	if(is_valid){
		let sql_user = `SELECT * FROM temo_chat WHERE s_user_id IN ('${req_data['ser_user_id']}','${req_data['r_user_id']}') AND r_user_id IN ('${req_data['ser_user_id']}','${req_data['r_user_id']}')`;
		con.query(sql_user,(err,sql_res,fields)=>{
			if(err){
				res_obj = {api_err : "Server Error",page_name : "LogIn"};
			}else{
				res_obj = {api_err : "",page_name : "Chat",data:{view : "chat_detail",pre_chat:sql_res}};
			}
			res.json(res_obj);
			res.end();
		});
	}else{
		res_obj = {api_err : "Incorrect data",page_name : "LogIn"};
		res.json(res_obj);
		res.end();
	}
}