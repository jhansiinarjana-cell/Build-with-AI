import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div 
        className="relative bg-black/40 border-2 border-neon-blue rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: 0, y: 0 }}
            className={`absolute w-5 h-5 rounded-sm ${i === 0 ? 'bg-neon-blue z-10 shadow-[0_0_10px_#00f2ff]' : 'bg-neon-blue/60'}`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute w-5 h-5 bg-neon-pink rounded-full shadow-[0_0_15px_#ff00ff]"
          style={{
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-bold text-neon-pink neon-text-pink mb-4 glitch" data-text="GAME OVER">GAME OVER</h2>
                  <p className="text-xl text-white mb-6">Final Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-transparent border-2 border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-black transition-all duration-300 font-bold tracking-wider"
                  >
                    TRY AGAIN
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-neon-blue neon-text-blue mb-4 glitch" data-text="PAUSED">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-transparent border-2 border-neon-green text-neon-green rounded-full hover:bg-neon-green hover:text-black transition-all duration-300 font-bold tracking-wider"
                  >
                    RESUME
                  </button>
                  <p className="mt-4 text-xs text-gray-400">Press SPACE to toggle</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex gap-8 text-sm font-mono">
        <div className="flex flex-col items-center">
          <span className="text-[var(--text-muted)] uppercase text-[10px] tracking-widest">Score</span>
          <span 
            className="text-5xl text-neon-green neon-text-green font-digital font-black glitch"
            data-text={score}
          >
            {score}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[var(--text-muted)] uppercase text-[10px] tracking-widest">Controls</span>
          <span className="text-xs text-neon-blue">Arrows to move</span>
        </div>
      </div>
    </div>
  );
}
