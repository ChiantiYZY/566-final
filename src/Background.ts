import Mesh from "./geometry/Mesh";
import { vec4, vec3, mat4, quat} from "gl-matrix";
import { readTextFile } from './globals';

export default class Background {
    Croissant: Mesh;

    constructor() {
        // this.heartObj = heartObj;
    }

    render() {
        this.Croissant = new Mesh(readTextFile('./src/Croissant.obj'), vec3.fromValues(0, 0, 0.998));
        this.Croissant.create();

        this.Croissant.colorsArray = [];
        this.Croissant.transArray1 = [];
        this.Croissant.transArray2 = [];
        this.Croissant.transArray3 = [];
        this.Croissant.transArray4 = [];

        var count: number = 0;

        for (let i = -2; i < 3; i++) {
            for (let j = -2; j < 3; j++) {
                //console.log("check drawing ");
                let transform = mat4.create();
                let translate = mat4.create();
                let scale = mat4.create();
                let rotate = mat4.create();

                let rot = quat.create();

                //console.log("rise is: " + rise);

                var trans = vec3.fromValues(i * 40.0, j * 40.0, 0.0);
                var scalar = vec3.fromValues(0.01, 0.01, 0.01);
                quat.setAxisAngle(rot, vec3.fromValues(0, 1, 0), 1.57);

                mat4.fromScaling(scale, scalar);
                mat4.fromTranslation(translate, trans);
                mat4.fromQuat(rotate, rot);


                mat4.multiply(transform, transform, scale);
                
                mat4.multiply(transform, transform, translate);

                

                //mat4.multiply(transform, transform, rotate);

                

                this.Croissant.transArray1.push(transform[0]);
                this.Croissant.transArray1.push(transform[1]);
                this.Croissant.transArray1.push(transform[2]);
                this.Croissant.transArray1.push(transform[3]);

                this.Croissant.transArray2.push(transform[4]);
                this.Croissant.transArray2.push(transform[5]);
                this.Croissant.transArray2.push(transform[6]);
                this.Croissant.transArray2.push(transform[7]);

                this.Croissant.transArray3.push(transform[8]);
                this.Croissant.transArray3.push(transform[9]);
                this.Croissant.transArray3.push(transform[10]);
                this.Croissant.transArray3.push(transform[11]);

                this.Croissant.transArray4.push(transform[12]);
                this.Croissant.transArray4.push(transform[13]);
                this.Croissant.transArray4.push(transform[14]);
                this.Croissant.transArray4.push(transform[15]);

                this.Croissant.colorsArray.push(0.0);
                this.Croissant.colorsArray.push(0.0);
                this.Croissant.colorsArray.push(1.0);
                this.Croissant.colorsArray.push(1.0); // Alpha channel

                count++;
            }
        }
        let colors: Float32Array = new Float32Array(this.Croissant.colorsArray);
        let col1: Float32Array = new Float32Array(this.Croissant.transArray1);
        let col2: Float32Array = new Float32Array(this.Croissant.transArray2);
        let col3: Float32Array = new Float32Array(this.Croissant.transArray3);
        let col4: Float32Array = new Float32Array(this.Croissant.transArray4);
        //let colors: Float32Array = new Float32Array(potColorsArray);
        this.Croissant.setInstanceVBOs(col1, col2, col3, col4, colors);
        this.Croissant.setNumInstances(count); // grid of "particles"
    }
};