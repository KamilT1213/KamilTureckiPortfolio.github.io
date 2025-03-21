import Projectile from "../JSTD/Projectile-JS.js";
import Vector2 from "../JSTD/Scripts-Vectors-JS.js";

export default class AutoTower{
    constructor(Index,Position,Direction,Size,Range,Func,...Actions){
        this.index = Index;
        this.TowerType = 3;
        this.Cost = 1000;
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

        this.damage = 1;

        this.PlacedPosition = new Vector2(0,0);
    }
    
    draw(ctx,GridSize){
        //ctx.save();
        ctx.fillStyle = `hsl(43,80%,80%)`;
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
            //targets = new Vector2(10,10);
            this.position = targets;
        }
        else{


            if(this.DoOnce){
                this.PlacedPosition = this.PlacedPosition.Add(this.position);
                this.DoOnce = false;
                this.position = this.PlacedPosition;
                targets = null;
            }

            //this.direction = this.position.Dir(targets[0]);

            if(this.InRange > 0){
                if(this.attackTimer >= 0.1){
                    this.direction = this.position.Dir(targets);
                    this.fire();
                    this.attackTimer = 0;
                }
                else{
                    this.attackTimer += elapsed;
                }
            }
            else{
                if(this.attackTimer < 0.1){
                    this.attackTimer += elapsed;
                }
            }

            
        }
    }

    fire(){
        this.func([new Projectile(this.index,3,this.position,this.direction,`rgb(140,20,200)`,this.range,100,0.3,2,this.damage)]);
    }
}