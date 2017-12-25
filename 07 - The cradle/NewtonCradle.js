class Stand {
    constructor() {
        this.base = new Paralelepiped([0, 0, -8], 8, 16, 1);
        this.legs = this.generateLegs();
        this.frame = this.generateFrame();
    }

    generateLegs() {
        var legs = [];
        legs.push(new Cylinder([-4, -8, -9], 0.6, 2, [0, 0, 0], [0.6, 0.6, 0.6]));
        legs.push(new Sphere([-4, -8, -7], 0.6, [0.6, 0.6, 0.6]));
        legs.push(new Cylinder([4, -8, -9], 0.6, 2, [0, 0, 0], [0.6, 0.6, 0.6]));
        legs.push(new Sphere([4, -8, -7], 0.6, [0.6, 0.6, 0.6]));
        legs.push(new Cylinder([4, 8, -9], 0.6, 2, [0, 0, 0], [0.6, 0.6, 0.6]));
        legs.push(new Sphere([4, 8, -7], 0.6, [0.6, 0.6, 0.6]));
        legs.push(new Cylinder([-4, 8, -9], 0.6, 2, [0, 0, 0], [0.6, 0.6, 0.6]));
        legs.push(new Sphere([-4, 8, -7], 0.6, [0.6, 0.6, 0.6]));
        return legs;
    }

    generateFrame() {
        var frame = [];
        frame.push(new Cylinder([-4, -8, -7], 0.3, 10, [0, 0, 0], [0.5, 0.5, 0.5]));
        frame.push(new Cylinder([4, -8, -7], 0.3, 10, [0, 0, 0], [0.5, 0.5, 0.5]));
        frame.push(new Cylinder([-4, 8, -7], 0.3, 10, [0, 0, 0], [0.5, 0.5, 0.5]));
        frame.push(new Cylinder([4, 8, -7], 0.3, 10, [0, 0, 0], [0.5, 0.5, 0.5]));

        frame.push(new Cylinder([-4, -8, 3], 0.3, 16, [90, 0, 0], [0.5, 0.5, 0.5]));
        frame.push(new Sphere([-4, -8, 3], 0.3, [0.6, 0.6, 0.6]));
        frame.push(new Sphere([-4, 8, 3], 0.3, [0.6, 0.6, 0.6]));
        frame.push(new Cylinder([4, -8, 3], 0.3, 16, [90, 0, 0], [0.5, 0.5, 0.5]));
        frame.push(new Sphere([4, -8, 3], 0.3, [0.6, 0.6, 0.6]));
        frame.push(new Sphere([4, 8, 3], 0.3, [0.6, 0.6, 0.6]));

        return frame;
    }

    draw() {
        this.base.draw();
        for (var i = 0; i < this.legs.length; i++) {
            this.legs[i].draw();
        }
        for (var i = 0; i < this.frame.length; i++) {
            this.frame[i].draw();
        }
    }
}

class Pendulum {
    constructor(center) {
        this.center = center;
        this.mass = 1;
        this.damping = 0.5;
        this.length = 1;
        this.gravity = 9;
        this.angle = 0;
        this.angularMomentum = 0;
        this.position = center;
    }

    draw() {
        this.calculateNextPosition();
        var ball = new Sphere(this.position, 1, [0.5, 0.5, 0.5])
        var strings = [
            new Cylinder([this.center[0] + 4, this.center[1], this.center[2]], 0.1, 9, [180 - 60 * this.angle, -25, 0], [0, 0, 0]),
            new Cylinder([this.center[0] - 4, this.center[1], this.center[2]], 0.1, 9, [180 - 60 * this.angle, 25, 0], [0, 0, 0])
        ]
        ball.draw();
        for (var i = 0; i < strings.length; i++) {
            //strings[i].draw();
        }
    }

    calculateNextPosition() {
        var dt = 0.005;
        for (var i = 0; i < 2; i++) {
            this.angle += dt * this.angularMomentum;
            this.angularMomentum -= dt * ((this.gravity / this.length) * Math.sin(this.angle) + (this.damping / (this.mass * this.length * this.length)) * this.angularMomentum);
        }
        var y = this.center[1] + 8 * this.length * Math.sin(this.angle);
        var z = this.center[2] - 8 * this.length * Math.cos(this.angle);
        this.position =  [0, y, z];
    }

