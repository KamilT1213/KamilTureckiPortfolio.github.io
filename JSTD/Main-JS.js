/*

Welcome to my tower defence game!

The basic controls are clicking the mouse button and moving your mouse

You may spend your Money shown in the top left to purchase towers on the right side

Click the tower you wish to use then click again at the position you would like to place them
NOTE: towers cannot be placed on top of eachother or the track

You are trying to survive to the highest strength of enemy you can using various towers and combos

The first tower shoots into 8 directions when in range of enemies and is the cheapest

The second tower has a large range but is slow firing and targets the strongest enemy

The third tower should be placed near the track and places traps periodically which can defeat a large amount of low level enemies

The fourth tower has a short range but fire quickly, their damage is based on how many lives have been lost throughout the game

The fifth tower doesn't attack but instead generated Money and health

The sixth tower places vines along the track that deal a lot of damage once the tower has rampt up

Remember use your space as a resource some towers will take up more space than others so consider your placement for the best strategy

The game will pause once you've reached your limit...

Good luck!

*/
//Import all classes from extra scripts

import DisplayLayer from "../JSTD/Display-Layers-JS.js";
import Level from "../JSTD/Level-JS.js";
import Vector2 from "../JSTD/Scripts-Vectors-JS.js";
import Enemy from "../JSTD/Enemy-JS.js";
import UIElement from "../JSTD/UI-Element-JS.js";
import Collision from "../JSTD/Collision-JS.js";
import Projectile from "../JSTD/Projectile-JS.js";

//Tower scripts

import BasicTower from "../JSTD/Basic-Tower-JS.js";
import SniperTower from "../JSTD/Sniper-Tower-JS.js";
import TrapTower from "../JSTD/Trap-Tower-JS.js";
import AutoTower from "../JSTD/Auto-Tower-JS.js";
import FactoryTower from "../JSTD/Factory-Tower-JS.js";
import VineTower from "../JSTD/Vine-Tower-JS.js";

///

//window.addEventListener('load', () => {
//    const canvas = document.querySelector('canvas');
//    if (canvas) {
//        canvas.style.display = 'block';
//        canvas.style.marginBottom = '20px'; // Space before the footer
//    }
//});

//Control Variables
let Paused = false;
let MousePressed = false;
let MousePosition = new Vector2(0, 0);

//Displayed Values
let Currency = 30000;
let Health = 300;
let Strength = 0;

//Tower Deploying and Selecting Varibles
let SelectedUnit = 0;
let selectedTower = 0;

//Variables used by towers
let HealthLost = 0;

//Array used by ChangeVars Function to change variables in Main-JS (usually this function is called outside of the Main-JS script)
///0:Currency //1:Selected-Unit //2: Health
let GameVars = [0, 0, 0];


let SpawningTimer = 0;


//Variables for the coordinate grid used in the abstract space of the game

///this indicates that the width of the grid relative to a square so at 100, 1% of the squares size is 1 unit in the grid
let GridPercentSize = 100;
////note that the bounds of the game are between 0 and 100 in both x and y axis

//These Variables Are for the path that the enemies take
///Path depth is the desired distace between points located on the bezier path, this is within the game space not screen space
let PathDepth = 2;

///Here is a list of points that are used to calculate the spline (joined list of bezier curves) it is calulated with this formula each point is an index in this following:
////Bezier 1 = [0,1,2,3] Bezier 2 = [3,4,5,6] Bezier 3 = [6,7,8,9] ...
let PathPoints = [new Vector2(50, -5), new Vector2(-5, 10), new Vector2(-5, 20), new Vector2(40, 20),
new Vector2(90, 80), new Vector2(90, -40), new Vector2(20, 40),
new Vector2(13, 48), new Vector2(20, 46.66), new Vector2(40, 50),
new Vector2(100, 60), new Vector2(85, 60), new Vector2(40, 70),
new Vector2(-5, 80), new Vector2(-5, 90), new Vector2(40, 90),
new Vector2(85, 90), new Vector2(80, 80), new Vector2(95, 105),]

///Here we create a new object of class level and pass our two latest variables
var level = new Level(PathPoints, PathDepth);


