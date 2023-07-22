<script lang="ts">
	import { Render } from '$lib/GL/Renderer';
	import { CreateShader, FetchShaderSource, Shader } from '$lib/GL/Shader';
	import { VertexBuffer } from '$lib/GL/VertexBuffer';
	import { Client } from '$lib/client/Client';
	import { onDestroy, onMount } from 'svelte';

	let client: Client;
	let vertexShaderSource: string;
	let fragmentShaderSource: string;
	let canvas: HTMLCanvasElement;
	let gl: WebGL2RenderingContext;
	let observer: ResizeObserver;
	let shader: Shader;
	let pane: VertexBuffer;

	onMount(async () => {
		observer = new ResizeObserver(OnResize);
		if (canvas.parentElement) {
			observer.observe(canvas.parentElement);
		}

		const context = canvas.getContext('webgl2');
		if (!context) {
			console.log('WebGL 2 not supported');
			return;
		}
		gl = context;

		console.log('WebGL Version:', gl.getParameter(gl.VERSION));
		console.log('Shader Version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

		vertexShaderSource = await FetchShaderSource('vertex.glsl');
		fragmentShaderSource = await FetchShaderSource('fragment.glsl');

		//prettier-ignore
		pane = new VertexBuffer(gl, 
      [
        -1, 1,
        -1, -1,
        1, -1,
        1, 1,
      ], 
      [0, 1, 2, 2, 3, 0]
    );

		UpdateShader();
		Update();

		client = new Client();
		client.OnNewShader((shaderSource) => {
			fragmentShaderSource = shaderSource;
			UpdateShader();
			Update();
		});
	});

	onDestroy(() => {
		client.RemoveAllListeners();
		client.Disconnect();
		observer.disconnect();
	});

	function OnResize(entries: ResizeObserverEntry[]) {
		if (entries.length == 0) {
			return;
		}

		canvas.width = entries[0].contentRect.width;
		canvas.height = entries[0].contentRect.height;

		Update();
	}

	function Update() {
		if (!gl || !shader || !pane) {
			return;
		}
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		Render(gl, shader, pane);
	}

	function UpdateShader() {
		shader?.Destroy();
		shader = CreateShader(gl, vertexShaderSource, fragmentShaderSource);
	}
</script>

<canvas bind:this={canvas} />
