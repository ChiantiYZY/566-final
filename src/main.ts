import {vec3, mat4, vec2} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile, parseTxt} from './globals';
import Mesh from './geometry/Mesh';
import Texture from './rendering/gl/Texture';
import { stringify } from 'querystring';
import { format } from 'url';
import Bread from './Bread';
import { cursorTo } from 'readline';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  shape: 'wahoo',
  slice: 0,
};

let screenQuad: ScreenQuad;
let pot:Mesh;
let time: number = 0.0;
let texture2D: Texture;
let texture3D: Texture;

let bread: Bread;

function loadScene() {

  screenQuad = new ScreenQuad();
  screenQuad.create();

  let obj2: string = readTextFile('./src/cube.obj');
  pot = new Mesh(obj2, vec3.fromValues(0, 0, 0));
  pot.create();

  texture2D = new Texture('./src/wahoo.bmp', 0, 2);
  texture3D = new Texture('./src/cube.raw', 0, 3);

}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
  let flag = false;

  var show = { add:function(){ flag = true }};

  // Add controls to the gui
  const gui = new DAT.GUI();

  gui.add(controls, 'shape', ['wahoo', 'sphere']);
  gui.add(controls, 'slice', 0.0, 10.0).step(1.0);
  gui.add(show, 'add').name('Cut the bread');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  //const camera = new Camera(vec3.fromValues(50, 50, 50), vec3.fromValues(50, 50, 50));
  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);


  bread = new Bread();


  let offsetsArray = [];
  let count: number = 0;
  let path: string;
  let path_b: string;

  let curSlice = controls.slice;
  
  if(controls.shape == 'wahoo')
  {
      path = './src/wahoo.txt';
      path_b = './src/wahoo_b.txt';
  }
  else if(controls.shape == 'sphere')
  {
      path = './src/sphere.txt'
  }

  var disArray = bread.calDistance(path, path_b);
 

  pot = bread.drawBread(path, controls.slice, pot, disArray);

  
  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.clear();

    var tmpPath;

    if(controls.shape == 'wahoo')
    {
        tmpPath = './src/wahoo.txt';
    }
    else if(controls.shape == 'sphere')
    {
        tmpPath = './src/sphere.txt'
    }
    
    if(path != tmpPath || controls.slice != curSlice)
    {
       path = tmpPath;
       curSlice = controls.slice;

       pot = bread.drawBread(path, curSlice, pot, disArray);
    }

 
    renderer.render(camera, instancedShader, [pot]);

    renderer.render(camera, flat, [screenQuad]);
    //renderer.render(camera, instancedShader, [petal]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
