function drawScene(gl, programInfo, buffers, texture) {
  // setup canvas and shader program
  resize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0); 
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  gl.useProgram(programInfo.program);

  // bind vertices
  {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, num, type, normalize, stride, offset);
  }

  // bind texcoords
  {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
  }
  
  // Set the shader uniforms
  const resolutionLocation = gl.getUniformLocation(programInfo.program, "u_resolution");
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  const randomLines = [];
  const randomHeights = [];
  
  const maxHeight = document.querySelector("#maxHeight").value / 10;

  // set max lines uniform
  const lines = document.querySelector("#lines").value;
  const numLines =  gl.getUniformLocation(programInfo.program, "u_numLines");
  gl.uniform1i(numLines, lines);

  // generate random line placed on height of canvas
  for(let i = 0; i < lines; i++) {
    position = Math.floor(Math.random() * Math.floor(gl.canvas.height)) / gl.canvas.height;
    height = Math.random() * maxHeight;

    randomLines.push(position);
    randomHeights.push(height);
  }

  randomLines.sort(function(a, b){return a-b});
  
  // set line position uniforms
  const offsetLines =  gl.getUniformLocation(programInfo.program, "u_offsetLines");
  gl.uniform1fv(offsetLines, randomLines);

  // set line height uniforms
  const offsetHeight =  gl.getUniformLocation(programInfo.program, "u_offsetHeight");
  gl.uniform1fv(offsetHeight, randomHeights);

  // set horizontal offset
  const offset = document.querySelector("#offset").value;
  console.log(offset);
  const offsetX =  gl.getUniformLocation(programInfo.program, "u_offsetX");
  gl.uniform1f(offsetX, offset);

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);
  
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  {    
    const offset = 0;
    const vertexCount = 6;
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
  }
}

function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}