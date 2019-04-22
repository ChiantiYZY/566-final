#version 300 es
precision highp float;
precision mediump sampler3D;
uniform vec3 u_Eye, u_Ref, u_Up;
uniform mat4 u_ViewProj;
uniform float u_Time;
uniform mat3 u_CameraAxes;
uniform vec2 u_Dimensions;
uniform sampler2D u_Texture;
uniform sampler3D u_3DTexture;
in vec4 fs_Col;
in vec4 fs_Pos;
in vec2 fs_UV;
in vec4 fs_Nor;
//in vec4 fs_Rot;

out vec4 out_Col;



void main()
{



vec3 lightPos = vec3(20, 20, 20);
float lambert = dot(vec3(fs_Nor), normalize(u_Eye));
lambert = clamp(lambert, 0.0, 1.0);
float ambient = 0.2;
float lightIntensity = ambient + lambert;

vec4 color1 = vec4(0.7882, 0.4392, 0.0431, 1.0);
vec4 color2 = vec4(0.9922, 0.8157, 0.4863, 1.0);

vec4 color3 = vec4(0.7059, 0.2863, 0.3922, 1.0);

   // float dist = fs_Col.b;
   // if(dist > 0.8) dist = 1.0;
   
   out_Col = mix(color2, color1, fs_Col.b) * lightIntensity;

   out_Col = vec4(clamp(vec3(out_Col), vec3(0.0), vec3(1.0)), 1.0);

   //out_Col = fs_Col;
}
