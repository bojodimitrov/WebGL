class Birds{
    constructor(location){
        this.location = location;
        this.birds = [];
        this.angles = [];
        this.radiuses = []
        this.angledt = []
        this.numberOfBirds = 50;
        this.init();
    }

    init(){
        for(var i = 0; i < this.numberOfBirds; i++){
            var radius = random(5, 20);
            var height = random(3, 8);
            var angledt = random(0.01, 0.03);
            var angle = random(0, 6);
            var newBird = new Sphere([this.location[0], this.location[1], this.location[2] + height], 0.3);
            newBird.color = [0,0,0];
            this.birds.push(newBird);
            this.angles.push(angle);
            this.angledt.push(angledt);
            this.radiuses.push(radius);
        }
    }

    draw(){
        for(var i = 0; i < this.birds.length; i++){
            this.orbit(i);
            this.birds[i].draw();
        }
    }

    orbit(i){
        this.angles[i] += this.angledt[i];
        var x = Math.sin(this.angles[i]) * this.radiuses[i];
        var y = Math.cos(this.angles[i]) * this.radiuses[i];
        this.birds[i].center[0] = this.location[0] + x;
        this.birds[i].center[1] = this.location[1] + y;
        this.birds[i].center[1] += Math.sin(this.angles[i]);
    }
}