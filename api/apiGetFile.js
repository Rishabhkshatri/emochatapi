var fs = require('fs');
exports.getFile = (req,res)=>{
	let url_arr = req.url.split('/');
	if(url_arr.length === 3 && url_arr[2].length !== 0){
		fs.readFile('./uploads/'+url_arr[2], (err, data) => {
		  if (err)	res.send();
		  res.send(data);
		});
	}
}