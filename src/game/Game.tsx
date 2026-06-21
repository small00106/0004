import React, { useRef, useEffect } from 'react';
import { useGame } from './useGame';
import { Mario, Block, Coin, Mushroom, Flower, Goomba, Koopa, Fireball, Cloud, Hill, Star, SpeedBoots } from './GameSprites';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, BLOCK_SIZE, GROUND_Y, WORLD_WIDTH, STAR_DURATION, SPEED_DURATION } from './constants';

export const Game: React.FC = () => {
  const { gameState, frame, startGame, resetGame } = useGame();
  const { player, blocks, enemies, powerUps, fireballs, cameraX, gameStatus } = gameState;

  const visibleBlocks = blocks.filter(
    (b) => b.x + b.width > cameraX - 50 && b.x < cameraX + GAME_WIDTH + 50
  );
  const visibleEnemies = enemies.filter(
    (e) => e.x + e.width > cameraX - 50 && e.x < cameraX + GAME_WIDTH + 50
  );
  const visiblePowerUps = powerUps.filter(
    (p) => p.x + p.width > cameraX - 50 && p.x < cameraX + GAME_WIDTH + 50
  );
  const visibleFireballs = fireballs.filter(
    (f) => f.x + f.width > cameraX - 50 && f.x < cameraX + GAME_WIDTH + 50
  );

  const cloudPositions = [
    { x: 100, y: 80, scale: 1 },
    { x: 350, y: 50, scale: 0.8 },
    { x: 600, y: 100, scale: 1.2 },
    { x: 900, y: 60, scale: 0.9 },
    { x: 1200, y: 90, scale: 1.1 },
    { x: 1500, y: 50, scale: 0.85 },
    { x: 1800, y: 80, scale: 1 },
    { x: 2100, y: 60, scale: 0.95 },
    { x: 2400, y: 90, scale: 1.05 },
    { x: 2700, y: 70, scale: 0.9 },
  ];

  const hillPositions = [
    { x: 200, y: GROUND_Y - 20, size: 60 },
    { x: 700, y: GROUND_Y - 10, size: 40 },
    { x: 1100, y: GROUND_Y - 30, size: 80 },
    { x: 1600, y: GROUND_Y - 15, size: 50 },
    { x: 2000, y: GROUND_Y - 25, size: 70 },
    { x: 2500, y: GROUND_Y - 20, size: 55 },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="mb-4 text-white flex gap-6 items-center flex-wrap">
        <div className="text-xl font-bold">
          分数: <span className="text-yellow-400">{player.score}</span>
        </div>
        <div className="text-xl font-bold">
          金币: <span className="text-yellow-400">{player.coins}</span>
        </div>
        <div className="text-xl font-bold">
          生命: <span className="text-red-400">{'❤️'.repeat(Math.max(0, player.lives))}</span>
        </div>
        {player.hasFire && (
          <div className="text-xl font-bold text-orange-400">🔥 火焰模式</div>
        )}
        {player.hasStar && (
          <div className="text-xl font-bold text-yellow-300 animate-pulse">
            ⭐ 无敌 {Math.ceil(player.starTimer / 60)}s
          </div>
        )}
        {player.hasSpeed && (
          <div className="text-xl font-bold text-cyan-400 animate-pulse">
            ⚡ 加速 {Math.ceil(player.speedTimer / 60)}s
          </div>
        )}
      </div>

      <div
        className="relative border-4 border-gray-700 rounded-lg overflow-hidden shadow-2xl"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        <svg
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          style={{ background: COLORS.sky, display: 'block' }}
        >
          <g transform={`translate(${-cameraX * 0.3}, 0)`}>
            {cloudPositions.map((cloud, i) => (
              <Cloud
                key={i}
                x={cloud.x}
                y={cloud.y}
                scale={cloud.scale}
              />
            ))}
          </g>

          <g transform={`translate(${-cameraX * 0.6}, 0)`}>
            {hillPositions.map((hill, i) => (
              <Hill key={i} x={hill.x} y={hill.y} size={hill.size} />
            ))}
          </g>

          <g transform={`translate(${-cameraX}, 0)`}>
            {visibleBlocks.map((block) => (
              <Block
                key={block.id}
                x={block.x}
                y={block.y}
                type={block.type}
                hit={block.hit}
              />
            ))}

            {visiblePowerUps.map((pu) => {
              if (pu.type === 'coin') {
                return (
                  <Coin
                    key={pu.id}
                    x={pu.x}
                    y={pu.y}
                    spinFrame={frame}
                  />
                );
              } else if (pu.type === 'mushroom') {
                return <Mushroom key={pu.id} x={pu.x} y={pu.y} />;
              } else if (pu.type === 'flower') {
                return (
                  <Flower
                    key={pu.id}
                    x={pu.x}
                    y={pu.y}
                    frame={frame}
                  />
                );
              } else if (pu.type === 'star') {
                return (
                  <Star
                    key={pu.id}
                    x={pu.x}
                    y={pu.y}
                    frame={frame}
                  />
                );
              } else if (pu.type === 'speed') {
                return (
                  <SpeedBoots
                    key={pu.id}
                    x={pu.x}
                    y={pu.y}
                    frame={frame}
                  />
                );
              }
              return null;
            })}

            {visibleEnemies.map((enemy) => {
              if (enemy.type === 'goomba') {
                return (
                  <Goomba
                    key={enemy.id}
                    x={enemy.x}
                    y={enemy.y}
                    alive={enemy.alive}
                    direction={enemy.direction}
                    frame={frame}
                  />
                );
              } else {
                return (
                  <Koopa
                    key={enemy.id}
                    x={enemy.x}
                    y={enemy.y}
                    alive={enemy.alive}
                    direction={enemy.direction}
                    frame={frame}
                  />
                );
              }
            })}

            {visibleFireballs.map((fb) => (
              <Fireball key={fb.id} x={fb.x} y={fb.y} frame={frame} />
            ))}

            <Mario
              x={player.x}
              y={player.y}
              direction={player.direction}
              isBig={player.isBig}
              hasFire={player.hasFire}
              isJumping={player.isJumping}
              invincible={player.invincible}
              hasStar={player.hasStar}
              hasSpeed={player.hasSpeed}
            />

            <g transform={`translate(${WORLD_WIDTH - 80}, ${GROUND_Y - BLOCK_SIZE * 8})`}>
              <rect x="0" y="0" width="8" height={BLOCK_SIZE * 8} fill="#228b22" />
              <polygon
                points={`0,0 -20,${BLOCK_SIZE * 2} 0,${BLOCK_SIZE * 2}`}
                fill="#32cd32"
              />
              <polygon
                points={`0,${BLOCK_SIZE * 3} -25,${BLOCK_SIZE * 5} 0,${BLOCK_SIZE * 5}`}
                fill="#32cd32"
              />
              <polygon
                points={`0,${BLOCK_SIZE * 6} -15,${BLOCK_SIZE * 7.5} 0,${BLOCK_SIZE * 7.5}`}
                fill="#32cd32"
              />
            </g>
          </g>
        </svg>

        {gameStatus === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h1 className="text-5xl font-bold text-white mb-4">超级马里奥</h1>
            <p className="text-xl text-yellow-400 mb-8">Super Mario Clone</p>
            <div className="text-white mb-6 text-center">
              <p className="mb-2">🎮 操作说明</p>
              <p>A / ← : 向左移动</p>
              <p>D / → : 向右移动</p>
              <p>W / ↑ / 空格 : 跳跃（长按跳更高）</p>
              <p>J : 发射火球（需吃到火焰花）</p>
              <p className="mt-3 text-yellow-300">⭐ 紫色特殊方块：顶出无敌星或加速靴</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-2xl font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              开始游戏
            </button>
          </div>
        )}

        {gameStatus === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <h1 className="text-5xl font-bold text-red-500 mb-4">游戏结束</h1>
            <p className="text-2xl text-white mb-2">最终得分: {player.score}</p>
            <p className="text-xl text-yellow-400 mb-8">金币: {player.coins}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              重新开始
            </button>
          </div>
        )}

        {gameStatus === 'win' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <h1 className="text-5xl font-bold text-yellow-400 mb-4">🎉 恭喜通关！</h1>
            <p className="text-2xl text-white mb-2">最终得分: {player.score}</p>
            <p className="text-xl text-yellow-400 mb-8">金币: {player.coins}</p>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-400 text-sm text-center">
        <p>使用 WASD 移动，J 键发射火球。长按跳跃键可以跳得更高！</p>
        <p className="mt-1">踩敌人可以消灭它们，从下方撞击问号方块或紫色特殊方块获取道具。</p>
        <p className="mt-1">⭐ 无敌星：无敌并秒杀敌人 &nbsp;&nbsp; ⚡ 加速靴：提升移动速度</p>
      </div>
    </div>
  );
};
