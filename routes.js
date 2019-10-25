exports.routes = (app)=>{

	const apiLogInCheck = require('./api/apiLogInCheck');
	app.post('/',apiLogInCheck.logInCheck);

	const apiLogIn = require('./api/apiLogIn');
	app.post('/LogIn',apiLogIn.logIn);

	const apiRegistration = require('./api/apiRegistration');
	app.post('/Registration',apiRegistration.registration);

	const apiGetChats = require('./api/apiGetChats');
	app.post('/GetChats',apiGetChats.getChats);

	const apiSendMsg = require('./api/apiSendMsg');
	app.post('/SendMsg',apiSendMsg.sendMsg);

	const apiFileUpload = require('./api/apiFileUpload');
	app.post('/FileUpload',apiFileUpload.fileUpload);

	const apiGetFileList = require('./api/apiGetFileList');
	app.post('/GetFileList',apiGetFileList.getFileList);

	const apiGetFile = require('./api/apiGetFile');
	app.get('/GetFile/emovideo\*',apiGetFile.getFile);

	const apiProfileSettings = require('./api/apiProfileSettings');
	app.post('/ProfileSettings',apiProfileSettings.profileSettings);

	const apiGetProfile = require('./api/apiProfileSettings');
	app.post('/GetProfile',apiGetProfile.getProfile);
}