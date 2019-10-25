var getChats = require('./apiGetChats');
var u_socket = require('./resource.js');
var tokenAnalyzer = require('./apiToneAnalyzer');
exports.sendMsg = (req,res)=>{
	let req_data = req.body;
	is_valid = true;
	if(req_data['ser_user_id'] === undefined || req_data['ser_user_id'].length === 0){
		is_valid = false;
	}else if(req_data['r_user_id'] === undefined || req_data['r_user_id'].length === 0){
		is_valid = false;
	}else if(req_data['msg_text'] === undefined || req_data['msg_text'].length === 0){
		is_valid = false;
	}

	if(is_valid){
		tokenAnalyzer.tokenAnalyzer(req_data['msg_text']).then(toneAnalysis => {
			req_data['tone_id'] = "";
			if(toneAnalysis.result.document_tone.tones.length !== 0)
				req_data['tone_id'] = toneAnalysis.result.document_tone.tones[0].tone_id;

	      	insertInDB(req_data,res);
	    })
	    .catch(err => {
	    	req_data['tone_id'] = ""; 
	    	insertInDB(req_data,res);
	    });
	    
	}else{
		res_obj = {api_err : "Incorrect data",page_name : "LogIn"};
		res.json(res_obj);
		res.end();
	}
}

var insertInDB = (req_data,res)=>{
	let res_obj;
	let insert_user = `INSERT INTO temo_chat (s_user_id,r_user_id,message,message_tone) VALUES ('${req_data['ser_user_id']}','${req_data['r_user_id']}','${req_data['msg_text']}','${req_data['tone_id']}')`;
	con.query(insert_user,(err,sql_res)=>{
		if(err){
			res_obj = {api_err : "Server Error",page_name : "LogIn"};
			res.json(res_obj);
			res.end();
		}else{
			msg_obj = {
				chat_id : sql_res.insertId,
				s_user_id : parseInt(req_data['ser_user_id']),
				r_user_id : parseInt(req_data['r_user_id']),
				message : req_data['msg_text'],
				message_tone : req_data['tone_id']
			};
			u_socket.SEvents.emit("newMsg",req_data['ser_user_id'],msg_obj);
			u_socket.SEvents.emit("newMsg",req_data['r_user_id'],msg_obj);
			res.json({api_err : ""});
			res.end();
		}
	});
}