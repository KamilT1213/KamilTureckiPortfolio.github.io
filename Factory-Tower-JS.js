import Vector2 from "./Scripts-Vectors-JS.js";

export default class FactoryTower{
    constructor(Index,Position,Direction,Size,Range,Func,...Actions){
        this.index = Index;
        this.TowerType = 4;
        this.Cost = 2000;
        this.position = Position;
        this.direction = Direction;
        this.size = Size;
        this.range = Range;
        this.func = Func;
        this.Actions = Actions;
        this.placed = false;
        this.selected = false;
        this.DoOnce = true;
        this.attackTimer = 0;
        this.InRange = false;

        this.PlacedPosition = new Vector2(0,0);
    }
    
    draw(ctx,GridSize){
        //ctx.save();
        ctx.fillStyle = `hsl(150,80%,80%)`;
        ctx.beginPath();
        var a = ctx.arc(this.position.x* GridSize,this.position.y* GridSize,this.size * GridSize,0,Math.PI * 2);
        ctx.fill(a);

        if(!this.placed || this.selected){
            ctx.fillStyle = `rgba(150,150,150,0.2)`;
            ctx.beginPath();
            a = ctx.arc(this.position.x* GridSize,this.position.y * GridSize,this.range * GridSize,0,Math.PI * 2);
            ctx.fill(a);
        }

        //ctx.restore();
    }

    update(elapsed,targets){
        if(!this.placed){
            
            this.position = targets;
        }
        else if(this.placed){
            if(this.DoOnce){
                this.PlacedPosition = this.PlacedPosition.Add(this.position);

                this.DoOnce = false;
                this.position = this.PlacedPosition;

                targets = null;
            }
            
            if(this.attackTimer >= 20){
                this.fire();
                this.attackTimer = 0;
            }
            else{
                this.attackTimer += elapsed;
            }
        }
    }

    fire(){
        for(let i = 0; i < this.Actions.length/2; i++){
            this.func(this.Actions[i*2],this.Actions[(i*2)+1]);
        }
    }
}