#version 300 es
precision highp float;

// The vertex shader used to render the background of the scene

in vec4 vs_Pos;
in vec4 vs_Col;
out vec2 fs_Pos;
out vec4 fs_Col;

void main() {
  fs_Pos = vs_Pos.xy;
  fs_Col = vs_Col;
  gl_Position = vs_Pos;
}
