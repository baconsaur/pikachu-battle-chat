$(function() {
	socket = io();
});

$(document).ready(function(){
	var newPlayer = true;
	var playerId;
	socket.emit('new player');

	socket.on('new player', function(id) {
		if(!newPlayer){
			$('.opponents>ul').append('<li class="' + id + '"><img src="http://pokeapi.co/media/img/25.png"><h3>Pikachu ' + id + '</h3><p>HP: <span class="current">100</span>/100</p></li>');
			opponentEventListener();
		} else {
			newPlayer = false;
			playerId = id;
		}
	});

	socket.on('attack', function(attack) {
		var target;
		if(attack.target == playerId){
			target = '.player .current';
		} else {
			target = '.' + attack.target + ' .current';
		}
		$(target).text(attack.damage);
	});

	socket.on('death', function(id) {
		if (id == playerId) {
			$('.opponents img').off('click'); 		
			$('.player img').addClass('dead');
		}
		socket.emit('chat message', 'Pikachu ' + id + ' died');

		var target = '.' + id;
		$(target).addClass('dead');
		setTimeout(function(){
			$(target).remove();
		}, 1000);
	});

	$('form').submit(function(event) {
		event.preventDefault();
		socket.emit('chat message', 'Pikachu ' + playerId + ': ' + $('#m').val());
		$('#m').val('');
	});
	socket.on('chat message', function(message) {
		var newMessage = $('#messages').append('<li>' + message + '</li>');
	});
});

function opponentEventListener () {
	$('.opponents img').addClass('attack');
	$('.opponents img').click(function(event) {
		socket.emit('attack', event.target.parentElement.className);
		cooldown();
	});
}

function cooldown() {
	$('.opponents img').off('click'); 
	$('.opponents img').removeClass('attack');
	setTimeout(function(){
		opponentEventListener();
	}, 1000);
}
