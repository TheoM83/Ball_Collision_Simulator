
//Settings
var ballNumber = 3; //number of balls
var ballSize = 10; //size of the ball
var ballSpeed = 20; //speed of the ball
var dt=0.1; //refresh rate
//////////

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ballArray = []; 
var screenWidth;
var screenHeight;
var multiColorMode = 'false';  
var coloredCollision = 'false';
var menuString = "PARTICLE SIMULATION\n\nR : reload \nZ : bigger \nS : smaller \nC : colored collisions \nM : multicolor collisions\nP : spawn ball\nD : delete ball\nSPACE : pause"; 

//Basic Functions 

function createball(){
var rdm = Math.floor(Math.random() * 101);
var ball = {
	PosX: getRandomInt(ballSize, screenWidth),
	PosY : getRandomInt(ballSize, 0.9*screenHeight),
	direction : [getRandomInt(0, 100)/200*ballSpeed, getRandomInt(0, 100)/200*ballSpeed], //direction[0] : X direction[1] : Y
	ballColor : 'white',
	mass : 1
  };
  ballArray.push(ball)
}

 function move(i){
	 var dt = 0.5;
		ballArray[i].PosX = ballArray[i].PosX + ballArray[i].direction[0]*dt;
		ballArray[i].PosY = ballArray[i].PosY + ballArray[i].direction[1]*dt;
 }

function init(){
	windowSize();
	//create the balls
	for (var i = 0; i < ballNumber; i++) {
		createball();
	}
	draw();
	alert(menuString);
	Newframe();
}

//Draw Functions

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

//Mathematic Functions

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function distanceBetween2Ball(x1,y1,x2,y2){
	return Math.sqrt(((x1-x2)*(x1-x2))+((y2-y1)*(y2-y1)));
}

function ps(a,b){
	return a[0]*b[0]+a[1]*b[1];
}

function nv(v){
	return Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2));
}
function nv2(v){
	return (Math.pow(v[0],2)+Math.pow(v[1],2));
}

function sub(v1, v2){
		return [v1[0] - v2[0], v1[1] - v2[1]];
}

function consProd(c, v){
		return [c * v[0], c *  v[1]];
}

//Collisions 

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
 
 function bounceBall(ball1, ball2, dist){
	vector1 = ball1.direction;
	vector2 = ball2.direction;
	vector1x = ball1.direction[0];
	vector1y = ball1.direction[1];
	vector2x = ball2.direction[0];
	vector2y = ball2.direction[1];	
	var prodscal = ps([vector2x-vector1x,vector2y-vector1y],[ball2.PosX-ball1.PosX,ball2.PosY-ball1.PosY]);
	
	if(prodscal<=0){
		var cnst = nv2([ball1.PosX - ball2.PosX, ball1.PosY - ball2.PosY]);
		var mprod1 = 2*ball2.mass / (ball1.mass + ball2.mass);
		var mprod2 = 2*ball1.mass / (ball1.mass + ball2.mass);
		
		ball1.direction = sub(vector1, consProd(mprod1*prodscal/cnst, [ball1.PosX - ball2.PosX, ball1.PosY - ball2.PosY]));
		ball2.direction = sub(vector2, consProd(mprod2*prodscal/cnst, [ball2.PosX - ball1.PosX, ball2.PosY - ball1.PosY]));
	}
}

  function collideScreen(i){
	 if (ballArray[i].PosX <= 0 + ballSize) ballArray[i].direction[0] = -ballArray[i].direction[0];
	 if (ballArray[i].PosX >= screenWidth - ballSize) ballArray[i].direction[0] = -ballArray[i].direction[0];
	 if (ballArray[i].PosY <= 0 + ballSize) ballArray[i].direction[1] = -ballArray[i].direction[1];
	 if (ballArray[i].PosY >= screenHeight - ballSize) ballArray[i].direction[1] = -ballArray[i].direction[1];
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
 
 //Elastic Screen
 
 function noBorderFreeze(i){
	 if (ballArray[i].PosX < 0 + ballSize ) ballArray[i].PosX = 0 + ballSize;
	 if (ballArray[i].PosX > screenWidth - ballSize ) ballArray[i].PosX = screenWidth - ballSize
	 if (ballArray[i].PosY < 0 + ballSize ) ballArray[i].PosY = 0 + ballSize;
	 if (ballArray[i].PosY > screenHeight - ballSize ) ballArray[i].PosY = screenHeight - ballSize;
 }
 
  function windowSize(){
	screenWidth  = window.innerWidth - 20 || document.documentElement.clientWidth - 20; 
	screenHeight = window.innerHeight - 20|| document.documentElement.clientHeight - 20; 
}

//keyboard interactions

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
	//D
	if(e.which == 68){
    		ballArray.pop();
			if (ballNumber > 0){
				ballNumber--;
			}
    		
    }

    if(e.which == 27){
    		alert(menuString);
    }
})
;