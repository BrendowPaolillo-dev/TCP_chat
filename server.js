/**
 * SERVIDOR 
 * @abstract Receber e redirecionar as mensagens dos clientes
 * 
 * Codes:
 *  1: Join
 *  2: Global message
 * 	3: getUserList
 *  4: Private message
 *  5: Global file share
 *  6: Private file Share
 *  7: Close connection
 */

const WebSocket = require('ws');

const port = 8080;
const hostname = '127.0.0.1';

const server = new WebSocket.Server({
  	port
});

let sockets = [];
let clientsConnected = [];

server.on('connection', function(socket) {
	// Adicionamos cada nova conexão/socket ao array `sockets`
	sockets.push(socket);

	// Quando você receber uma mensagem, enviamos ela para todos os sockets
	socket.on('message', function(msg) {
		manageMessages(msg);
	});
	
	// Quando a conexão de um socket é fechada/disconectada, removemos o socket do array
	socket.on('close', function() {
		closeConnection(socket)
	});
});

console.log(`Server running at http://${hostname}:${port}/`);


function manageMessages(msg) {
	const stringMsg = JSON.parse(base64ToString(msg));
  	const [code, senderName, _, destination, __] = stringMsg;
	

  	switch(code){
      	case 1:
			clientsConnected.push(senderName);
			console.log('Clientes conectados: ', clientsConnected);
			sockets.forEach(s => s.send(msg));
			break;
      	case 2:
			sockets.forEach(s => s.send(msg));
			break;
      	case 3:
			getClientsConnected(senderName);
        	break;
      	case 4:
			findSocketDestination(destination).send(msg)
        	break;
		case 5:
			sockets.forEach(s => s.send(msg));
			break;
		case 6:
			findSocketDestination(destination).send(msg)
			break;
		default:
	        break;
	}

};

function findSocketDestination(destination) {
	return sockets.find(s => s.protocol === destination);
}

function getClientsConnected(senderName) {
	const s = sockets.find(socket => socket.protocol === senderName);
	const msg = [3, senderName, clientsConnected.filter(c => c !== senderName)];
	s.send(toBase64(JSON.stringify(msg)));
};

function closeConnection(socket) {
	const msg = [7, socket.protocol]
	sockets = sockets.filter(s => s !== socket);
	clientsConnected = clientsConnected.filter(c => c !== socket.protocol);
	console.log('Clientes conectados close: ', sockets.length ,clientsConnected);
  	sockets.forEach(s => s.send(toBase64(JSON.stringify(msg))));
};

function toBase64(msg) {
	return Buffer.from(msg).toString('base64')
};

function base64ToString(msg) {
	return Buffer.from(msg, 'base64').toString()
};
