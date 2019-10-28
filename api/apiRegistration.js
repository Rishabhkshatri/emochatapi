exports.registration = (req,res)=>{ 
	let req_data = req.body;
	let con = req.pool;
	let res_obj;
	let is_valid = true;
	if(req_data.user.length === 0){
		is_valid = false;
	}else if(req_data.name.length === 0){
		is_valid = false;
	}else if(req_data.email.length === 0){
		is_valid = false;
	}else if(req_data.password.length === 0){
		is_valid = false;
	}
	if(is_valid){
		let insert_user = `INSERT INTO temo_user (user_name, user_u_name, user_email, user_password) VALUES ($1,$2,$3,$4)`;
		con.query(insert_user,[req_data['name'],req_data['user'],req_data['email'],req_data['password']],(err,sql_res)=>{
			if(err){
				if(err.constraint === "temo_user_user_u_name_key"){
					res_obj = {api_err : "User Name already exists",page_name : ""};
				}else{
					res_obj = {api_err : "Something went wrong",page_name : ""};
				}
			}else{
				res_obj = {api_err : "",page_name : "LogIn"};
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