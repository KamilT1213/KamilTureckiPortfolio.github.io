import Vector2 from "../JSTD/Scripts-Vectors-JS.js";
import Enemy from "../JSTD/Enemy-JS.js";
import BasicTower from "../JSTD/Basic-Tower-JS.js";
import Projectile from "../JSTD/Projectile-JS.js";

export default class Collision{
    constructor(MapBoundsWidth,MapBoundHeight,Path,Enemies,Towers,Projectiles,Terrain){
        this.BoundsX = MapBoundsWidth;
        this.BoundsY = MapBoundHeight;
        this.PathPoints = Path;
        this.Enemies = Enemies;
        this.Towers = Towers;
        this.Projectiles = Projectiles;
        this.Terrain = Terrain;
        
    }

    UpdateObjectList(List,Type){

        if(Type == 0){
            this.PathPoints = List;

        }
        else if(Type == 1){
            this.Enemies = List;
        }
        else if(Type == 2){
            this.Towers = List;
        }
        else if(Type == 3){
            this.Projectiles = List;
        }
        else if(Type == 4){
            this.Terrain = List;
        }


    }

    SingleBasicCollisionCheck(Position,Size,GridSize,IgnoreBounds = false,...Types){

        //console.log(Position)

        var InCollision = false;

        if(Position.x - this.BoundsX.x < Size || this.BoundsX.y - Position.x < Size || Position.y - this.BoundsY.x < Size || this.BoundsY.y - Position.y < Size ){
            if(!IgnoreBounds){
                InCollision = true;
            }

        }
        if(!InCollision){

            Types.forEach(Type => {

                
                if(Type == 0 && !InCollision){
                    this.PathPoints.forEach(point => {

                        if(point.Sub(Position).Len < Size + (1) && !InCollision){  

                            InCollision = true;
                        }
                    })
                }
                if(Type == 1 && !InCollision){
                    this.Enemies.forEach(enemy => {
                        if(enemy.position.Sub(Position).Len < Size + enemy.size && !InCollision){
                            InCollision = true;
                        }
                    })
                }
                if(Type == 2 && !InCollision){

                    this.Towers.forEach(tower => {

                        if(IgnoreBounds){
                            if(tower.position.Sub(Position).Len < Size + tower.range && !InCollision && tower.placed == true){
                                InCollision = true;
                            }
                        }
                        else if(tower.position.Sub(Position).Len < Size + tower.size && !InCollision && tower.placed == true){
                            InCollision = true;
                        }
                    })
                }
                if(Type == 3 && !InCollision){
                    this.Projectiles.forEach(proj => {
                        if(proj.position.Sub(Position).Len < Size + proj.size && !InCollision){
                            InCollision = true;
                        }
                    })
                }
                if(Type == 4 && !InCollision){
                    this.Terrain.forEach(terra => {
                        if(terra.Mul(new Vector2(GridSize,GridSize)).Sub(Position).Len < Size + 2 && !InCollision){
                            InCollision = true;
                        }
                    })
                }
            })
        }

        return InCollision;

    }

    SingleListCollisionCheck(Position,Size,GridSize,IgnoreBounds = false,...Types){
        //console.log(Position);
        //console.log(Size);

        var InCollision = [];

        if(Position.x - this.BoundsX.x < Size || this.BoundsX.y - Position.x < Size || Position.y - this.BoundsY.x < Size || this.BoundsY.y - Position.y < Size){

            if(!IgnoreBounds){
                InCollision.push(true);
            }

        }
        if(!InCollision[0]){

            InCollision.push(false);

            Types.forEach(Type => {
                InCollision.push([]);

                if(Type == 0){
                    
                    

                    for(var i = 0; i < this.PathPoints.length; i++){

                        //console.log(this.PathPoints[i].Sub(Position).Len);

                        if(this.PathPoints[i].Sub(Position).Len < Size + (1)){
                            InCollision[InCollision.length - 1].push(i);
                        }
                    }
                }
                else if(Type == 1){


                    for(var i = 0; i < this.Enemies.length; i++){
                        if(this.Enemies[i].position.Sub(Position).Len < Size + this.Enemies[i].size){
                            InCollision[InCollision.length - 1].push(i);
                        }
                    }
                }
                else if(Type == 2){
                    for(var i = 0; i < this.Towers.length; i++){

                        if(this.Towers[i].position.Sub(Position).Len < Size + this.Towers[i].size&& this.Towers[i].placed == true){
                            InCollision[InCollision.length - 1].push(i);
                            
                        }
                    }
                }
                else if(Type == 3){
                    for(var i = 0; i < this.Projectiles.length; i++){
                        if(this.Projectiles[i].position.Sub(Position).Len < Size + this.Projectiles[i].size){
                            InCollision[InCollision.length - 1].push(i);
                        }
                    }
                }
                else if(Type == 4){
                    for(var i = 0; i < this.Terrain.length; i++){
                        if(this.Terrain[i].Mul(new Vector2(GridSize,GridSize)).Sub(Position).Len < Size + 2 && !InCollision){
                            InCollision[InCollision.length - 1].push(i);
                        }
                    }
                }
            })
        }
        return InCollision;

    }

    MultiSelfCollisionCheck(SelfIndex,Type){
        var InCollision = [];

        if(Type == 0 && !InCollision){
                    
                    

            for(var i = 0; i < this.PathPoints.length; i++){
                if(this.PathPoints[i].Sub(Position).Len < Size + 2 && !InCollision){
                    InCollision[1].push(i);
                }
            }
        }
        else if(Type == 1 && !InCollision){


            for(var i = 0; i < this.Enemies.length; i++){
                if(this.Enemies[i].position.sub(Position).Len < Size + this.Enemies[i].size && !InCollision){
                    InCollision[1].push(i);
                }
            }
        }
        else if(Type == 2 && !InCollision){
            for(var i = 0; i < this.Towers.length; i++){
                if(this.Towers[i].position.sub(Position).Len < Size + this.Towers[i].size && !InCollision){
                    InCollision[1].push(i);
                }
            }
        }
        else if(Type == 3 && !InCollision){
            for(var i = 0; i < this.Projectiles.length; i++){
                if(this.Projectiles[i].Sub(Position).Len < Size + 2 && !InCollision){
                    InCollision[1].push(i);
                }
            }
        }
        else if(Type == 4 && !InCollision){
            for(var i = 0; i < this.Terrain.length; i++){
                if(this.Terrain.Sub(Position).Len < Size + 2 && !InCollision){
                    InCollision[1].push(i);
                }
            }
        }

        return InCollision;
    }
    

}