// inner variables
var canvas, context; // canvas and context objects

//images
var backgroundImage,imgDrown, imgSteel, imgWater, imgbulldozer;
var imgTower, imgFall, imgShadow; 
var imgup,imgdn,imglt,imgrt,imgP;

var repeat;
				

var aMap; // map array
var obulldozer; // bulldozer object
var otower;//tower object
var oExplosionImage;//falling image

// arrays
var explosions = []; // array of explosions

var iCurCelY,iCurCelX;
var iCellSize = window.innerWidth*4/100; // cell wide  window.innerHeight
var iXCnt = 26; // amount of X cells
var iYCnt = 26; // amount of Y cells
var mouse;
var time=0;
var iScore=0;
var endMsg;
var noT=11;
var pause=false;

	var level=3;
    var diffi=2;
	var k=0;

function setLevel(var1) {
    localStorage.setItem('myItem', var1);
}

function getLevel() {
    level = null;
    if (localStorage.getItem('myItem')) {
        level = localStorage.getItem('myItem');
    }
}
	
function setDiffi(var2) {
    localStorage.setItem('myItem1', var2);
}

function getDiffi() {
    diffi = null;
    if (localStorage.getItem('myItem1')) {
        diffi = localStorage.getItem('myItem1');
		
    }
}
	
	
// objects :
function bulldozer(x, y, w, h, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
	
    this.i = 0;
    this.image = image;
}

bulldozer.prototype.getBounds = function () {
  return {
    x: this.x - this.w/2,
    y: this.y - this.h/2,
    width: this.w,
    height: this.h
  };
};

function Explosion(x, y, w, h, sprite, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.sprite = sprite;
    this.image = image;
}

