class TrefoilKnot {
    constructor(center, size) {
        this.center = center;
        this.size = size;
        this.data = [];
    }



    draw() {
        this.data = [];


        var nyanHelper = new NyanHelper([255,125,125]);
        var x = (Math.sin(0) + 2 * Math.sin(2 * 0));
        var y = (Math.cos(0) - 2 * Math.cos(2 * 0));
        var z = (Math.sin(0));
        
        var previousPoint = PointBuilder.start().with3DCoordinates(x, y, z).withColor(0.5, 0.5, 0.5).build();
        var offset = 0.02;
        var clip = 0.01;
        for (var phi = 0.02; phi <= 2*Math.PI + 0.1; phi += offset) {
            for(var i = 0; i < 4; i++){
                nyanHelper.changeColor();
            }
            var x1 = (Math.sin(phi) + 2 * Math.sin(2 * (phi)));
            var y1 = (Math.cos(phi) - 2 * Math.cos(2 * (phi)));
            var z1 = (Math.sin(3 * (phi)));

            var x2 = (Math.sin(phi+offset+clip) + 2 * Math.sin(2 * (phi+offset+clip)));
            var y2 = (Math.cos(phi+offset+clip) - 2 * Math.cos(2 * (phi+offset+clip)));
            var z2 = (Math.sin(3 * (phi+offset+clip)));

            var point1 = PointBuilder.start().with3DCoordinates(x1, y1, z1).withColor(nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue()).build();
            var point2 = PointBuilder.start().with3DCoordinates(x2, y2, z2).withColor(nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue()).build();
            var tube = new Tube(point1.get3DCoordinates(), point2.get3DCoordinates(), 1, point1.getColor())
            tube.draw();
            //previousPoint = point;
        }

    }
}

class Tube {
    constructor(startingPoint, endingPoint, size, color) {
        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;
        this.size = size;
        this.walls = 50;
        this.data = [];
        this.color = color;
        this.radius = 0.3;
    }

    draw() {
        this.init();
        pushMatrix();
        //translate(this.endingPoint);
        scale([this.size, this.size, this.size]);
        useMatrix();
        this.drawTube();
        popMatrix();
    }

    init() {
        var iterations = 0;

        var a = 0, dA = 2 * Math.PI / this.walls;
        var nZ = Math.cos(Math.PI / this.walls); // височина на нормалния вектор

        for (var i = 0; i <= this.walls; i++) {
            
            var pointA = this.determineRotation(this.startingPoint, a, this.radius);
            var pointB = this.determineRotation(this.endingPoint, a, this.radius);
            var pointC = this.determineRotation(this.startingPoint, a + dA, this.radius);
            var pointD = this.determineRotation(this.endingPoint, a + dA, this.radius);
            var normalVector = this.getNormalVector(pointA, pointB, pointC);
            this.data.push(pointA[0],
                            pointA[1],
                            pointA[2], normalVector[0], normalVector[1], normalVector[2], this.color[0], this.color[1], this.color[2]);
            this.data.push(pointB[0],
                            pointB[1],
                            pointB[2], normalVector[0], normalVector[1], normalVector[2], this.color[0], this.color[1], this.color[2]);
            this.data.push(pointC[0],
                            pointC[1],
                            pointC[2], normalVector[0], normalVector[1], normalVector[2], this.color[0], this.color[1], this.color[2]);
            this.data.push(pointC[0],
                            pointC[1],
                            pointC[2], normalVector[0], normalVector[1], normalVector[2], this.color[0], this.color[1], this.color[2]);
            this.data.push(pointB[0],
                            pointB[1],
                            pointB[2], normalVector[0], normalVector[1], normalVector[2], this.color[0], this.color[1], this.color[2]);
            this.data.push(pointD[0],
                            pointD[1],
                            pointD[2], normalVector[0], normalVector[1], normalVector[2], this.color[0], this.color[1], this.color[2]);
            a += dA;
        }

        this.points = iterations;
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        // запомняме буфера в текущата инстанция
        this.buf = buf;
    }

    getNormalVector(x, y, z){
        var a = [y[0]-x[0], y[1]-x[1], y[2]-x[2]];
        var b = [z[0]-x[0], z[1]-x[1], z[2]-x[2]];
        return vectorProduct(a, b);
    }

