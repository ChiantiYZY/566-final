import { vec3, mat4, vec2 } from 'gl-matrix';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import { readTextFile, parseTxt , generateTexture} from './globals';
import Mesh from './geometry/Mesh';

class Bread {

    distArray:Array<any> = [];
    textArray:Array<any> = [];
    boundTexture:Array<any> = [];
    size:number;

    constructor(size: number) {

        this.size = size;
        this.distArray = new Array(Math.pow(this.size, 3));
        this.distArray.fill(-1);
        
    }

    passTexture(fillpath: string, boundPath: string)
    {
        var offsetsArray = parseTxt(fillpath);
        this.textArray = generateTexture(offsetsArray, this.size);

        var boundArray = parseTxt(boundPath);
        this.boundTexture = generateTexture(boundArray, this.size);
        //console.log(this.textArray);

    }

    drawBread(fillpath: string, boundPath: string, curSlice: number, pot: Mesh) : Mesh
    {
        //console.log(this.textArray);
        pot.colorsArray = [];
        pot.transArray1 = [];
        pot.transArray2 = [];
        pot.transArray3 = [];
        pot.transArray4 = [];

        var count:number = 0;

        var cut = curSlice * this.size / 100.0;

        for (var i = 0; i < this.size; i++) {
            if (i < cut) continue;
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.size; k++) {
                    if(this.textArray[i + j * this.size + k * this.size * this.size ] == 1)
                    {
                        //console.log("check drawing ");
                        let transform = mat4.create();
                        let translate = mat4.create();
                        let scale = mat4.create();

                        var trans = vec3.fromValues(i - this.size / 2.0, j - this.size / 2.0, k - this.size / 2.0);
                         var scalar = vec3.fromValues(0.05, 0.05, 0.05);
                        //var scalar = vec3.fromValues(0.01, 1, 1);
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
                        pot.colorsArray.push(this.boundTexture[i  + j * this.size + k * this.size * this.size]);
                        pot.colorsArray.push(1.0); // Alpha channel

                        count++;

                    }

                    
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

        return pot;
    }


    calDist(fillpath: string, boundPath: string) : any
    {
        var offsetsArray = parseTxt(fillpath);

    
        var boundArray = parseTxt(boundPath);

        // console.log(offsetsArray);
        // console.log(boundArray);

        for(var i = 0; i < offsetsArray.length / 3; i++)
        {
            var min = 10000000000;
            var fillPos = vec3.fromValues(offsetsArray[3 * i],
                                          offsetsArray[3 * i] + 1,
                                          offsetsArray[3 * i] + 2);

            for(var j = 0; j < boundArray.length / 3; j++)
            {
                var boundPos = vec3.fromValues(boundArray[3 * j],
                                                boundArray[3 * j] + 1,
                                                boundArray[3 * j] + 2);

                var diff = vec3.fromValues(0, 0, 0);
                vec3.subtract(diff, fillPos, boundPos);
                min = Math.min(min, vec3.length(diff));
            }
            this.distArray[offsetsArray[3 * i] + 
                     (offsetsArray[3 * i] + 1) * this.size + 
                     (offsetsArray[3 * i] + 2) * this.size * this.size] = min;
        }
    }


    calDistance(pos1: vec3, pos2: vec3) : any
    {
        var diff = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.subtract(diff, pos1, pos2);
        return vec3.length(diff);
    }


    generateBubble() : any
    {

        var scalar = 512 / this.size;

        // console.log("distArray");
        // console.log(this.distArray);

        //baguette bread type
        // var r_min = 1;
        // var r_max = 5;
        // var k = 0.07 * Math.pow(this.size, 3) / 5.0;
        // var d = 2.78;

        //home-baked bread type
        var r_min = 1;
        var r_max = 23 / 4;    //should be 24 but 18 looks better 
        var k = 0.69 * Math.pow(this.size, 3) / 5.0;
        var d = 5.6;

        // var r_min = 1;
        // var r_max = 23;    //should be 24 but 18 looks better 
        // var k = 0.69 * Math.pow(this.size, 3) / 20.0;
        // var d = 5.6;

        // r_min *= scalar;
        // r_max *= scalar;
        // k = k * scalar * scalar;

    

        for(var i = r_min; i < r_max; i++)
        {
            var N = k / (Math.pow(i, d));

            for(var j = 0; j < N; j++)
            {
                var x = Math.floor(Math.random() * this.size);
                var y = Math.floor(Math.random() * this.size);
                var z = Math.floor(Math.random() * this.size);
                var center = vec3.fromValues(x, y ,z);

                for(var a = -i; a < i + 1; a++)
                {
                    for(var b = -i; b < i + 1; b++)
                    {
                        for(var c = -i; c < i + 1; c++)
                        {
                            var index = x + a + (y + b) * this.size + (z + c) * this.size * this.size;
                            if(this.boundTexture[index] == 1) continue;
                            var tmp = vec3.fromValues(x + a, (y + b), (z + c));
                            if(this.calDistance(center, tmp) < i)
                            {
                                this.textArray[index] = 0.0;
                            }
                        }
                    }
                }  
            }
        }
    }

};

export default Bread;