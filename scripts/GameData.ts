GameData.ts


export const T = 1;
export const R = 2;
export const B = 4;
export const L = 8;


export function rotateCW(mask: number): number {
    let out = 0;
    if (mask & T) out |= R;
    if (mask & R) out |= B;
    if (mask & B) out |= L;
    if (mask & L) out |= T;
    return out;
}

function applyRot(sides: number, n: number): number {
    let s = sides;
    for (let i = 0; i < (n % 4); i++) s = rotateCW(s);
    return s;
}

export type TileType = 'start' | 'goal' | 'pipe';

export interface TileData {
    currentSides: number;
    solvedSides:  number;
    locked:       boolean;
    type:         TileType;
}


const SOLVED: number[] = [
    B,     L|R,  T|B,  L|B,
    T|B,   T|R,  L|B,  T|B,
    T|R,   L|R,  L|R,  L|B,
    T|R,   L|B,  T|R,  T,
];

const LOCKED_SET = new Set([0, 15]);

const SCRAMBLE: number[] = [
    0, 1, 2, 1,
    3, 2, 1, 3,
    1, 3, 2, 3,
    2, 3, 1, 0,
];

interface Dir { dr: number; dc: number; myOpen: number; theirOpen: number; }
const DIRS: Dir[] = [
    { dr: -1, dc:  0, myOpen: T, theirOpen: B },
    { dr:  0, dc:  1, myOpen: R, theirOpen: L },
    { dr:  1, dc:  0, myOpen: B, theirOpen: T },
    { dr:  0, dc: -1, myOpen: L, theirOpen: R },
];

export const GRID_SIZE = 4;
export const MAX_MOVES = 12;

export function buildGrid(): TileData[] {
    return SOLVED.map((sol, i) => ({
        currentSides: LOCKED_SET.has(i) ? sol : applyRot(sol, SCRAMBLE[i]),
        solvedSides:  sol,
        locked:       LOCKED_SET.has(i),
        type: (i === 0 ? 'start' : i === 15 ? 'goal' : 'pipe') as TileType,
    }));
}

export interface BFSResult {
    solved:    boolean;
    connected: Set<number>;
}

export function bfs(grid: TileData[]): BFSResult {
    const visited = new Array(16).fill(false);
    const queue   = [0];
    visited[0]    = true;
    const connected = new Set<number>([0]);

    while (queue.length > 0) {
        const cur = queue.shift()!;
        const row = Math.floor(cur / GRID_SIZE);
        const col = cur % GRID_SIZE;
        const cell = grid[cur];

        for (const d of DIRS) {
            const nr = row + d.dr;
            const nc = col + d.dc;
            if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) continue;
            const ni = nr * GRID_SIZE + nc;
            if (visited[ni]) continue;
            const nb = grid[ni];
            if ((cell.currentSides & d.myOpen) && (nb.currentSides & d.theirOpen)) {
                visited[ni] = true;
                queue.push(ni);
                connected.add(ni);
            }
        }
    }
    return { solved: connected.has(15), connected };
}
