/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var gl;
var vertices = [
    -0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.5, 0.5, 0.0
];
var colors = [
    0, 0, 1,
    1, 0, 0,
    0, 1, 0,
    1, 0, 1,
];
var indices = [3, 2, 1, 3, 1, 0];
function GetCode(id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var theSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }
    return theSource;
}
var points = [0, 0, 1, 1, 0, 1, 1, 0];
function MouseEventHandler(e, gl, canvas, position) {
    var x = e.clientX;
    var y = e.clientY;
    var rect = e.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    points.push(x);
    points.push(y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = points.length;
    for (var i = 0; i < len; i += 2) {
        gl.vertexAttrib3f(position, points[i], points[i + 1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
window.addEventListener("DOMContentLoaded", function () {
    var canvas_elem = document.getElementById("glcanvas");
    gl = canvas_elem.getContext('experimental-webgl');
    gl.clearColor(0.9, 0.9, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    var ColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    var VertShaderCode = GetCode("shader-vs");
    var VertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(VertShader, VertShaderCode);
    gl.compileShader(VertShader);
    var FragCode = GetCode("shader-fs");
    var FragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(FragShader, FragCode);
    gl.compileShader(FragShader);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, VertShader);
    gl.attachShader(shaderProgram, FragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
    var color = gl.getAttribLocation(shaderProgram, "color");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    var TX = 0.0, TY = 0.0, TZ = 0.0;
    var translation = gl.getUniformLocation(shaderProgram, "translations");
    gl.uniform3f(translation, TX, TY, TZ);
    var transformMatrix = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
    ]);
    var u_xformMatrix = gl.getUniformLocation(shaderProgram, "u_xformMatrix");
    gl.uniformMatrix3fv(u_xformMatrix, false, transformMatrix);
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas_elem.width, canvas_elem.height);
    canvas_elem.addEventListener("click", function (e) {
        MouseEventHandler(e, gl, canvas_elem, coord);
    });
});


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map