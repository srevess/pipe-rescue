import { _decorator, Component, Node, UITransform, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { TileData, buildGrid, bfs, rotateCW, GRID_SIZE, MAX_MOVES } from './GameData';
import { TileRenderer } from './TileRenderer';
import { UIManager } from './UIManager';

const TILE_SIZE = 70;
const TILE_GAP  = 6;

@ccclass('GridManager')
export class GridManager extends Component {

    @property(Node)
    gridRoot: Node = null!;

    @property(Node)
    uiManagerNode: Node = null!;

    private _grid:      TileData[]     = [];
    private _renderers: TileRenderer[] = [];
    private _movesLeft: number         = MAX_MOVES;
    private _gameOver:  boolean        = false;
    private _uiMgr:     UIManager | null = null;

    private get _span(): number {
        return GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * TILE_GAP;
    }

    onLoad() {
        this._uiMgr = this.uiManagerNode.getComponent(UIManager);
        this._uiMgr?.registerCallbacks(
            () => this.checkPath(),
            () => this.startNewGame()
        );
        this._startGame();
    }

    public startNewGame() {
        this.gridRoot.destroyAllChildren();
        this._renderers = [];
        this._startGame();
    }

    private _startGame() {
        this._grid      = buildGrid();
        this._movesLeft = MAX_MOVES;
        this._gameOver  = false;
        this._uiMgr?.setMoves(this._movesLeft);
        this._uiMgr?.setStatus('Not connected', false);
        this._spawnTiles();
        this._renderAll(null);
    }

    private _spawnTiles() {
        const half = this._span / 2;
        for (let i = 0; i < 16; i++) {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            const tileNode = new Node(`Tile_${i}`);
            this.gridRoot.addChild(tileNode);
            const ut = tileNode.addComponent(UITransform);
            ut.setContentSize(TILE_SIZE, TILE_SIZE);
            const x = col * (TILE_SIZE + TILE_GAP) - half + TILE_SIZE / 2;
            const y = -(row * (TILE_SIZE + TILE_GAP)) + half - TILE_SIZE / 2;
            tileNode.setPosition(x, y, 0);
            const renderer = tileNode.addComponent(TileRenderer);
            renderer.tileIndex = i;
            renderer.tileType  = this._grid[i].type;
            renderer.onTapped  = (idx) => this._onTileTap(idx);
            this._renderers.push(renderer);
        }
    }

    private _onTileTap(i: number) {
        if (this._gameOver || this._movesLeft <= 0) return;
        const cell = this._grid[i];
        if (cell.locked) return;
        cell.currentSides = rotateCW(cell.currentSides);
        this._movesLeft--;
        const node = this._renderers[i].node;
        tween(node)
            .to(0.08, { scale: new Vec3(0.85, 0.85, 1) })
            .to(0.12, { scale: new Vec3(1.0,  1.0,  1) })
            .start();
        const result = bfs(this._grid);
        this._renderAll(result.connected);
        this._uiMgr?.setMoves(this._movesLeft);
        this._uiMgr?.setStatus(
            result.solved ? '✅ Connected!' : 'Not connected',
            result.solved
        );
        if (result.solved) {
            this._gameOver = true;
            this._flashWin(result.connected);
            return;
        }
        if (this._movesLeft <= 0) {
            this._gameOver = true;
            this.scheduleOnce(() => { this._uiMgr?.showEndCard(false); }, 0.5);
        }
    }

    public checkPath() {
        if (this._gameOver) return;
        const result = bfs(this._grid);
        this._renderAll(result.connected);
        this._uiMgr?.setStatus(
            result.solved ? '✅ Connected!' : '❌ Not yet',
            result.solved
        );
        if (result.solved) {
            this._gameOver = true;
            this._flashWin(result.connected);
        } else if (this._movesLeft <= 0) {
            this._gameOver = true;
            this.scheduleOnce(() => { this._uiMgr?.showEndCard(false); }, 0.5);
        }
    }

    private _renderAll(connected: Set<number> | null) {
        this._grid.forEach((cell, i) => {
            this._renderers[i].draw(cell.currentSides, connected ? connected.has(i) : false);
        });
    }

    private _flashWin(connected: Set<number>) {
        connected.forEach(i => {
            const node = this._renderers[i].node;
            tween(node)
                .to(0.15, { scale: new Vec3(1.12, 1.12, 1) })
                .to(0.15, { scale: new Vec3(1.0,  1.0,  1) })
                .union().repeat(3).start();
        });
        this.scheduleOnce(() => { this._uiMgr?.showEndCard(true); }, 1.0);
    }
}
