function initBuffers(gl, image) {
  // create vertex buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(image.vertices), gl.STATIC_DRAW);

  // create texture buffer
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(image.textureCoordinates), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
  };
}