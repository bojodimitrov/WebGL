class Function {
    constructor(func, color) {
        this.func = func;
        this.color = color;
        this.widthRescaler = 1;
        this.heightRescaler = 1;
        this.widthMover = 0;
        this.heightMover = 0;
    }

    init() {
        this.data = [];
        for(var i = 0; i < 10000; i+=0.2){
            this.data.push(i / this.widthRescaler + this.widthMover, this.func(i) / this.heightRescaler + this.heightMover, 0,
                this.color[0], this.color[1], this.color[2]
            )
        }
    }

    rescaleWidth(newScale){
        this.widthRescaler = newScale;
    }

    rescaleHeight(newScale){
        this.heightRescaler = newScale;
    }

    moveHorizontally(moveWith){
        this.widthMover = moveWith;
    }

    moveVertically(moveWith){
        this.heightMover = moveWith;
    }

    draw() {
        this.init();
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

class Pointer{
    constructor(initialPosition){
        this.x = initialPosition / 5000 - 1;
        this.color = [0, 0, 0.9];
    }

    draw(){
        var data = [
            this.x, -1, 0,
            this.color[0], this.color[1], this.color[2],
            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.x-0.1, -1, 0,
            this.color[0], this.color[1], this.color[2],
            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.x-0.1, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            this.x-0.1, -1, 0,
            this.color[0], this.color[1], this.color[2],

            this.x, -1, 0,
            this.color[0], this.color[1], this.color[2],
            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            -1, -1, 0,
            1, 1, 1,

            this.x, -0.6, 0,
            this.color[0], this.color[1], this.color[2],
            -1, -1, 0,
            1, 1, 1,
            -1, -0.6, 0,
            1, 1, 1,
        ];

        var vBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(aXYZ);
        gl.enableVertexAttribArray(aRGB);

        gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 6 * FLOATS, 0 * FLOATS);
        gl.vertexAttribPointer(aRGB, 3, gl.FLOAT, false, 6 * FLOATS, 3 * FLOATS);

        gl.drawArrays(gl.TRIANGLES, 0, data.length / 6);
    }
}