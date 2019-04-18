import { gl } from '../../globals';
import {readTextFile} from '../../globals';
import {handleFileSelect} from '../../globals';

export class Texture {
  texture: WebGLTexture;

  bindTex() {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  bind3DTex() {
    gl.bindTexture(gl.TEXTURE_3D, this.texture);
  }


  handle(): WebGLTexture {
    return this.texture;
  }

  isPowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0;
  }

  constructor(imgSource: string, clampVert: number, type: number) {


    // create a white pixel to serve as placeholder
    const formatSrc = gl.RGBA;
    const formatDst = gl.RGBA;
    const lvl = 0;
    const phWidth = 1; // placeholder
    const phHeight = 1;
    const phDepth = 1;
    const phImg = new Uint8Array([255, 255, 255, 255]);
    const formatBit = gl.UNSIGNED_BYTE; // TODO: HDR


    if (type == 2.0) {

      this.texture = gl.createTexture();
      this.bindTex();

      gl.texImage2D(gl.TEXTURE_2D, lvl, formatDst, phWidth, phHeight, 0, formatSrc, formatBit, phImg);

      // get a javascript image locally and load it. not instant but will auto-replace white pixel
      const img = new Image();
      if (clampVert == 0) {
        img.onload = function () {
          this.bindTex()
          console.log("check 2d");
          gl.texImage2D(gl.TEXTURE_2D, lvl, formatDst, img.width, img.height, 0, formatSrc, formatBit, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }.bind(this);
      }
      else {
        img.onload = function () {
          this.bindTex()
          gl.texImage2D(gl.TEXTURE_2D, lvl, formatDst, img.width, img.height, 0, formatSrc, formatBit, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }.bind(this);
      }

      img.src = imgSource; // load the image
    }
    else if (type == 3.0) {

      this.texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      this.bind3DTex();
      //gl.texImage3D(gl.TEXTURE_3D, lvl, formatDst, phWidth, phHeight, phDepth, 0, formatSrc, formatBit, phImg);
  
      //const img = new Image();

      // if (clampVert == 0) {

        

        let raw: string = readTextFile(imgSource);
        // let raw: string = readRawFile(imgSource);

        // var raw = 
        //console.log(raw.length);

        var SIZE = 200;
        var data = new Uint8Array(SIZE * SIZE * SIZE);
      for (var k = 0; k < SIZE; ++k) {
        for (var j = 0; j < SIZE; ++j) {
          for (var i = 0; i < SIZE; ++i) {

                if (k <= 150) {
                    data[i + j * SIZE + k * SIZE * SIZE] = 1.0 * 255;
                }
                else
                {
                  data[i + j * SIZE + k * SIZE * SIZE] = parseInt(raw[i + j * SIZE + k * SIZE * SIZE]) * 255;
                }
          }
        }
      }

       // this.bind3DTex();
        // gl.texImage3D(gl.TEXTURE_3D, lvl, formatDst, SIZE, SIZE, SIZE, 0, formatSrc, formatBit, data);
          gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
          gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_BASE_LEVEL, 0);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAX_LEVEL, Math.log2(SIZE));
        // gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        // gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage3D(
            gl.TEXTURE_3D,  // target
            0,              // level
            gl.R8,        // internalformat
            SIZE,           // width
            SIZE,           // height
            SIZE,           // depth
            0,              // border
            gl.RED,         // format
            gl.UNSIGNED_BYTE,       // type
            data            // pixel
            );


          console.log("already binded");
        }
  }




};

export default Texture;
