
let gl: WebGLRenderingContext;

let vertices = [
   -0.5,0.5,0.0, 1.0,
   -0.5,-0.5,0.0, 1.0,
   0.5,-0.5,0.0, 1.0,
];

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

let points: number[] = [0, 0, 0.5, 0.5, -0.5 , 0];

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

let ANGLE = 20;

function GetTransformMatrix(angle: number) {
    let radian = Math.PI * angle / 180.0;
    let cosB = Math.cos(radian),
        sinB = Math.sin(radian);
    return new Float32Array([
        cosB,  sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0,   0.0,  1.0, 0.0,
        0.0,   0.0,  0.0, 1.0,
    ]);
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

    let coord = gl.getAttribLocation(shaderProgram, "a_Position");
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    // Transform
    let radian = Math.PI * (ANGLE + 30) / 180.0;
    let cosB = Math.cos(radian),
        sinB = Math.sin(radian);
    let transformMatrix = new Float32Array([
        cosB,  sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0,   0.0,  1.0, 0.0,
        0.0,   0.0,  0.0, 1.0,
    ]);

    let u_ModelMatrix = gl.getUniformLocation(shaderProgram, "u_ModelMatrix");
    gl.uniformMatrix4fv(u_ModelMatrix, false, transformMatrix);

    //  Step 5

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas_elem.width, canvas_elem.height);

    // gl.drawArrays(gl.LINE_LOOP, 0, 3);
    // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    // let len = points.length;
    // for (let i = 0; i < len; i+=2) {
    //     // console.log(points[i], points[i+1]);
    //     gl.vertexAttrib4f(coord, points[i], points[i+1], 0.0, 1.0);

    //     gl.drawArrays(gl.POINTS, 0, 1);
    // }

    // canvas_elem.addEventListener("click", (e) => {
    //     MouseEventHandler(e, gl, canvas_elem, coord);
    // });

    let last_time = new Date();
    let ANGLE_SPEED = 25;
    function tick() {
        let current = new Date();
        let delta = (current.getTime() - last_time.getTime()) / 1000.0;
        last_time = current;
        ANGLE = (ANGLE + ANGLE_SPEED * delta) % 360;

        let tranform_matrix = GetTransformMatrix(ANGLE);

        gl.uniformMatrix4fv(u_ModelMatrix, false, tranform_matrix);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(tick);
    }

    tick();

});
