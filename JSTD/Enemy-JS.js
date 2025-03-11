import Vector2 from "../JSTD/Scripts-Vectors-JS.js";

export default class Enemy{
    constructor(path,position,direction,Difficulty,Func,...Actions){
        this.path = path;
        this.position = position;
        this.StartPos = position;
        this.direction = direction;
        this.difficulty = Difficulty;
        this.speed = (Difficulty/30) + 10;
        this.size = (Difficulty/30) + 1;
        this.MaxHealth = Math.ceil(Difficulty);
        this.health = Math.ceil(Difficulty);
        this.color = `hsl(${Difficulty},60%,80%)`;

        this.spawnSpeed = 0.25;
        this.Spawned = false;
        
        this.func = Func;
        this.actions = Actions;

        this.pathPoint = 0;
        this.AtEnd = false;

        this.PathDensity = path[0].Dis(path[1]);
        //console.log(path[0])
    }

    draw(ctx,GridSize){
        if(this.Spawned){
            //ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.position.x * GridSize,this.position.y * GridSize,this.size * GridSize,0,Math.PI * 2);
            ctx.fill();
            //ctx.restore();
        }

    }
    
    update(elapsed){

        //console.log(this.position);

        if(this.Spawned){
            if(!this.AtEnd && this.position.Dis(this.path[this.pathPoint]) < this.PathDensity/2){
                this.pathPoint += 1;
                if(this.pathPoint >= this.path.length - 1){
                    for(let i = 0; i < this.actions.length/2; i++){
                        this.func(this.actions[i*2],-this.health);
                    }
                    this.AtEnd = true;
                }
            }
            this.size = (this.health/100) + 1;
            this.color = `hsl(${this.health},60%,80%)`;
    
            this.direction = this.position.Dir(this.path[this.pathPoint]);
            this.position.x = this.position.x + (this.direction.x * (this.speed * elapsed));
            this.position.y = this.position.y + (this.direction.y * (this.speed * elapsed));
        }


    }

    destroy(){
        //console.log(this.StartPos.Sub(0,10));
        this.Spawned = false;
        this.position.x = 50; this.position.y = -5;
        this.difficulty += 2;

        if(this.spawnSpeed > 0.05){
            this.spawnSpeed -= 0.01;
        }
        
        this.speed = (this.difficulty/30) + 10;
        this.size = (this.difficulty/30) + 1;
        this.MaxHealth = Math.ceil((this.difficulty**2)/100);
        this.health = Math.ceil((this.difficulty**2)/100);
        this.color = `hsl(${this.difficulty},60%,80%)`;

        this.pathPoint = 0;
        this.AtEnd = false;
    }

}