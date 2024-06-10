import Vector2 from "./Scripts-Vectors-JS.js";

export default class Level {
    constructor(CurvePoints,Precision) {
        this.CurvePoints = CurvePoints;
        this.precision = Precision;
        this.PathPoints = this.path(Precision)
;
    }

    draw(ctx, GridSize) {
        //ctx.save();
        ctx.moveTo(this.PathPoints[0].x, this.PathPoints[0].y);
        ctx.beginPath();
        ctx.lineWidth = GridSize * 3;
        ctx.strokeStyle = "rgb(200,200,200)"

        for (let i = 0; i < this.PathPoints.length; i++) {
            ctx.lineTo((this.PathPoints[i].x * GridSize), (this.PathPoints[i].y * GridSize));
        }

        ctx.stroke();
        //ctx.restore();
    }

    BezierPath(t) {

        if (t > (this.CurvePoints.length - 1) / 3) {
            t = (this.CurvePoints.length - 1) / 3;

        }
        else if (t < 0) {
            t = 0;
        }

        let ti = Math.trunc(t);
        let tf = t - Math.trunc(t);

        const Bernstein_1 = ((((tf ** 3) * -1) + ((tf ** 2) * 3)) - (tf * 3)) + 1;
        const Bernstein_2 = (((tf ** 3) * 3) - ((tf ** 2) * 6)) + (tf * 3);
        const Bernstein_3 = ((tf ** 3) * -3) + ((tf ** 2) * 3);
        const Bernstein_4 = (tf ** 3);

        let x = (this.CurvePoints[0 + (3 * ti)].x * Bernstein_1) +
            (this.CurvePoints[1 + (3 * ti)].x * Bernstein_2) +
            (this.CurvePoints[2 + (3 * ti)].x * Bernstein_3) +
            (this.CurvePoints[3 + (3 * ti)].x * Bernstein_4);

        let y = (this.CurvePoints[0 + (3 * ti)].y * Bernstein_1) +
            (this.CurvePoints[1 + (3 * ti)].y * Bernstein_2) +
            (this.CurvePoints[2 + (3 * ti)].y * Bernstein_3) +
            (this.CurvePoints[3 + (3 * ti)].y * Bernstein_4);

        return new Vector2(x, y);
    }

    path(precision) {
        var points = [];
        let t = 0;
        let tH = (this.CurvePoints.length - 1) / 3;
        let tL = 0;

        points.push(this.BezierPath(0));

        while (true) {

            //console.log(this.BezierPath(t));

            if (((this.CurvePoints.length - 1) / 3) - t <= 0) {
                break;
            }

            if (Math.abs(precision - (points[points.length - 1].Dis(this.BezierPath(t)))) < 0.01) {
                //console.log(`#########: ${this.BezierPath(t).x} :: ${this.BezierPath(t).y} :: t = ${t}`);
                points.push(this.BezierPath(t));
                tL = t;
                tH = (this.CurvePoints.length - 1) / 3;
            }
            else if (precision - (points[points.length - 1].Dis(this.BezierPath(t))) > 0) {
                tL = t;
                t += (tH - t) / 2;

            }
            else if (precision - (points[points.length - 1].Dis(this.BezierPath(t))) < 0) {
                tH = t;
                t += (tL - t) / 2;
            }

        }

        return points;
    }

}