    getPosition(){
        return this.position;
    }

    updateAngularMomentum(angularMomentum) {
        this.angularMomentum = angularMomentum;
    }
    getAngularMomentum() {
        return this.angularMomentum;
    }
    updateAngle(angle) {
        this.angle = angle;
    }
    getAngle() {
        return this.angle;
    }
    getCenter(){
        return this.center;
    }
}

class Physics {
    constructor() {
        this.epsilon = 1.99;
    }

    calculateCollisions(balls) {
        var inCollision = [];
        var currentBall = balls[0];
        var group = 0;
        inCollision.push([currentBall]);
        for (var i = 1; i < balls.length; i++) {
            if (this.areInVicinity(currentBall, balls[i])) {
                inCollision[group].push(balls[i]);
            } else {
                currentBall = balls[i];
                inCollision.push([currentBall]);
                group++;
            }
        }
        return inCollision;
    }

    updateAngularMomentums(ballsInCollision) {
        for (var i = 0; i < ballsInCollision.length; i++) {
            this.swapMomentums(ballsInCollision[i][0], ballsInCollision[i][ballsInCollision[i].length - 1]);
        }
    }

    swapMomentums(a, b) {
        var tmp = a.getAngularMomentum();
        a.updateAngularMomentum(b.getAngularMomentum());
        b.updateAngularMomentum(tmp);
    }

    updateState(balls) {
        this.updateAngularMomentums(this.calculateCollisions(balls));
    }

    areInVicinity(a, b) {
        return this.dist(a.getPosition(), b.getPosition()) < this.epsilon;
    }

    dist(point1, point2) {

        var deltaX = point2[0] - point1[0];
        var deltaY = point2[1] - point1[1];
        var deltaZ = point2[2] - point1[2];

        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

        return distance;
    }
}

// каноничен куб - конструктор
CanonicalCube = function () {
    // върхове
    var v = [[+0.5, -0.5, -0.5], [+0.5, +0.5, -0.5],
    [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5],
    [+0.5, -0.5, +0.5], [+0.5, +0.5, +0.5],
    [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5]];
    // нормални вектори
    var n = [[1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1]];
    // общ списък връх-нормала
    var data = [].concat(
        v[0], n[0], v[1], n[0], v[4], n[0],
        v[4], n[0], v[1], n[0], v[5], n[0],
        v[6], n[1], v[2], n[1], v[7], n[1],
        v[7], n[1], v[2], n[1], v[3], n[1],
        v[5], n[2], v[1], n[2], v[6], n[2],
        v[6], n[2], v[1], n[2], v[2], n[2],
        v[4], n[3], v[7], n[3], v[0], n[3],
        v[0], n[3], v[7], n[3], v[3], n[3],
        v[4], n[4], v[5], n[4], v[7], n[4],
        v[7], n[4], v[5], n[4], v[6], n[4],
        v[0], n[5], v[3], n[5], v[1], n[5],
        v[1], n[5], v[3], n[5], v[2], n[5]);
    // локална променлива за инстанцията с WebGL буфер
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    // запомняме буфера в текущата инстанция
    this.buf = buf;
}

// каноничен куб - метод за рисуване
CanonicalCube.prototype.draw = function () {
    // активираме буфера, създаден от конструктора
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    // казваме къде са координатите
    gl.enableVertexAttribArray(aXYZ);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 6 * FLOATS, 0 * FLOATS);
    // казваме къде са нормалите
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 6 * FLOATS, 3 * FLOATS);
    // рисуваме
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

var canonicalCube;

// куб - конструктор с параметри център и размер
Paralelepiped = function (center, length, width, height) {
    // съхраняваме центъра и размера на куба
    this.center = center;
    this.length = length;
    this.width = width;
    this.height = height;
    this.color = [1, 0.75, 0];
    // създаваме еднократно канонична инстанция
    if (!canonicalCube)
        canonicalCube = new CanonicalCube();
}

// куб - рисуване
Paralelepiped.prototype.draw = function () {
    pushMatrix(); // запомняме матрицата
    gl.vertexAttrib3fv(aColor, this.color); // подаваме цвета
    translate(this.center); // мястото
    scale([this.length, this.width, this.height]); // и размера
    useMatrix();
    canonicalCube.draw(); // самото рисуване
    popMatrix(); // възстановяваме матрицата
}

