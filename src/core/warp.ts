import fragmentSource from "./title.frag?raw";

const vertexSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

interface WarpContext {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  texture: WebGLTexture;
  resolution: WebGLUniformLocation | null;
  textureResolution: WebGLUniformLocation | null;
}

let context: WarpContext | null | undefined;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compilation failed: ${log}`);
  }
  return shader;
}

function createContext(): WarpContext | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  if (!gl) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(gl.getUniformLocation(program, "u_texture"), 0);

  return {
    canvas,
    gl,
    texture,
    resolution: gl.getUniformLocation(program, "u_resolution"),
    textureResolution: gl.getUniformLocation(program, "u_textureResolution"),
  };
}

/**
 * Runs the title shader over `source` and returns the canvas holding the result.
 * The returned canvas is reused between calls, so draw from it immediately.
 */
export function warpText(
  source: HTMLCanvasElement,
  width: number,
  height: number,
): HTMLCanvasElement | null {
  if (context === undefined) context = createContext();
  if (!context) return null;

  const { canvas, gl, texture, resolution, textureResolution } = context;
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

  gl.uniform2f(resolution, canvas.width, canvas.height);
  gl.uniform2f(textureResolution, source.width, source.height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  return canvas;
}

/** Largest text texture the GPU accepts, used to keep huge titles renderable. */
export function maxTextureSize(): number {
  if (context === undefined) context = createContext();
  if (!context) return 4096;
  return context.gl.getParameter(context.gl.MAX_TEXTURE_SIZE) as number;
}
