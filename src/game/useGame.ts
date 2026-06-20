import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, Keys, Block, Enemy, PowerUp, Fireball } from './types';
import {
  GRAVITY,
  JUMP_FORCE,
  MOVE_SPEED,
  MAX_FALL_SPEED,
  FRICTION,
  GROUND_Y,
  WORLD_WIDTH,
  GAME_WIDTH,
  INVINCIBLE_DURATION,
  BLOCK_SIZE,
  FIREBALL_SPEED,
  PLAYER_WIDTH,
} from './constants';
import {
  generateLevel,
  createInitialPlayer,
  createPowerUp,
  createFireball,
  checkCollision,
  resizePlayer,
} from './level';
import { soundManager } from './soundManager';

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { blocks, enemies, powerUps } = generateLevel();
    return {
      player: createInitialPlayer(),
      blocks,
      enemies,
      powerUps,
      fireballs: [],
      cameraX: 0,
      gameStatus: 'ready',
      groundY: GROUND_Y,
      worldWidth: WORLD_WIDTH,
      levelHeight: 480,
    };
  });

  const keysRef = useRef<Keys>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    fire: false,
  });

  const frameRef = useRef(0);
  const animationRef = useRef<number>();
  const lastFireRef = useRef(0);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const startGame = useCallback(() => {
    soundManager.init();
    setGameState((prev) => ({
      ...prev,
      gameStatus: 'playing',
    }));
  }, []);

  const resetGame = useCallback(() => {
    const { blocks, enemies, powerUps } = generateLevel();
    setGameState({
      player: createInitialPlayer(),
      blocks,
      enemies,
      powerUps,
      fireballs: [],
      cameraX: 0,
      gameStatus: 'ready',
      groundY: GROUND_Y,
      worldWidth: WORLD_WIDTH,
      levelHeight: 480,
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'arrowleft') keysRef.current.left = true;
    if (key === 'd' || key === 'arrowright') keysRef.current.right = true;
    if (key === 'w' || key === 'arrowup' || key === ' ') {
      keysRef.current.up = true;
      keysRef.current.jump = true;
    }
    if (key === 's' || key === 'arrowdown') keysRef.current.down = true;
    if (key === 'j') keysRef.current.fire = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'arrowleft') keysRef.current.left = false;
    if (key === 'd' || key === 'arrowright') keysRef.current.right = false;
    if (key === 'w' || key === 'arrowup' || key === ' ') {
      keysRef.current.up = false;
      keysRef.current.jump = false;
    }
    if (key === 's' || key === 'arrowdown') keysRef.current.down = false;
    if (key === 'j') keysRef.current.fire = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const gameLoop = () => {
      frameRef.current++;
      setGameState((prev) => updateGame(prev, keysRef.current, frameRef.current, lastFireRef));
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameStatus]);

  return {
    gameState,
    frame: frameRef.current,
    startGame,
    resetGame,
  };
}

