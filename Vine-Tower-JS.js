import Projectile from "./Projectile-JS.js";
import Vector2 from "./Scripts-Vectors-JS.js";

export default class VineTower{
    constructor(Index,Position,Direction,Size,Range,ClosestPoints,PathPoints,Func,...Actions){
        this.index = Index;
        this.TowerType = 5;
        this.Cost = 4000;
        this.position = Position;
        this.direction = Direction;
        this.size = Size;
        this.range = Range;

        this.closestpoints = ClosestPoints;
        this.pathpoints = PathPoints;
        this.orderedpathpoints = [];

        this.func = Func;
        this.Actions = Actions;
        this.placed = false;
        this.selected = false;
        this.DoOnce = true;
        this.attackTimer = 0;
        this.InRange = false;

        this.TrackPoint = 0;
        this.VineSize = 0.2;

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
                this.orderedpathpoints = this.sortPathPoints();
                //console.log(this.orderedpathpoints.length);
            }


            
            //this.direction = this.position.Dir(targets[0]);

            if(this.attackTimer >= 0.01){


                //console.log(this.orderedpathpoints);
                //console.log(this.TrackPoint);
                this.fire();
                this.attackTimer = 0;

                if(this.VineSize < 2){
                    this.VineSize += 0.001;
                }

                this.TrackPoint++;
                if(this.TrackPoint >= this.orderedpathpoints.length - 1){
                    this.TrackPoint = 0;
                }
            }
            else{
                this.attackTimer += elapsed;
            }
        }
            
        
    }

    sortPathPoints(){

        let Sorted = [];

        let Closest = this.closestpoints[0];

        this.closestpoints.forEach(Point => {
            if(this.pathpoints[Point].Dis(this.position) < this.pathpoints[Closest].Dis(this.position)){
                Closest = Point;
            }
        });

        Sorted.push(Closest);

        for(let i = 1; i < this.pathpoints.length; i++){
            
            
            
            if(Sorted[0] + i <= this.pathpoints.length - 1){
                //console.log(`${Sorted[0] + i} : ${Sorted.length}`);
                Sorted.push(Sorted[0] + i);
            }
            if(Sorted[0] - i >= 0){
                //console.log(`${Sorted[0] - i} : ${Sorted.length}`);
                Sorted.push(Sorted[0] - i);
            }
        }
        //console.log(this.pathpoints.length);


        return Sorted;
    }

    fire(){
        //console.log(this.orderedpathpoints[this.TrackPoint]);
        this.func([new Projectile(this.index,10,this.pathpoints[this.orderedpathpoints[this.TrackPoint]],new Vector2(0,0),`rgb(20,230,40)`,this.range,0,this.VineSize,2,this.VineSize)]);
    }
}