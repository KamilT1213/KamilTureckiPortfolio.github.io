export default class Vector2{

    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }

    get Len(){
        return Math.sqrt((this.x ** 2)+(this.y ** 2));
    }

    get Nor(){
        return this.Div(new Vector2(this.Len,this.Len));
    }

    get Abs(){
        return new Vector2(Math.abs(this.x),Math.abs(this.y));
    }

    Add(b) {
        return new Vector2(this.x + b.x, this.y + b.y);
    }

    Sub(b){
        return new Vector2(this.x - b.x, this.y - b.y);
    }

    Div(b){
        return new Vector2(this.x / b.x, this.y / b.y);
    }

    Mul(b){
        return new Vector2(this.x * b.x, this.y * b.y);
    }

    Dot(b){
        return (this.Nor.x * b.Nor.x) + (this.Nor.y * b.Nor.y);
    }

    Dir(b){
        return b.Sub(this).Nor;
    }

    Dis(b){
        return this.Sub(b).Len;
    }

}