import Vector2 from "./Scripts-Vectors-JS.js";

export default class Projectile{
    constructor(TowerIndex,Life,Position,Direction,Colour,MaxDistance,Speed,Size,Pierce,Damage){
        this.towerIndex = TowerIndex;
        this.position = Position;
        this.direction = Direction;
        this.colour = Colour;
        this.maxdistance = MaxDistance;
        this.speed = Speed;
        this.size = Size;
        this.pierce = Pierce;
        this.damage = Damage;
        this.distance = 0;
        this.StartPosition = Position;
        this.Maxlifespan = Life;
        this.lifespan = 0;

    }

    

    draw(ctx,GridSize){
        //ctx.save();
        ctx.fillStyle = this.colour;//`rgb(140,20,200)`;
        ctx.beginPath();
        var a = ctx.arc(this.position.x* GridSize,this.position.y* GridSize,this.size * GridSize,0,Math.PI * 2);
        ctx.fill(a);
        //ctx.restore();
    }

    update(elapsed){
        this.lifespan += elapsed;

        this.position = this.position.Add(this.direction.Mul(new Vector2(this.speed * elapsed,this.speed * elapsed)));
        this.distance = this.StartPosition.Dis(this.position);
    }

}
