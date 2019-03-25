const fileUpload = document.getElementById("upload");
fileUpload.addEventListener("change", createImage, false);

const image = new Image();
image.onload = function () {
    Main();
};

function createImage() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = function () {
        image.src = reader.result;
    }
}

function Main() {
    const canvas = document.querySelector("#glCanvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const frame = new Frame(0, 0, image.width, image.height);

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const buffers = initBuffers(gl, frame);
    const texture = loadTexture(gl, image);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
            textureCoord: gl.getAttribLocation(shaderProgram, "a_texCoord"),
        }
    };

    requestAnimationFrame(render);

    const sliders = document.querySelectorAll(".slider");
    sliders.forEach(function(el) {
        el.addEventListener("change", function(event) {
            console.log(event);
            render();
        });
    });

    const downloadButton = document.querySelector("#download");

    downloadButton.addEventListener("click", function(event) {
        download();
    });

    function render() {
        drawScene(gl, programInfo, buffers, texture);
        //requestAnimationFrame(render);
    }
}

function download() {
    const image = document.querySelector("#glCanvas").toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href= image;
}
