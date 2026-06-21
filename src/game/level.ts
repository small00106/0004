import { Block, Enemy, PowerUp, BlockType, EnemyType, PowerUpType, Player, GameState, Fireball } from './types';
import { BLOCK_SIZE, GROUND_Y, WORLD_WIDTH, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_BIG_HEIGHT, COIN_SIZE, GOOMBA_WIDTH, GOOMBA_HEIGHT, KOOPA_WIDTH, KOOPA_HEIGHT, FIREBALL_SIZE, MUSHROOM_SIZE, FLOWER_SIZE } from './constants';

let idCounter = 0;
const genId = () => `id_${++idCounter}`;

export function generateLevel(): { blocks: Block[]; enemies: Enemy[]; powerUps: PowerUp[] } {
  const blocks: Block[] = [];
  const enemies: Enemy[] = [];
  const powerUps: PowerUp[] = [];

  for (let x = 0; x < WORLD_WIDTH; x += BLOCK_SIZE) {
    if (
      (x >= 600 && x < 700) ||
      (x >= 1400 && x < 1500) ||
      (x >= 2400 && x < 2500)
    ) {
      continue;
    }
    blocks.push({
      id: genId(),
      x,
      y: GROUND_Y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: 'ground',
      hit: false,
    });
  }

  for (let x = 0; x < WORLD_WIDTH; x += BLOCK_SIZE) {
    if (
      (x >= 600 && x < 700) ||
      (x >= 1400 && x < 1500) ||
      (x >= 2400 && x < 2500)
    ) {
      continue;
    }
    blocks.push({
      id: genId(),
      x,
      y: GROUND_Y + BLOCK_SIZE,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type: 'ground',
      hit: false,
    });
  }

  addBrickRow(blocks, 256, GROUND_Y - BLOCK_SIZE * 4, 5, 'brick');
  addBrickRow(blocks, 288, GROUND_Y - BLOCK_SIZE * 4, 1, 'question', 'coin');
  addBrickRow(blocks, 320, GROUND_Y - BLOCK_SIZE * 4, 1, 'brick');

  addBrickRow(blocks, 416, GROUND_Y - BLOCK_SIZE * 2, 4, 'brick');
  addBrickRow(blocks, 448, GROUND_Y - BLOCK_SIZE * 2, 1, 'question', 'mushroom');

  addBrickRow(blocks, 768, GROUND_Y - BLOCK_SIZE * 3, 3, 'brick');
  addBrickRow(blocks, 800, GROUND_Y - BLOCK_SIZE * 5, 1, 'question', 'coin');
  addBrickRow(blocks, 832, GROUND_Y - BLOCK_SIZE * 5, 1, 'special', 'star');
  addBrickRow(blocks, 864, GROUND_Y - BLOCK_SIZE * 3, 1, 'brick');

  addBrickRow(blocks, 1024, GROUND_Y - BLOCK_SIZE * 4, 7, 'brick');
  addBrickRow(blocks, 1056, GROUND_Y - BLOCK_SIZE * 4, 1, 'question', 'flower');
  addBrickRow(blocks, 1120, GROUND_Y - BLOCK_SIZE * 4, 1, 'question', 'coin');
  addBrickRow(blocks, 1184, GROUND_Y - BLOCK_SIZE * 5, 1, 'special', 'speed');

  addBrickRow(blocks, 1600, GROUND_Y - BLOCK_SIZE * 2, 1, 'question', 'coin');
  addBrickRow(blocks, 1664, GROUND_Y - BLOCK_SIZE * 4, 1, 'question', 'mushroom');
  addBrickRow(blocks, 1696, GROUND_Y - BLOCK_SIZE * 4, 2, 'brick');
  addBrickRow(blocks, 1728, GROUND_Y - BLOCK_SIZE * 5, 1, 'question', 'coin');
  addBrickRow(blocks, 1760, GROUND_Y - BLOCK_SIZE * 5, 1, 'special', 'star');

  addBrickRow(blocks, 2048, GROUND_Y - BLOCK_SIZE * 3, 8, 'brick');
  addBrickRow(blocks, 2080, GROUND_Y - BLOCK_SIZE * 3, 1, 'question', 'flower');
  addBrickRow(blocks, 2176, GROUND_Y - BLOCK_SIZE * 4, 1, 'special', 'speed');

  addBrickRow(blocks, 384, GROUND_Y - BLOCK_SIZE * 4, 2, 'brick');
  addBrickRow(blocks, 512, GROUND_Y - BLOCK_SIZE * 3, 3, 'brick');
  addBrickRow(blocks, 544, GROUND_Y - BLOCK_SIZE * 5, 2, 'brick');
  addBrickRow(blocks, 1216, GROUND_Y - BLOCK_SIZE * 3, 3, 'brick');
  addBrickRow(blocks, 1248, GROUND_Y - BLOCK_SIZE * 5, 2, 'brick');
  addBrickRow(blocks, 1536, GROUND_Y - BLOCK_SIZE * 4, 2, 'brick');
  addBrickRow(blocks, 2304, GROUND_Y - BLOCK_SIZE * 4, 4, 'brick');
  addBrickRow(blocks, 2336, GROUND_Y - BLOCK_SIZE * 5, 2, 'brick');
  addBrickRow(blocks, 2560, GROUND_Y - BLOCK_SIZE * 3, 3, 'brick');

  addStairs(blocks, 2800, GROUND_Y, 8);

  blocks.push({
    id: genId(),
    x: 960,
    y: GROUND_Y - BLOCK_SIZE * 2,
    width: BLOCK_SIZE * 2,
    height: BLOCK_SIZE * 2,
    type: 'pipe',
    hit: false,
  });

  blocks.push({
    id: genId(),
    x: 1280,
    y: GROUND_Y - BLOCK_SIZE * 3,
    width: BLOCK_SIZE * 2,
    height: BLOCK_SIZE * 3,
    type: 'pipe',
    hit: false,
  });

  blocks.push({
    id: genId(),
    x: 1856,
    y: GROUND_Y - BLOCK_SIZE * 4,
    width: BLOCK_SIZE * 2,
    height: BLOCK_SIZE * 4,
    type: 'pipe',
    hit: false,
  });

  enemies.push(createEnemy('goomba', 420, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 780, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 820, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('koopa', 900, GROUND_Y - KOOPA_HEIGHT));
  enemies.push(createEnemy('goomba', 1100, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 1180, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('koopa', 1560, GROUND_Y - KOOPA_HEIGHT));
  enemies.push(createEnemy('goomba', 1780, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('koopa', 2000, GROUND_Y - KOOPA_HEIGHT));
  enemies.push(createEnemy('goomba', 2200, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 2280, GROUND_Y - GOOMBA_HEIGHT));
  enemies.push(createEnemy('koopa', 2350, GROUND_Y - KOOPA_HEIGHT));
  enemies.push(createEnemy('goomba', 2680, GROUND_Y - GOOMBA_HEIGHT));

  enemies.push(createEnemy('goomba', 416 + 16, GROUND_Y - BLOCK_SIZE * 2 - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 512 + 16, GROUND_Y - BLOCK_SIZE * 3 - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 1024 + 32, GROUND_Y - BLOCK_SIZE * 4 - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 2048 + 64, GROUND_Y - BLOCK_SIZE * 3 - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 2304 + 32, GROUND_Y - BLOCK_SIZE * 4 - GOOMBA_HEIGHT));
  enemies.push(createEnemy('goomba', 1696 + 16, GROUND_Y - BLOCK_SIZE * 4 - GOOMBA_HEIGHT));

  return { blocks, enemies, powerUps };
}

function addBrickRow(
  blocks: Block[],
  startX: number,
  y: number,
  count: number,
  type: BlockType,
  hasItem?: PowerUpType
) {
  for (let i = 0; i < count; i++) {
    blocks.push({
      id: genId(),
      x: startX + i * BLOCK_SIZE,
      y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
      type,
      hit: false,
      hasItem: i === Math.floor(count / 2) ? hasItem : undefined,
    });
  }
}

function addStairs(blocks: Block[], startX: number, groundY: number, steps: number) {
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j <= i; j++) {
      blocks.push({
        id: genId(),
        x: startX + i * BLOCK_SIZE,
        y: groundY - (j + 1) * BLOCK_SIZE,
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        type: 'ground',
        hit: false,
      });
    }
  }
}

function createEnemy(type: EnemyType, x: number, y: number): Enemy {
  const width = type === 'goomba' ? GOOMBA_WIDTH : KOOPA_WIDTH;
  const height = type === 'goomba' ? GOOMBA_HEIGHT : KOOPA_HEIGHT;
  return {
    id: genId(),
    x,
    y,
    width,
    height,
    type,
    alive: true,
    vx: -1.5,
    vy: 0,
    direction: -1,
  };
}

export function createInitialPlayer(): Player {
  return {
    id: 'player',
    x: 100,
    y: GROUND_Y - PLAYER_HEIGHT,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    direction: 1,
    isJumping: false,
    isBig: false,
    hasFire: false,
    invincible: false,
    invincibleTimer: 0,
    hasStar: false,
    starTimer: 0,
    hasSpeed: false,
    speedTimer: 0,
    lives: 3,
    coins: 0,
    score: 0,
  };
}

export function createPowerUp(type: PowerUpType, x: number, y: number): PowerUp {
  const size = type === 'coin' ? COIN_SIZE : type === 'mushroom' ? MUSHROOM_SIZE : type === 'flower' ? FLOWER_SIZE : 32;
  return {
    id: genId(),
    x,
    y,
    width: size,
    height: size,
    type,
    vx: type === 'coin' ? 0 : 2,
    vy: type === 'coin' ? -8 : 0,
    collected: false,
  };
}

export function createFireball(x: number, y: number, direction: 1 | -1): Fireball {
  return {
    id: genId(),
    x,
    y,
    width: FIREBALL_SIZE,
    height: FIREBALL_SIZE,
    vx: direction * 6,
    vy: 0,
    active: true,
  };
}

export function checkCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resizePlayer(player: Player, isBig: boolean): Player {
  const height = isBig ? PLAYER_BIG_HEIGHT : PLAYER_HEIGHT;
  const y = isBig ? player.y - (PLAYER_BIG_HEIGHT - PLAYER_HEIGHT) : player.y + (PLAYER_BIG_HEIGHT - PLAYER_HEIGHT);
  return {
    ...player,
    isBig,
    height,
    y: Math.min(y, GROUND_Y - height),
  };
}

export function getSolidBlocks(blocks: Block[]): Block[] {
  return blocks.filter((b) => {
    if ((b.type === 'question' || b.type === 'special') && b.hit) return false;
    return true;
  });
}
