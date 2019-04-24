#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
// in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
 in vec4 vs_Transform1;
  in vec4 vs_Transform2;
   in vec4 vs_Transform3;
    in vec4 vs_Transform4;
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

out vec4 fs_Col;
out vec4 fs_Pos;
out vec2 fs_UV;
out vec4 fs_Nor;
//out vec4 fs_Rot;



mat4 rotateZ(float angle)
{
    return mat4(vec4(cos(angle), -sin(angle), 0, 0),
                vec4(sin(angle), cos(angle), 0, 0),
                vec4(0,0,1,0),
                vec4(0,0,0,1));
}

void main()
{
    fs_Col = vs_Col;
    //fs_Pos = vs_Pos;
    fs_UV = vs_UV;
    fs_Nor = vs_Nor;
    // fs_Rot = abs(vs_Rotate);

    // vec3 offset = vs_Translate;
    // vec4 rotate = (vs_Rotate);
    // //offset.z = (sin((u_Time + offset.x) * 3.14159 * 0.1) + cos((u_Time + offset.y) * 3.14159 * 0.1)) * 1.5;

    //vec4 pos = vs_Pos - vec4(25.0, 15.0, 15.0, 0.0);
    vec4 pos = vs_Pos;
    mat4 trans = mat4(vs_Transform1, vs_Transform2, vs_Transform3, vs_Transform4);
    mat4 rot = rotateZ(sin(u_Time * 0.05));
    pos = trans * rot * pos;

    fs_Pos = pos;

    vec3 color = vec3(0.2314, 0.149, 0.0);

    gl_Position = vec4(pos.xy, 0.998, 1.0);

}
