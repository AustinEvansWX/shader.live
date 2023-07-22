import type { Shader } from "./Shader";
import type { VertexBuffer } from "./VertexBuffer";

export function Render(gl: WebGL2RenderingContext, shader: Shader, canvas: VertexBuffer) {
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  shader.Bind();
  canvas.Bind();

  gl.drawElements(gl.TRIANGLES, canvas.GetIndexCount(), gl.UNSIGNED_BYTE, 0);
}
