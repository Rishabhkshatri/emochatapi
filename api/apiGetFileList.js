exports.getFileList = (req,res)=>{
	let req_data = req.body;
	let res_obj;
	is_valid = true;
	if(req_data['ser_user_id'] === undefined){
		is_valid = false;
	}

	if(is_valid){
		let sql_user = `SELECT A.*,B.user_u_name FROM temo_video AS A, temo_user AS B WHERE A.user_id = B.user_id AND (B.show_video_all = 1 OR B.user_id = ${req_data['ser_user_id']})`;
		// let sql_user = `SELECT A.* FROM temo_video AS A`;
		con.query(sql_user,(err,sql_res,fields)=>{
			if(err){
				res_obj = {api_err : "Server Error",page_name : "LogIn"};
			}else{
				res_obj = {api_err : "",page_name : "Chat",data:{view : "chat_detail",video_list:sql_res}};
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