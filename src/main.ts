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




  let offsetsArray = [];
  let count: number = 0;
  let path: string;

  let curSlice = controls.slice;


  
  if(controls.shape == 'wahoo')
  {
      path = './src/wahoo.txt';
  }
  else if(controls.shape == 'sphere')
  {
      path = './src/sphere.txt'
  }

  offsetsArray = parseTxt(path);
   
  var minX = parseFloat(offsetsArray[0]);
  var maxX = parseFloat(offsetsArray[offsetsArray.length / 3]);


  var cut = (maxX - minX) * 0.1 * curSlice;

  console.log('max is : ' + maxX + ' min is : ' + minX + ' cut is: ' + cut);

  for(let m = 0; m < offsetsArray.length / 3; m++)
  {
        let i = parseFloat(offsetsArray[3 * m]);
        let j = parseFloat(offsetsArray[3 * m + 1]);
        let k = parseFloat(offsetsArray[3 * m + 2]);
        
        if(i < curSlice * 10.0) continue;
        //console.log(i + " " + j + " " + k );
        let transform = mat4.create();
        let translate = mat4.create();
        let scale = mat4.create();

        var trans = vec3.fromValues(i, j, k);
        var scalar = vec3.fromValues(0.05, 0.05, 0.05);
        mat4.fromScaling(scale, scalar);
        mat4.fromTranslation(translate, trans);

        mat4.multiply(transform, transform, scale);
        mat4.multiply(transform, transform, translate);

        pot.transArray1.push(transform[0]);
        pot.transArray1.push(transform[1]);
        pot.transArray1.push(transform[2]);
        pot.transArray1.push(transform[3]);

        pot.transArray2.push(transform[4]);
        pot.transArray2.push(transform[5]);
        pot.transArray2.push(transform[6]);
        pot.transArray2.push(transform[7]);

        pot.transArray3.push(transform[8]);
        pot.transArray3.push(transform[9]);
        pot.transArray3.push(transform[10]);
        pot.transArray3.push(transform[11]);

        pot.transArray4.push(transform[12]);
        pot.transArray4.push(transform[13]);
        pot.transArray4.push(transform[14]);
        pot.transArray4.push(transform[15]);
  
        pot.colorsArray.push(1.0);
        pot.colorsArray.push(0.0);
        pot.colorsArray.push(k / 50.0);
        pot.colorsArray.push(1.0); // Alpha channel

        count ++;

  }
  let colors: Float32Array = new Float32Array(pot.colorsArray);
  let col1: Float32Array = new Float32Array(pot.transArray1);
  let col2: Float32Array = new Float32Array(pot.transArray2);
  let col3: Float32Array = new Float32Array(pot.transArray3);
  let col4: Float32Array = new Float32Array(pot.transArray4);
  //let colors: Float32Array = new Float32Array(potColorsArray);
  pot.setInstanceVBOs(col1, col2, col3, col4, colors);
  pot.setNumInstances(count); // grid of "particles"


  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.clear();

    var tmpPath

    if(controls.shape == 'wahoo')
    {
        tmpPath = './src/wahoo.txt';
    }
    else if(controls.shape == 'sphere')
    {
        tmpPath = './src/sphere.txt'
    }
    
    if(path != tmpPath)
    {
      pot.colorsArray = [];
      pot.transArray1 = [];
      pot.transArray2 = [];
      pot.transArray3 = [];
      pot.transArray4 = [];

      var count = 0;
      path = tmpPath;

      var offsetsArray = parseTxt(path);
   

      for(let m = 0; m < offsetsArray.length / 3; m++)
      {
            let i = parseFloat(offsetsArray[3 * m]);
            let j = parseFloat(offsetsArray[3 * m + 1]);
            let k = parseFloat(offsetsArray[3 * m + 2]);
            
            if(i < curSlice * 10.0) continue;
    
            //console.log(i + " " + j + " " + k );
            let transform = mat4.create();
            let translate = mat4.create();
            let scale = mat4.create();
    
            var trans = vec3.fromValues(i, j, k);
            var scalar = vec3.fromValues(0.05, 0.05, 0.05);
            mat4.fromScaling(scale, scalar);
            mat4.fromTranslation(translate, trans);
    
            mat4.multiply(transform, transform, scale);
            mat4.multiply(transform, transform, translate);
    
            pot.transArray1.push(transform[0]);
            pot.transArray1.push(transform[1]);
            pot.transArray1.push(transform[2]);
            pot.transArray1.push(transform[3]);
    
            pot.transArray2.push(transform[4]);
            pot.transArray2.push(transform[5]);
            pot.transArray2.push(transform[6]);
            pot.transArray2.push(transform[7]);
    
            pot.transArray3.push(transform[8]);
            pot.transArray3.push(transform[9]);
            pot.transArray3.push(transform[10]);
            pot.transArray3.push(transform[11]);
    
            pot.transArray4.push(transform[12]);
            pot.transArray4.push(transform[13]);
            pot.transArray4.push(transform[14]);
            pot.transArray4.push(transform[15]);
      
            pot.colorsArray.push(1.0);
            pot.colorsArray.push(0.0);
            pot.colorsArray.push(k / 50.0);
            pot.colorsArray.push(1.0); // Alpha channel
    
            count ++;
    
      }
      let colors: Float32Array = new Float32Array(pot.colorsArray);
      let col1: Float32Array = new Float32Array(pot.transArray1);
      let col2: Float32Array = new Float32Array(pot.transArray2);
      let col3: Float32Array = new Float32Array(pot.transArray3);
      let col4: Float32Array = new Float32Array(pot.transArray4);
      //let colors: Float32Array = new Float32Array(potColorsArray);
      pot.setInstanceVBOs(col1, col2, col3, col4, colors);
      pot.setNumInstances(count); // grid of "particles"
    }


    if(controls.slice != curSlice)
    {
      pot.colorsArray = [];
      pot.transArray1 = [];
      pot.transArray2 = [];
      pot.transArray3 = [];
      pot.transArray4 = [];

      var count = 0;

      var offsetsArray = parseTxt(path);
      curSlice = controls.slice;

      var minX = parseFloat(offsetsArray[0]);
      var maxX = parseFloat(offsetsArray[offsetsArray.length / 3]);
    
      

      for(let m = 0; m < offsetsArray.length / 3; m++)
      {

        //if(blockArray[m] == 'true') continue;
            let i = parseFloat(offsetsArray[3 * m]);
            let j = parseFloat(offsetsArray[3 * m + 1]);
            let k = parseFloat(offsetsArray[3 * m + 2]);

            if( i < curSlice * 10.0) continue;
            //console.log(i + " " + j + " " + k );
            let transform = mat4.create();
            let translate = mat4.create();
            let scale = mat4.create();
    
            var trans = vec3.fromValues(i, j, k);
            var scalar = vec3.fromValues(0.05, 0.05, 0.05);
            mat4.fromScaling(scale, scalar);
            mat4.fromTranslation(translate, trans);
    
            mat4.multiply(transform, transform, scale);
            mat4.multiply(transform, transform, translate);
    
            pot.transArray1.push(transform[0]);
            pot.transArray1.push(transform[1]);
            pot.transArray1.push(transform[2]);
            pot.transArray1.push(transform[3]);
    
            pot.transArray2.push(transform[4]);
            pot.transArray2.push(transform[5]);
            pot.transArray2.push(transform[6]);
            pot.transArray2.push(transform[7]);
    
            pot.transArray3.push(transform[8]);
            pot.transArray3.push(transform[9]);
            pot.transArray3.push(transform[10]);
            pot.transArray3.push(transform[11]);
    
            pot.transArray4.push(transform[12]);
            pot.transArray4.push(transform[13]);
            pot.transArray4.push(transform[14]);
            pot.transArray4.push(transform[15]);
      
            pot.colorsArray.push(1.0);
            pot.colorsArray.push(0.0);
            pot.colorsArray.push(k / 50.0);
            pot.colorsArray.push(1.0); // Alpha channel
    
            count ++;
    
      }
      let colors: Float32Array = new Float32Array(pot.colorsArray);
      let col1: Float32Array = new Float32Array(pot.transArray1);
      let col2: Float32Array = new Float32Array(pot.transArray2);
      let col3: Float32Array = new Float32Array(pot.transArray3);
      let col4: Float32Array = new Float32Array(pot.transArray4);
      //let colors: Float32Array = new Float32Array(potColorsArray);
      pot.setInstanceVBOs(col1, col2, col3, col4, colors);
      pot.setNumInstances(count); // grid of "particles"

      flag  = false;

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
