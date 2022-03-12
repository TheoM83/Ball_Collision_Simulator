var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballArray = []; 
var screenWidth;
var screenHeight;

//Settings
var multiColorMode = 'false'; //DO NOT TOOOOOOOUCH !!!! 
var coloredCollision = 'false'; //balls getting red after a collision
var ballNumber = 2; //number of balls
var ballSize = 50; //size of the ball
var ballSpeed = 20; //speed of the ball
var dt=0.1; //refresh rate
var menuString = "PARTICLE SIMULATION\n\nA : accelerate \nR : reload \nZ : bigger \nS : smaller \nC : colored collisions \nM : multicolor collisions\n P : spawn ball\nSPACE : pause \nE : exit";

function createball(){
var rdm = Math.floor(Math.random() * 101);
var ball = {
	PosX: getRandomInt(ballSize, screenWidth),
	PosY : getRandomInt(ballSize, 0.9*screenHeight),
	directionX : getRandomInt(0, 100)/200*ballSpeed,
	directionY : getRandomInt(0, 100)/200*ballSpeed,
	ballColor : 'white',
	mass : 1
  };
  ballArray.push(ball)
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function draw(){   
	canvas.width = screenWidth;
    canvas.height = screenHeight;
    for (var i = 0; i < ballNumber; i++) {
		drawBall(i);
	}
}

function drawBall(i){
	if (ctx) { 
		ctx.fillStyle = 'rgb(125, 125, 125)';
		ctx.beginPath();
	    ctx.arc(ballArray[i].PosX, ballArray[i].PosY, ballSize, 0, 2 * Math.PI, false);
	    ctx.fillStyle = ballArray[i].ballColor;
	    ctx.fill();
    }
}

function init(){
	windowSize();

	for (var i = 0; i < ballNumber; i++) {
		createball();
	}
	draw();
	alert(menuString);
	Newframe();
}

function Newframe(){
	windowSize();
	ctx.clearRect(0,0,screenWidth,screenHeight);
	for (var i = 0; i < ballNumber; i++) {
		collideScreen(i);
		noBorderFreeze(i);
		collideBall(i);
		move(i);
	}
	draw();
	setTimeout(Newframe,dt)
}


 
 function move(i){
	 var dt = 0.5;
		ballArray[i].PosX = ballArray[i].PosX + ballArray[i].directionX*dt;
		ballArray[i].PosY = ballArray[i].PosY + ballArray[i].directionY*dt;
 }

 function windowSize(){
	screenWidth  = window.innerWidth - 20 || document.documentElement.clientWidth - 20; 
	screenHeight = window.innerHeight - 20|| document.documentElement.clientHeight - 20; 
}

function distanceBetween2Ball(x1,y1,x2,y2){
	return Math.sqrt(((x1-x2)*(x1-x2))+((y2-y1)*(y2-y1)));
}

function ps(a,b){
	return a[0]*b[0]+a[1]*b[1];
}
function bounceBall(ball1, ball2, dist){
	xSpeeda = ball1.directionX;
	ySpeeda = ball1.directionY;
	xSpeedb = ball2.directionX;
	ySpeedb = ball2.directionY;	
	
	if(ps([xSpeedb-xSpeeda,ySpeedb-ySpeeda],[ball2.PosX-ball1.PosX,ball2.PosY-ball1.PosY])<=0){
		ball1.directionX = (xSpeeda * (ball1.mass - ball2.mass) + (2 * ball1.mass * xSpeedb))/(ball2.mass + ball1.mass);
		ball1.directionY = (ySpeeda * (ball1.mass - ball2.mass) + (2 * ball1.mass * ySpeedb))/(ball2.mass + ball1.mass);
		ball2.directionX = (xSpeedb * (ball2.mass - ball1.mass) + (2 * ball2.mass * xSpeeda))/(ball2.mass + ball1.mass);
		ball2.directionY = (ySpeedb * (ball2.mass - ball1.mass) + (2 * ball2.mass * ySpeeda))/(ball2.mass + ball1.mass);
	}
}

 function collideBall(i){
 	for (var iter = i; iter < ballNumber ; iter++){
		var dist = distanceBetween2Ball(ballArray[i].PosX,ballArray[i].PosY,ballArray[iter].PosX,ballArray[iter].PosY);
 		if ( dist < 2*ballSize && (i != iter)){ 			//renvoi de la balle
 			bounceBall(ballArray[i], ballArray[iter], dist);
 			if (coloredCollision == 'true'){
 				coloredBall(i, 'red');
 				coloredBall(iter, 'red');
 			}
 		}
 	}	 
 }

 function coloredBall(i , color){
 	if (multiColorMode == 'true'){
 		ballArray[i].ballColor = '#' + parseInt(Math.random() * 0xffffff).toString(16);
 		 	}
 	else {
 		ballArray[i].ballColor = 'red';
 	}
 	
 	if (multiColorMode == 'false'){
 		setTimeout(function(){
    	ballArray[i].ballColor = 'white';
	}, 250);
 	}
 	
 }
 
 function noBorderFreeze(i){
	 if (ballArray[i].PosX < 0 + ballSize ) ballArray[i].PosX = 0 + ballSize;
	 if (ballArray[i].PosX > screenWidth - ballSize ) ballArray[i].PosX = screenWidth - ballSize
	 if (ballArray[i].PosY < 0 + ballSize ) ballArray[i].PosY = 0 + ballSize;
	 if (ballArray[i].PosY > screenHeight - ballSize ) ballArray[i].PosY = screenHeight - ballSize;
 }

 function collideScreen(i){
	 if (ballArray[i].PosX <= 0 + ballSize) ballArray[i].directionX = -ballArray[i].directionX;
	 if (ballArray[i].PosX >= screenWidth - ballSize) ballArray[i].directionX = -ballArray[i].directionX;
	 if (ballArray[i].PosY <= 0 + ballSize) ballArray[i].directionY = -ballArray[i].directionY;
	 if (ballArray[i].PosY >= screenHeight - ballSize) ballArray[i].directionY = -ballArray[i].directionY;
 }

document.addEventListener("keydown",function(e){
    //space
    if(e.which == 32){
    		alert("Simulation Paused");
    }

    //Z
    if(e.which == 90){
    		ballSize++;
    }

    //S
    if(e.which == 83){
    	if (ballSize > 1){
    		ballSize--;
    	}	
    	}

    //A
    if(e.which == 65){
    		ballSpeed = ballSpeed + 0.5;
    		for (var i = 0 ; i < ballNumber ; i++){
    			ballArray[i].directionX = ballArray[i].directionX * ballSpeed;
    			ballArray[i].directionY = ballArray[i].directionY * ballSpeed;
    		}
    }

    //C
    if(e.which == 67){
    	if (coloredCollision == 'true') {
    		coloredCollision = 'false';
    	}
    	else {
    		coloredCollision = 'true';
    	}
    }

    if(e.which == 77){
    	if (multiColorMode == 'true') {
    		multiColorMode = 'false';
    	}
    	else {
    		multiColorMode = 'true';
    	}
    }

    //R
    if(e.which == 82){
    		document.location.reload(true);
    }

    //P
    if(e.which == 80){
    		createball();
    		ballNumber++;
    }

    if(e.which == 27){
    		alert(menuString);
    }
})
;