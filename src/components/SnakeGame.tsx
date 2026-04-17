import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, Point } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((p) => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState('PLAYING');
    setFood(generateFood(INITIAL_SNAKE));
  };

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };
      const currentDir = nextDirection;
      setDirection(currentDir);

      if (currentDir === 'UP') newHead.y -= 1;
      if (currentDir === 'DOWN') newHead.y += 1;
      if (currentDir === 'LEFT') newHead.x -= 1;
      if (currentDir === 'RIGHT') newHead.x += 1;

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameState, nextDirection, food, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          if (gameState === 'PLAYING') setGameState('PAUSED');
          else if (gameState === 'PAUSED') setGameState('PLAYING');
          else if (gameState === 'START' || gameState === 'GAMEOVER') resetGame();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    const frame = (time: number) => {
      if (time - lastUpdateRef.current > GAME_SPEED) {
        update();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(frame);
    };
    gameLoopRef.current = requestAnimationFrame(frame);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#008888';
      if (i === 0) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
      }
      ctx.fillRect(p.x * size + 1, p.y * size + 1, size - 2, size - 2);
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span>High: {highScore}</span>
        </div>
        <div className="text-xl font-bold glow-text">Score: {score}</div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-slate-900 rounded-lg overflow-hidden border border-cyan-500/30">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-auto aspect-square"
          />

          <AnimatePresence>
            {gameState !== 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
              >
                {gameState === 'START' && (
                  <>
                    <h2 className="text-4xl font-bold text-cyan-400 mb-4 tracking-tighter italic">NEON SNAKE</h2>
                    <p className="text-slate-400 mb-8 font-mono">Use arrow keys to move. SPACE to start.</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-full font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    >
                      <Play className="w-5 h-5 fill-current" /> START MISSION
                    </button>
                  </>
                )}

                {gameState === 'PAUSED' && (
                  <>
                    <h2 className="text-4xl font-bold text-yellow-400 mb-8">SYSTEM PAUSED</h2>
                    <button
                      onClick={() => setGameState('PLAYING')}
                      className="flex items-center gap-2 px-8 py-3 bg-yellow-500 text-slate-900 rounded-full font-bold hover:bg-yellow-400 transition-colors"
                    >
                      <Play className="w-5 h-5 fill-current" /> RESUME
                    </button>
                  </>
                )}

                {gameState === 'GAMEOVER' && (
                  <>
                    <h2 className="text-4xl font-bold text-rose-500 mb-2">CRASHED!</h2>
                    <p className="text-slate-400 mb-8 font-mono">Terminal score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 px-8 py-3 bg-rose-500 text-slate-900 rounded-full font-bold hover:bg-rose-400 transition-colors shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                    >
                      <RotateCcw className="w-5 h-5" /> REBOOT SYSTEM
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4 md:hidden">
         {/* Mobile controls could be added here if needed, but the prompt emphasizes the center window for Snake */}
      </div>
    </div>
  );
}
