export type Player = "X" | "O";
export type Cell = Player | null;

export type GameResult = {
  winner: Player | null;
  winningLine: readonly number[];
  draw: boolean;
};

export type GameState = {
  board: readonly Cell[];
  turn: Player;
  result: GameResult;
  round: number;
};

export type GameAction =
  | { type: "play"; index: number }
  | { type: "restart" };

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const EMPTY_RESULT: GameResult = {
  winner: null,
  winningLine: [],
  draw: false,
};

export function evaluateBoard(board: readonly Cell[]): GameResult {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    const mark = board[first];

    if (mark && mark === board[second] && mark === board[third]) {
      return { winner: mark, winningLine: line, draw: false };
    }
  }

  return {
    winner: null,
    winningLine: [],
    draw: board.length === 9 && board.every(Boolean),
  };
}

export function createGameState(round = 1): GameState {
  return {
    board: Array<Cell>(9).fill(null),
    turn: "X",
    result: EMPTY_RESULT,
    round,
  };
}

export function playMove(state: GameState, index: number): GameState {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8 ||
    state.board[index] ||
    state.result.winner ||
    state.result.draw
  ) {
    return state;
  }

  const board = [...state.board];
  board[index] = state.turn;
  const result = evaluateBoard(board);

  return {
    ...state,
    board,
    result,
    turn: result.winner || result.draw ? state.turn : state.turn === "X" ? "O" : "X",
  };
}

export function restartGame(state: GameState): GameState {
  return createGameState(state.round + 1);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  return action.type === "play" ? playMove(state, action.index) : restartGame(state);
}
