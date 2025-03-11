import Vector2 from "../JSTD/Scripts-Vectors-JS.js";

export default class UIElement{
    constructor(Position,Size,Num,DisplayText,PriceText,Func,...Actions){
        this.position = Position;
        this.size = Size;
        this.num = Num;
        this.displayText = DisplayText;
        this.priceText = PriceText;
        this.func = Func;
        this.Actions = Actions;
        this.PressValue = 80;
        this.MouseAction = false;
    }

    update(elapsed,MousePos,MousePress){

        var Inside = false;

        if(MousePos.x > this.position.x && MousePos.x < this.position.x + this.size.x && MousePos.y > this.position.y && MousePos.y < this.position.y + this.size.y){
            
            if(!MousePress){
                this.MouseAction = false;
                this.PressValue = 60;
            }

            if(MousePress && this.MouseAction == false){
                this.MouseAction = true;

                this.PressValue = 20;

                //console.log(`Pressed: ${this.num}`);
                for(let i = 0; i < this.Actions.length/2; i++){
                    this.func(this.Actions[i*2],this.Actions[(i*2)+1]);
                }
            }
        }
        else if(MousePos){
            this.MouseAction = true;
            this.PressValue = 100;
        }
        else{
            this.PressValue = 100;
        }
    }

    draw(ctx,GridSize){
        //ctx.save();
        ctx.fillStyle = `hsl(${this.num * 25.5},${this.PressValue}%,60%)`;
        ctx.fillRect(this.position.x * GridSize,this.position.y * GridSize,this.size.x * GridSize,this.size.y * GridSize);


        ctx.beginPath();
        ctx.font = `${5 * GridSize}px Arial`;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(this.displayText,(this.position.x * GridSize) + (9 * GridSize), (this.position.y * GridSize) + (7  * GridSize));

        ctx.beginPath();
        ctx.font = `${2 * GridSize}px Arial`;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText(this.priceText,(this.position.x * GridSize) + (8 * GridSize), (this.position.y * GridSize) + (11  * GridSize));

        //ctx.restore();
    }
}