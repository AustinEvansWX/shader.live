#version 300 es

precision mediump float;

in vec2 uv;

out vec4 oFragColor;

void main() {
  oFragColor = vec4(uv, 0.1, 1.0);
}
