import { _decorator, Component, Node, Label, Button, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    @property(Label)
    movesLabel: Label = null!;

    @property(Label)
    statusLabel: Label = null!;

    @property(Button)
    checkPathBtn: Button = null!;

    @property(Node)
    endCardNode: Node = null!;

    @property(Label)
    endTitleLabel: Label = null!;

    @property(Label)
    endSubLabel: Label = null!;

    @property(Button)
    playNowBtn: Button = null!;

    @property(Button)
    retryBtn: Button = null!;

    @property(Node)
    gridManagerNode: Node = null!;

    private _checkPathFn: (() => void) | null = null;
    private _newGameFn:   (() => void) | null = null;

    onLoad() {
        this.endCardNode.active = false;
        this.checkPathBtn.node.on(Button.EventType.CLICK, () => {
            if (this._checkPathFn) this._checkPathFn();
        }, this);
        this.playNowBtn.node.on(Button.EventType.CLICK, () => {
            console.log('CTA: Play Now — insert store link here');
        }, this);
        this.retryBtn.node.on(Button.EventType.CLICK, () => {
            this.endCardNode.active = false;
            if (this._newGameFn) this._newGameFn();
        }, this);
    }

    public registerCallbacks(checkPath: () => void, newGame: () => void) {
        this._checkPathFn = checkPath;
        this._newGameFn   = newGame;
    }

    public setMoves(n: number) {
        this.movesLabel.string = `Moves: ${n}`;
        this.movesLabel.color  = n <= 3
            ? new Color(255, 82,  82,  255)
            : new Color(  0, 212, 170, 255);
    }

    public setStatus(text: string, connected: boolean) {
        this.statusLabel.string = text;
        this.statusLabel.color  = connected
            ? new Color(  0, 212, 170, 255)
            : new Color(200, 220, 230, 255);
    }

    public showEndCard(win: boolean) {
        this.endCardNode.active   = true;
        this.endTitleLabel.string = win ? '🎉 You fixed it!' : '💧 Out of moves!';
        this.endSubLabel.string   = win
            ? 'Puzzle complete — water is flowing!'
            : "Pipes aren't connected yet. Try again!";
        this.endTitleLabel.color  = win
            ? new Color(  0, 212, 170, 255)
            : new Color(255,  82,  82, 255);
    }
}
