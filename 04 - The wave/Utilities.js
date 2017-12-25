function surface(x, y) {
    var r = Math.sqrt(x * x + y * y);
    return 10 * Math.cos(r / 5 - phase) * Math.cos(r / 10) * Math.cos(r / 20);
}

function drawSurface(data) {
    globalNyan.changeColor();

    var nyanHelper = new NyanHelper([globalNyan.getRed()*255, globalNyan.getGreen()*255, globalNyan.getBlue()*255])
    nyanHelper.setState(globalNyan.getState())
    var p = [];	// масив с височината във всеки връх
    var n = [];	// масив с нормалния вектор във всеки връх
    // изчисляваме височината във възлите
    var height;
    for (var x = -k; x <= k; x++) {
        p[x] = [];
        for (var y = -k; y <= k; y++)
            p[x][y] = surface(x, y);
    }

    // изчисляваме нормалните вектори във възлите
    for (var x = -k; x <= k; x++) {
        n[x] = [];
        for (var y = -k; y <= k; y++) {
            var eps = 0.001;
            var p0 = [x, y, surface(x, y)];
            var p1 = [x - eps, y, surface(x - eps, y)];
            var p2 = [x, y - eps, surface(x, y - eps)];
            n[x][y] = unitVector(vectorProduct(vectorPoints(p1, p0), vectorPoints(p2, p0)));
        }
    }

    // генерираме триъгълниците: координати на върхове и нормали
    // на върховете на всеки триъгълник слагаме нормалата от първия му връх
    for (var x = -k; x < k; x++)
        for (var y = -k; y < k; y++) {
            distance = Math.sqrt(x * x + y * y);
            updateColor(distance*20, nyanHelper);
            data.push(x, y, p[x][y],
                n[x][y][0], n[x][y][1], n[x][y][2],
                nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue());
            data.push(x + 1, y, p[x + 1][y],
                n[x + 1][y][0], n[x + 1][y][1], n[x + 1][y][2],
                nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue());
            data.push(x, y + 1, p[x][y + 1],
                n[x][y + 1][0], n[x][y + 1][1], n[x][y + 1][2],
                nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue());

            data.push(x, y + 1, p[x][y + 1],
                n[x][y + 1][0], n[x][y + 1][1], n[x][y + 1][2],
                nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue());
            data.push(x + 1, y, p[x + 1][y],
                n[x + 1][y][0], n[x + 1][y][1], n[x + 1][y][2],
                nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue());
            data.push(x + 1, y + 1, p[x + 1][y + 1],
                n[x + 1][y + 1][0], n[x + 1][y + 1][1], n[x + 1][y + 1][2],
                nyanHelper.getRed(), nyanHelper.getGreen(), nyanHelper.getBlue());
            nyanHelper.reset()
        }
}

function updateColor(value, nyanHelper) {
    for (var i = 0; i < value; i++) {
        nyanHelper.changeColor();
    }
}

function init() {
    gl = getContext("picasso");
    glprog = getProgram("vshader", "fshader");

    aXYZ = gl.getAttribLocation(glprog, "aXYZ");
    uProjectionMatrix = gl.getUniformLocation(glprog, "uProjectionMatrix");
    uViewMatrix = gl.getUniformLocation(glprog, "uViewMatrix");
    uModelMatrix = gl.getUniformLocation(glprog, "uModelMatrix");

    aColor = gl.getAttribLocation(glprog, "aColor");
    uAmbientColor = gl.getUniformLocation(glprog, "uAmbientColor");
    uUseAmbient = gl.getUniformLocation(glprog, "uUseAmbient");

    aNormal = gl.getAttribLocation(glprog, "aNormal");

    uDiffuseColor = gl.getUniformLocation(glprog, "uDiffuseColor");
    uUseDiffuse = gl.getUniformLocation(glprog, "uUseDiffuse");

    uSpecularColor = gl.getUniformLocation(glprog, "uSpecularColor");
    uUseSpecular = gl.getUniformLocation(glprog, "uUseSpecular");

    uLightDir = gl.getUniformLocation(glprog, "uLightDir");
    uShininess = gl.getUniformLocation(glprog, "uShininess");

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(1, 1, 1, 1);
}

function webglDraw(data) {

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    // включване на върховете
    gl.enableVertexAttribArray(aXYZ);
    gl.vertexAttribPointer(aXYZ, 3, gl.FLOAT, false, 9 * FLOATS, 0 * FLOATS);

    // включване на нормалните вектори
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 9 * FLOATS, 3 * FLOATS);

    // настройка на цветове и светлини
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 9 * FLOATS, 6 * FLOATS);

    //gl.vertexAttrib3f(aColor, 92 / 255, 51 / 255, 23 / 255);
    gl.uniform3f(uAmbientColor, 0.5, 0.5, 0.5);
    gl.uniform3f(uDiffuseColor, 1, 1, 1);
    gl.uniform3f(uSpecularColor, 1, 1, 1);
    gl.uniform1f(uShininess, 20);

    gl.uniform3f(uLightDir, 0, 0, -1);

    gl.uniform1i(uUseAmbient, true);
    gl.uniform1i(uUseDiffuse, true);
    gl.uniform1i(uUseSpecular, true);
}
