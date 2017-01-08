var scene = undefined;
var camera = undefined;
var renderer = undefined;
var controls = undefined;

var y_position = 0;

function initWebGL() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75, 
		window.innerWidth / window.innerHeight, 
		0.1, 
		1000
	);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
//    renderer.setClearColor( 0xeeeeee, 0);
    
    //scene.captureAllKeyboardInput = false;
    
    
	document.getElementById('container').appendChild(renderer.domElement);
    
	controls = new THREE.TrackballControls(camera);
	controls.staticMoving = false;

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.target = new THREE.Vector3(0.8, 1, 0.5);
	scene.add(light);

	// fix camera
	camera.position.z = 25;
    
	// gogogo
	render();
    
}

function render() {
	onRender();

	controls.update();

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function onRender() {
	if(!MIDI.Player.playing)
		return;
    
	camera.position.y -= config.speed;
	y_position -= config.speed;

	controls.target = new THREE.Vector3(0, y_position, 0);
}

/* POPRAVLJENO ZA VEC INSTRUMENTOV */

function drawOnNote(data, channelsInstruments, pathView) {
	var geometry = new THREE.CubeGeometry(0.2, 0.2, 0.2);
    
    // new color definition
    var clrval = getColor(data.note, data.channel, channelsInstruments);
    var clr = new THREE.Color(); //"hsl(0, 100%, 50%)"
    clr.setHSL(clrval[0], clrval[1], clrval[2]);
	var material = new THREE.MeshBasicMaterial({
		color: clr
	});
	var cube = new THREE.Mesh(geometry, material);

    // za explode
    var insideCh = -40 + (data.note / 10);
    var chPos = (data.channel * Object.keys(channelsInstruments).length);
    
    
    if(pathView === 'explode') {
        //    PREJ: v vrsti 
        cube.position.x = insideCh + chPos;
        // (window.innerWidth * data.channel) / Object.keys(channelsInstruments).length  + (data.note / 10) - (window.innerWidth/2/100);
        //    console.log("x:", cube.position.x);
        
        cube.position.y = y_position;
//    console.log("y:", cube.position.y);
    
        
        if(config.all_dimensions) {
//            v vrsti
            cube.position.z = data.velocity / 100;
        }
    }
    else if(pathView === 'circle') {
        //    V KROGU
        var numCh = Object.keys(channelsInstruments).length;
        var ch = data.channel;
        var angle = 360/numCh;

        var radian = angle * (Math.PI / 180);
        var wantedRadian = ch*radian;

        var circleX = Math.cos(wantedRadian);
        var circleZ = Math.sin(wantedRadian);
        
        cube.position.x = circleX + insideCh;
        
        cube.position.y = y_position;
//    console.log("y:", cube.position.y);
    
        if(config.all_dimensions) {

            cube.position.z = circleZ + insideCh;
            cube.position.z += data.velocity / 100;   
//          console.log("z:", cube.position.z);
        }
        
    }
    else if(pathView === 'merged') {
        cube.position.x = -5 + data.note / 10;
        //    console.log("x:", cube.position.x);
        
        cube.position.y = y_position;
//    console.log("y:", cube.position.y);
    
        
        if(config.all_dimensions) {
//            v vrsti
            cube.position.z = data.velocity / 100;
        }
    }

        
	scene.add(cube);

	// delete old nodes
	if(scene.children.length > config.maxObjectNum) {
		scene.remove(scene.children[0]);
	}
}

function d2h(d) {
	var str = '00' + d.toString(16);
	return str.substr(str.length - 2)
}

// SPREMENI ZA VEC KANALOV
function getColor(note, channel, chins) {
//	var startColor = config.startColor;
//	var endColor = config.endColor;

    var step = note/100;
    
//	var c0 = Math.floor(startColor[0]+(endColor[0] - startColor[0])*step); 
//	var c1 = Math.floor(startColor[1]+(endColor[1] - startColor[1])*step); 
//	var c2 = Math.floor(startColor[2]+(endColor[2] - startColor[2])*step);
    
//	return '#' + d2h(c0) + d2h(c1) + d2h(c2);
    
    var hue = channel / Object.keys(chins).length;
    return [hue, 1, step];
    
}