function updateGame(
  state: GameState,
  keys: Keys,
  frame: number,
  lastFireRef: React.MutableRefObject<number>
): GameState {
  let { player, blocks, enemies, powerUps, fireballs, cameraX } = state;
  let newPlayer = { ...player };
  let newBlocks = [...blocks];
  let newEnemies = [...enemies];
  let newPowerUps = [...powerUps];
  let newFireballs = [...fireballs];
  let newGameStatus = state.gameStatus;

  if (keys.left) {
    newPlayer.vx = -MOVE_SPEED;
    newPlayer.direction = -1;
  } else if (keys.right) {
    newPlayer.vx = MOVE_SPEED;
    newPlayer.direction = 1;
  } else {
    newPlayer.vx *= FRICTION;
    if (Math.abs(newPlayer.vx) < 0.1) newPlayer.vx = 0;
  }

  if (keys.jump && !newPlayer.isJumping) {
    newPlayer.vy = JUMP_FORCE;
    newPlayer.isJumping = true;
    soundManager.jump();
    keys.jump = false;
  }

  if (keys.fire && newPlayer.hasFire && frame - lastFireRef.current > 20) {
    const fbX = newPlayer.direction === 1 ? newPlayer.x + newPlayer.width : newPlayer.x - 16;
    const fbY = newPlayer.y + newPlayer.height / 3;
    newFireballs.push(createFireball(fbX, fbY, newPlayer.direction));
    soundManager.fireball();
    lastFireRef.current = frame;
  }

  newPlayer.vy += GRAVITY;
  if (newPlayer.vy > MAX_FALL_SPEED) newPlayer.vy = MAX_FALL_SPEED;

  newPlayer.x += newPlayer.vx;
  const collisionX = checkBlockCollisions(newPlayer, newBlocks);
  if (collisionX) {
    if (newPlayer.vx > 0) {
      newPlayer.x = collisionX.x - newPlayer.width;
    } else {
      newPlayer.x = collisionX.x + collisionX.width;
    }
    newPlayer.vx = 0;
  }

  if (newPlayer.x < 0) newPlayer.x = 0;
  if (newPlayer.x + newPlayer.width > WORLD_WIDTH) newPlayer.x = WORLD_WIDTH - newPlayer.width;

  newPlayer.y += newPlayer.vy;
  const collisionY = checkBlockCollisions(newPlayer, newBlocks);
  if (collisionY) {
    if (newPlayer.vy > 0) {
      newPlayer.y = collisionY.y - newPlayer.height;
      newPlayer.vy = 0;
      newPlayer.isJumping = false;
    } else {
      newPlayer.y = collisionY.y + collisionY.height;
      newPlayer.vy = 0;

      if (collisionY.type === 'question' && !collisionY.hit) {
        newBlocks = newBlocks.map((b) =>
          b.id === collisionY.id ? { ...b, hit: true } : b
        );

        if (collisionY.hasItem) {
          const item = createPowerUp(
            collisionY.hasItem,
            collisionY.x + (BLOCK_SIZE - 32) / 2,
            collisionY.y - 32
          );
          newPowerUps.push(item);
          soundManager.powerUp();
        } else {
          newPlayer.coins++;
          newPlayer.score += 100;
          soundManager.coin();
        }
      } else if (collisionY.type === 'brick') {
        if (newPlayer.isBig) {
          newBlocks = newBlocks.filter((b) => b.id !== collisionY.id);
          newPlayer.score += 50;
          soundManager.brickBreak();
        } else {
          soundManager.bump();
        }
      }
    }
  }

  if (newPlayer.y + newPlayer.height >= GROUND_Y && !isOnBlock(newPlayer, newBlocks)) {
    if (newPlayer.y + newPlayer.height > GROUND_Y + BLOCK_SIZE * 3) {
      newPlayer.lives--;
      if (newPlayer.lives <= 0) {
        newGameStatus = 'gameover';
        soundManager.gameOver();
      } else {
        newPlayer = {
          ...createInitialPlayer(),
          lives: newPlayer.lives,
          score: newPlayer.score,
          coins: newPlayer.coins,
        };
        soundManager.death();
      }
    }
  }

  if (newPlayer.invincible) {
    newPlayer.invincibleTimer--;
    if (newPlayer.invincibleTimer <= 0) {
      newPlayer.invincible = false;
    }
  }

  newEnemies = newEnemies.map((enemy) => {
    if (!enemy.alive) return enemy;

    let newEnemy = { ...enemy };

    newEnemy.vy += GRAVITY;
    if (newEnemy.vy > MAX_FALL_SPEED) newEnemy.vy = MAX_FALL_SPEED;

    newEnemy.x += newEnemy.vx;
    const enemyCollisionX = checkBlockCollisions(newEnemy, newBlocks);
    if (enemyCollisionX) {
      if (newEnemy.vx > 0) {
        newEnemy.x = enemyCollisionX.x - newEnemy.width;
      } else {
        newEnemy.x = enemyCollisionX.x + enemyCollisionX.width;
      }
      newEnemy.vx = -newEnemy.vx;
      newEnemy.direction = (newEnemy.direction * -1) as 1 | -1;
    }

    if (newEnemy.x <= 0 || newEnemy.x + newEnemy.width >= WORLD_WIDTH) {
      newEnemy.vx = -newEnemy.vx;
      newEnemy.direction = (newEnemy.direction * -1) as 1 | -1;
    }

    newEnemy.y += newEnemy.vy;
    const enemyCollisionY = checkBlockCollisions(newEnemy, newBlocks);
    if (enemyCollisionY) {
      if (newEnemy.vy > 0) {
        newEnemy.y = enemyCollisionY.y - newEnemy.height;
        newEnemy.vy = 0;
      } else {
        newEnemy.y = enemyCollisionY.y + enemyCollisionY.height;
        newEnemy.vy = 0;
      }
    }

    if (newEnemy.y > GROUND_Y + 100) {
      newEnemy.alive = false;
    }

    return newEnemy;
  });

  for (let i = 0; i < newEnemies.length; i++) {
    const enemy = newEnemies[i];
    if (!enemy.alive) continue;

    if (checkCollision(newPlayer, enemy)) {
      if (newPlayer.vy > 0 && newPlayer.y + newPlayer.height < enemy.y + enemy.height / 2) {
        newEnemies[i] = { ...enemy, alive: false };
        newPlayer.vy = JUMP_FORCE / 2;
        newPlayer.score += 100;
        soundManager.stomp();
      } else if (!newPlayer.invincible) {
        if (newPlayer.isBig) {
          newPlayer = resizePlayer(newPlayer, false);
          newPlayer.hasFire = false;
          newPlayer.invincible = true;
          newPlayer.invincibleTimer = INVINCIBLE_DURATION;
          soundManager.bump();
        } else {
          newPlayer.lives--;
          if (newPlayer.lives <= 0) {
            newGameStatus = 'gameover';
            soundManager.gameOver();
          } else {
            newPlayer = {
              ...createInitialPlayer(),
              lives: newPlayer.lives,
              score: newPlayer.score,
              coins: newPlayer.coins,
              invincible: true,
              invincibleTimer: INVINCIBLE_DURATION,
            };
            soundManager.death();
          }
        }
      }
    }
  }

  newPowerUps = newPowerUps.map((pu) => {
    if (pu.collected) return pu;

    let newPu = { ...pu };

    if (pu.type !== 'coin') {
      newPu.vy += GRAVITY;
      if (newPu.vy > MAX_FALL_SPEED) newPu.vy = MAX_FALL_SPEED;

      newPu.x += newPu.vx;
      const puCollisionX = checkBlockCollisions(newPu, newBlocks);
      if (puCollisionX) {
        if (newPu.vx > 0) {
          newPu.x = puCollisionX.x - newPu.width;
        } else {
          newPu.x = puCollisionX.x + puCollisionX.width;
        }
        newPu.vx = -newPu.vx;
      }

      newPu.y += newPu.vy;
      const puCollisionY = checkBlockCollisions(newPu, newBlocks);
      if (puCollisionY) {
        if (newPu.vy > 0) {
          newPu.y = puCollisionY.y - newPu.height;
          newPu.vy = 0;
        }
      }

      if (newPu.y + newPu.height >= GROUND_Y) {
        newPu.y = GROUND_Y - newPu.height;
        newPu.vy = 0;
      }
    } else {
      newPu.y += newPu.vy;
      newPu.vy += GRAVITY / 2;
    }

    if (checkCollision(newPlayer, newPu)) {
      newPu.collected = true;
      if (pu.type === 'coin') {
        newPlayer.coins++;
        newPlayer.score += 100;
        soundManager.coin();
      } else if (pu.type === 'mushroom') {
        if (!newPlayer.isBig) {
          newPlayer = resizePlayer(newPlayer, true);
        }
        newPlayer.score += 1000;
        soundManager.powerUp();
      } else if (pu.type === 'flower') {
        if (!newPlayer.isBig) {
          newPlayer = resizePlayer(newPlayer, true);
        }
        newPlayer.hasFire = true;
        newPlayer.score += 1000;
        soundManager.powerUp();
      }
    }

    return newPu;
  });

  newFireballs = newFireballs.map((fb) => {
    if (!fb.active) return fb;

    let newFb = { ...fb };

    newFb.x += newFb.vx;
    newFb.vy += GRAVITY / 2;
    if (newFb.vy > MAX_FALL_SPEED) newFb.vy = MAX_FALL_SPEED;
    newFb.y += newFb.vy;

    const fbBlockCollision = checkBlockCollisions(newFb, newBlocks);
    if (fbBlockCollision) {
      newFb.active = false;
    }

    if (newFb.y + newFb.height >= GROUND_Y) {
      newFb.y = GROUND_Y - newFb.height;
      newFb.vy = -Math.abs(newFb.vy) * 0.5;
    }

    if (newFb.x < 0 || newFb.x > WORLD_WIDTH) {
      newFb.active = false;
    }

    for (const enemy of newEnemies) {
      if (enemy.alive && checkCollision(newFb, enemy)) {
        enemy.alive = false;
        newFb.active = false;
        newPlayer.score += 200;
        soundManager.stomp();
      }
    }

    return newFb;
  });

  newFireballs = newFireballs.filter((fb) => fb.active);
  newPowerUps = newPowerUps.filter((pu) => !pu.collected);
  newEnemies = newEnemies.filter((e) => e.alive || e.y < GROUND_Y + 50);

  const targetCameraX = newPlayer.x - GAME_WIDTH / 3;
  cameraX = Math.max(0, Math.min(WORLD_WIDTH - GAME_WIDTH, targetCameraX));

  if (newPlayer.x > WORLD_WIDTH - 100) {
    newGameStatus = 'win';
    soundManager.win();
  }

  return {
    ...state,
    player: newPlayer,
    blocks: newBlocks,
    enemies: newEnemies,
    powerUps: newPowerUps,
    fireballs: newFireballs,
    cameraX,
    gameStatus: newGameStatus,
  };
}

function checkBlockCollisions(
  obj: { x: number; y: number; width: number; height: number },
  blocks: Block[]
): Block | null {
  for (const block of blocks) {
    if (block.type === 'question' && block.hit) {
      if (obj.y + obj.height <= block.y || obj.y >= block.y + block.height) {
        continue;
      }
    }
    if (checkCollision(obj, block)) {
      return block;
    }
  }
  return null;
}

function isOnBlock(player: { x: number; y: number; width: number; height: number }, blocks: Block[]): boolean {
  const feet = {
    x: player.x + 2,
    y: player.y + player.height,
    width: player.width - 4,
    height: 2,
  };
  for (const block of blocks) {
    if (checkCollision(feet, block)) {
      return true;
    }
  }
  return false;
}
