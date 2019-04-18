import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufTransform1: WebGLBuffer;
  bufTransform2: WebGLBuffer;
  bufTransform3: WebGLBuffer;
  bufTransform4: WebGLBuffer;
  bufCol: WebGLBuffer;
  bufUV: WebGLBuffer;

  idxGenerated: boolean = false;
  posGenerated: boolean = false;
  norGenerated: boolean = false;
  colGenerated: boolean = false;
  transformGenerated1: boolean = false;
  transformGenerated2: boolean = false;
  transformGenerated3: boolean = false;
  transformGenerated4: boolean = false;
  uvGenerated: boolean = false;

  numInstances: number = 1; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufCol);
    gl.deleteBuffer(this.bufTransform1);
    gl.deleteBuffer(this.bufTransform2);
    gl.deleteBuffer(this.bufTransform3);
    gl.deleteBuffer(this.bufUV);
  }

  generateIdx() {
    this.idxGenerated = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posGenerated = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norGenerated = true;
    this.bufNor = gl.createBuffer();
  }

  generateCol() {
    this.colGenerated = true;
    this.bufCol = gl.createBuffer();
  }

  generateTransform1() {
    this.transformGenerated1 = true;
    this.bufTransform1 = gl.createBuffer();
  }
  generateTransform2() {
    this.transformGenerated2 = true;
    this.bufTransform2 = gl.createBuffer();
  }
  generateTransform3() {
    this.transformGenerated3 = true;
    this.bufTransform3 = gl.createBuffer();
  }
  generateTransform4() {
    this.transformGenerated4 = true;
    this.bufTransform4 = gl.createBuffer();
  }

  generateUV() {
    this.uvGenerated = true;
    this.bufUV = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxGenerated) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxGenerated;
  }

  bindPos(): boolean {
    if (this.posGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posGenerated;
  }

  bindNor(): boolean {
    if (this.norGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norGenerated;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindTransform1(): boolean {
    if (this.transformGenerated1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform1);
    }
    return this.transformGenerated1;
  }

  bindTransform2(): boolean {
    if (this.transformGenerated2) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform2);
    }
    return this.transformGenerated2;
  }
  bindTransform3(): boolean {
    if (this.transformGenerated3) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform3);
    }
    return this.transformGenerated1;
  }
  bindTransform4(): boolean {
    if (this.transformGenerated4) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform4);
    }
    return this.transformGenerated1;
  }

  bindUV(): boolean {
    if (this.uvGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    }
    return this.uvGenerated;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;
