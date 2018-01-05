var vShader =
	'attribute vec3 aXYZ;'+
	'attribute vec3 aRGB;'+
	'varying vec3 vRGB;'+
	''+
	'void main ()'+
	'{'+
	'	gl_Position = vec4(aXYZ,1);'+
	'	gl_PointSize = 1.0;'+
	'	vRGB = aRGB;'+
	'}';
	
var fShader =
	'precision mediump float;'+
	''+
	'varying vec3 vRGB;'+
	'uniform float uAlpha;'+
	'void main( )'+
	'{'+
	'	gl_FragColor = vec4(vRGB, uAlpha);'+
	'}';