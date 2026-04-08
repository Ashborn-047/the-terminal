// src/types/hardcore.ts
export interface HardcoreProfile {
    isActive: boolean;
    deathCount: number;
    currentSessionStarted: number; // timestamp
    protectedPaths: string[]; // ['/bin', '/boot', '/lib', '/etc']
}
