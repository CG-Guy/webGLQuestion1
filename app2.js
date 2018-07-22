

var vertexShaderText = 
['precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
'   gl_Position = mProj * mView * mWorld *vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'   gl_FragColor = vec4(fragColor, 1.0);',
'}',
].join('\n');


var Walls = function(){
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR canot compile vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR cannot compile fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	//CreateBuffer
	//
	var triangleVertices = 
	[//X, Y, Z             R, G, B
		0.0, 0.5, 0.0,      1.0, 0.0, 0.0,
		-0.5, -0.5, 0.0,    1.0, 0.0, 0.0,
		0.5, -0.5, 0.0,     1.0, 0.0, 0.0
	];
	
	var TriangleIndices = [0,1,2];
		
	//Buffer is a chunk of memory on the GPU used for some purpose	
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	
	
	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(TriangleIndices),gl.STATIC_DRAW);
	
	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	gl.vertexAttribPointer( 
		positionAttribLocation, //Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, //Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,// Sizeof an individual vertex
		0// Offset from the begimming of a single vertex to this attribute
	);
	
	
	gl.vertexAttribPointer( 
	colorAttribLocation, //colour location
	3, // Number of elements per attribute
	gl.FLOAT, //Type of elements
	gl.FALSE,
	6 * Float32Array.BYTES_PER_ELEMENT,// Sizeof an individual vertex
	3 * Float32Array.BYTES_PER_ELEMENT// Offset from the begimming of a single vertex to this attribute
	);
	
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	
	
	//Tell openGL state machine which program should be active
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	
	
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix,[0, 0, -5],[0, 0, 0],[0, 1, 0]);//set camera
	mat4.perspective(projMatrix,glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);// Set perspective
	
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	//
	//Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function(){
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		
		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		
		requestAnimationFrame(loop);
	};
	
	requestAnimationFrame(loop);
		 
		 

         /*=========Drawing the triangle===========*/


		//gl.clearColor(0.8, 0.8, 0.8, 1.0);
		//gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

         // Draw the triangle
         //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
	///Triangle end///
	
/*
	
	/////////////////////////////////////
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.FRONT);
	//gl.cullFace(gl.BACK);
	
	var vertexShader =  gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		
		console.error('ERROR cannot compile the vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		
		console.error('ERROR cannot compile fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!', gl.getProgramInfolog(program));
		return;
	}
	
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('ERROR validating program!', gl.getProgramInfolog(program));
		return;
	}
	
	//
	//CreateBuffer
	//
	var triangleVertices = 
	[//X, Y            R, G, B
		0.0, 0.5,      1.0, 1.0, 0.0,
		-0.5, -0.5,    0.7, 0.0, 1.0,
		0.5, -0.5,      0.1, 1.0, 0.6
	];
		
	//Buffer is a chunk of memory on the GPU used for some purpose	
	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	
	
	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	
	gl.vertexAttribPointer( 
	positionAttribLocation, //Attribute location
	2, // Number of elements per attribute
	gl.FLOAT, //Type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT,// Sizeof an individual vertex
	0// Offset from the begimming of a single vertex to this attribute
	);
	
	
	gl.vertexAttribPointer( 
	colorAttribLocation, //colour location
	3, // Number of elements per attribute
	gl.FLOAT, //Type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT,// Sizeof an individual vertex
	2 * Float32Array.BYTES_PER_ELEMENT// Offset from the begimming of a single vertex to this attribute
	);
	
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);



//
//Main render loop
//
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
	////////////////////////////////////
	
	

	
	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
	{
		
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
	{
		
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
		console.error('ERROR linking program!', gl.getProgramInfolog(program));
		return;
	}
	
	gl.validateProgram(program);
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
	{
		console.error('ERROR validating program!', gl.getProgramInfolog(program));
		return;
	}
	
	//
	//CreateBuffer
	//
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.7,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.7,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.7,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.7,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.3,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.3,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.3,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.3,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.76,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.76,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.76,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.76,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.1, 7.15,
		1.0, -1.0, 1.0,    1.0, 0.1, 7.15,
		-1.0, -1.0, 1.0,    1.0, 0.1, 7.15,
		-1.0, 1.0, 1.0,    1.0, 0.1, 7.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 2.6, 0.15,
		1.0, -1.0, -1.0,    0.0, 2.6, 0.15,
		-1.0, -1.0, -1.0,    0.0, 2.6, 0.15,
		-1.0, 1.0, -1.0,    0.0, 2.6, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.8, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.8, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.8, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.8, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
];

	
	
		
	//Buffer is a chunk of memory on the GPU used for some purpose	
	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
	
	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices),gl.STATIC_DRAW);
	
	
	var positionAttribLocation = gl.getAttribLocation(program,'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program,'vertColor');
	gl.vertexAttribPointer( 
		positionAttribLocation, //Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, //Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT,// Sizeof an individual vertex
		0// Offset from the begimming of a single vertex to this attribute
	);
	
	
	gl.vertexAttribPointer( 
	colorAttribLocation, //colour location
	3, // Number of elements per attribute
	gl.FLOAT, //Type of elements
	gl.FALSE,
	6 * Float32Array.BYTES_PER_ELEMENT,// Sizeof an individual vertex
	3 * Float32Array.BYTES_PER_ELEMENT// Offset from the begimming of a single vertex to this attribute
	);
	
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	
	
	//Tell openGL state machine which program should be active
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
	
	
	var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
	
	
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix,[2, 0, -3],[0, 0, 0],[0, 1, 0]);//set camera
	mat4.perspective(projMatrix,glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);// Set perspective
	
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	//
	//Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function(){
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		//mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);//Rotate
		//mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);//Rotate on y axis
		//mat4.rotate(xRotationMatrix, identityMatrix, angle/ 4, [1, 0, 0]);//Rotate on x axis
		//mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);// Rotate along x and y axis
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		
		gl.clearColor(0.8, 0.8, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		
		// Draw the triangle  ******
         gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);//*************
		
		requestAnimationFrame(loop);
	};
	
	requestAnimationFrame(loop);
	*/
};

/*
function draw2D()  {
      var canvas = document.getElementById("shapecanvas");
      var c2dCtx = null;
      var exmsg = "Cannot get 2D context from canvas";
      try {
        c2dCtx = canvas.getContext('2d');
      }
      catch (e)
      {
        exmsg = "Exception thrown: " + e.toString();
      }
      if (!c2dCtx) {
        alert(exmsg);
        throw new Error(exmsg);
      }
      c2dCtx.fillStyle = "#0000ff";
      c2dCtx.beginPath();
      c2dCtx.moveTo(250, 40);    
      c2dCtx.lineTo(450, 250);         // Bottom Right
      c2dCtx.lineTo(50, 250);         // Bottom Left
      c2dCtx.closePath();
      c2dCtx.fill();
     
  }
*/


//Base code sample
/*
main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glCanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}
*/