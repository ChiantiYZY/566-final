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
import Background from './Background';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  shape: 'sphere',
  prove_Type: 'home-made',
  slice: 0,
};

let screenQuad: ScreenQuad;
let pot:Mesh;
let time: number = 0.0;
let texture2D: Texture;
let texture3D: Texture;
let bg : Background;

let bread: Bread;

function loadScene() {

  screenQuad = new ScreenQuad();
  screenQuad.create();

  let obj2: string = readTextFile('./src/cube.obj');
  pot = new Mesh(obj2, vec3.fromValues(0, 0, 0));
  pot.create();

  texture2D = new Texture('./src/wahoo.bmp', 0, 2);
  texture3D = new Texture('./src/cube.raw', 0, 3);

  bg = new Background();
  bg.render();
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

  gui.add(controls, 'shape', ['wahoo', 'sphere', 'baguette', 'toast']);
  gui.add(controls, 'prove_Type', ['home-made', 'baguette']);
  gui.add(controls, 'slice', 0.0, 100.0).step(1.0);
  gui.add(show, 'add').name('Prove the bread');

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

  const flatInst = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flatInst-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flatInst-frag.glsl')),
  ]);


  


  let offsetsArray = [];
  let count: number = 0;
  let path: string;
  let path_b: string;

  let curSlice = controls.slice;
  
  let wahoo_size = 128;
  let cube_size = 128;
  let sphere_size = 64;
  let toast_size = 128;
  let size = 0;

  if(controls.shape == 'wahoo')
  {
      path = './src/wahoo.txt';
      path_b = './src/wahoo_b.txt';
      size = wahoo_size;
  }
  else if(controls.shape == 'sphere')
  {
      path = './src/sphere.txt';
      path_b = './src/sphere_b.txt'
      size = sphere_size;
  }
  else if(controls.shape == 'baguette')
  {
      path = './src/shell.txt';
      path_b = './src/shell_b.txt'
      size = cube_size;
  }
  else if(controls.shape == 'toast')
  {
      path = './src/toast.txt';
      path_b = './src/toast_b.txt'
      size = toast_size;
  }


  bread = new Bread(size);

  var type = controls.prove_Type;
  if(controls.prove_Type == 'home-made') bread.proveType = 1;
  else if(controls.prove_Type == 'baguette') bread.proveType = 0;
 
  // bread.calDist(path, path_b);

  bread.passTexture(path, path_b);
  //console.log(bread.textArray);
  // bread.generateBubble();
  
  //pot = bread.drawBread(path, path_b, controls.slice, pot);

  pot = bread.initialBread(controls.slice, pot);

  
  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    flatInst.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.clear();

    var tmpPath;
    var tmpPath_b;

    if(controls.shape == 'wahoo')
    {
        tmpPath = './src/wahoo.txt';
        tmpPath_b = './src/wahoo_b.txt';
        bread.size = wahoo_size;
    }
    else if(controls.shape == 'sphere')
    {
        tmpPath = './src/sphere.txt';
        tmpPath_b = './src/sphere_b.txt'
        bread.size = sphere_size;
    }
    else if(controls.shape == 'baguette')
    {
      tmpPath = './src/shell.txt';
      tmpPath_b = './src/shell_b.txt'
        bread.size = cube_size;
    }
    else if(controls.shape == 'toast')
    {
      tmpPath = './src/toast.txt';
      tmpPath_b = './src/toast_b.txt'
      bread.size = toast_size;
    }

    if(controls.prove_Type != type)
    {
        type = controls.prove_Type;
        if(type == 'home-made') bread.proveType = 1;
        else if(type == 'baguette') bread.proveType = 0;
        bread.generateBubble();
        pot = bread.drawBread(path, tmpPath_b, curSlice, pot);
 
    }


    if(flag == true)
    {
      bread.generateBubble();
      pot = bread.drawBread(path, tmpPath_b, curSlice, pot);
      flag = false;
    }
    
    if(path != tmpPath) 
    {
       path = tmpPath;
       bread.passTexture(path, tmpPath_b);
       pot = bread.initialBread(curSlice, pot);
    }

    if(controls.slice != curSlice)
    {
        curSlice = controls.slice;
        // bread.passTexture(path, path_b);
        // bread.textArray = bread.generateBubble();
        pot = bread.drawBread(path, tmpPath_b, curSlice, pot);
    }

 
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, flatInst, [bg.Croissant]);


    renderer.render(camera, instancedShader, [pot]);

    
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
    flatInst.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);
  flatInst.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
