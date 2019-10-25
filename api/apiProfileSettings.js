exports.profileSettings = (req,res)=>{ 
	let req_data = req.body;
	let res_obj;
	let is_valid = true;

	if(req_data['ser_user_id'] === undefined){
		is_valid = false;
	}else if(req_data['show_video'] === undefined){
		is_valid = false;
	}

	if(is_valid){
		let update_user = `UPDATE temo_user SET show_video_all = ${req_data['show_video']} WHERE user_id = ${req_data['ser_user_id']}`;
		con.query(update_user,(err,sql_res)=>{
			if(err){
				res_obj = {api_err : "Something went wrong",page_name : ""};
			}else{
				res_obj = {api_err : "",page_name : ""};
			}
			res.json(res_obj);
			res.end();
		});
	}else{
		res_obj = {api_err : "Incorrect data",page_name : ""};
		res.json(res_obj);
		res.end();	
	}
};

exports.getProfile = (req,res)=>{ 
	let req_data = req.body;
	let res_obj;
	let is_valid = true;

	if(req_data['ser_user_id'] === undefined){
		is_valid = false;
	}

	if(is_valid){
		let sql_user = `SELECT show_video_all FROM temo_user WHERE user_id = ${req_data['ser_user_id']}`;
		con.query(sql_user,(err,sql_res)=>{
			if(err){
				res_obj = {api_err : "Something went wrong",page_name : ""};
			}else{
				res_obj = {api_err : "",page_name : "", show_video_all : sql_res[0]['show_video_all']};
			}
			res.json(res_obj);
			res.end();
		});
	}else{
		res_obj = {api_err : "Incorrect data",page_name : ""};
		res.json(res_obj);
		res.end();	
	}
};