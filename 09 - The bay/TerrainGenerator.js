class TerrainGenerator {
    constructor(center, size, dimensions, density) {
        this.center = center;
        this.size = size;//x and y dimensions
        this.density = density;
        this.dimensions = dimensions;
        this.elevation = 50;
        this.cutoff = 25;
        this.color = [0.1, 0.8, 0.2];
        this.worldBottom = -160;
        this.waterLevel = 0;
        this.greenThreshold = 5;
        this.permanentFrost = 50;
        this.shoreDepth = 1;
        this.highestPeak = [0,0,0];
        this.generatePoints();
        this.data = this.generateTerrain();

    }

    updateWaterLevel(waterLevel) {
        this.waterLevel = waterLevel;
    }

    updateWorldBottom(worldBottom) {
        this.worldBottom = worldBottom;
    }

    getHighestPeak(){
        return this.highestPeak;
    }

    generatePoints() {
        this.points = [];
        var xDisplacement = this.dimensions[0] / 2 ** this.density;
        var yDisplacement = this.dimensions[1] / 2 ** this.density;
        var rightEnd = this.dimensions[0] / 2;
        var leftEnd = -this.dimensions[0] / 2;
        var upperEnd = this.dimensions[1] / 2;
        var lowerEnd = -this.dimensions[1] / 2;

        this.numberOfLines = 0;

        for (var i = leftEnd; i <= rightEnd; i += xDisplacement) {
            this.points.push([]);
            for (var j = lowerEnd; j <= upperEnd; j += yDisplacement) {
                this.points[this.numberOfLines].push([i, j, 0]);
            }
            this.numberOfLines++;
        }
        var randOffset = 0;
        this.points[0][0][2] = random(-randOffset, randOffset)
        this.points[0][this.numberOfLines - 1][2] = random(-randOffset, randOffset)
        this.points[this.numberOfLines - 1][0][2] = random(-randOffset, randOffset)
        this.points[this.numberOfLines - 1][this.numberOfLines - 1][2] = random(-randOffset, randOffset)
        this.diamondSquare(0, 0, this.numberOfLines, this.numberOfLines, this.elevation, this.numberOfLines - 1)
    }

    diamondSquare(iStart, jStart, iEnd, jEnd, summandValue, level) {
        if (level <= 1) return;

        // diamonds
        for (var i = iStart + level; i < iEnd; i += level) {
            for (var j = jStart + level; j < jEnd; j += level) {
                var a = this.points[i - level][j - level][2];
                var b = this.points[i][j - level][2];
                var c = this.points[i - level][j][2];
                var d = this.points[i][j][2];
                var e = this.points[i - level / 2][j - level / 2][2] = (a + b + c + d) / 4 + random(-1, 1) * summandValue;
                if(e > this.highestPeak[2]) {
                    this.highestPeak[0] = this.points[i - level / 2][j - level / 2][0];
                    this.highestPeak[1] = this.points[i - level / 2][j - level / 2][1];
                    this.highestPeak[2] = e;
                }
            }
        }

        // squares
        for (var i = iStart + 2 * level; i < iEnd; i += level) {
            for (var j = jStart + 2 * level; j < jEnd; j += level) {
                var a = this.points[i - level][j - level][2];
                var b = this.points[i][j - level][2];
                var c = this.points[i - level][j][2];
                var d = this.points[i][j][2];
                var e = this.points[i - level / 2][j - level / 2][2];

                var f = this.points[i - level][j - level / 2][2] = (a + c + e + this.points[i - 3 * level / 2][j - level / 2][2]) / 4 + random(-1, 1) * summandValue;
                if(f > this.highestPeak){
                    this.highestPeak[0] = this.points[i - level][j - level / 2][0];
                    this.highestPeak[1] = this.points[i - level][j - level / 2][1];
                    this.highestPeak[2] = f;
                } 
                var g = this.points[i - level / 2][j - level][2] = (a + b + e + this.points[i - level / 2][j - 3 * level / 2][2]) / 4 + random(-1, 1) * summandValue;
                if(f > this.highestPeak){
                    this.highestPeak[0] = this.points[i - level / 2][j - level][0];
                    this.highestPeak[1] = this.points[i - level / 2][j - level][1];
                    this.highestPeak[2] = g;
                } 
            }
        }

        this.diamondSquare(iStart, jStart, iEnd, jEnd, summandValue / 2, level / 2);
    }

    generateTerrain() {
        var data = [];

        this.numberOfPoints = 0;
        var cutOff = this.cutoff;

        for (var i = cutOff; i < this.points.length - cutOff - 1; i++) {
            for (var j = cutOff; j < this.points[i].length - cutOff - 1; j++) {
                var n1 = vectorProduct(vectorPoints(this.points[i][j + 1], this.points[i][j]), vectorPoints(this.points[i + 1][j + 1], this.points[i][j]))
                var n2 = vectorProduct(vectorPoints(this.points[i][j], this.points[i + 1][j + 1]), vectorPoints(this.points[i + 1][j], this.points[i + 1][j + 1]))

                var color1 = this.getColorOnHeight(this.points[i][j][2]);
                var color2 = this.getColorOnHeight(this.points[i][j + 1][2]);
                var color3 = this.getColorOnHeight(this.points[i + 1][j][2]);
                var color4 = this.getColorOnHeight(this.points[i + 1][j + 1][2]);

                data.push(this.points[i][j][0], this.points[i][j][1], this.points[i][j][2],
                    -n1[0], -n1[1], -n1[2],
                    color1[0], color1[1], color1[2]
                );
                data.push(this.points[i][j + 1][0], this.points[i][j + 1][1], this.points[i][j + 1][2],
                    -n1[0], -n1[1], -n1[2],
                    color2[0], color2[1], color2[2]
                );
                data.push(this.points[i + 1][j + 1][0], this.points[i + 1][j + 1][1], this.points[i + 1][j + 1][2],
                    -n1[0], -n1[1], -n1[2],
                    color4[0], color4[1], color4[2]
                );

                data.push(this.points[i][j][0], this.points[i][j][1], this.points[i][j][2],
                    n2[0], n2[1], n2[2],
                    color1[0], color1[1], color1[2]
                );
                data.push(this.points[i + 1][j][0], this.points[i + 1][j][1], this.points[i + 1][j][2],
                    n2[0], n2[1], n2[2],
                    color3[0], color3[1], color3[2]
                );
                data.push(this.points[i + 1][j + 1][0], this.points[i + 1][j + 1][1], this.points[i + 1][j + 1][2],
                    n2[0], n2[1], n2[2],
                    color4[0], color4[1], color4[2]
                );
                this.numberOfPoints += 6;
            }
        }

        this.generateBlackEdgeY(data, cutOff, cutOff);
        this.generateBlackEdgeY(data, cutOff, this.points.length - cutOff-1);
        this.generateBlackEdgeX(data, cutOff, cutOff);
        this.generateBlackEdgeX(data, cutOff, this.points.length - cutOff-1);
        return data;
    }

    generateBlackEdgeY(data, cutOff, direction) {
        var color = [0, 0, 0];
        for (var i = cutOff; i < this.points.length - cutOff - 1; i++) {
            data.push(this.points[i][direction][0], this.points[i][direction][1], this.points[i][direction][2],
                0, 1, 0,
                color[0], color[1], color[2]
            );
            data.push(this.points[i + 1][direction][0], this.points[i + 1][direction][1], this.points[i + 1][direction][2],
                0, 1, 0,
                color[0], color[1], color[2]
            );
            data.push(this.points[i][direction][0], this.points[i][direction][1], this.worldBottom,
                0, 1, 0,
                color[0], color[1], color[2]
            );
            data.push(this.points[i + 1][direction][0], this.points[i + 1][direction][1], this.points[i + 1][direction][2],
                0, 1, 0,
                color[0], color[1], color[2]
            );
            data.push(this.points[i + 1][direction][0], this.points[i + 1][direction][1], this.worldBottom,
                0, 1, 0,
                color[0], color[1], color[2]
            );
            data.push(this.points[i][direction][0], this.points[i][direction][1], this.worldBottom,
                0, 1, 0,
                color[0], color[1], color[2]
            );
            this.numberOfPoints += 6;
        }
    }

    generateBlackEdgeX(data, cutOff, direction) {
        for (var j = cutOff; j < this.points.length - cutOff - 1; j++) {
            data.push(this.points[direction][j][0], this.points[direction][j][1], this.points[direction][j][2],
                0, 0, 0,
                0, 0, 0
            );
            data.push(this.points[direction][j+1][0], this.points[direction][j+1][1], this.points[direction][j+1][2],
                0, 0, 0,
                0, 0, 0
            );
            data.push(this.points[direction][j][0], this.points[direction][j][1], this.worldBottom,
                0, 0, 0,
                0, 0, 0
            );
            data.push(this.points[direction][j+1][0], this.points[direction][j+1][1], this.points[direction][j+1][2],
                0, 0, 0,
                0, 0, 0
            );
            data.push(this.points[direction][j+1][0], this.points[direction][j+1][1], this.worldBottom,
                0, 0, 0,
                0, 0, 0
            );
            data.push(this.points[direction][j][0], this.points[direction][j][1], this.worldBottom,
                0, 0, 0,
                0, 0, 0
            );
            this.numberOfPoints += 6;
        }
    }

    getColorOnHeight(height) {
        if (height < this.waterLevel - this.shoreDepth) {
            return [0.2, 0.5, 0.9];
        }
        if (height >= this.waterLevel - this.shoreDepth && height < this.greenThreshold) {
            var heightPercentage = (Math.round(height - (this.waterLevel - 5)) / (this.greenThreshold - (this.waterLevel - 5)) + 0.2) * 100 / 360;
            var color = hslToRgb(heightPercentage, 1, 0.5);
            return color;
        }
        if (height >= this.greenThreshold && height < this.permanentFrost) {
            var heightPercentage = (Math.round(height - this.greenThreshold) / (this.permanentFrost - this.greenThreshold)) + 0.5;
            if (heightPercentage > 1) {
                heightPercentage = 1;
            }
            var color = hslToRgb(0.4, 1, heightPercentage);
            return color;
        }
        if (height >= this.permanentFrost) {
            return [1, 1, 1];
        }
    }

    drawGrid() {
        // активираме буфера, създаден от конструктора
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
        // върхове
        gl.enableVertexAttribArray(aXYZ);
        gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 9 * FLOATS, 0 * FLOATS);
        // нормали
        gl.enableVertexAttribArray(aNormal);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 9 * FLOATS, 3 * FLOATS);

        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 9 * FLOATS, 6 * FLOATS);

        gl.drawArrays(gl.TRIANGLES, 0, this.numberOfPoints);

        gl.disableVertexAttribArray(aColor);
    }

    init() {
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
        // запомняме буфера в текущата инстанция
        this.buf = buf;
    }

    draw() {
        this.init();
        pushMatrix(); // запомняме матрицата
        translate(this.center); // мястото
        scale([this.size, this.size, this.size]); // и размера
        useMatrix();
        this.drawGrid(); // самото рисуване
        popMatrix(); // възстановяваме матрицата
    }
}

function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b]
}