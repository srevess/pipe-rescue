import { _decorator, Component, Graphics, Color, Node } from 'cc';
const { ccclass } = _decorator;

import { T, R, B, L, TileType } from './GameData';

const COL_DIM    = new Color( 42,  96, 112, 255);
const COL_LIVE   = new Color(  0, 212, 170, 255);
const COL_START  = new Color(  0, 230, 118, 255);
const COL_GOAL   = new Color(255, 214,   0, 255);
const COL_BG     = new Color( 30,  58,  74, 255);
const COL_BG_LIT = new Color( 10,  40,  48, 255);
const COL_BORDER = new Color( 42,  80,  96, 255);

const HALF   = 35;
const PIPE_W = 11;

@ccclass('TileRenderer')
export class TileRenderer extends Component {

    public tileIndex: number   = 0;
    public tileType:  TileType = 'pipe';
    public onTapped: ((index: number) => void) | null = null;

    private _sides: number  = 0;
    private _isLit: boolean = false;
    private _gfx:   Graphics | null = null;

    onLoad() {
        this._gfx = this.getComponent(Graphics);
        if (!this._gfx) this._gfx = this.addComponent(Graphics);
        this.node.on(Node.EventType.TOUCH_END, this._onTouch, this);
    }

    private _onTouch() {
        if (this.onTapped) this.onTapped(this.tileIndex);
    }

    public draw(sides: number, isLit: boolean) {
        this._sides = sides;
        this._isLit = isLit;
        this._render();
    }

    private _render() {
        const g = this._gfx!;
        g.clear();

        // Background
        g.fillColor = this._isLit ? COL_BG_LIT : COL_BG;
        g.roundRect(-HALF, -HALF, HALF * 2, HALF * 2, 6);
        g.fill();

        // Pipe colour
        let pc: Color;
        if      (this.tileType === 'start') pc = COL_START;
        else if (this.tileType === 'goal')  pc = COL_GOAL;
        else if (this._isLit)               pc = COL_LIVE;
        else                                pc = COL_DIM;

        g.fillColor = pc;

        // Arms from centre to each open edge
        if (this._sides & T) { g.rect(-PIPE_W, 0,     PIPE_W * 2, HALF); g.fill(); }
        if (this._sides & B) { g.rect(-PIPE_W, -HALF, PIPE_W * 2, HALF); g.fill(); }
        if (this._sides & L) { g.rect(-HALF, -PIPE_W, HALF, PIPE_W * 2); g.fill(); }
        if (this._sides & R) { g.rect(0,     -PIPE_W, HALF, PIPE_W * 2); g.fill(); }

        // Centre junction
        g.fillColor = pc;
        g.circle(0, 0, PIPE_W + 1);
        g.fill();

        // Border
        const bc = this.tileType === 'start' ? COL_START
                 : this.tileType === 'goal'  ? COL_GOAL
                 : this._isLit              ? COL_LIVE
                 : COL_BORDER;
        g.strokeColor = bc;
        g.lineWidth   = this._isLit ? 2.5 : 1.5;
        g.roundRect(-HALF, -HALF, HALF * 2, HALF * 2, 6);
        g.stroke();
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this._onTouch, this);
    }
}
