import React, { useState, useMemo } from 'react';
import './App.css';

function Square({ value, onSquareClick, highlight, disabled }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { 
        winner: squares[a], 
        winningSquares: [a, b, c] 
      };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  const result = useMemo(() => calculateWinner(squares), [squares]);
  const winner = result?.winner;
  const winningSquares = result?.winningSquares || [];
  const isDraw = !winner && squares.every((square) => square !== null);

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'It\'s a draw!';
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  function handleClick(i) {
    if (squares[i] || winner || isDraw) {
      return;
    }
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  // Render board using map instead of nested loops for cleaner code
  return (
    <div className="board-container">
      <div className="status">{status}</div>
      {[0, 1, 2].map(row => (
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                highlight={winningSquares.includes(index)}
                disabled={!!winner || isDraw}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Improved move history rendering with more informative display
  const moves = useMemo(() => {
    return history.map((squares, move) => {
      if (move === currentMove) {
        return move === 0 
          ? <li key={move}><button disabled>Game Start</button></li>
          : <li key={move}><button disabled>Current Move #{move}</button></li>;
      }

      const description = move === 0 
        ? 'Go to game start' 
        : `Go to move #${move}`;
      
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    });
  }, [history, currentMove]);

  // Optional: Reset game functionality
  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
        />
        <div className="game-controls">
          <button 
            onClick={resetGame} 
            className="reset-button"
          >
            Reset Game
          </button>
        </div>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}