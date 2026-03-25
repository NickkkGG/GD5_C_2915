"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Game1() {
  const holes = Array.from({ length: 9 });

  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(30);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const savedHighScore = localStorage.getItem("whack_highscore");
    return savedHighScore ? Number(savedHighScore) : 0;
  });

  // spawn mole
  useEffect(() => {
    if (!gameActive) return;

    const moleTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * holes.length);
      setMoleIndex(randomIndex);
    }, 700);

    return () => clearInterval(moleTimer);
  }, [gameActive, holes.length]);

  // countdown timer interval
  useEffect(() => {
    if (!gameActive || time <= 0) return;

    const countdown = setInterval(() => {
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameActive, time, holes.length]);

  // end game effects when timer reaches zero
  useEffect(() => {
    if (!gameActive || time !== 0) return;

    const endGameTimeout = setTimeout(() => {
      setGameActive(false);

      toast.info("⏰ Waktu habis!", {
        autoClose: 1500,
      });

      if (score > highScore) {
        localStorage.setItem("whack_highscore", score.toString());
        setHighScore(score);

        toast.success("🎉 New High Score!", {
          autoClose: 1500,
        });
      }
    }, 0);

    return () => clearTimeout(endGameTimeout);
  }, [gameActive, time, score, highScore]);

  // klik mole
  const hitMole = (index: number) => {
    if (index === moleIndex && gameActive) {
      setScore((prev) => prev + 1);
      setMoleIndex(null);
    }
  };

  // start game
  const startGame = () => {
    setScore(0);
    setTime(30);
    setGameActive(true);

    toast.info("🎮 Waktu dimulai! Kamu punya 30 detik!", {
      autoClose: 1500,
    });
  };

  return (
    <div className="game-container">
      <div className="game-panel">
        <h1 className="game-title">🐹 Tap the Mouse</h1>

        <div className="game-stats">
          <div className="score">🏆 Score: {score}</div>
          <div className="timer">⏱️ Time: {time}</div>
        </div>

        <div className="highscore">
          ⭐ High Score: {highScore}
        </div>

        {!gameActive && (
          <button className="start-btn" onClick={startGame}>
            ▶ Start Game
          </button>
        )}
      </div>

      <div className="game-grid">
        {holes.map((_, index) => (
          <div
            key={index}
            onClick={() => hitMole(index)}
            className="hole"
          >
            {moleIndex === index && (
              <div className="mole">🐹</div>
            )}
          </div>
        ))}
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        closeOnClick
        pauseOnHover
        draggable
        closeButton
      />
    </div>
  );
}