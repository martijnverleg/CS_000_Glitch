function Frame(x, y, width, height) {
    this.vertices = generateVertices(x, y, width, height);
    this.textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,

        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ];
}

function generateVertices(x, y, width, height) {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    return [
        x1, y1,
        x2, y1,
        x1, y2,

        x1, y2,
        x2, y1,
        x2, y2,
    ];
}