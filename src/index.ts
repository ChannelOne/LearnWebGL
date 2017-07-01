
let gl: WebGLRenderingContext;

let vertices = [
   -0.5,0.5,0.0,
   -0.5,-0.5,0.0,
   0.5,-0.5,0.0,
   0.5,0.5,0.0 
];

let colors = [
    0,0,1,
    1,0,0,
    0,1,0,
    1,0,1,
]

let indices = [3,2,1,3,1,0];

function GetCode(id: string) {
    let shaderScript = document.getElementById(id);

    // Didn't find an element with the specified ID; abort.

    if (!shaderScript) {
        return null;
    }

    // Walk through the source element's children, building the
    // shader source string.

    let theSource = "";
    let currentChild = shaderScript.firstChild;

    while (currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    return theSource;
}

let points: number[] = [0, 0, 1, 1, 0,1, 1,0];

function MouseEventHandler(e: MouseEvent, gl: WebGLRenderingContext, canvas: HTMLCanvasElement, position: number) {
    let x = e.clientX;
    let y = e.clientY;
    let rect = (<HTMLElement>e.target).getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    points.push(x); points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let len = points.length;
    for (let i = 0; i < len; i+=2) {
        // console.log(points[i], points[i+1]);
        gl.vertexAttrib3f(position, points[i], points[i+1], 0.0);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

window.addEventListener("DOMContentLoaded", function() {
    const canvas_elem = <HTMLCanvasElement>document.getElementById("glcanvas");

    gl = canvas_elem.getContext('experimental-webgl');
    gl.clearColor(0.9, 0.9, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Create vertices
    let vertex_buffer = gl.createBuffer();

    // Bind an empty array buffe to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // let IndexBuffer = gl.createBuffer();

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Color buffer

    let ColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Compile shader program

    let VertShaderCode = GetCode("shader-vs");

    let VertShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(VertShader, VertShaderCode);

    gl.compileShader(VertShader);

    let FragCode = GetCode("shader-fs");

    let FragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(FragShader, FragCode);

    gl.compileShader(FragShader);

    let shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, VertShader);
    gl.attachShader(shaderProgram, FragShader);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Step 4
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBuffer);

    let coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // gl.enableVertexAttribArray(coord);

    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);

    let color = gl.getAttribLocation(shaderProgram, "color");

    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(color);


    // Translation
    // let TX = 0.2, TY = 0.2, TZ = 0.0;
    let TX = 0.0, TY = 0.0, TZ = 0.0;
    let translation = gl.getUniformLocation(shaderProgram, "translations");
    gl.uniform3f(translation, TX, TY, TZ);

    // Transform
    // let transformMatrix = new Float32Array([
    //     0.8, 0.0, 0.0,
    //     0.0, 1.0, 0.0,
    //     0.0, 0.0, 1.0,
    // ]);
    let transformMatrix = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
    ]);

    let u_xformMatrix = gl.getUniformLocation(shaderProgram, "u_xformMatrix");
    gl.uniformMatrix3fv(u_xformMatrix, false, transformMatrix);

    //  Step 5

    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvas_elem.width, canvas_elem.height);

    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    // gl.drawArrays(gl.LINE_LOOP, 0, 3);
    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    canvas_elem.addEventListener("click", (e) => {
        MouseEventHandler(e, gl, canvas_elem, coord);
    });
});
