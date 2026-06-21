import React from 'react';
import { COLORS, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_BIG_HEIGHT, BLOCK_SIZE, COIN_SIZE, GOOMBA_WIDTH, GOOMBA_HEIGHT, KOOPA_WIDTH, KOOPA_HEIGHT, FIREBALL_SIZE, MUSHROOM_SIZE, FLOWER_SIZE } from './constants';

interface MarioProps {
  x: number;
  y: number;
  direction: 1 | -1;
  isBig: boolean;
  hasFire: boolean;
  isJumping: boolean;
  invincible: boolean;
  hasStar?: boolean;
  hasSpeed?: boolean;
}

export const Mario: React.FC<MarioProps> = ({ x, y, direction, isBig, hasFire, isJumping, invincible, hasStar = false, hasSpeed = false }) => {
  const height = isBig ? PLAYER_BIG_HEIGHT : PLAYER_HEIGHT;
  const hatColor = hasFire ? '#ffffff' : COLORS.mario;
  const overallColor = hasFire ? '#ffffff' : '#0000ff';
  const opacity = invincible && !hasStar ? 0.5 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${direction}, 1) ${direction === -1 ? `translate(${-PLAYER_WIDTH}, 0)` : ''}`} style={{ opacity }}>
      {hasStar && (
        <>
          <circle cx={PLAYER_WIDTH / 2} cy={height / 2} r={PLAYER_WIDTH * 0.8} fill="#ffff00" opacity="0.25" />
          <circle cx={PLAYER_WIDTH / 2} cy={height / 2} r={PLAYER_WIDTH * 0.6} fill="#ff6600" opacity="0.2" />
        </>
      )}
      {hasSpeed && (
        <>
          <line x1="-10" y1={height / 2} x2="-2" y2={height / 2} stroke="#00ffff" strokeWidth="2" />
          <line x1="-14" y1={height / 3} x2="-4" y2={height / 3} stroke="#00ffff" strokeWidth="2" opacity="0.7" />
          <line x1="-14" y1={height * 2 / 3} x2="-4" y2={height * 2 / 3} stroke="#00ffff" strokeWidth="2" opacity="0.7" />
        </>
      )}
      <rect x="6" y="0" width="20" height="8" fill={hatColor} />
      <rect x="2" y="8" width="28" height="4" fill={hatColor} />
      <rect x="8" y="12" width="16" height="12" fill={COLORS.marioSkin} />
      <rect x="22" y="14" width="4" height="4" fill="#000" />
      <rect x="10" y="24" width="12" height="4" fill={COLORS.marioHair} />
      {isBig && (
        <>
          <rect x="6" y="28" width="20" height="16" fill={overallColor} />
          <rect x="2" y="32" width="6" height="10" fill={overallColor} />
          <rect x="24" y="32" width="6" height="10" fill={overallColor} />
          <rect x="10" y="32" width="12" height="6" fill="#ff0000" />
          <rect x="8" y="44" width="8" height="12" fill={COLORS.marioHair} />
          <rect x="16" y="44" width="8" height="12" fill={COLORS.marioHair} />
        </>
      )}
      {!isBig && (
        <>
          <rect x="4" y="26" width="24" height="10" fill={overallColor} />
          <rect x="8" y="30" width="16" height="6" fill="#ff0000" />
          <rect x="6" y="36" width="8" height="4" fill={COLORS.marioHair} />
          <rect x="18" y="36" width="8" height="4" fill={COLORS.marioHair} />
        </>
      )}
    </g>
  );
};

interface BlockProps {
  x: number;
  y: number;
  type: 'brick' | 'question' | 'ground' | 'pipe' | 'special';
  hit?: boolean;
}

export const Block: React.FC<BlockProps> = ({ x, y, type, hit = false }) => {
  if (type === 'ground') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect width={BLOCK_SIZE} height={BLOCK_SIZE} fill={COLORS.ground} stroke={COLORS.brickDark} strokeWidth="1" />
        <rect y="0" width={BLOCK_SIZE} height="6" fill={COLORS.groundTop} />
        <rect x="4" y="10" width="6" height="4" fill={COLORS.brickDark} />
        <rect x="16" y="18" width="8" height="4" fill={COLORS.brickDark} />
        <rect x="6" y="24" width="10" height="4" fill={COLORS.brickDark} />
      </g>
    );
  }

  if (type === 'brick') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect width={BLOCK_SIZE} height={BLOCK_SIZE} fill={COLORS.brick} stroke="#000" strokeWidth="1" />
        <rect y="15" width={BLOCK_SIZE} height="2" fill="#000" />
        <rect x="15" y="0" width="2" height="16" fill="#000" />
        <rect x="7" y="17" width="2" height="15" fill="#000" />
        <rect x="23" y="17" width="2" height="15" fill="#000" />
      </g>
    );
  }

  if (type === 'question') {
    const color = hit ? COLORS.questionDark : COLORS.question;
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect width={BLOCK_SIZE} height={BLOCK_SIZE} fill={color} stroke="#000" strokeWidth="1" />
        <rect x="2" y="2" width="28" height="28" fill="none" stroke="#fff" strokeWidth="1" />
        {!hit && (
          <text x="16" y="24" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">?</text>
        )}
      </g>
    );
  }

  if (type === 'special') {
    const color = hit ? '#663399' : '#9932cc';
    const glowColor = hit ? 'none' : '#ff00ff';
    return (
      <g transform={`translate(${x}, ${y})`}>
        {!hit && (
          <rect x="-2" y="-2" width={BLOCK_SIZE + 4} height={BLOCK_SIZE + 4} fill={glowColor} opacity="0.3" />
        )}
        <rect width={BLOCK_SIZE} height={BLOCK_SIZE} fill={color} stroke="#000" strokeWidth="1" />
        <rect x="2" y="2" width="28" height="28" fill="none" stroke="#ffff00" strokeWidth="1" />
        {!hit && (
          <>
            <polygon
              points="16,4 19,12 28,12 21,18 24,27 16,22 8,27 11,18 4,12 13,12"
              fill="#ffff00"
              stroke="#fff"
              strokeWidth="0.5"
            />
          </>
        )}
      </g>
    );
  }

  if (type === 'pipe') {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect x="0" y="0" width={BLOCK_SIZE * 2} height={BLOCK_SIZE} fill={COLORS.pipe} stroke="#000" strokeWidth="1" />
        <rect x="2" y="2" width={BLOCK_SIZE * 2 - 4} height={BLOCK_SIZE - 4} fill="none" stroke={COLORS.pipeDark} strokeWidth="2" />
        <rect x="4" y="8" width={BLOCK_SIZE * 2 - 8} height={BLOCK_SIZE - 16} fill={COLORS.pipeDark} opacity="0.3" />
      </g>
    );
  }

  return null;
};

interface CoinProps {
  x: number;
  y: number;
  spinFrame: number;
}

export const Coin: React.FC<CoinProps> = ({ x, y, spinFrame }) => {
  const scale = Math.abs(Math.sin(spinFrame * 0.2));
  return (
    <g transform={`translate(${x + COIN_SIZE / 2}, ${y + COIN_SIZE / 2}) scale(${Math.max(scale, 0.3)}, 1)`}>
      <circle r={COIN_SIZE / 2} fill={COLORS.coin} stroke={COLORS.coinDark} strokeWidth="2" />
      <circle r={COIN_SIZE / 2 - 4} fill="none" stroke={COLORS.coinDark} strokeWidth="1" />
      <text y="5" textAnchor="middle" fill={COLORS.coinDark} fontSize="10" fontWeight="bold">$</text>
    </g>
  );
};

interface MushroomProps {
  x: number;
  y: number;
}

export const Mushroom: React.FC<MushroomProps> = ({ x, y }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={MUSHROOM_SIZE / 2} cy={MUSHROOM_SIZE / 3} rx={MUSHROOM_SIZE / 2} ry={MUSHROOM_SIZE / 3} fill={COLORS.mushroom} />
      <circle cx={MUSHROOM_SIZE / 3} cy={MUSHROOM_SIZE / 4} r="4" fill={COLORS.mushroomSpots} />
      <circle cx={(MUSHROOM_SIZE * 2) / 3} cy={MUSHROOM_SIZE / 3} r="3" fill={COLORS.mushroomSpots} />
      <circle cx={MUSHROOM_SIZE / 2} cy={MUSHROOM_SIZE / 5} r="2" fill={COLORS.mushroomSpots} />
      <rect x="8" y={MUSHROOM_SIZE / 3} width="16" height={MUSHROOM_SIZE / 2} fill={COLORS.mushroomSpots} />
      <circle cx="12" cy={MUSHROOM_SIZE / 2} r="2" fill="#000" />
      <circle cx="20" cy={MUSHROOM_SIZE / 2} r="2" fill="#000" />
    </g>
  );
};

interface FlowerProps {
  x: number;
  y: number;
  frame: number;
}

export const Flower: React.FC<FlowerProps> = ({ x, y, frame }) => {
  const rotation = (frame * 5) % 360;
  return (
    <g transform={`translate(${x + FLOWER_SIZE / 2}, ${y + FLOWER_SIZE / 2})`}>
      <g transform={`rotate(${rotation})`}>
        {[0, 90, 180, 270].map((angle) => (
          <ellipse key={angle} cx="0" cy="-10" rx="6" ry="10" fill={COLORS.flower} transform={`rotate(${angle})`} />
        ))}
      </g>
      <circle r="6" fill={COLORS.flowerCenter} />
      <circle r="3" fill="#ff6b00" />
    </g>
  );
};

interface StarProps {
  x: number;
  y: number;
  frame: number;
}

export const Star: React.FC<StarProps> = ({ x, y, frame }) => {
  const rotation = (frame * 8) % 360;
  const pulse = 1 + Math.sin(frame * 0.2) * 0.1;
  return (
    <g transform={`translate(${x + 16}, ${y + 16})`}>
      <circle r="18" fill="#ffff00" opacity="0.3" />
      <g transform={`rotate(${rotation}) scale(${pulse})`}>
        <polygon
          points="0,-14 4,-4 14,-4 6,3 9,13 0,7 -9,13 -6,3 -14,-4 -4,-4"
          fill="#ffff00"
          stroke="#ff8c00"
          strokeWidth="1"
        />
        <polygon
          points="0,-10 2,-3 9,-3 4,2 6,9 0,5 -6,9 -4,2 -9,-3 -2,-3"
          fill="#fffacd"
          opacity="0.6"
        />
      </g>
    </g>
  );
};

interface SpeedBootsProps {
  x: number;
  y: number;
  frame: number;
}

export const SpeedBoots: React.FC<SpeedBootsProps> = ({ x, y, frame }) => {
  const bobOffset = Math.sin(frame * 0.15) * 2;
  return (
    <g transform={`translate(${x}, ${y + bobOffset})`}>
      <ellipse cx="16" cy="20" rx="18" ry="6" fill="#00ffff" opacity="0.3" />
      <path d="M4,16 L4,26 Q4,30 10,30 L26,30 Q30,30 30,26 L30,20 L20,20 L18,16 L4,16 Z" fill="#00bfff" stroke="#000" strokeWidth="1" />
      <path d="M6,18 L6,26 Q6,28 10,28 L24,28 L24,22 L18,22 L16,18 Z" fill="#00ffff" opacity="0.5" />
      <line x1="-4" y1="14" x2="4" y2="18" stroke="#ffff00" strokeWidth="2" />
      <line x1="-6" y1="20" x2="2" y2="22" stroke="#ffff00" strokeWidth="2" />
      <line x1="-4" y1="26" x2="4" y2="26" stroke="#ffff00" strokeWidth="2" />
      <text x="17" y="26" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">S</text>
    </g>
  );
};

interface GoombaProps {
  x: number;
  y: number;
  alive: boolean;
  direction: 1 | -1;
  frame: number;
}

export const Goomba: React.FC<GoombaProps> = ({ x, y, alive, direction, frame }) => {
  if (!alive) {
    return (
      <g transform={`translate(${x}, ${y + GOOMBA_HEIGHT - 8})`}>
        <ellipse cx={GOOMBA_WIDTH / 2} cy="4" rx={GOOMBA_WIDTH / 2} ry="4" fill={COLORS.goomba} />
        <text x={GOOMBA_WIDTH / 2} y="8" textAnchor="middle" fill="#000" fontSize="10">x_x</text>
      </g>
    );
  }

  const walkOffset = Math.sin(frame * 0.3) * 2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={GOOMBA_WIDTH / 2} cy={GOOMBA_HEIGHT / 2} rx={GOOMBA_WIDTH / 2 - 2} ry={GOOMBA_HEIGHT / 2 - 4} fill={COLORS.goomba} />
      <ellipse cx={GOOMBA_WIDTH / 2} cy={GOOMBA_HEIGHT / 3} rx={GOOMBA_WIDTH / 2 - 4} ry="6" fill="#d2691e" />
      <circle cx={GOOMBA_WIDTH / 3} cy={GOOMBA_HEIGHT / 2.5} r="5" fill="#fff" />
      <circle cx={(GOOMBA_WIDTH * 2) / 3} cy={GOOMBA_HEIGHT / 2.5} r="5" fill="#fff" />
      <circle cx={GOOMBA_WIDTH / 3 + direction * 1} cy={GOOMBA_HEIGHT / 2.5} r="3" fill="#000" />
      <circle cx={(GOOMBA_WIDTH * 2) / 3 + direction * 1} cy={GOOMBA_HEIGHT / 2.5} r="3" fill="#000" />
      <rect x="4" y={GOOMBA_HEIGHT - 8 + walkOffset} width="8" height="8" fill={COLORS.goombaDark} />
      <rect x={GOOMBA_WIDTH - 12} y={GOOMBA_HEIGHT - 8 - walkOffset} width="8" height="8" fill={COLORS.goombaDark} />
    </g>
  );
};

interface KoopaProps {
  x: number;
  y: number;
  alive: boolean;
  direction: 1 | -1;
  frame: number;
}

export const Koopa: React.FC<KoopaProps> = ({ x, y, alive, direction, frame }) => {
  const walkOffset = Math.sin(frame * 0.25) * 2;

  return (
    <g transform={`translate(${x}, ${y}) scale(${direction}, 1) ${direction === -1 ? `translate(${-KOOPA_WIDTH}, 0)` : ''}`}>
      {alive && (
        <>
          <ellipse cx={KOOPA_WIDTH / 2} cy={KOOPA_HEIGHT / 2} rx={KOOPA_WIDTH / 2 - 2} ry={KOOPA_HEIGHT / 2 - 4} fill={COLORS.koopaShell} />
          <ellipse cx={KOOPA_WIDTH / 2} cy={KOOPA_HEIGHT / 2} rx={KOOPA_WIDTH / 3} ry={KOOPA_HEIGHT / 3} fill="#6b4423" />
          <circle cx={KOOPA_WIDTH / 2} cy={KOOPA_HEIGHT / 2} r="4" fill="#8b6914" />
          <ellipse cx={KOOPA_WIDTH - 8} cy={KOOPA_HEIGHT / 3} rx="10" ry="12" fill={COLORS.koopa} />
          <circle cx={KOOPA_WIDTH - 4} cy={KOOPA_HEIGHT / 3 - 2} r="4" fill="#fff" />
          <circle cx={KOOPA_WIDTH - 3} cy={KOOPA_HEIGHT / 3 - 2} r="2" fill="#000" />
          <rect x="4" y={KOOPA_HEIGHT - 10 + walkOffset} width="8" height="10" fill={COLORS.koopa} />
          <rect x={KOOPA_WIDTH - 16} y={KOOPA_HEIGHT - 10 - walkOffset} width="8" height="10" fill={COLORS.koopa} />
        </>
      )}
      {!alive && (
        <>
          <ellipse cx={KOOPA_WIDTH / 2} cy={KOOPA_HEIGHT - 8} rx={KOOPA_WIDTH / 2} ry="10" fill={COLORS.koopaShell} />
          <ellipse cx={KOOPA_WIDTH / 2} cy={KOOPA_HEIGHT - 8} rx={KOOPA_WIDTH / 3} ry="6" fill="#6b4423" />
          <circle cx={KOOPA_WIDTH / 2} cy={KOOPA_HEIGHT - 8} r="3" fill="#8b6914" />
          <text x={KOOPA_WIDTH / 2} y={KOOPA_HEIGHT - 5} textAnchor="middle" fill="#fff" fontSize="8">u_u</text>
        </>
      )}
    </g>
  );
};

interface FireballProps {
  x: number;
  y: number;
  frame: number;
}

export const Fireball: React.FC<FireballProps> = ({ x, y, frame }) => {
  const pulse = 1 + Math.sin(frame * 0.5) * 0.2;
  return (
    <g transform={`translate(${x + FIREBALL_SIZE / 2}, ${y + FIREBALL_SIZE / 2})`}>
      <circle r={FIREBALL_SIZE / 2 * pulse} fill={COLORS.fireball} opacity="0.6" />
      <circle r={FIREBALL_SIZE / 2.5 * pulse} fill={COLORS.fireball} />
      <circle r={FIREBALL_SIZE / 4 * pulse} fill={COLORS.fireballCore} />
    </g>
  );
};

interface CloudProps {
  x: number;
  y: number;
  scale?: number;
}

export const Cloud: React.FC<CloudProps> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="20" ry="12" fill="#fff" />
      <ellipse cx="18" cy="-4" rx="16" ry="10" fill="#fff" />
      <ellipse cx="-16" cy="2" rx="14" ry="9" fill="#fff" />
      <ellipse cx="8" cy="6" rx="18" ry="8" fill="#fff" />
    </g>
  );
};

interface HillProps {
  x: number;
  y: number;
  size: number;
}

export const Hill: React.FC<HillProps> = ({ x, y, size }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="0" rx={size} ry={size * 0.6} fill="#228b22" />
      <ellipse cx="0" cy={-size * 0.2} rx={size * 0.8} ry={size * 0.4} fill="#32cd32" />
    </g>
  );
};
