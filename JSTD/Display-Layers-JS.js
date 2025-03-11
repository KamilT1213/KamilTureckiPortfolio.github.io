export default class DisplayLayer{
    constructor(document,Name){

        this.canvas = document.createElement(`canvas`);
        this.canvas.id = `${Name}`;

        this.Resize();

        document.getElementById("gameCanvasContainer").append(this.canvas);

        this.context = this.canvas.getContext("2d");
    }

    Update(elapsed){

    }

    Draw(){
        
        this.context.fillRect(-100,-100,10,10);
        console.log(`${this.canvas.id}`)
    }

    get size(){
        return Math.min(this.height, this.width) * 0.75;
    }

    get width(){
        return Math.max(
            //document.parentElement.width
            document.body.scrollWidth,
            //document.documentElement.scrollWidth,
            //document.body.offsetWidth,
            //document.documentElement.offsetWidth,
            //document.documentElement.clientWidth
        );
    }

    get height(){
        return Math.max(
            //document.parentElement.height
            document.body.scrollHeight,
            //document.documentElement.scrollHeight,
            //document.body.offsetHeight,
            //document.documentElement.offsetHeight,
            //document.documentElement.clientHeight
        );
    }

    Resize(){
        
        let ow = Math.trunc((50) - ((((this.size / 8) * 5) / this.width) * 80));
        let oh = Math.trunc((50) - (((this.size / 2) / this.height) * 80));


        this.canvas.style = `position: absolute; left: ${ow}%; top: ${oh}%; z-index: 0;`;
        this.canvas.height = this.size;
        this.canvas.width = this.size + (this.size/4);
        
    }

}


