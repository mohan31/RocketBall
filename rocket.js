var poplu;
var lifespan=200;
var count=0;
var lifeP;
var target;
function setup(){
    createCanvas(600,400);
    rocket=new Rocket();
    poplu = new population();
    lifeP = createP('this is some text');
    target = createVector(width/2,50);

}

function draw(){
    background(0);
    poplu.run();

    lifeP.html(count);
    count++;
    if(count > lifespan){
        count = 0;
        poplu.evaluate();
        //poplu = new population();
        poplu.selection();
    }

    ellipse(target.x,target.y,20,20);


}

function DNA(genes){

    if(genes){
        this.genes = genes;
    }else{
        this.genes = [];
        for(var i = 0; i < lifespan; i++){
            this.genes[i] = p5.Vector.random2D();
            this.genes[i].setMag(0.1);
        }
    }

    this.crossOver = function(partner){

        var newgens = [];
        var mid = floor(random(this.genes.length));
        for(var i=0; i < this.genes.length; i++){
            if(i < mid){
                newgens[i]=(this.genes[i]);
            }else{
                newgens[i]=(partner.genes[i]);
            }
        }
        return new DNA(newgens);
    }
}

function population(){
    this.rocket=[];
    this.popsize=25;
    this.matingpool = [];

    for(var i=0;i<this.popsize;i++){
        this.rocket[i] = new Rocket();
    }

    var maxfit = 0;
    this.evaluate = function(){
        for(var i =0 ; i < this.popsize; i++){
            this.rocket[i].calcFitness();
            if(this.rocket[i].fitness > maxfit){
                maxfit = this.rocket[i].fitness;
            }
        }
        createP(maxfit);
        for(var i = 0; i < this.popsize ; i++){
            this.rocket[i].fitness/=maxfit;
        }
        this.matingpool = [];

        for(var i=0; i < this.popsize; i++){
            var n= this.rocket[i].fitness*100;
            for(var j=0; j < n; j++){
                this.matingpool.push(this.rocket[i]);
            }
        }
    }

    this.selection = function(){
        var newRockets = [];
        for(var i=0; i < this.rocket.length; i++){
            var parentA = random(this.matingpool).dna;
            var parentB = random(this.matingpool).dna;

            var child = parentA.crossOver(parentB);
            newRockets[i] = new Rocket(child);
        }

        this.rocket = newRockets;
    }

    this.run = function(){
        for(var i=0;i<this.popsize;i++){
            this.rocket[i].update();
            this.rocket[i].show();
        }
    }
}

function Rocket(dna){
    this.pos = createVector(width/2,height);
    this.vel = createVector();
    this.acc = createVector();

    if(dna){
        this.dna = dna;
    }else{
        this.dna = new DNA();
    }
    this.fitness = 0;

    this.applyForce = function(force){
        this.acc.add(force);
    }

    this.calcFitness = function(){
        var d = dist(this.pos.x,this.pos.y,target.x,target.y);

        this.fitness= map(d,0,width,width,0);
        //console.log(this.fitness);
    }



    this.update = function(){
        //console.log(this.dns.genes[count]);
        this.applyForce(this.dna.genes[count]);
        //count=(++count%lifespan);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        //console.log(this.fitness);
    }

    this.show = function(){

        push();
        noStroke();
        fill(255,110);
        translate(this.pos.x,this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        rect(0,0,40,10);
        pop();
    }
}
