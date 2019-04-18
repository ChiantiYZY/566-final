#version 300 es
precision highp float;
precision mediump sampler3D;
uniform mat4 u_ViewProj;
uniform float u_Time;
uniform mat3 u_CameraAxes;
uniform vec2 u_Dimensions;
uniform sampler2D u_Texture;
uniform sampler3D u_3DTexture;
in vec4 fs_Col;
in vec4 fs_Pos;
in vec2 fs_UV;
//in vec4 fs_Rot;

out vec4 out_Col;



void main()
{
    //vec4 color = vec4(0.4863, 0.2784, 0.0392, 1.0);

//     vec4 color3D = texture(u_3DTexture, fs_Pos.xyz);

//    float slice = color3D.r;
//    if(slice == 1.0)
//    {
//        color = texture(u_Texture, fs_UV);
//    }
//    else
//    {
//        color = vec4(0.8863, 0.1451, 0.1451, 1.0);
//    }


vec4 color1 = vec4(0.7882, 0.4392, 0.0431, 1.0);
vec4 color2 = vec4(0.9333, 0.7569, 0.4235, 1.0);
   
   out_Col = mix(color2, color1, fs_Col.r);
}