//This list is Creates a list of class UIElement which contains some rendering, we pass the ChangeVar function into it with the extra arguments starting with 1 and followed
//a digit betweem 1 to 6, 1 indicates that we will change the second value withing GameVars by the second value. the second value in the GameVars array adjusts the selectedUnit
//variable that is then used to pick out which tower the player has chosen

var UIElements = [new UIElement(new Vector2(100, 1), new Vector2((50 / 2) - 1, (33 / 2) - 1), 1,`|❉|`,`💵: 200`, ChangeVar, 1, 1),
new UIElement(new Vector2(100, ((33 / 2)) + 1), new Vector2((50 / 2) - 1, (33 / 2) - 1), 3,`🔭`,`💵: 500`, ChangeVar, 1, 2),
new UIElement(new Vector2(100, ((33 / 2) * 2) + 1), new Vector2((50 / 2) - 1, (33 / 2) - 1), 5,`💫`,`💵: 1000`, ChangeVar, 1, 3),
new UIElement(new Vector2(100, ((33 / 2) * 3) + 1), new Vector2((50 / 2) - 1, (33 / 2) - 1), 7,`🔫`,`💵: 1000`, ChangeVar, 1, 4),
new UIElement(new Vector2(100, ((33 / 2) * 4) + 1), new Vector2((50 / 2) - 1, (33 / 2) - 1), 9,`🏭`,`💵: 2000`, ChangeVar, 1, 5),
new UIElement(new Vector2(100, ((33 / 2) * 5) + 1), new Vector2((50 / 2) - 1, (33 / 2) - 1), 11,`🌵`,`💵: 4000`, ChangeVar, 1, 6),
]

//Here we create arrays for all the objects that we will commonly find within the game itself

let Projectiles = [];

let Towers = [];

let SpawnedEnemies = [];

//Here we create and populate a list that is used as a buffer for spawning enemies into the level

let QuedEnemies = Array.from({length: 100}, () => {
    return new Enemy(level.PathPoints, new Vector2(50,-5), new Vector2(0,-1),1,ChangeVar,2,0);
});

//These arrays are used to store differently sorted versions of the SpawnedEnemies array
let SpawnedEnemiesOrderedFirst = [];
let SpawnedEnemiesOrderedStrongest = [];

//Here we create an array of DisplayLayers which is a list of canvases that are created on top of eachother however in this case we only create one
let Layers = Array.from({ length: 1 }, () => {
    return new DisplayLayer(document, "Layer");
});

//We assign the context of our single layer to a variable to easily use later in the code
let ctx = Layers[0].context;

//Here we take the property of size from our DisplayLayer or Canvas, and get the amount of pixels that are per 1% of the Canvas in screen space which will be used to scale our
//abstract grid from game space into screen space for rendering
let GridSize = Layers[0].size / GridPercentSize;

//Here we create our Collision class which handles all the collisions in the game we give the the world bounds between 0 and 100 on x and y to indicate that
//any position outside of this is a colision with the boundry
let CollisionHandler = new Collision(new Vector2(0, 100), new Vector2(0, 100), [], [], [], [], []);

//Here we update the collision handler with our generated path of the enemies that was made using the bezier curves we gave it and the path depth that was out distance between 
//points
CollisionHandler.UpdateObjectList(level.PathPoints, 0);

//Here we do the same but instead with any spawned enemies
CollisionHandler.UpdateObjectList(SpawnedEnemies,1);


//The Draw function is called every frame and handles the drawing of every object and UI element in the game
function Draw() {

    
    //Here we first clear the canvas ready for a new frame
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //Calling the draw function of the enemies path
    level.draw(ctx, GridSize);

    //Calling the draw function for projectiles 
    Projectiles.forEach(projectile => {
        projectile.draw(ctx, GridSize);
    });

    //Calling the draw function for towers
    Towers.forEach(tower => {
        tower.draw(ctx, GridSize);
    });

    //Calling the draw function for enemies
    SpawnedEnemies.forEach(enemy => {
        enemy.draw(ctx, GridSize);
    });

    //Calling the draw function for UI elements
    UIElements.forEach(elem => {
        elem.draw(ctx, GridSize);
    });

    //Draw the basic UI to indicate currency, health and strength of enemies
    ctx.beginPath();
    ctx.font = `${5 * GridSize}px Arial`;
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(`💵: ${Math.trunc(Currency)} ❤️: ${Math.trunc(Health)} 💪: ${Strength}`,GridSize, 5 * GridSize);


    //NOTE: the order that they are within the draw function is intentional to help with clarity, for example enemies are drawn on top of all the game objects outside of UI
}


