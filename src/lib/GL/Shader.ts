export function CreateShader(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string): Shader {
  const vertexShader = CompileShader(gl, vertexShaderSource, "vertex");
  const fragmentShader = CompileShader(gl, fragmentShaderSource, "fragment");

  const program = CreateProgram(gl, vertexShader, fragmentShader);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return new Shader(gl, program);
}

export async function FetchShaderSource(shaderName: string) {
  const res = await fetch('shaders/' + shaderName);
  return await res.text();
}

function CompileShader(gl: WebGL2RenderingContext, source: string, type: "vertex" | "fragment") {
  const shader = gl.createShader(type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
  if (!shader) {
    throw new Error('Error creating shader resource');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(shader);
    throw new Error(`Error compiling ${type} shader: ${compileError}`);
  }

  return shader;
}

function CreateProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error('Error creating program resource');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(program);
    throw new Error(`Error linking shader program: ${linkError}`);
  }

  return program;
}

export class Shader {
  private locationCache: { [name: string]: WebGLUniformLocation };

  constructor(private gl: WebGL2RenderingContext, private program: WebGLProgram) {
    this.locationCache = {};
  }

  Bind() {
    this.gl.useProgram(this.program);
  }

  Unbind() {
    this.gl.useProgram(null);
  }

  Destroy() {
    this.gl.deleteProgram(this.program);
  }

  GetUniformLocation(name: string): WebGLUniformLocation {
    let location = this.locationCache[name];
    if (!location) {
      location = this.gl.getUniformLocation(this.program, name) || -1;
      this.locationCache[name] = location;
    }
    return location;
  }

  Mat4Uniform(name: string, value: number[] | Float32Array) {
    this.gl.uniformMatrix4fv(this.GetUniformLocation(name), false, value);
  }

  Vec2Uniform(name: string, value: number[]) {
    this.gl.uniform2fv(this.GetUniformLocation(name), value);
  }

  Vec4Uniform(name: string, value: number[]) {
    this.gl.uniform4fv(this.GetUniformLocation(name), value);
  }

  IntUniform(name: string, value: number) {
    this.gl.uniform1i(this.GetUniformLocation(name), value);
  }

  FloatUniform(name: string, value: number) {
    this.gl.uniform1f(this.GetUniformLocation(name), value);
  }

  FloatArrayUniform(name: string, value: number[]) {
    this.gl.uniform1fv(this.GetUniformLocation(name), value);
  }
}