// functions
function clear() { // clear canvas function
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawScene() { // main drawScene function
	
	if(!pause)
	{
    clear(); // clear canvas
	if(noT==0)
	{
			context.drawImage(backgroundImage, 0, 0 , canvas.width, canvas.height);
            context.font = '40px Verdana';
            context.fillStyle = '#ff0';
            context.fillText('Win!!!!!', 50, 200);
			context.fillText('your score: ' + iScore * 10 + ' points', 50, 250);
			context.fillText('Opponent score: ' + oppScore, 50, 50);
			window.setTimeout(function() {
				//window.location.href = unescape(window.location.pathname);
				window.location="win.html"
			}, 1000);
			return;
	}
		time += 1;
		oppScore = time * 110 / 1000;
		oppScore = parseInt(oppScore, 10);
		document.title = 'Opponent: ' + oppScore;
        if (time > 30000) 
		{ // Finish after 30s
            

            // draw score
			context.drawImage(backgroundImage, 0, 0 , canvas.width, canvas.height);
            context.font = '40px Verdana';
            context.fillStyle = '#ff0';
            context.fillText('Time Up!!!!!', 50, 200);
			context.fillText('your score: ' + iScore * 10 + ' points', 50, 250);
			context.fillText('Opponent score: ' + oppScore, 50, 300);
			window.setTimeout(function() {
				//window.location.href = unescape(window.location.pathname);
				window.location="lose.html"
			}, 1000);
            return;
        }

	
	// draw background
    context.drawImage(backgroundImage, 0, 0 , canvas.width, canvas.height);

    // save current context
    context.save();

    // walk through our array
    for (var y = 0; y < iYCnt; y++) 
	{ 
        for (var x = 0; x < iXCnt; x++) 
		{
            switch (aMap[y][x]) 
			{
                case 0: // skip
                    break;
                case 2: // draw steel block
                    context.drawImage(imgSteel, 0, 0, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
                case 4: // draw water block
                    context.drawImage(imgWater, 0, 0, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 11: // fall
					context.drawImage(imgFall, 0, 0, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 12: // fall
					context.drawImage(imgFall, 1*24, 0, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
                case 14: // draw building shadow
                    context.drawImage(imgShadow, 0, 0, 24, 2*24, x*iCellSize-3, (y-1)*iCellSize+3, iCellSize, 2*iCellSize);
                    break;
            }
        }
    }

    // restore current context
    context.restore();

    // draw bulldozer
    context.drawImage(obulldozer.image, obulldozer.i*48, 0, 48, 48, obulldozer.x, obulldozer.y, obulldozer.w, obulldozer.h);
	window.scrollTo(obulldozer.x+(window.innerWidtht/2), obulldozer.y-(window.innerHeight/2));
 
	// draw explosions
        if (explosions.length > 0) 
		{
            for (var key in explosions) 
			{
                if (explosions[key] != undefined) 
				{
                    // display explosion sprites
                    context.drawImage(explosions[key].image, explosions[key].sprite*48, 0, 48, 90, explosions[key].x, explosions[key].y, explosions[key].w, explosions[key].h);
						explosions[key].sprite++;
					
                    // remove an explosion object when it expires
                    if (explosions[key].sprite > 11) 
					{
                        delete explosions[key];
                    }
                }
            }
        }

 	
    
	
    // walk through our array
    for (var y = 0; y < iYCnt; y++) 
	{ 
        for (var x = 0; x < iXCnt; x++) 
		{
            switch (aMap[y][x]) 
			{
				case 5: // tower
					context.drawImage(imgTower, 0, 2*24, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 6: // tower
					context.drawImage(imgTower, 0, 1*24, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 7: // tower
					context.drawImage(imgTower, 0, 0, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 8: // tower
					context.drawImage(imgTower, 1*24, 2*24, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 9: // tower
					context.drawImage(imgTower, 1*24, 1*24, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
				case 10: // tower
					context.drawImage(imgTower, 1*24, 0, 24, 24, x*iCellSize, y*iCellSize, iCellSize, iCellSize);
                    break;
                case 13: // draw Drown block
                    context.drawImage(imgDrown, 0, 0, 2*24, 2*24, x*iCellSize, (y-1)*iCellSize, 2*iCellSize, 2*iCellSize);
                    break;
				case 1: //End
							var snd = new Audio("audio/drown.ogg"); // buffers automatically when created
							snd.volume=.3;
							snd.play();
					var bgmusic=document.getElementById('bgmusic');
					bgmusic.pause();
					context.font = '40px Verdana';
					endMsg="oops";
					context.fillStyle = '#ff0';
					context.fillText('OOPS!!!!!', 50, 200);
					context.fillText('your score: ' + iScore * 10 + ' points', 50, 250);
					context.fillText('Opponent score: ' + oppScore, 50, 50);
			window.setTimeout(function() {
				//window.location.href = unescape(window.location.pathname);
				window.location="lose.html"
			}, 10);
					return;
					break;
            }
        }
    }

	}

}
// -------------------------------------------------------------
function loadDiffi()
{
	switch(diffi)
	{
	case '1':
    aMap = ([
      [02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02],
      [02, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 05, 08, 14, 00, 00, 00, 07, 10, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 02],
      [02, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 02],
      [02, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 05, 08, 14, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 07, 10, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 05, 08, 14, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02]
    ]);
	break;
	
	case '2':
    aMap = ([
      [02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02],
      [02, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 00, 00, 02, 02, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 05, 08, 14, 00, 00, 00, 07, 10, 02, 02, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02, 02, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 02, 02, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 02],
      [02, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 02, 02, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 02],
      [02, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 02],
      [02, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 02, 02, 02, 07, 10, 00, 00, 00, 00, 00, 05, 08, 14, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02, 06, 09, 00, 02, 02, 00, 00, 00, 00, 02, 02],
      [02, 00, 07, 10, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 05, 08, 14, 02, 02, 00, 00, 00, 00, 02, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 00, 02],
      [02, 00, 05, 08, 14, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 07, 10, 02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 05, 08, 14, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 06, 09, 00, 00, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 05, 08, 14, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 02],
      [02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02]
    ]);
	break;
	
	case '3':
    aMap = ([
      [02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02],
      [02, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 05, 08, 14, 02, 02, 02, 02, 02, 02, 02, 02, 02, 05, 08, 14, 02, 02, 02, 02, 02, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 00, 00, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 02],
      [02, 00, 00, 02, 02, 02, 02, 02, 02, 07, 10, 00, 02, 02, 02, 02, 02, 02, 02, 02, 05, 08, 14, 00, 00, 02],
      [02, 00, 00, 02, 00, 00, 00, 00, 00, 06, 09, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 02],
      [02, 00, 00, 02, 00, 00, 00, 00, 00, 05, 08, 14, 00, 02, 02, 02, 02, 02, 02, 02, 02, 02, 00, 00, 00, 02],
      [02, 00, 00, 02, 07, 10, 00, 00, 00, 00, 00, 00, 00, 02, 00, 00, 00, 00, 00, 00, 00, 00, 07, 10, 00, 02],
      [02, 00, 00, 02, 06, 09, 00, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 00, 06, 09, 00, 02],
      [02, 00, 00, 02, 05, 08, 14, 00, 00, 00, 00, 00, 02, 02, 00, 00, 00, 02, 02, 02, 02, 02, 05, 08, 14, 02],
      [02, 00, 00, 02, 00, 00, 02, 02, 02, 02, 02, 02, 02, 02, 00, 00, 00, 02, 02, 02, 00, 00, 00, 00, 02, 02],
      [02, 00, 07, 10, 00, 00, 00, 00, 00, 00, 07, 10, 00, 02, 00, 00, 00, 02, 02, 02, 00, 00, 00, 00, 02, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 00, 00, 06, 09, 00, 02, 00, 00, 00, 02, 00, 02, 02, 00, 00, 00, 00, 02],
      [02, 00, 05, 08, 02, 00, 00, 02, 02, 02, 05, 08, 02, 02, 00, 00, 00, 02, 00, 00, 00, 00, 00, 00, 04, 02],
      [02, 02, 00, 00, 02, 00, 00, 02, 00, 00, 00, 00, 00, 02, 00, 00, 00, 02, 00, 00, 00, 00, 00, 04, 04, 02],
      [02, 02, 00, 02, 02, 00, 00, 02, 00, 00, 00, 00, 00, 02, 00, 00, 00, 02, 00, 00, 00, 00, 04, 04, 04, 02],
      [02, 00, 00, 00, 02, 00, 00, 02, 00, 00, 00, 00, 00, 02, 00, 00, 00, 02, 00, 00, 00, 04, 04, 04, 04, 02],
      [02, 00, 00, 00, 00, 00, 00, 02, 00, 00, 00, 00, 00, 02, 00, 00, 00, 07, 10, 00, 04, 04, 04, 04, 04, 02],
      [02, 00, 00, 00, 00, 00, 00, 02, 00, 00, 00, 00, 00, 02, 00, 00, 00, 06, 09, 00, 04, 04, 04, 04, 04, 02],
      [02, 00, 07, 10, 02, 02, 02, 02, 00, 00, 00, 00, 00, 02, 00, 00, 00, 05, 08, 14, 04, 04, 04, 04, 04, 02],
      [02, 00, 06, 09, 00, 00, 00, 00, 02, 02, 02, 02, 02, 02, 00, 00, 00, 00, 00, 00, 04, 04, 04, 04, 04, 02],
      [02, 00, 05, 08, 14, 00, 00, 00, 02, 02, 00, 00, 00, 00, 00, 00, 00, 02, 00, 00, 04, 04, 04, 04, 04, 02],
      [02, 00, 00, 00, 00, 00, 00, 00, 00, 02, 00, 00, 00, 00, 00, 00, 00, 02, 00, 00, 04, 04, 04, 04, 04, 02],
      [02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02, 02]
    ]);
	break;
	}
}

function loadImg()
{
	// load background image
    backgroundImage = new Image();
    backgroundImage.src = 'images/arena'+level+'.jpg';
    backgroundImage.onload = function() {
    }
    backgroundImage.onerror = function() {
        console.log('Error loading the background image.');
    }
	
	imgDrown = new Image();
    imgDrown.src = 'images/drown'+level+'.png';
    imgSteel = new Image();
    imgSteel.src = 'images/steel'+level+'.png';
    imgWater = new Image();
    imgWater.src = 'images/water'+level+'.png';
	
	
	imgTower = new Image();
	imgTower.src = 'images/tower'+level+'.png';
	imgShadow = new Image();
	imgShadow.src = 'images/shadow'+level+'.png';
	imgFall = new Image();
	imgFall.src = 'images/fall'+level+'.png';
	
    // initialization of explosion image
    oExplosionImage = new Image();
    oExplosionImage.src = 'images/explosion'+level+'.png';
    oExplosionImage.onload = function() { }
	
    setInterval(drawScene, 100); // loop drawScene
}

// initialization
function start(){
    canvas = document.getElementById('scene');
    canvas.width  = iXCnt * iCellSize;
    canvas.height = iYCnt * iCellSize;
    context = canvas.getContext('2d');

    getDiffi();
    // main scene Map array
	loadDiffi();

	getLevel();
    // load images
	loadImg();
    

    imgbulldozer = new Image();
    imgbulldozer.src = 'images/bulldozer.png';
    obulldozer = new bulldozer(iCellSize*10, iCellSize*23, iCellSize*2, iCellSize*2, imgbulldozer);
	
	imgup = document.getElementById("up");
	imgdn = document.getElementById("down");
	imglt = document.getElementById("lt");
	imgrt = document.getElementById("rt");
	imgP = document.getElementById("p");
	
	
}



$(window).keydown(function (evt){ // onkeydown event handle
        press(evt.keyCode);
    });      


function press(k) 
{ // keyboard alerts		
if (k == 65) {
	pause=!pause;
	imgP.src='images/p'+pause+'.png';
}
	if(!pause)
		{
				window.scrollTo(obulldozer.x+(window.innerWidtht/2),obulldozer.y-(window.innerHeight/2));
				
                iCurCelY = obulldozer.y / iCellSize;
				iCurCelY = Math.round(iCurCelY);
                iCurCelX = obulldozer.x / iCellSize;
				iCurCelX = Math.round(iCurCelX);
				var cur = aMap[iCurCelY][iCurCelX];
				
				function update(X,Y) {
						aMap[Y][X] = 11;
						aMap[Y][X+1] = 12;
						aMap[Y][X+2] = 0;
						aMap[Y-1][X] = 0;
						aMap[Y-1][X+1] = 0;
						aMap[Y-2][X] = 0;
						aMap[Y-2][X+1] = 0;
							//play music
							var snd = new Audio("audio/fall1.ogg"); // buffers automatically when created
							snd.volume=.3;
							snd.play();

                        explosions.push(new Explosion(X*iCellSize,(Y-2)*iCellSize, iCellSize*2, iCellSize*90 / 24, 0, oExplosionImage));
				}
                    if(cur == 5) {//tower
						iScore++; 
						noT--;
						update(iCurCelX,iCurCelY);
					}
					else if(cur == 8) {//tower
						iScore++; 
						noT--;
						update(iCurCelX-1,iCurCelY);
					}
				
        switch (k) {			
            case 38: // Up key
                obulldozer.i = 2;
				imgup.src='images/upP.png';
				imgdn.src='images/down.png';
				imglt.src='images/lt.png';
				imgrt.src='images/rt.png';

                // checking collisions
                if (iCurCelY) {
                    var t1 = aMap[iCurCelY-1][iCurCelX];
                    var t2 = aMap[iCurCelY-1][iCurCelX+1];
					if (!(t1 == 2 || t2 == 2))//obstruction
                        obulldozer.y-=6;
					
					if (t1 == 4 || t2 == 4) {//water
						var x;
						if(t1 == 4 && t2 == 4)x=0;
						else if(t2 == 4)x=1;
						else x=-1;
						aMap[iCurCelY-1][iCurCelX+x] = 13;
						obulldozer.i=4;
						aMap[25][25]=1;
					}
                }
                break;
            case 40: // Down key
                obulldozer.i = 3;
				imgup.src='images/up.png';
				imgdn.src='images/downP.png';
				imglt.src='images/lt.png';
				imgrt.src='images/rt.png';
                // checking collisions
                if (iCurCelY+2 < iYCnt) {
                    var t1 = aMap[iCurCelY+2][iCurCelX];
                    var t2 = aMap[iCurCelY+2][iCurCelX+1];
					if (!(t1 == 2 || t2 == 2))
                        obulldozer.y+=6;
					
					if (t1 == 4 || t2 == 4) {
						var x;
						if(t1 == 4 && t2 == 4)x=0;
						else if(t2 == 4)x=1;
						else x=-1;
						aMap[iCurCelY+3][iCurCelX+x] = 13;
						obulldozer.i=4;
						aMap[25][25]=1;
					}
                }
                break;
            case 37: // Left key
                obulldozer.i = 1;
				imgup.src='images/up.png';
				imgdn.src='images/down.png';
				imglt.src='images/ltP.png';
				imgrt.src='images/rt.png';

                // checking collisions
                var t1 = aMap[iCurCelY][iCurCelX-1];
                var t2 = aMap[iCurCelY+1][iCurCelX-1];
					if (!(t1 == 2 || t2 == 2))
                   obulldozer.x-=6;

					if (t1 == 4 || t2 == 4) {
						var x;
						if(t1 == 4 && t2 == 4)x=1;
						else if(t2 == 4)x=2;
						else x=0;
						aMap[iCurCelY+x][iCurCelX-2] = 13;
						obulldozer.i=4;
						aMap[25][25]=1;
					}
				break;
            case 39: // Right key
                obulldozer.i = 0;
				imgup.src='images/up.png';
				imgdn.src='images/down.png';
				imglt.src='images/lt.png';
				imgrt.src='images/rtP.png';

                // checking collisions
                var t1 = aMap[iCurCelY][iCurCelX+2];
                var t2 = aMap[iCurCelY+1][iCurCelX+2];
					if (!(t1 == 2 || t2 == 2))
                    obulldozer.x+=6;

					if (t1 == 4 || t2 == 4) {
						var x;
						if(t1 == 4 && t2 == 4)x=1;
						else if(t2 == 4)x=2;
						else x=0;
						aMap[iCurCelY+x][iCurCelX+2] = 13;
						obulldozer.i=4;
						aMap[25][25]=1;
					}
                break;
        }
				clearTimeout(repeat);
				repeat=window.setTimeout(function() {
				press(k);
				},5);
    }
}