////////////////////////////////////////////////////////////////////////////////
// Scientific Units Grid
////////////////////////////////////////////////////////////////////////////////


var camera, scene, renderer;
var windowScale;
var cameraControls;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;
var jsonUnitData;
var units;
var fns;
/*
var jsonUnitData = '{' +
   '"name": "units",' +
   '"units": [' +
    '["F", "force", [1, 1, 0, -2]],' +
    '["W", "work", [1, 2, 0, -2]],' +
    '["E", "electric field", [1, 1, -1, -2]],' +
    '["V", "potential", [1, 2, -1, -2]]' +
    '],' +
   '"funcs": [' +
    '["F", "W", "W = Fd"],' +
    '["F", "E", "F = Eq"],' +
    '["E", "V", "V = Ed"],' +
    '["V", "W", "W = Vq"]' +
    '] }'
*/

function readUnitData() {
    // read from file after installing web server
    var jsonResult = $.getJSON("units.json", function (data) {
      jsonUnitData = data; 
      console.log(jsonUnitData); } );
    console.log(jsonResult);
    console.log(jsonUnitData);
    jsonData = JSON.parse(jsonUnitData);
    units = jsonData.units;
    fns = jsonData.funcs;
}

function makeLabel(label, xpos, ypos, zpos) {
	var spritey = makeTextSprite( label, 
		{ fontsize: 64, borderColor: {r:0, g:0, b:180, a:1.0},
		                backgroundColor: {r:120, g:120, b:240, a:0.8} } );

	spritey.position.set(xpos, ypos, zpos);
	spritey.material.depthTest = false;
	scene.add( spritey );
}

function drawSphere(unitLetter, xpos, ypos, zpos) {

	var faceMaterial = new THREE.MeshLambertMaterial( { color: 0xafeeee, opacity: 0.3, transparent: true } );
	
	var sphere = new THREE.Mesh( 
		new THREE.SphereGeometry( 33, 32, 16 ), faceMaterial );
	sphere.position.x = xpos;
	sphere.position.y = ypos;
	sphere.position.z = zpos;
    makeLabel(unitLetter, xpos, ypos, zpos)
	scene.add( sphere );
}	
	
function drawSpheres() {
	for (i = 0; i < units.length; i++) { 
	    thisUnit = units[i];
        unitLetter  = thisUnit[0];
        lPos = thisUnit[2][1];
        qPos = thisUnit[2][2];
        tPos = thisUnit[2][3];
        console.log(unitLetter, lPos, qPos, tPos);
        drawSphere(unitLetter, lPos * 100, qPos * 100, tPos * 100)
    }
}
	
	
function drawGoldCube() {

	var cube;
	var cubeSizeLength = 100;
	var goldColor = "#FFDF00";
	var showFrame = true;
	var wireMaterial = new THREE.MeshBasicMaterial( { color: goldColor, wireframe: showFrame } ) ;

	var cubeGeometry = new THREE.CubeGeometry(cubeSizeLength, cubeSizeLength, cubeSizeLength);

	cube = new THREE.Mesh( cubeGeometry, wireMaterial );
	cube.position.x = 200;	// centered at origin
	cube.position.y = 0;	// centered at origin
	cube.position.z = 0;	// centered at origin
	scene.add( cube );
	
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;
	// SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
//	renderer.setClearColor( scene.fog.color, 1 );
    renderer.setClearColorHex( 0xAAAAAA, 1.0 );
    
	var container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );
	
	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 );
	camera.position.set( -200, 200, -150 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);

	// draw the coordinate grid
	Coordinates.drawGrid({size:1000,scale:0.01});
    Coordinates.drawGrid({size:1000,scale:0.01, orientation:"y"});
	Coordinates.drawGrid({size:1000,scale:0.01, orientation:"z"});
	
	Coordinates.drawAxes({axisLength:200,axisOrientation:"x",axisRadius:1});
	Coordinates.drawAxes({axisLength:200,axisOrientation:"y",axisRadius:1});
	Coordinates.drawAxes({axisLength:200,axisOrientation:"z",axisRadius:1});
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
	}
	renderer.render(scene, camera);
}

/*
function fillScene() {
}
*/

function setupGui() {

	effectController = {
	
		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes,

		dummy: function() {
		}
	};

	var gui = new dat.GUI();
	gui.add(effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var spriteAlignment = THREE.SpriteAlignment.topLeft;
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + ","
	                              + backgroundColor.g + ","
	                              + backgroundColor.b + ","
	                              + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + ","
	                              + borderColor.g + ","
	                              + borderColor.b + ","
	                              + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2,
	          textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture,
		  useScreenCoordinates: false,
		  alignment: spriteAlignment } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}


init();
setupGui();
readUnitData();
drawSpheres();
drawSphere(0,0,0);
drawSphere(0,100,0);
animate();