//Here we call the update functions of most game objects as well as handle a large amount of runtime logic for the game 
//including collision result distribution and player interactiom
function Update(elapsed) {


    //Here we detect if a change is being made through the ChangeVar function and apply it as well as reset the value back to a default state

    ///Currency Changes through ChangeVar
    if (GameVars[0] != 0) {
        Currency += GameVars[0];
        GameVars[0] = 0;
    }

    ///SelectedUnit Changes through ChangeVar
    if (GameVars[1] != 0) {

        if (Towers.length > 0) {
            if (!Towers[Towers.length - 1].placed) {
                Towers.splice(Towers.length - 1, 1);
                CollisionHandler.UpdateObjectList(Towers, 2);
            }
        }

        SelectedUnit = GameVars[1];
        GameVars[1] = 0;

    }

    ///Health Changes through ChangeVar
    if (GameVars[2] != 0) {
        if(GameVars[2] < 0){
            HealthLost -= GameVars[2];
        }
        Health += GameVars[2];
        GameVars[2] = 0;

        if(Health <= 0){
            Paused = true;
        }
    }

    //Here we Create a new tower if the game has no towers placed and update the collision list with them
    if (SelectedUnit != 0 && Towers.length == 0) {
        if (SelectedUnit == 1) {
            Towers.push(new BasicTower(Towers.length,MousePosition, new Vector2(0, 0), 3, 20, SpawnProjectile, 0, 100));
        }
        else if(SelectedUnit == 2) {
            Towers.push(new SniperTower(Towers.length,MousePosition, new Vector2(0, 0), 3, 40, SpawnProjectile, 0, 100));
        }
        else if(SelectedUnit == 3){
            Towers.push(new TrapTower(Towers.length,MousePosition, new Vector2(0,0), 6, 8, SpawnProjectile,0,100));
        }
        else if(SelectedUnit == 4) {
            Towers.push(new AutoTower(Towers.length,MousePosition, new Vector2(0, 0), 2, 10, SpawnProjectile, 0, 100));
        }
        else if(SelectedUnit == 5) {
            Towers.push(new FactoryTower(Towers.length,MousePosition,new Vector2(0,0),5,5,ChangeVar,0,200,2,1));
        }
        else if(SelectedUnit == 6){
            Towers.push(new VineTower(Towers.length,MousePosition, new Vector2,10,13,0,level.PathPoints,SpawnProjectile,0,100));
        }

        CollisionHandler.UpdateObjectList(Towers, 2);
    }
    else if (Towers.length > 0) { // This sections handles what should be done once a tower is picked or once more than one tower is already present in the game

        //This handles what should happen once a player has chosen a place for the tower and it is viable (not overlaping the track or other towers as well as is in the bounds
        //of the game)
        if (MousePressed && !Towers[Towers.length - 1].placed && !CollisionHandler.SingleBasicCollisionCheck(Towers[Towers.length - 1].position, Towers[Towers.length - 1].size, GridSize, false, 0, 2)) {
            
            //here we make sure we meet some tower specific requirements which are required for the tower to function properly once being placed
            let check = true;

            if(SelectedUnit == 6){
                let c = CollisionHandler.SingleListCollisionCheck(Towers[Towers.length - 1].position,Towers[Towers.length - 1].range,GridSize,true,0)
                //console.log(c);
                
                if(c[1].length > 0){
                        
                    Towers[Towers.length - 1].closestpoints = c[1]
                }
                else{
                    check = false;
                    Towers.splice(Towers.length - 1,1);
                    SelectedUnit = 0;
                }
               
            }

            //if the tower check passes we finally pay for the tower we have selected if we can afford it and finally deselect a tower
            if(check){
                if(Currency - Towers[Towers.length - 1].Cost >= 0){
                    Currency -= Towers[Towers.length - 1].Cost;
    
                    Towers[Towers.length - 1].placed = true;

                    SelectedUnit = 0;
                }
            }



        }
        else if (SelectedUnit != 0 && Towers[Towers.length - 1].placed) { //Here we do the same process we do if there were no towers present once a unit has been selected
            if (SelectedUnit == 1) {
                Towers.push(new BasicTower(Towers.length,MousePosition, new Vector2(0, 0), 3, 20, SpawnProjectile, 0, 100));
            }
            else if(SelectedUnit == 2) {
                Towers.push(new SniperTower(Towers.length,MousePosition, new Vector2(0, 0), 3, 40, SpawnProjectile, 0, 100));
            }
            else if(SelectedUnit == 3){
                Towers.push(new TrapTower(Towers.length,MousePosition, new Vector2(0,0), 6, 8, SpawnProjectile,0,100));
            }
            else if(SelectedUnit == 4) {
                Towers.push(new AutoTower(Towers.length,MousePosition, new Vector2(0, 0), 2, 10, SpawnProjectile, 0, 100));
            }
            else if(SelectedUnit == 5) {
                Towers.push(new FactoryTower(Towers.length,MousePosition,new Vector2(0,0),5,5,ChangeVar,0,200,2,1));
            }
            else if(SelectedUnit == 6){
                Towers.push(new VineTower(Towers.length,MousePosition, new Vector2,10,13,0,level.PathPoints,SpawnProjectile,0,100));
            }
    
            CollisionHandler.UpdateObjectList(Towers, 2);
        }
        else if (SelectedUnit != 0 && !Towers[Towers.length - 1].placed) { //Here we have the selected tower move to the mouse position before it has been placed
            Towers[Towers.length - 1].update(elapsed, MousePosition);
        }
    }


    //Here we take the list of spawned enemies and sort them relative to the game as a whole in lists such as the ones furthest into the track and the ones with the most health
    //this is used to be passed into the collision handler so that the first result we get from checking all the enemies colliding will be in our desired order
    if(SpawnedEnemies.length > 0){
        SpawnedEnemiesOrderedFirst = [SpawnedEnemies[0]];
        SpawnedEnemiesOrderedStrongest = [SpawnedEnemies[0]];
        

        for(let i = 1; i < SpawnedEnemies.length; i++){

            let check = false;

            for(let j = 0; j < SpawnedEnemiesOrderedFirst; j++){
                if(SpawnedEnemies[i].pathPoint >= SpawnedEnemiesOrderedFirst[j].pathPoint){
                    SpawnedEnemiesOrderedFirst.splice(j,0,SpawnedEnemies[i]);
                    check = true;
                    break;
                }
            }
            if(!check){
                SpawnedEnemiesOrderedFirst.push(SpawnedEnemies[i]);
            }

            check = false;

            for(let j = 0; j < SpawnedEnemiesOrderedStrongest; j++){
                if(SpawnedEnemies[i].health >= SpawnedEnemiesOrderedStrongest[j].health){
                    SpawnedEnemiesOrderedStrongest.splice(j,0,SpawnedEnemies[i]);
                    check = true;
                    break;
                }
            }
            if(!check){
                SpawnedEnemiesOrderedStrongest.push(SpawnedEnemies[i]);
            }
        }
    }


    //This lets the player select any already placed tower to check its range
    if (MousePressed && Towers.length > 0) {

        if (selectedTower != 0) {
            Towers[selectedTower - 1].selected = false;
            selectedTower = 0;
        }

        if (CollisionHandler.SingleListCollisionCheck(MousePosition, 1, GridSize, false, 2).length > 1) {

            if (CollisionHandler.SingleListCollisionCheck(MousePosition, 1, GridSize, false, 2)[1][0] + 1 == 0) {
                Towers[selectedTower - 1].selected = false;
            }
            else if (CollisionHandler.SingleListCollisionCheck(MousePosition, 1, GridSize, false, 2)[1].length > 0) {
                selectedTower = CollisionHandler.SingleListCollisionCheck(MousePosition, 1, GridSize, false, 2)[1][0] + 1;
                Towers[selectedTower - 1].selected = true;
            }
            else {
                Towers[selectedTower]
            }
        }
    }


    //Within this are the primary calculations, actions and function calls that are made during runtime that are need for the game to actively run
    if (!Paused) {

        //first we spawn the next enemy in the que if the timer has reached that enemies spawnSpeed 
        if(QuedEnemies.length > 0){
            SpawningTimer += elapsed;
            if(SpawningTimer >= QuedEnemies[0].spawnSpeed){
                SpawningTimer = 0;
                
                QuedEnemies[0].Spawned = true;
                
                SpawnedEnemies.push(QuedEnemies[0])
                if(QuedEnemies[0].MaxHealth > Strength){
                    Strength = QuedEnemies[0].MaxHealth;
                }
                
                QuedEnemies.splice(0,1);
                
                
            }
        }

        //here we update every tower with their own specifications of collision and other features
        Towers.forEach(tower => {
            if (tower.placed) {
                

                if(tower.TowerType == 0){ // the basic tower simply toggles on and off if at least a single enemy is in its radius
                    tower.update(elapsed, new Vector2(0, 0));

                    if(CollisionHandler.SingleBasicCollisionCheck(tower.position,tower.range,GridSize,true,1)){
                        tower.InRange = true;
                    }
                    else{
                        tower.InRange = false;
                    }
                }
                if(tower.TowerType == 1){// the sniper tower prefers to shoot at the strongest enemy that is within rnage

                    CollisionHandler.UpdateObjectList(SpawnedEnemiesOrderedStrongest,1);

                    tower.update(elapsed, tower.PlacedPosition);
                    
                    let c = CollisionHandler.SingleListCollisionCheck(tower.position,tower.range,GridSize,true,1);
                    if(c.length > 1){
                        if(c[1].length > 0){

                            //console.log(FurthestIn);

                            tower.InRange = true;

                            tower.update(elapsed,SpawnedEnemiesOrderedStrongest[c[1][0]].position);
    
                        }
                    }
                    else{
                        tower.InRange = false;
                        tower.update(elapsed,MousePosition);
                    }
                    CollisionHandler.UpdateObjectList(SpawnedEnemies,1);
                    
                }
                if(tower.TowerType == 2){// the trap tower spawns traps at any random position on the track within its range
                    let c = CollisionHandler.SingleListCollisionCheck(tower.position,tower.range,GridSize,true,0);

                    if(c.length > 1){
                        if(c[1].length > 0){
                            tower.InRange = true;
                            tower.update(elapsed,level.PathPoints[c[1][Math.floor(Math.random() * (c[1].length - 1))]]);
                        }
                    }
                    else{
                        tower.InRange = false;
                        tower.update(elapsed,MousePosition);
                    }
                    
                }
                if(tower.TowerType == 3){// the auto tower targets the enemy furthest into the track as well as scales with the amount of lives lost in the game so far

                    CollisionHandler.UpdateObjectList(SpawnedEnemiesOrderedFirst,1);

                    tower.update(elapsed, tower.PlacedPosition);
                    tower.damage = (HealthLost/100) + 1;
                    
                    let c = CollisionHandler.SingleListCollisionCheck(tower.position,tower.range,GridSize,true,1);
                    if(c.length > 1){
                        if(c[1].length > 0){

                            //console.log(FurthestIn);

                            tower.InRange = true;

                            tower.update(elapsed,SpawnedEnemiesOrderedFirst[c[1][0]].position);
    
                        }
                    }
                    else{
                        tower.InRange = false;
                        tower.update(elapsed,MousePosition);
                    }
                    CollisionHandler.UpdateObjectList(SpawnedEnemies,1);
                    
                }
                if(tower.TowerType == 4){// the factory tower simply updates its timer to know when to next give money and health 
                    tower.update(elapsed,new Vector2(0,0));
                }
                if(tower.TowerType == 5){// the vine tower updates its timer to know when to place the next part of the vine on the track
                    tower.update(elapsed,new Vector2(0,0));
                }
            }
        });

        //Here we update all the projectiles as well as check if they are withing the radius of their tower or have expired in lifespan(for optimizing purposes)
        for (var i = 0; i < Projectiles.length; i++) {
            Projectiles[i].update(elapsed);
            if (Projectiles[i].distance >= Projectiles[i].maxdistance) {
                Projectiles.splice(i, 1);
                CollisionHandler.UpdateObjectList(Projectiles, 3);
            }
            else if(Projectiles[i].lifespan > Projectiles[i].Maxlifespan){
                Projectiles.splice(i, 1);
                CollisionHandler.UpdateObjectList(Projectiles, 3);
            }
        }

        //here we update the enemies and check if they have reached the end of the track if so they are moved back into the que
        for (var i = 0; i < SpawnedEnemies.length; i++) {
            SpawnedEnemies[i].update(elapsed);
            if(SpawnedEnemies[i].AtEnd){
                
                QuedEnemies.push(SpawnedEnemies[i]);
                
                SpawnedEnemies[i].destroy();

                SpawnedEnemies.splice(i,1);
                
            }
        }

        //here we loop through the enemies again and determine if they have been hit by a projectile
        for (var i = 0; i < SpawnedEnemies.length; i++) {
            let c = CollisionHandler.SingleListCollisionCheck(SpawnedEnemies[i].position, SpawnedEnemies[i].size, GridSize, true, 3);


            if (c.length > 0) {

                if (c[1].length > 0) {//if they have been hit the enemy takes damage based on the projectiles damage as well as the gold rewarded for hitting the enemy is calculated
                    SpawnedEnemies[i].health -= Projectiles[c[1][0]].damage;
                    Currency += Math.ceil((SpawnedEnemies[i].difficulty**2)/500) * ((Projectiles[c[1][0]].damage + ((((Math.sign(SpawnedEnemies[i].health) - 1)/2) * -1) * SpawnedEnemies[i].health))/SpawnedEnemies[i].MaxHealth);
                    Projectiles[c[1][0]].pierce -= 1; // the projectile loses one pierce and is destroyed if it has none left

                    //if the projectile has multiple pierce and the enemy doesnt die in one hit of damage the damage is recalculated every frame until there is no pierce left or
                    //the enemy is killed

                    if (Projectiles[c[1][0]].pierce <= 0) {
                        Projectiles.splice(c[1][0], 1);
                    }

                    //enemy is killed and pushed back into the que (when calling the destory on the enemy they level up so they get reused as a stronger one to be spawned again)
                    if (SpawnedEnemies[i].health <= 0) {
                        QuedEnemies.push(SpawnedEnemies[i]);
                        SpawnedEnemies[i].destroy();
                        SpawnedEnemies.splice(i,1);
                    }

                    CollisionHandler.UpdateObjectList(SpawnedEnemies, 1);
                }
            }
        }

        //Here we call the UI element's update function and give it the variables it needs
        UIElements.forEach(elem => {
            elem.update(elapsed, MousePosition, MousePressed);
        });
    }
}

