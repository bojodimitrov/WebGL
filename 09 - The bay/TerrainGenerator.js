class TerrainGenerator {
    constructor(center, size, dimensions, density) {
        this.center = center;
        this.size = size;//x and y dimensions
        this.density = density;
        this.dimensions = dimensions;
        this.color = [0.1, 0.8, 0.2];
        this.generatePoints();
        this.data = this.generateTerrain();
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
        var randOffset = 30;
        this.points[0][0][2] = random(-randOffset, randOffset)
        this.points[0][this.numberOfLines-1][2] = random(-randOffset, randOffset)
        this.points[this.numberOfLines-1][0][2] = random(-randOffset, randOffset)
        this.points[this.numberOfLines-1][this.numberOfLines-1][2] = random(-randOffset, randOffset)
        this.diamondStep(0, 0, this.numberOfLines-1, this.numberOfLines-1, 50)
    }

    diamondStep(iStart, jStart, iEnd, jEnd, summandValue){
        var difference = iEnd - iStart;
        if(difference == 1) return;
        var value = ((this.points[iStart][jStart][2] + this.points[iStart][jEnd][2] + this.points[iEnd][jStart][2] + this.points[iEnd][jEnd][2]) / 4) + random(-summandValue, summandValue);
        var iMidPoint = (iStart + iEnd) / 2;
        var jMidPoint = (jStart + jEnd) / 2;
        this.points[iMidPoint][jMidPoint][2] = value;
        
        summandValue = summandValue - summandValue * 0.5;

        
        
        this.squareStep(iMidPoint-difference/2, jMidPoint, difference/2, summandValue)
        this.squareStep(iMidPoint+difference/2, jMidPoint, difference/2, summandValue)
        this.squareStep(iMidPoint, jMidPoint-difference/2, difference/2, summandValue)
        this.squareStep(iMidPoint, jMidPoint+difference/2, difference/2, summandValue)

        this.diamondStep(iStart, jStart, iMidPoint, jMidPoint, summandValue)
        this.diamondStep(iMidPoint, jStart, iEnd, jMidPoint, summandValue)
        this.diamondStep(iStart, jMidPoint, iMidPoint, jEnd, summandValue)
        this.diamondStep(iMidPoint, jMidPoint, iEnd, jEnd, summandValue)

    }

    squareStep(iMidPoint, jMidPoint, difference, summandValue){
        var leftValue = 0;
        var rightValue = 0;
        var lowerValue = 0;
        var upperValue = 0;
        if(iMidPoint - difference >= 0){
            leftValue = this.points[iMidPoint - difference][jMidPoint][2]
        }
        if(iMidPoint + difference < this.numberOfLines){
            rightValue = this.points[iMidPoint + difference][jMidPoint][2]
        }
        if(jMidPoint - difference >= 0){
            lowerValue = this.points[iMidPoint][jMidPoint - difference][2]
        }
        if(jMidPoint + difference < this.numberOfLines){
            upperValue = this.points[iMidPoint][jMidPoint + difference][2]
        }
        var value = (leftValue + rightValue + lowerValue + upperValue) / 4 + random(-summandValue, summandValue);
        this.points[iMidPoint][jMidPoint][2] = value;
    }

    generateTerrain() {
        var data = [];

        this.numberOfPoints = 0;

        for (var i = 0; i < this.points.length-1; i++) {
            for (var j = 0; j < this.points[i].length-1; j++) {
                var n1 = vectorProduct(vectorPoints(this.points[i][j+1], this.points[i][j]), vectorPoints(this.points[i+1][j+1], this.points[i][j]))
                var n2 = vectorProduct(vectorPoints(this.points[i][j], this.points[i+1][j+1]), vectorPoints(this.points[i+1][j], this.points[i+1][j+1]))
                data.push(this.points[i][j][0], this.points[i][j][1], this.points[i][j][2], 
                    -n1[0], -n1[1], -n1[2],
                    this.color[0], this.color[1], this.color[2]    
                );
                data.push(this.points[i][j+1][0], this.points[i][j+1][1], this.points[i][j+1][2], 
                    -n1[0], -n1[1], -n1[2],
                    this.color[0], this.color[1], this.color[2]    
                );
                data.push(this.points[i+1][j+1][0], this.points[i+1][j+1][1], this.points[i+1][j+1][2], 
                    -n1[0], -n1[1], -n1[2],
                    this.color[0], this.color[1], this.color[2]    
                );

                data.push(this.points[i][j][0], this.points[i][j][1], this.points[i][j][2], 
                    n2[0], n2[1], n2[2],
                    this.color[0], this.color[1], this.color[2]    
                );
                data.push(this.points[i+1][j][0], this.points[i+1][j][1], this.points[i+1][j][2], 
                    n2[0], n2[1], n2[2],
                    this.color[0], this.color[1], this.color[2]    
                );
                data.push(this.points[i+1][j+1][0], this.points[i+1][j+1][1], this.points[i+1][j+1][2], 
                    n2[0], n2[1], n2[2],
                    this.color[0], this.color[1], this.color[2]    
                );
                this.numberOfPoints +=6;
            }
        }
        return data;
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