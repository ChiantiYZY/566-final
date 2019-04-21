import { vec3, mat4, vec2 } from 'gl-matrix';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import { readTextFile, parseTxt } from './globals';
import Mesh from './geometry/Mesh';

class Bread {
    constructor() {
    }

    drawBread(fillpath: string, curSlice: number, pot: Mesh, distArray: Array<any>) : Mesh
    {
        pot.colorsArray = [];
        pot.transArray1 = [];
        pot.transArray2 = [];
        pot.transArray3 = [];
        pot.transArray4 = [];

        var offsetsArray = parseTxt(fillpath);

        var count:number = 0;

        var maxDist = Math.max.apply(null, distArray);

        for (let m = 0; m < offsetsArray.length / 3; m++) {
            let i = parseFloat(offsetsArray[3 * m]);
            let j = parseFloat(offsetsArray[3 * m + 1]);
            let k = parseFloat(offsetsArray[3 * m + 2]);

            let dist = distArray[m];

            if (i < curSlice * 5.0) continue;
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
            pot.colorsArray.push(dist / maxDist);
            pot.colorsArray.push(1.0); // Alpha channel

            count++;

        }
        let colors: Float32Array = new Float32Array(pot.colorsArray);
        let col1: Float32Array = new Float32Array(pot.transArray1);
        let col2: Float32Array = new Float32Array(pot.transArray2);
        let col3: Float32Array = new Float32Array(pot.transArray3);
        let col4: Float32Array = new Float32Array(pot.transArray4);
        //let colors: Float32Array = new Float32Array(potColorsArray);
        pot.setInstanceVBOs(col1, col2, col3, col4, colors);
        pot.setNumInstances(count); // grid of "particles"

        return pot;
    }

    calDistance(fillPath: string, boundPath: string): any
    {
        var fillArray = parseTxt(fillPath);
        var boundArray = parseTxt(boundPath);
        var DF = [];

        for(var i = 0; i < fillArray.length / 3; i++)
        {
            var minDist = 1000000000.0;
            for(var j = 0; j < boundArray.length / 3; j++)
            {
                var diff = vec3.fromValues(0, 0, 0);
                var bound = vec3.fromValues(boundArray[j], boundArray[j + 1], boundArray[j + 2]);
                var fill = vec3.fromValues(fillArray[i], fillArray[i + 1], fillArray[i + 2]);
                vec3.subtract(diff, bound, fill);
                var length = vec3.length(diff);
                if(length < minDist) minDist = length;
            }
            DF.push(minDist);
        }

        //console.log('DF');
       // console.log(DF);
        return DF;
    }

};

export default Bread;