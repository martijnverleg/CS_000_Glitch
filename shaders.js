function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Vertex shader program
const vsSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    uniform vec2 u_resolution;

    varying vec2 v_texCoord;

    void main() {
        // convert the rectangle from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        // center on 0
        vec2 halfRes = a_position * 0.5;
        vec2 centered = a_position - halfRes;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

        // pass the texCoord to the fragment shader
        // The GPU will interpolate this value between points.
        v_texCoord = a_texCoord;
    }
`;

// Fragment shader program
const fsSource = `
    #define MAX_LINES 128
    precision mediump float;

    // our texture
    uniform sampler2D u_image;
    uniform int u_numLines;
    uniform float u_offsetX;
    uniform float u_offsetLines[MAX_LINES];
    uniform float u_offsetHeight[MAX_LINES];
    
    // the texCoords passed in from the vertex shader.
    varying vec2 v_texCoord;
    
    bool isInArray(float number);

    void main() {
        vec2 u_resolution;
        vec2 offset = v_texCoord;

        if(isInArray(v_texCoord.y)) {
            offset = vec2(v_texCoord.x + u_offsetX, v_texCoord.y);
        }
        
        gl_FragColor = texture2D(u_image, offset);
        
    }

    bool isInArray(float number) {
        for(int i = 0; i < MAX_LINES; i++) {
            if(i > u_numLines) { break; }
            vec2 u_resolution;

            if(number >= u_offsetLines[i] && number < u_offsetLines[i] + u_offsetHeight[i]) {
                return true;
            }
        }
        
        return false;
    }
`;