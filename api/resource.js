exports.active_user = {};
exports.user_socket = {};
const Events = require('events');
class SocketEvents extends Events{}
exports.SEvents = new SocketEvents();