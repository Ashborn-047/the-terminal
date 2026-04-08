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
