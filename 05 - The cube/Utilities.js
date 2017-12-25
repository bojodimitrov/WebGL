class Panel {
    constructor(center, groove, size, color, rotate) {
        this.center = center;
        this.data = [];
        this.color = color;
        this.size = size;
        this.groove = groove;
        this.rotate = rotate;
    }

    draw() {
        this.init();
        pushMatrix();
        translate(this.center);
        scale([1, 1, 1]);
        xRotate(this.rotate[0]);
        yRotate(this.rotate[1]);
        zRotate(this.rotate[2]);
        useMatrix();
        this.drawPanel();
        popMatrix();
    }

    init() {
        var offset = this.size - this.groove;
        var v = [
            //base square
            [this.size, this.size, 0], [-this.size, this.size, 0],
            [-this.size, -this.size, 0], [this.size, -this.size, 0],
            //upper square
            [this.groove, this.groove, offset], [-this.groove, this.groove, offset],
            [-this.groove, -this.groove, offset], [this.groove, -this.groove, offset]
        ];

        var n = [[0, 0, 1], [0, 0, -1],
        [1, 0, 1], [0, 1, 1],
        [-1, 0, 1], [0, -1, 1],
        ];
        var baseColor = [0.1, 0.1, 0.1];
        this.data = [].concat(
            v[0], n[1], baseColor, v[1], n[1], baseColor, v[2], n[1], baseColor,
            v[2], n[1], baseColor, v[3], n[1], baseColor, v[0], n[1], baseColor,
            v[4], n[0], this.color, v[5], n[0], this.color, v[6], n[0], this.color,
            v[6], n[0], this.color, v[7], n[0], this.color, v[4], n[0], this.color,
            //walls -> 1
            v[0], n[2], baseColor, v[3], n[2], baseColor, v[7], n[2], baseColor,
            v[0], n[2], baseColor, v[4], n[2], baseColor, v[7], n[2], baseColor,
            // -> 2
            v[0], n[3], baseColor, v[4], n[3], baseColor, v[5], n[3], baseColor,
            v[0], n[3], baseColor, v[1], n[3], baseColor, v[5], n[3], baseColor,
            // -> 3
            v[1], n[4], baseColor, v[2], n[4], baseColor, v[6], n[4], baseColor,
            v[1], n[4], baseColor, v[6], n[4], baseColor, v[5], n[4], baseColor,
            // -> 4
            v[2], n[5], baseColor, v[3], n[5], baseColor, v[7], n[5], baseColor,
            v[2], n[5], baseColor, v[6], n[5], baseColor, v[7], n[5], baseColor
        );

        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        // запомняме буфера в текущата инстанция
        this.buf = buf;
    }

    drawPanel() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
        // върхове
        gl.enableVertexAttribArray(aXYZ);
        gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 9 * FLOATS, 0 * FLOATS);
        // нормали
        gl.enableVertexAttribArray(aNormal);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 9 * FLOATS, 3 * FLOATS);

        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 9 * FLOATS, 6 * FLOATS);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

}

class RubicCube {
    constructor(center) {
        this.center = center;
        this.panels = [];
        this.colorPicker = new ColorPicker();
        this.generatePanels();
    }

    generatePanels() {
        this.addXYPlaneWalls(-3, 180);
        this.addXYPlaneWalls(3, 0);
        this.addZYPlaneWalls(-3, -90);
        this.addZYPlaneWalls(3, 90);
        this.addXZPlaneWalls(-3, -90);
        this.addXZPlaneWalls(3, 90);

    }

    addXYPlaneWalls(offset, rotation) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var panel = new Panel([this.center[0] + 2*i, this.center[1] + 2*j, this.center[2] + offset],
                    0.9, 1, this.colorPicker.nextColor().getColor(), [rotation, 0, 0]);
                this.panels.push(panel);
            }
        }
    }

    addXZPlaneWalls(offset, rotation) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var panel = new Panel([this.center[0] + 2*i, this.center[1] + offset, this.center[2] + 2*j],
                    0.9, 1, this.colorPicker.nextColor().getColor(), [rotation, 0, 0]);
                this.panels.push(panel);
            }
        }
    }

    addZYPlaneWalls(offset, rotation) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                var panel = new Panel([this.center[1] + offset, this.center[1] + 2*i, this.center[2] + 2*j],
                    0.9, 1, this.colorPicker.nextColor().getColor(), [0, rotation, 0]);
                this.panels.push(panel);
            }
        }
    }

    draw() {
        for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].draw();
        }
    }
}

class ColorPicker{
    constructor(){
        var white = [1, 1, 1];
        var blue = [0, 0.3, 1];
        var red =  [0.9, 0, 0];
        var yellow = [1, 0.75, 0];
        var green = [0, 0.7, 0.2];
        var orange = [1, 0.3, 0];

        this.chosenColor = [];
        this.colors = [];

        for (var i = 0; i < 9; i++) {
            this.colors.push(white);
            this.colors.push(blue);
            this.colors.push(red);
            this.colors.push(yellow);
            this.colors.push(green);
            this.colors.push(orange);
        }
    }

    nextColor(){
        var position = Math.floor(random(0, this.colors.length-1));
        this.chosenColor = this.colors[position];
        this.color = this.colors.splice(position, 1);
        return this;
    }

    getColor(){
        return this.chosenColor;
    }
}