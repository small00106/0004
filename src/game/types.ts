export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject extends Position, Size {
  id: string;
}

export type BlockType = 'brick' | 'question' | 'ground' | 'pipe';
export type EnemyType = 'goomba' | 'koopa';
export type PowerUpType = 'coin' | 'mushroom' | 'flower';

export interface Block extends GameObject {
  type: BlockType;
  hit: boolean;
  hasItem?: PowerUpType;
}

export interface Enemy extends GameObject, Velocity {
  type: EnemyType;
  alive: boolean;
  direction: 1 | -1;
}

export interface PowerUp extends GameObject, Velocity {
  type: PowerUpType;
  collected: boolean;
}

export interface Fireball extends GameObject, Velocity {
  active: boolean;
}

export interface Player extends GameObject, Velocity {
  direction: 1 | -1;
  isJumping: boolean;
  isBig: boolean;
  hasFire: boolean;
  invincible: boolean;
  invincibleTimer: number;
  lives: number;
  coins: number;
  score: number;
}

export interface GameState {
  player: Player;
  blocks: Block[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  fireballs: Fireball[];
  cameraX: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'gameover' | 'win';
  groundY: number;
  worldWidth: number;
  levelHeight: number;
}

export interface Keys {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  fire: boolean;
}
