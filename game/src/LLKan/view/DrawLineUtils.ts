class DrawLineUtils extends egret.DisplayObjectContainer {

    private _container: egret.DisplayObjectContainer;

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.addChild(this._container = new egret.DisplayObjectContainer());
    }

    public drawLines(ptsArr: any) {
        let pts1 = ptsArr[0];
        let pts2 = ptsArr[1];
        if (ptsArr.length == 2) {
            if (ptsArr[0].x == ptsArr[1].x) {
                this.drawLine(pts1, pts2);
            }
            else if (ptsArr[0].y == ptsArr[1].y) {
                this.drawLine(pts1, pts2);
            }
        }
        else if (ptsArr.length == 3) {
            let pts3 = ptsArr[2];
            if (ptsArr[0].x == ptsArr[1].x) {
                if (pts1.y < pts2.y)
                    this.drawLine(pts1, pts2);
                else
                    this.drawLine(pts2, pts1);
            }
            else if (ptsArr[0].y == ptsArr[1].y) {
                if (pts1.x < pts2.x) {
                    this.drawLine(pts1, pts2);
                }
                else {
                    this.drawLine(pts2, pts1);
                }
            }

            if (ptsArr[1].x == ptsArr[2].x) {
                if (pts2.y < pts3.y)
                    this.drawLine(pts2, pts3);
                else
                    this.drawLine(pts3, pts2);
            }
            else if (ptsArr[1].y == ptsArr[2].y) {
                if (pts2.x < pts3.x)
                    this.drawLine(pts2, pts3);
                else
                    this.drawLine(pts3, pts2);
            }
        }
        else if (ptsArr.length == 4) {
            let pts3 = ptsArr[2];
            let pts4 = ptsArr[3];

            if (ptsArr[0].x == ptsArr[1].x) {
                if (pts1.y < pts2.y)
                    this.drawLine(pts1, pts2);
                else
                    this.drawLine(pts2, pts1);
            }
            else if (ptsArr[0].y == ptsArr[1].y) {
                if (pts1.x < pts2.x) {
                    this.drawLine(pts1, pts2);
                }
                else {
                    this.drawLine(pts2, pts1);
                }
            }

            if (ptsArr[1].x == ptsArr[2].x) {
                if (pts2.y < pts3.y)
                    this.drawLine(pts2, pts3);
                else
                    this.drawLine(pts3, pts2);
            }
            else if (ptsArr[1].y == ptsArr[2].y) {
                if (pts2.x < pts3.x)
                    this.drawLine(pts2, pts3);
                else
                    this.drawLine(pts3, pts2);
            }

            if (ptsArr[2].x == ptsArr[3].x) {
                if (pts3.y < pts4.y)
                    this.drawLine(pts3, pts4);
                else
                    this.drawLine(pts4, pts3);
            }
            else if (ptsArr[2].y == ptsArr[3].y) {
                if (pts3.x < pts4.x)
                    this.drawLine(pts3, pts4);
                else {
                    this.drawLine(pts4, pts3);
                }
            }
        }
        return this._container;
    }

    private drawLine(pts1, pts2) {
        if (pts1.x == pts2.x) {
            let line = this.createBitmapByName("lg_updown");
            line.x = pts1.x;
            line.y = pts1.y + 45;
            line.width = 90;
            line.height = Math.abs(pts1.y - pts2.y);
            this._container.addChild(line);
        }
        else if (pts1.y == pts2.y) {
            let line = this.createBitmapByName("lg_leftright");
            line.x = pts1.x + 45;
            line.y = pts1.y;
            line.width = Math.abs(pts1.x - pts2.x);
            line.height = 90;
            this._container.addChild(line);
        }
    }

    //创建图片
    private createBitmapByName(name: string): eui.Image {
        let result = new eui.Image();
        result.source = name;
        return result;
    }
}