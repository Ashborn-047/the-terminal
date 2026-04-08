# Wave 3 Gap Analysis: Gamification & Content Restoration

| Feature | Status | Current Code Location | Notes |
| :--- | :--- | :--- | :--- |
| **Exponential XP Curve** | ✅ Complete | `src/config/progression.ts` | Uses base 1.5 formula. Correctly integrated into store. |
| **Diminishing Returns** | ✅ Complete | `src/stores/gamificationStore.ts` | 50% / 25% / 10% XP reduction on 3-day cooldown. |
| **Streak Multipliers** | ✅ Complete | `gamificationStore.ts` | Rewarding consistent daily activity (1.1x to 1.3x). |
| **Hardcore Mode** | ✅ Complete | `src/stores/hardcoreStore.ts` | Permanent death XP reset and level recalibration. |
| **Unified Completion** | ✅ Complete | `gamificationStore.ts` (processLabCompletion) | Single atomic transaction for rewards and verification. |
| **Mastery Badges** | ✅ Complete | `src/components/terminal/Terminal.tsx` | Dynamic PS1 prompt badges (e.g., [KERNEL]). |
| **Streak Fire Emoji** | ✅ Complete | `Terminal.tsx` (getPrompt) | Dynamic fire emoji for streaks >= 3 days. |
| **Protected Paths** | ❌ Missing | `vfs.ts` | VFS does not yet strictly block writes to `/bin`, `/etc` in Hardcore mode. |
| **Daily Rotation** | ❌ Missing | N/A | Automated quest generation and daily refresh logic is pending. |
| **Mentor Mode** | ❌ Missing | N/A | SpacetimeDB real-time terminal mirroring and observation UI. |
| **Mastery Challenges** | ⚠️ Partial | `src/features/lab-engine/scenarios.ts` | Scenario composites exist, but UI level-gating is missing. |

---

### Wave 3 Summary
The economy and risk mechanics are fully functional. The high-risk "Hardcore" mode is the centerpiece of this wave. Key missing items are the **Protected Path Enforcement** (to prevent accidental soft-locks) and the **Daily Quest Store** for long-term retention.
