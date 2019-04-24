import { vec3, mat4, vec2 , quat} from 'gl-matrix';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import { setGL } from './globals';
import ShaderProgram, { Shader } from './rendering/gl/ShaderProgram';
import { readTextFile, parseTxt , generateTexture} from './globals';
import Mesh from './geometry/Mesh';
import { timingSafeEqual } from 'crypto';

class Bread {

    distArray:Array<any> = [];
    textArray:Array<any> = [];
    boundTexture:Array<any> = [];
    radiiArray:Array<any> = [];
    afterRiseArray: Array<any> = [];
    afterRiseBoundry: Array<any> = [];
    newSize: number;
    proveType: number;

    size:number;

    constructor(size: number) {

        this.size = size;
        this.distArray = new Array(Math.pow(this.size, 3));
        this.distArray.fill(-1);
        
    }

    passTexture(fillpath: string, boundPath: string)
    {

        this.textArray = new Array(Math.pow(this.size, 3));
        this.boundTexture = new Array(Math.pow(this.size, 3));

        var offsetsArray = parseTxt(fillpath);
        this.textArray = generateTexture(offsetsArray, this.size);

        var boundArray = parseTxt(boundPath);
        this.boundTexture = generateTexture(boundArray, this.size);
        //console.log(this.textArray);

    }

    initialBread(curSlice: number, pot: Mesh) : Mesh
    {
        //console.log(this.textArray);
        pot.colorsArray = [];
        pot.transArray1 = [];
        pot.transArray2 = [];
        pot.transArray3 = [];
        pot.transArray4 = [];

        var count:number = 0;

        var cut = curSlice * this.size / 100.0;

        //console.log(this.radiiArray);
        
        for (var i = 0; i < this.size; i++) {
            if (i < cut) continue;
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.size; k++) {
                    var index = i + j * this.size + k * this.size * this.size;
                    if(this.textArray[index] == 1)
                    {
                        //console.log("check drawing ");
                        let transform = mat4.create();
                        let translate = mat4.create();
                        let scale = mat4.create();

                        //console.log("rise is: " + rise);

                        var trans = vec3.fromValues(i - this.size / 2.0, j - this.size / 2.0, k - this.size / 2.0);
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
                        pot.colorsArray.push(this.boundTexture[index]);
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

        //console.log(this.radiiArray);

     


        
       for (var i = 0; i < this.newSize; i++) {
        if (i < cut) continue;
        for (var j = 0; j < this.newSize; j++) {
            for (var k = 0; k < this.newSize; k++) {
                var index = i + j * this.newSize + k * this.newSize * this.newSize;
                if(this.afterRiseArray[index] == 1)
                {
                    //console.log("check drawing ");
                    let transform = mat4.create();
                    let translate = mat4.create();
                    let scale = mat4.create();
                    let rotate = mat4.create();

                    //console.log("rise is: " + rise);

                    var trans = vec3.fromValues(i - this.newSize / 2.0, j - this.newSize / 2.0, k - this.newSize / 2.0);
                    var scalar = vec3.fromValues(0.05, 0.05, 0.05);
                    var rot = quat.create();

    
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

                    var flag = 0;

                    //check boundary

                    if(this.afterRiseBoundry[index] == 1) flag = 1;
                    else
                    {
                        for(var m = -1; m < 2; m++)
                        {
                            for(var l = -1; l < 2; l++)
                            {
                                for(var n = -1; n < 2; n++)
                                {
                                    var testIndex = i + m + (l + j) * this.newSize + (k + n) * this.newSize * this.newSize;
    
                                    
                                    if(testIndex < 0 ||testIndex >= Math.pow(this.newSize,3)||this.afterRiseArray[testIndex] == -1)
                                    {
                                        flag = 1;
                                        break;
                                    }      
                                }
                            }
                        }

                    }
                   


                    pot.colorsArray.push(1.0);
                    pot.colorsArray.push(0.0);
                    pot.colorsArray.push(flag);
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


        this.radiiArray = new Array(Math.pow(this.size, 3));
        this.radiiArray.fill(-1);
    

        var r_min, r_max, k, d;

        if(this.proveType == 0)
        {
            console.log("check baguette");
             r_min = 1;
             r_max = 5;
             k = 0.07 * Math.pow(this.size, 3) / 5.0;
             d = 2.78;
        }
        else
        {
             r_min = 1;
             r_max = 23 / 4;    //should be 24 but 18 looks better 
             k = 0.69 * Math.pow(this.size, 3) / 5.0;
             d = 5.6;
        }

        //baguette bread type


        //home-baked bread type


    

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

                                if(this.radiiArray[index] < i) this.radiiArray[index] = i;

                                //console.log(this.radiiArray[index]);
                                //this.radiiArray[index] = Math.max(this.radiiArray[index], i);
                            }
                        }
                    }
                }  
            }
        }

        this.rise();
    }


