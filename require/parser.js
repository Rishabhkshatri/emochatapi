/*
Parse normal and multipart data
*/
const bodyParser = require('body-parser');
var multer  = require('multer');
const cookieParser = require('cookie-parser');

exports.reqParser = (app)=>{
	app.use(cookieParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './uploads')
	  },
	  filename: function (req, file, cb) {
	    let file_type = file.mimetype.split('/');
	    cb(null, 'emovideo'+'-'+Date.now()+'.'+file_type[1]);
	  }
	})

	return multer({ storage: storage });
}