const Events = require('events');
// module level local variable to store active user info
let active_user = {};
let user_socket = {};

// SocketEvents class to access socket.io 
class SocketEvents extends Events{}
var SEvents = new SocketEvents();

// start socket.io only once from the main module 
SEvents.once('startSocket',(http)=>{
	const io = require('socket.io')(http);

	io.on('connection', function(socket){
		// new_user_id to store the current connection user id (using Closer)
		let new_user_id = 0;
		// io.emit('newUser',active_user);

		socket.on('newUser',(cur_user)=>{
			// whenever new user comes store its user_u_name in active_user 
			// and socket info in user_socket 
			new_user_id = cur_user['user_id'];
			active_user[cur_user['user_id']] = cur_user['user_u_name'];
			user_socket[cur_user['user_id']] = socket;
			io.emit('newUser',active_user);    
		});

		socket.on('disconnect',()=>{
			// delete the user info
			delete active_user[new_user_id];
			delete user_socket[new_user_id];
			io.emit('newUser',active_user); 
		});
	});

	io.on('error',(err)=>{
		console.log(err);
	});
	// on new video upload nodify all
	SEvents.on("newVideo",()=>{
		io.emit('newVideo');
	});

	// on new message notify the particular socket
	SEvents.on("newMsg",(u_id,msg_obj)=>{
		user_socket[u_id].emit('newMsg', msg_obj);
	});
});

exports.SEvents = SEvents;