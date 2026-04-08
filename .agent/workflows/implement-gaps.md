---
description: Implement Remaining Features from Gap Analysis Documents
---

# 1. Review Target Gaps
Review the specific gap document for the feature you intend to implement:
- `docs/restoration_gaps/wave_1_vfs_gaps.md`
- `docs/restoration_gaps/wave_2_engine_gaps.md`
- `docs/restoration_gaps/wave_3_gamification_gaps.md`

# 2. Plan Phase
// turbo
Create an `implementation_plan.md` artifact outlining the intended architectural changes. Make sure to:
- Avoid circular dependencies.
- Maintain POSIX structure and error behavior.
- Ensure state handling does not violate the existing isolated store architecture.

# 3. Execution Phase
Write code applying the changes strictly to the `main` branch. 
Update or create unit tests asserting the new behavior and verifying that previous tests continue to pass.

# 4. Verification
// turbo-all
Run `npm test` to ensure 100% pass rate across the codebase.
Manually verify standard string assertions (like `"Permission denied."`) match perfectly across the test suite.

# 5. Finalize
// turbo
1. Stage and commit the changes using `git add src/` and `git commit -m "feat(<scope>): <description>"`.
2. Update the corresponding gap analysis document in `docs/restoration_gaps/` to mark the feature as `✅ Complete` and remove it from the missing elements list.
