import {vec3, quat, mat3, mat4} from 'gl-matrix';

export default class Turtle {

    position: vec3 = vec3.create();
    prevPos: vec3 = vec3.create();
    forward: vec3 = vec3.create();
    up: vec3 = vec3.create();
    right: vec3 = vec3.create();
    orientation: quat = quat.create();
    scale: number;

    turtles: Array<Turtle>;


  constructor() {
    this.position = vec3.fromValues(0,0,0);
    this.prevPos = vec3.fromValues(0,0,0);
    this.up = vec3.fromValues(0, 1, 0);
    this.forward = vec3.fromValues(0, 0, 1);
    this.right = vec3.fromValues(1, 0, 0);
    // this.scale = vec3.fromValues(1, 1, 1);
  }

  growUp(distance: number) {
    //distance = 1.0;
    //vec3.copy(this.position, this.prevPos);

    // let rot = mat3.create();

    // mat3.fromQuat(rot, this.orientation);

    // let trans = vec3.fromValues(distance,distance,distance);

    // vec3.transformQuat(trans, trans, this.orientation);
    this.prevPos = this.position;

    this.position = vec3.fromValues(this.prevPos[0] + distance * this.up[0], 
                                    this.prevPos[1] + distance * this.up[1], 
                                    this.prevPos[2] + distance * this.up[2]);

                                  // this.position = vec3.fromValues(this.position[0] + trans[0] , 
                                  //     this.position[1] + trans[1], 
                                  //     this.position[2] + trans[2]);

    // this.scale = vec3.fromValues(distance * this.scale[0],
    //                              distance * this.scale[1],
    //                              distance * this.scale[2]);
  }

  rotateOnZ(angle: number) {
        let rot: quat = quat.create();

        //generate the quat along the world z axis
        quat.setAxisAngle(rot, this.forward, angle);         //angle is radius
        
        //updating UFR// 
        vec3.transformQuat(this.forward, this.forward, rot);
        vec3.transformQuat(this.up, this.up, rot);
        vec3.transformQuat(this.right, this.right, rot);
        quat.multiply(this.orientation, rot, this.orientation);

 
  }

  rotateOnY(angle: number) {
    let rot: quat = quat.create();

    //generate the quat along the world z axis
    quat.setAxisAngle(rot, this.up, angle);         //angle is radius
    
    //updating UFR// 
    vec3.transformQuat(this.forward, this.forward, rot);
    vec3.transformQuat(this.up, this.up, rot);
    vec3.transformQuat(this.right, this.right, rot);
    quat.multiply(this.orientation, rot, this.orientation);

  }

  rotateOnX(angle: number) {
    let rot: quat = quat.create();

    //generate the quat along the world z axis
    quat.setAxisAngle(rot, this.right, angle);         //angle is radius
    
    //updating UFR// 
    vec3.transformQuat(this.forward, this.forward, rot);
    vec3.transformQuat(this.up, this.up, rot);
    vec3.transformQuat(this.right, this.right, rot);
    quat.multiply(this.orientation, rot ,this.orientation);

  }

  

  copy(turtle: Turtle) {
    //vec3.copy(this.position, turtle.prevPos);
    vec3.copy(this.prevPos, turtle.prevPos);
    quat.copy(this.orientation, turtle.orientation);
    vec3.copy(this.up, turtle.up);
    vec3.copy(this.right, turtle.right);
    vec3.copy(this.forward, turtle.forward);
    //vec3.copy(this.scale, turtle.scale);


    this.position = vec3.fromValues(turtle.position[0], turtle.position[1], turtle.position[2]);
    // this.prevPos = turtle.prevPos;
    // this.orientation, turtle.orientation);
    // this.up, turtle.up);
    // this.right, turtle.right);
    // this.forward, turtle.forward);
    // this.scale, turtle.scale);
     // return 
  }



};

