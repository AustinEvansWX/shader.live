export class VertexBuffer {
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  private indexCount: number;

  constructor(private gl: WebGL2RenderingContext, vertices: number[], indices: number[]) {
    this.gl = gl;
    this.indexCount = indices.length;

    this.vbo = this.gl.createBuffer() as WebGLBuffer;
    this.SetVertices(vertices);

    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(0);

    this.ibo = this.gl.createBuffer() as WebGLBuffer;
    this.SetIndices(indices);

    this.gl.bindBuffer(gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  Bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  }

  Unbind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  Delete() {
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.ibo);
  }

  GetIndexCount() {
    return this.indexCount;
  }

  SetVertices(vertices: number[]) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
  }

  SetIndices(indices: number[]) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), this.gl.STATIC_DRAW);
  }
}
