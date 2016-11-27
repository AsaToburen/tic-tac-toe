
'use strict';

var squares = document.getElementsByTagName('li');
var signUpForm = document.getElementById('signUp');
var overlay = document.getElementById('overlay');
var modal = document.getElementById('modal');
var upNext = document.getElementById('upNext');
var playerData = {};
var turn = 0;
var winner = false;

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
		var match = a.every(function(item){
			return b.includes(item);
		});

		if(match){
			winner = true;
			upNext.innerHTML = '';
			displayModal(team.name);
		}
	}

	if(score.length < 3){
		return;
	} else {
		matrix.forEach(function(testCase){
			arraysContainSame(testCase, score);
		});
	}
}

function initGame(formData) {
	playerData.teamOne = new Team(formData.name1, formData.color1);
	playerData.teamTwo = new Team(formData.name2, formData.color2);

	whosUpNext();

	overlay.classList.add('hide');
}

function updateName(input, heading){
	if(input !== ''){
		document.getElementById(heading).innerHTML = input;
	}
}
function updateColor(input, heading){
	document.getElementById(heading).style.backgroundColor = input;
}

function restartGame() {
	playerData = {};
	upNext.innerHTML = '';
	localStorage.removeItem('playerData');
	overlay.style.display = 'block';
	overlay.classList.remove('hide');
	modal.classList.remove('show');
	winner = false;

	//clear board data
	for(var i = 0, len = squares.length; i < len; i++){
		squares[i].checked = false;
		squares[i].innerHTML = '';
		squares[i].style.color = '';
	}

	//update form settings
	updateName('Player 1', 'title1');
	updateName('Player 2', 'title2');
	updateColor('', 'title1');
	updateColor('', 'title2');

	// clear player 1 inputs
	signUpForm.name1.value = '';
	signUpForm.color1.value = '';

	// clear player 2 inputs
	signUpForm.name2.value = '';
	signUpForm.color2.value = '';

}

function resetGame(){
	playerData.teamOne.score = [];
	playerData.teamTwo.score = [];
	upNext.innerHTML = '';
	modal.classList.remove('show');
	winner = false;

	//remove only score data from localStorage
	if(localStorage.getItem('playerData')){
		var localObject = JSON.parse(localStorage.getItem('playerData'));
		localObject.teamOne.score = [];
		localObject.teamTwo.score = [];
		localStorage.setItem('playerData', JSON.stringify(localObject));
	}

	for(var i = 0, len = squares.length; i < len; i++){
		squares[i].checked = false;
		squares[i].innerHTML = '';
		squares[i].style.color = '';
	}
	whosUpNext();
}

function displayModal(name){
	modal.classList.add('show');
	if(name){
		upNext.innerHTML = '';
		document.getElementById('message').innerHTML = 'Congratulations ' + name + '!';
	} else {
		upNext.innerHTML = '';
		document.getElementById('message').innerHTML = 'DRAW!';
	}
}

// clear board to play again w/ same player data
document.getElementById('resetBtn').onclick = function(){
	resetGame();
};
// clear board and player data
document.getElementById('restartBtn').onclick = function(){
	restartGame();
};

// handle sign-up submit
signUpForm.addEventListener('submit', function(e){
	e.preventDefault(); // prevent default form behavior

	var formData = {};

	// player 1 values
	formData.name1 = signUpForm.name1.value;
	formData.color1 = signUpForm.color1.value;

	// player 2 values
	formData.name2 = signUpForm.name2.value;
	formData.color2 = signUpForm.color2.value;

	// check for empty inputs
	if(!formData.name1 || !formData.color1 || !formData.name2 || !formData.color2) {
		alert('Please complete the player information');
	} else {
		// no empty inputs? ==> Initialize game
		initGame(formData);
	}
});

//register click event handlers on list item boxes
for(var i = 0, len = squares.length; i < len; i++){
	squares[i].onclick = function (e) {
		
		// prevent checked boxes from being selected
		if(this.checked || winner) return;

		if(turn === 0) {
			this.checked = true;
			this.style.color = playerData.teamOne.color;
			this.innerHTML = '<span>X</span>';
			playerData.teamOne.score.push(this.getAttribute('data'));
			turn = 1;
			checkScore(playerData.teamOne);
		} else {
			this.checked = true;
			this.style.color = playerData.teamTwo.color;
			this.innerHTML = '<span>O</span>';
			playerData.teamTwo.score.push(this.getAttribute('data'));
			turn = 0;
			checkScore(playerData.teamTwo);
		}
		whosUpNext();
		localStorage.setItem('playerData', JSON.stringify(playerData));
	};
}

function whosUpNext(){
	var totalScore = playerData.teamOne.score.concat(playerData.teamTwo.score);

	if(!winner && totalScore.length === 9) {
		displayModal(); // draw
	} else if(!winner) {
		var text = turn ? playerData.teamTwo.name : playerData.teamOne.name;
		upNext.innerHTML = "It's your turn " + text;
	}
}

// if playerData in localStorage ==> restore game state
var savedPlayerData = JSON.parse(localStorage.getItem('playerData'));
if(savedPlayerData){

	overlay.style.display = 'none';

	playerData.teamOne = savedPlayerData.teamOne;
	playerData.teamTwo = savedPlayerData.teamTwo;

		//check for winner
	checkScore(playerData.teamOne);
	checkScore(playerData.teamTwo);

	var teamOneScore = playerData.teamOne.score;
	var teamTwoScore = playerData.teamTwo.score;

	//find total length to determine who goes next
	var totalLength = teamOneScore.length + teamTwoScore.length;
	// if totalLength is even ==> teamTwo is next. If odd, team one is next.
	turn = totalLength % 2 ? 1 : 0;
	whosUpNext();

	//iterate over all squares to compare data attributes against each team's array
	for(var i = 0, len = squares.length; i < len; i++){
		//check team one
		for(var j = 0, x = teamOneScore.length; j<x; j++){
			if(teamOneScore[j] === squares[i].getAttribute('data')){
				squares[i].checked = true;
				squares[i].innerHTML = '<span>X</span>';
				squares[i].style.color = savedPlayerData.teamOne.color;
			}
		}
		//check team two
		for(var k = 0, y = teamTwoScore.length; k<y; j++){
			if(teamTwoScore[j] === squares[i].getAttribute('data')){
				squares[i].checked = true;
				squares[i].innerHTML = '<span>O</span>';
				squares[i].style.color = savedPlayerData.teamTwo.color;
			}
		}
	}
}
