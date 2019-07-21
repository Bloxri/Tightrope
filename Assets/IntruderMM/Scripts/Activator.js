#pragma strict

var triggerByUse = false;
var triggerByShoot = false;
var hp = -1;

var triggerByEnter = false;



var objectsToAnimate : GameObject[];
var objectsToStop : GameObject[]; 
var animationNames : String[];


var objectsToEnable : GameObject[];
var objectsToDisable : GameObject[];


var delayTime = 0.0;


var enabledByDefault = true;
var canRedo = false;
var redoTime = 1.0;



var activatorTeam : ActivatorTeam;

var goal = false;
var goalMessage = "Guards Win!";
var goalWinner : GoalWinner;




enum ActivatorTeam {
	Both = 0,
	Guards = 1,
	Intruders = 2
}

enum GoalWinner {
	Guards = 1,
	Intruders = 2,
	Draw = 0
}