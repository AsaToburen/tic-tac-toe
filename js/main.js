'use strict';

var squares = document.getElementsByTagName('li');
var signUpForm = document.getElementById('signUp');
var overlay = document.getElementById('overlay');
var teamOne = [];
var teamTwo = [];

signUpForm.addEventListener('submit', function(e){
	e.preventDefault(); // prevent default form behavior

	var playerData = {};

	// player 1 values
	playerData.name1 = signUpForm.name1.value;
	playerData.color1 = signUpForm.color1.value;

	// player 2 values
	playerData.name2 = signUpForm.name2.value;
	playerData.color2 = signUpForm.color2.value;

	// check for empty inputs
	if(!playerData.name1 || !playerData.color1 || !playerData.name2 || !playerData.color2){
		alert('Please complete the player information');
	} else {
		// no empty inputs? ==> Initialize game
		initGame(playerData);
		localStorage.setItem('playerData', playerData);
	}
});

// constructor to create individual teams
function Team(name, color) {
	this.name = name;
	this.color = color;
	this.score = [];
}

function checkScore(team){
	var score = team.score;

	// all available winning combinations
	var matrix = [
		[ "A1", "B1", "C1"],
		[ "A2", "B2", "C2"],
		[ "A3", "B3", "C3"],
		[ "A1", "A2", "A3"],
		[ "B1", "B2", "B3"],
		[ "C1", "C2", "C3"],
		[ "C1", "B2", "A3"],
		[ "A1", "B2", "C3"]
	];

	// function to compare player array against winning arrays
	function arraysContainSame(a, b) {
		var test = a.every(el => b.includes(el));
		if(test){
			console.log( team.name + ' wins');
		}
	}

	if(score.length < 3){
		return
	} else {
		matrix.forEach(function(test){
			arraysContainSame(test, score);
		});
	}
}

function initGame(playerData){
	teamOne = new Team(playerData.name1, playerData.color1);
	teamTwo = new Team(playerData.name2, playerData.color2);

	overlay.classList.add('hide');
}

var turn = 0;
for(var i = 0, len = squares.length; i < len; i++){
	squares[i].onclick = function (e) {
		// prevent checked boxes from being selected
		if(this.checked) return;

		if(turn === 0){
			this.checked = true;
			this.style.backgroundColor = teamOne.color;
			this.innerHTML = 'X';
			teamOne.score.push(this.getAttribute('data'));
			turn = 1;
			checkScore(teamOne);
		} else {
			this.checked = true;
			this.style.backgroundColor = teamTwo.color
			this.innerHTML = 'O';
			teamTwo.score.push(this.getAttribute('data'));
			turn = 0;
			checkScore(teamTwo);
		}
	}
}

if(localStorage.playerData.length){
	overlay.style.display = 'none';
	console.log('initing game', localStorage.getItem('playerData'));
	initGame(localStorage.playerData);
}


