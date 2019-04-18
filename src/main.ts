import {vec3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import Texture from './rendering/gl/Texture';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  iteration: 1,
  angle: 1,
  color1: [0.2314 * 255, 0.149 * 255, 0.0],
  color2: [0.9333 * 255, 0.6706 * 255, 0.6706 * 255],
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

  gui.add(controls, 'iteration', 1, 8).step(1);
  gui.add(controls, 'angle', 0, 2).step(0.1);
  gui.addColor(controls, 'color1');
  gui.addColor(controls, 'color2');
  gui.add(show, 'add').name('Do L-System');
  //gui.add(Text, 'shape', [ 'pizza', 'chrome', 'hooray' ] );

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
  let col1Array: number[] ; // scale x
  let col2Array: number[] ; // scale y
  let col3Array: number[] ; // scale z
  let col4Array: number[] ; // translation
  let colorsArray = [];
  let n: number = 10;
  let count: number = 0;
  
  //let raw: string = readTextFile('./src/wahoo.binvox');

  // var rawFile = new XMLHttpRequest();
  //   rawFile.open("GET", './src/wahoo.raw', false);
  // var reader = new FileReader();
  // var raw = reader.readAsBinaryString(rawFile);


  // let raw = [];
  // for(var i = -3; i < 4; i++)
  // {
  //   for(var j = -3; j < 4; j++)
  //   {
  //     for(var k = 0; k < 2; k++)
  //     {
  //         raw.push(0);
  //     }
  //   }
  // }


  for(let i = -n; i < n + 1; i++) {
    for(let j = -n ; j < n + 1; j++) {
      for(let k = -n; k < n; k++)
      {
        
          if(Math.sqrt(Math.abs(i) *  Math.abs(i) + Math.abs(j) * Math.abs(j) + Math.abs(k) *  Math.abs(k)) > n )
          {
            continue;
          }

          // if(i < 0)
          // {
          //   continue;
          // }
          
        let transform = mat4.create();
        let translate = mat4.create();
        let scale = mat4.create();

        var trans = vec3.fromValues(i, j, k);
        var scalar = vec3.fromValues(0.1, 0.1, 0.1);
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
  
        pot.colorsArray.push(Math.abs(i) / n);
        pot.colorsArray.push(Math.abs(i) / n);
        pot.colorsArray.push(Math.abs(i) / n);
        pot.colorsArray.push(1.0); // Alpha channel

        count ++;
      }
    }
  }
  
  let colors: Float32Array = new Float32Array(pot.colorsArray);
  let col1: Float32Array = new Float32Array(pot.transArray1);
  let col2: Float32Array = new Float32Array(pot.transArray2);
  let col3: Float32Array = new Float32Array(pot.transArray3);
  let col4: Float32Array = new Float32Array(pot.transArray4);
  //let colors: Float32Array = new Float32Array(potColorsArray);
  pot.setInstanceVBOs(col1, col2, col3, col4, colors);
  pot.setNumInstances(count); // grid of "particles"
 
  //instancedShader.bindTexToUnit(instancedShader.unifSampler1, texture2D, 0);
  //instancedShader.bind3DTexToUnit(instancedShader.unifSampler2, texture3D, 1);


  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.clear();
 
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
