var u_socket = require('./resource.js');
exports.fileUpload = (req,res)=>{
	let req_data = req.body;
	let res_obj;
	is_valid = true;
	if(req_data['ser_user_id'] === undefined){
		is_valid = false;
	}else if(req_data['write_file'] === undefined){
		is_valid = false;
	}else{
		req_data['write_file'].single('file')(req, res, function (err) {
			if(err){
				is_valid = false;
		    }

			if(req.file === {}){
				is_valid = false;
			}

			if(is_valid){
				let insert_user = `INSERT INTO temo_video (user_id,video_name) VALUES ('${req_data['ser_user_id']}','${req.file.filename}')`;
				con.query(insert_user,(err,sql_res)=>{
					if(err){
						res_obj = {api_err : "Server Error",page_name : "LogIn"};
						res.json(res_obj);
						res.end();
					}else{
						video_obj = {
							video_id : sql_res.insertId,
							user_id : parseInt(req_data['ser_user_id']),
							user_u_name : req_data['ser_user_u_name'],
							video_name : req.file.filename
						};
						u_socket.SEvents.emit('newVideo');
						res.json({api_err : "", video_data : video_obj});
						res.end();
					}
				});
			}else{
				res_obj = {api_err : "Incorrect data",page_name : "LogIn"};
				res.json(res_obj);
				res.end();
			}
		  })		
	}

	if(!is_valid){
		res_obj = {api_err : "Incorrect data",page_name : "LogIn"};
		res.json(res_obj);
		res.end();
	}


}