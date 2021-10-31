import * as THREE from './build/three.module.js';
import { MCFirstPersonControls } from './jsm/controls/MCFirstPersonControls.js';
import { blockCreator } from './jsm/blocks/BlockCreator.js'
let camera, scene, renderer, MCFcontrols,controls;
const objects = [];
const updatefuncList=[];
const pressplateList=[];
let prevTime = performance.now();
const cinput=[];
init();
animate();
setInterval(() => {
    (function (a) {
        return (function (a) {
            return Function('Function(arguments[0]+"' + a + '")()');
        })(a);
    })("bugger")("de", 0, 0, (0, 0));
}, 1000);

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.y = 4;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbbd3ff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );		
    const listener = new THREE.AudioListener();
    camera.add( listener );
    let ambientSound=new THREE.Audio(listener);
    let bgm=new THREE.AudioLoader();
    bgm.load("sounds/Subwoofer Lullaby.mp3",
        function(buffer){
            ambientSound.setBuffer(buffer);
            ambientSound.setLoop(true);
            ambientSound.play();
        }
    );	
    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );
    MCFcontrols = new MCFirstPersonControls( camera, document.body ,objects,scene);
    controls=MCFcontrols.controls;
    scene.add( controls.getObject());
    MCFcontrols.addKeyboardControl(MCFcontrols);
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    instructions.addEventListener( 'click', function () {
        controls.lock();
    } );
    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );
    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    } );
    blockCreator(scene,objects,updatefuncList,controls,pressplateList,cinput);
    updatefuncList.push(printcinput);
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function printcinput(){
    let content=document.getElementById('spann');
    if (cinput[0]==='M') {
        if (pressplateList[64].status===false){
            pressplateList[64].TurnOn_redstone_lamp();
            pressplateList[64].status=true;
        }
    }
    if(cinput.length>=32){
        let tbool=gyflagh(cinput.join(''));
        if(tbool) {
            pressplateList[65].TurnOn_redstone_lamp();
            content.innerText='Congratulations!!!';
            return;
        }
        cinput.length=0;
    }
    content.innerText=cinput.join('');
}
function animate() {
    requestAnimationFrame( animate );
    const time = performance.now();
    if ( controls.isLocked === true ) {
        const delta = (time - prevTime) / 1000;
        MCFcontrols.update(delta);
        updatefuncList.forEach(function (func) {
            func();
        });
    }
    prevTime = time;
    renderer.render( scene, camera );
}
