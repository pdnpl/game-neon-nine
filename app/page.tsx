"use client";

import { KeyboardEvent, useReducer, useRef, useState } from "react";
import { createGameState, gameReducer } from "./game";

const coordinates = [
  "top left",
  "top center",
  "top right",
  "middle left",
  "center",
  "middle right",
  "bottom left",
  "bottom center",
  "bottom right",
];

export default function Home() {
  const [game, dispatch] = useReducer(gameReducer, undefined, () => createGameState());
  const [focusIndex, setFocusIndex] = useState(0);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const finished = Boolean(game.result.winner) || game.result.draw;
  const status = game.result.winner
    ? `${game.result.winner} wins the round.`
    : game.result.draw
      ? "Round drawn. Perfectly matched."
      : `${game.turn}'s turn.`;
  const statusDetail = game.result.winner
    ? "Three lights aligned."
    : game.result.draw
      ? "All nine spaces are filled."
      : "Choose an open space.";

  function moveFocus(index: number) {
    setFocusIndex(index);
    cellRefs.current[index]?.focus();
  }

  function handleCellKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const row = Math.floor(index / 3);
    const column = index % 3;
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = row * 3 + ((column + 1) % 3);
        break;
      case "ArrowLeft":
        nextIndex = row * 3 + ((column + 2) % 3);
        break;
      case "ArrowDown":
        nextIndex = ((row + 1) % 3) * 3 + column;
        break;
      case "ArrowUp":
        nextIndex = ((row + 2) % 3) * 3 + column;
        break;
      case "Home":
        nextIndex = row * 3;
        break;
      case "End":
        nextIndex = row * 3 + 2;
        break;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      moveFocus(nextIndex);
    }
  }

  function play(index: number) {
    setFocusIndex(index);
    dispatch({ type: "play", index });
  }

  function restart() {
    dispatch({ type: "restart" });
    setFocusIndex(0);
    requestAnimationFrame(() => cellRefs.current[0]?.focus());
  }

  return (
    <main className="game-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="experience">
        <header className="brand-panel">
          <div className="wordmark" aria-label="Neon Nine">
            <span className="wordmark-dot" aria-hidden="true" />
            Neon Nine
          </div>
          <div className="brand-copy">
            <p className="eyebrow">Two players / One board</p>
            <h1>
              Find your
              <span>line of light.</span>
            </h1>
            <p className="intro">
              Take turns. Claim a space. Connect three before your opponent does.
            </p>
          </div>
          <p className="keyboard-hint">
            <span>Arrow keys</span> to move / <span>Enter</span> to mark
          </p>
        </header>

        <section className="play-panel" aria-labelledby="game-status">
          <div className="status-bar">
            <div className={`turn-chip turn-${(game.result.winner ?? game.turn).toLowerCase()}`} aria-hidden="true">
              <span>{game.result.winner ?? game.turn}</span>
            </div>
            <p id="game-status" className="status-copy" role="status" aria-live="polite" aria-atomic="true">
              <strong>{status}</strong>
              <span>{statusDetail}</span>
            </p>
            <span className="round-label">Round {game.round}</span>
          </div>

          <div className={`board-frame${finished ? " is-finished" : ""}${game.result.draw ? " is-draw" : ""}`}>
            <div
              className="board"
              role="grid"
              aria-label="Tic-tac-toe board"
              aria-rowcount={3}
              aria-colcount={3}
            >
              {[0, 1, 2].map((row) => (
                <div className="board-row" role="row" key={row}>
                  {[0, 1, 2].map((column) => {
                    const index = row * 3 + column;
                    const mark = game.board[index];
                    const winning = game.result.winningLine.includes(index);
                    const unavailable = Boolean(mark) || finished;
                    const cellLabel = mark
                      ? `${mark}, ${coordinates[index]}`
                      : `${coordinates[index]}, empty`;

                    return (
                      <div className="grid-cell" role="gridcell" key={index}>
                        <button
                          ref={(element) => { cellRefs.current[index] = element; }}
                          className={`cell${mark ? " is-filled" : ""}${winning ? " is-winning" : ""}`}
                          type="button"
                          data-cell-index={index}
                          aria-label={cellLabel}
                          aria-disabled={unavailable}
                          tabIndex={focusIndex === index ? 0 : -1}
                          onClick={() => play(index)}
                          onFocus={() => setFocusIndex(index)}
                          onKeyDown={(event) => handleCellKeyDown(event, index)}
                        >
                          {mark && <span className={`mark mark-${mark.toLowerCase()}`} aria-hidden="true" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <button className="restart-button" type="button" onClick={restart}>
            <span>{finished ? "Play again" : "Restart round"}</span>
            <span className="restart-arrow" aria-hidden="true">↗</span>
          </button>
        </section>
      </div>

      <footer className="site-footer">
        <span>Neon Nine</span>
        <span>Three in a row. Nothing else.</span>
      </footer>
    </main>
  );
}
