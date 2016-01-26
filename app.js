var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var players = [];
var player_id = 0;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
	socket.on('chat message', function(message) {
		io.emit('chat message', message);
	});
	socket.on('new player', function() {
		players.push({
			id: player_id,
			hp: 100
		});
		io.emit('new player', player_id);
		player_id++;
	});
	socket.on('attack', function(id) {
		console.log('attack' + id);
		var damage = Math.floor(Math.random() * 5 + 5);
		players[id].hp -= damage;
		io.emit('attack', {target: id, damage: players[id].hp});
		if (players[id].hp <= 0) {
			io.emit('death', id);
		}
	});
});

app.get('/', function (req, res) {
	res.render('index');
});

server.listen(3000, function(){
	console.log('listening on port 3000');
});
