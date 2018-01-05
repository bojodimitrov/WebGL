class Function {
    constructor(func, color, isSegment) {
        this.func = func;
        this.color = color;
        this.widthRescaler = 1;
        this.heightRescaler = 1;
        this.widthMover = 0;
        this.heightMover = 0;
        this.changeXValue = 0;
        this.isSegment = isSegment;
        this.a = 0;
        this.b = 10000;
        this.init();
    }

    init() {
        this.data = [];
        for (var i = this.a; i <= this.b + 20; i += 1) {
            var value = this.func(i) / this.heightRescaler + this.heightMover;
            if (this.isSegment && value > segmentPart) {
                this.data.push((i + this.changeXValue) / this.widthRescaler + this.widthMover, value , 0,
                    this.color[0], this.color[1], this.color[2]
                )
            }
            if (!this.isSegment && value < segmentPart) {
                this.data.push((i + this.changeXValue) / this.widthRescaler + this.widthMover, value , 0,
                    this.color[0], this.color[1], this.color[2]
                )
            }
        }
    }

    rescaleWidth(newScale) {
        this.widthRescaler = newScale;
    }

    rescaleHeight(newScale) {
        this.heightRescaler = newScale;
    }

    changeXWith(value) {
        this.changeXValue = value;
    }

    moveHorizontally(moveWith) {
        this.widthMover = moveWith;
    }

    moveVertically(moveWith) {
        this.heightMover = moveWith;
    }

    updateInterval(a, b) {
        this.a = a;
        this.b = b;
    }

    redraw() {
        this.init();
    }

    draw() {
        var vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(aXYZ);
        gl.enableVertexAttribArray(aRGB);

        gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 6 * FLOATS, 0 * FLOATS);
        gl.vertexAttribPointer(aRGB, 3, gl.FLOAT, false, 6 * FLOATS, 3 * FLOATS);

        gl.drawArrays(gl.LINE_STRIP, 0, this.data.length / 6);
    }
}

class Pointer {
    constructor(initialPosition, direction) {
        this.x = initialPosition / 5000 - 1;
        this.color = [0.3, 0.3, 0.3];
        this.data = [];
        this.gradientDirection = this.x;
        if (direction == 'left') {
            this.gradientDirection = -1;
        }
        if (direction == 'right') {
            this.gradientDirection = 1;
        }
        this.initPointer();
        this.initGradient();
    }

    initPointer() {
        this.pointer = [
            this.x, -1, 0,
            this.color[0], this.color[1], this.color[2],
            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.x + 0.01 * (this.gradientDirection), -1, 0,
            this.color[0], this.color[1], this.color[2],
            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.x + 0.01 * (this.gradientDirection), -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.x + 0.01 * (this.gradientDirection), -1, 0,
            this.color[0], this.color[1], this.color[2]
        ];
    }

    updateX(x){
        this.x = x/ 5000 - 1;
    }

    initGradient() {
        this.gradient = [
            this.x, -1, 0,
            this.color[0], this.color[1], this.color[2],
            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.gradientDirection, -1, 0,
            1, 1, 1,

            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.gradientDirection, -1, 0,
            1, 1, 1,
            this.gradientDirection, -0.6, 0,
            1, 1, 1,
        ];
    }

    redraw() {
        this.initGradient();
        this.initPointer();
    }

    drawPointer() {
        this.data = this.pointer;
        this.draw();
    }

    drawGradient() {
        this.data = this.gradient;
        this.draw();
    }

    draw() {
        var vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(aXYZ);
        gl.enableVertexAttribArray(aRGB);

        gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 6 * FLOATS, 0 * FLOATS);
        gl.vertexAttribPointer(aRGB, 3, gl.FLOAT, false, 6 * FLOATS, 3 * FLOATS);

        gl.drawArrays(gl.TRIANGLES, 0, this.data.length / 6);
    }
}