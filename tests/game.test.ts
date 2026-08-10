import assert from "node:assert/strict";
import test from "node:test";
import {
  WINNING_LINES,
  createGameState,
  evaluateBoard,
  playMove,
  restartGame,
  type Cell,
} from "../app/game.ts";

test("recognizes every winning line", () => {
  for (const line of WINNING_LINES) {
    const board = Array<Cell>(9).fill(null);
    for (const index of line) board[index] = "X";

    const result = evaluateBoard(board);
    assert.equal(result.winner, "X");
    assert.deepEqual(result.winningLine, line);
    assert.equal(result.draw, false);
  }
});

test("recognizes an O win and a full-board draw", () => {
  const oWin: Cell[] = ["X", "X", null, "O", "O", "O", null, null, "X"];
  assert.equal(evaluateBoard(oWin).winner, "O");

  const draw: Cell[] = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
  assert.deepEqual(evaluateBoard(draw), {
    winner: null,
    winningLine: [],
    draw: true,
  });
});

test("alternates turns and rejects occupied or invalid spaces", () => {
  const start = createGameState();
  const afterX = playMove(start, 4);
  assert.equal(afterX.board[4], "X");
  assert.equal(afterX.turn, "O");

  assert.strictEqual(playMove(afterX, 4), afterX);
  assert.strictEqual(playMove(afterX, -1), afterX);
  assert.strictEqual(playMove(afterX, 9), afterX);

  const afterO = playMove(afterX, 0);
  assert.equal(afterO.board[0], "O");
  assert.equal(afterO.turn, "X");
});

test("locks the board after a result", () => {
  let game = createGameState();
  for (const index of [0, 3, 1, 4, 2]) game = playMove(game, index);

  assert.equal(game.result.winner, "X");
  assert.deepEqual(game.result.winningLine, [0, 1, 2]);
  assert.strictEqual(playMove(game, 8), game);
  assert.equal(game.board[8], null);
});

test("restart returns a clean X-first board and increments the round", () => {
  const played = playMove(createGameState(4), 6);
  const restarted = restartGame(played);

  assert.equal(restarted.round, 5);
  assert.equal(restarted.turn, "X");
  assert.deepEqual(restarted.board, Array(9).fill(null));
  assert.deepEqual(restarted.result, {
    winner: null,
    winningLine: [],
    draw: false,
  });
});
