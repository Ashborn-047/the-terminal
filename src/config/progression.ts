// src/config/progression.ts

export const XP_BASE = 1.5;
export const XP_MULTIPLIER = 100;

export const STREAK_BONUS_TIERS = [
  { minDays: 3, maxDays: 5, multiplier: 1.1 },
  { minDays: 6, maxDays: 10, multiplier: 1.2 },
  { minDays: 11, maxDays: Infinity, multiplier: 1.3 },
];

export const HARDCORE_XP_MULTIPLIER = 1.5;

export const BASE_LAB_XP = 250;

// PR 8: Difficulty mode system
export type DifficultyMode = 'BEGINNER' | 'NORMAL' | 'HARD';

export const DIFFICULTY_MULTIPLIERS: Record<DifficultyMode, number> = {
  BEGINNER: 1.0,
  NORMAL: 1.5,
  HARD: 3.0,
};

export const HINT_PENALTIES = [10, 25, 50]; // Level 1, 2, 3

export const SOLUTION_COST_HARD_MODE = 200;