    rise() : any
    {

        this.afterRiseArray = [];
        this.afterRiseBoundry = [];
        var bubble_in_X = new Array<number>(this.size * this.size).fill(0);
        var bubble_in_Y = new Array<number>(this.size * this.size).fill(0);
        var bubble_in_Z = new Array<number>(this.size * this.size).fill(0);

        for(var i = 0; i < this.size; i++)
        {
            for(var j = 0; j < this.size; j++)
            {
                for(var k = 0; k < this.size; k++)
                {
                    var index = i + j * this.size + k * this.size * this.size;
                    if(this.textArray[index] == 0 && this.radiiArray[index] > 0)
                    {
                        bubble_in_X[j + k * this.size] += this.radiiArray[index];
                    }
                }
            }
        }

        for(var j = 0; j < this.size; j++)
        {
            for(var i = 0; i < this.size; i++)
            {
                for(var k = 0; k < this.size; k++)
                {
                    var index = i + j * this.size + k * this.size * this.size;
                    if(this.textArray[index] == 0 && this.radiiArray[index] > 0)
                    {
                        bubble_in_Y[i + k * this.size] += this.radiiArray[index];
                    }
                }
            }
        }

        for(var k = 0; k < this.size; k++)
        {
            for(var j = 0; j < this.size; j++)
            {
                for(var i = 0; i < this.size; i++)
                {
                    var index = i + j * this.size + k * this.size * this.size;
                    if(this.textArray[index] == 0 && this.radiiArray[index] > 0)
                    {
                        bubble_in_Z[j + i * this.size] += this.radiiArray[index];
                    }
                }
            }
        }

        //console.log(bubble_in_X);

        //proving ratio
        var p = 0.1;

        //console.log("this.size: " + this.size);
        var largest_X = Math.floor(Math.max.apply(Math, bubble_in_X) * p) + this.size;
        var largest_Y = Math.floor(Math.max.apply(Math, bubble_in_Y) * p) + this.size;
        var largest_Z = Math.floor(Math.max.apply(Math, bubble_in_Z) * p) + this.size;

        this.newSize = Math.max(largest_X, largest_Y, largest_Z);

        this.afterRiseArray = new Array(Math.pow(this.newSize, 3));
        this.afterRiseArray.fill(0);
        this.afterRiseBoundry = new Array(Math.pow(this.newSize, 3));
        this.afterRiseBoundry.fill(0);

        //console.log(this.afterRiseArray);

        var ratio = this.newSize/ this.size;

        for(var i = 0; i < this.size; i++)
        {
            for(var j = 0; j < this.size; j++)
            {
                for(var k = 0; k < this.size; k++)
                {
                    var ratio_X = (bubble_in_X[j + k * this.size] * p + this.size) / this.size;
                    var ratio_Y = (bubble_in_Y[i + k * this.size] * p + this.size) / this.size;
                    var ratio_Z = (bubble_in_Z[j + i * this.size] * p + this.size) / this.size;


                    //if(ratio_X > ratio || ratio_Y > ratio || ratio_Z > ratio) console.log("error");


                    //console.log(ratio_X + " " + ratio_Y + " " + ratio_Z);

                    for(var tmpX = 0; tmpX < ratio_X; tmpX ++)
                    {
                        for(var tmpY = 0; tmpY < ratio_Y; tmpY ++)
                        {
                            for(var tmpZ = 0; tmpZ < ratio_Z; tmpZ ++)
                            {
                                var index_x = Math.floor(i * ratio_X + tmpX);
                                var index_y = Math.floor(j * ratio_Y + tmpY);
                                var index_z = Math.floor(k * ratio_Z + tmpZ);
                                var index = index_x + index_y * this.newSize + index_z * this.newSize * this.newSize;

                                var origInde = i + j * this.size + k * this.size * this.size;

                                this.afterRiseArray[index] = this.textArray[origInde];
                                this.afterRiseBoundry[index] = this.boundTexture[origInde];
                            }
                        }

                    }
                }
            }
        }

        // console.log(this.afterRiseArray);
        // console.log(this.afterRiseBoundry);
        
    }

};

export default Bread;