//here we setup the per frame calls and loop them for the game to function
let PastTime;

function frame(ts) {
    const elapsed = ts - PastTime || 0;

    PastTime = ts;

    Update(elapsed / 1000);
    Draw();

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);



//Events//

//The next three events simply handle the resizing of the DisplayLayer and its content relative to the window size
addEventListener('resize', (event) => {

    Layers.forEach(layer => {
        layer.Resize();
    });
    GridSize = Layers[0].size / GridPercentSize;
    Draw();
});

addEventListener('fullscreenchange', (event) => {

    Layers.forEach(layer => {
        layer.Resize();
    });
    GridSize = Layers[0].size / GridPercentSize;
    Draw();
});

addEventListener('focus', (event) => {

    Layers.forEach(layer => {
        layer.Resize();
    });
    GridSize = Layers[0].size / GridPercentSize;
    Draw();
});

//Here we gather input data from the player to use in the game 

addEventListener('mousedown', (event) => {
    MousePressed = true;
});

addEventListener('mouseup', (event) => {
    MousePressed = false;
});

addEventListener('touchstart', (event) => {
    MousePressed = true;
});

addEventListener('touchend', (event) => {
    MousePressed = true;
});

Layers[0].canvas.addEventListener('mousemove', (event) => {
    MousePosition.x = event.offsetX/GridSize;
    MousePosition.y = event.offsetY/GridSize;
});

Layers[0].canvas.addEventListener('touchmove', (event) => {
    MousePosition.x = event.offsetX/GridSize;
    MousePosition.y = event.offsetY/GridSize;
});

//Events - END//

//Function//

//The ChangeVar funtion used to change different Main-JS variables from inside other created classes
export function ChangeVar(Id, Amount) {
    GameVars[Id] += Amount;
}

//The SpawnProjectile function mainly used by towers to place their spawned projectiles into the collision handler so they can be used throughout the rest of the game
export function SpawnProjectile(inProjectiles) {

    Projectiles.push.apply(Projectiles, inProjectiles);

    CollisionHandler.UpdateObjectList(Projectiles, 3);

    return Projectiles;
}

//Function - END//