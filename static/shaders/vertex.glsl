#version 300 es

precision mediump float;

layout(location = 0) in vec2 vertexPosition;

out vec2 uv;

void main() {
  gl_Position = vec4(vertexPosition, 0.0, 1.0);
  uv = (vertexPosition + 1.0) / 2.0;
}