    determineRotation(center, theta, radius) {
        var v = unitVector([this.endingPoint[0] - this.startingPoint[0], this.endingPoint[1] - this.startingPoint[1], this.endingPoint[2] - this.startingPoint[2]]);
        var a = unitVector(this.findPerpendicularVector(v[0],v[1],v[2]));
        var b = vectorProduct(v, a);

        var x = center[0] + radius * Math.cos(theta) * a[0] + radius * Math.sin(theta) * b[0];
        var y = center[1] + radius * Math.cos(theta) * a[1] + radius * Math.sin(theta) * b[1];
        var z = center[2] + radius * Math.cos(theta) * a[2] + radius * Math.sin(theta) * b[2];
        return [x,y,z];
    }

    findPerpendicularVector(x, y, z){
        var scale = Math.abs(x) +  Math.abs(y) +  Math.abs(z);
        if(scale == 0){
            return [0,0,0];
        }

        x = x/scale;
        y = y/scale;
        z = z/scale;

        if(Math.abs(x) > Math.abs(y)){
            return [z, 0, -x];
        } else {
            return [0, z, -y];
        }
    }

    drawTube() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
        // върхове
        gl.enableVertexAttribArray(aXYZ);
        gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 9 * FLOATS, 0 * FLOATS);
        // нормали
        gl.enableVertexAttribArray(aNormal);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 9 * FLOATS, 3 * FLOATS);

        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 9 * FLOATS, 6 * FLOATS);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * this.walls);
    }
}

class Point {
    set2DCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    set3DCoordinates(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set3DNormalVector(vector) {
        this.nx = vector[0];
        this.ny = vector[1];
        this.nz = vector[2];
    }

    setRGBColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get3DCoordinates() {
        return [this.x, this.y, this.z];
    }

    get2DCoordinates() {
        return [this.x, this.y];
    }

    getNormalVector() {
        return [this.nx, this.ny, this.nz];
    }

    getColor() {
        return [this.r, this.g, this.b];
    }
}

class PointBuilder {
    static start() {
        this.point = new Point();
        return this;
    }

    static with2DCoordinates(x, y) {
        this.point.set2DCoordinates(x, y);
        return this;
    }

    static with3DCoordinates(x, y, z) {
        this.point.set3DCoordinates(x, y, z);
        return this;
    }

    static withNormalVector(nx, ny, nz) {
        this.point.set3DNormalisedVector([nx, ny, nz]);
        return this;
    }

    static withColor(r, g, b) {
        this.point.setRGBColor(r, g, b);
        return this;
    }

    static build() {
        return this.point;
    }
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}


class NyanHelper {
    constructor(initialColor) {
		this.initRed = initialColor[0];
		this.initGreen = initialColor[1];
		this.initBlue = initialColor[2];
        this.red = this.initRed;
        this.green = this.initGreen;
        this.blue = this.initBlue;
        this.state = 1;
    }

	reset(){
		this.red = this.initRed;
        this.green = this.initGreen;
        this.blue = this.initBlue;
		this.state = 1;
	}

    changeColor() {
        switch (this.state) {
            case 1: this.incrementGreen(); break;
            case 2: this.decrementRed(); break;
            case 3: this.incrementBlue(); break;
            case 4: this.incrementRedAndDecrementGreen(); break;
            case 5: this.decrementBlue(); break;
        }
    }
	
	updateInit(){
		this.initRed = this.red;
        this.initGreen = this.green;
        this.initBlue = this.blue;
	}

	setState(state){
		this.state = state;
	}
	getState(){
		return this.state;
	}
    getRed() {
        return this.red/255;
    }

    getGreen() {
        return this.green/255;
    }

    getBlue() {
        return this.blue/255;
    }
	
    incrementGreen() {
        this.green+=0.5;
        if (this.green > 255) {
            this.state = 2;
        }
    }
	
    decrementRed() {
        this.red-=0.5;
        if (this.red < 140) {
            this.state = 3;
        }
    }

    incrementBlue() {
        this.blue+=0.5;
        if (this.blue > 255) {
            this.state = 4;
        }
    }

    incrementRedAndDecrementGreen() {
        this.green-=0.5;
        this.red+=0.5;
        if (this.green < 140 && this.red > 255) {
            this.state = 5;
        }
    }

    decrementBlue() {
        this.blue-=0.5;
        if (this.blue < 125) {
            this.state = 1;
        }
    }
}