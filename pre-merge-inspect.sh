#!/bin/bash
set -euo pipefail

# Configuration
REMOTE="origin"
BRANCH="linux-simulator-critique-and-fixes-9707972783365951732"
BASE_BRANCH="main"
REPORT_FILE="pre-merge-report.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Pre-Merge Inspection Script ===${NC}"
echo "Remote: $REMOTE/$BRANCH"
echo "Target: $BASE_BRANCH"
echo "Report will be saved to: $REPORT_FILE"
echo ""

# 1. Save current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"
if [[ "$CURRENT_BRANCH" != "$BASE_BRANCH" ]]; then
    echo -e "${RED}Warning: You are not on $BASE_BRANCH. Switching to $BASE_BRANCH...${NC}"
    git checkout "$BASE_BRANCH"
fi

# 2. Fetch remote branch
echo -e "${YELLOW}Fetching $REMOTE/$BRANCH ...${NC}"
git fetch "$REMOTE" "$BRANCH"

# 3. Generate diff statistics
echo -e "${YELLOW}Generating change statistics...${NC}"
{
    echo "=== Pre-Merge Inspection Report ==="
    echo "Generated: $(date)"
    echo "Remote branch: $REMOTE/$BRANCH"
    echo "Base branch: $BASE_BRANCH"
    echo ""
    echo "--- Overall change statistics ---"
    git diff --stat "$BASE_BRANCH" "$REMOTE/$BRANCH"
    echo ""
    echo "--- List of changed files ---"
    git diff --name-only "$BASE_BRANCH" "$REMOTE/$BRANCH"
    echo ""
} > "$REPORT_FILE"

# 4. Check if lsof.ts was deleted, moved, or renamed
echo -e "${YELLOW}Checking lsof.ts status...${NC}"
LSOF_STATUS=$(git diff --diff-filter=D --name-only "$BASE_BRANCH" "$REMOTE/$BRANCH" | grep -E "lsof\.ts$" || true)
if [[ -n "$LSOF_STATUS" ]]; then
    echo -e "${RED}  lsof.ts was DELETED in remote branch.${NC}"
    echo "  Action: Restore from local branch after merge." >> "$REPORT_FILE"
else
    # Check if it was moved/renamed
    LSOF_MOVED=$(git diff --diff-filter=R --name-only "$BASE_BRANCH" "$REMOTE/$BRANCH" | grep -E "lsof\.ts$" || true)
    if [[ -n "$LSOF_MOVED" ]]; then
        echo -e "${YELLOW}  lsof.ts was MOVED/RENAMED in remote branch.${NC}"
        echo "  Action: Identify new name/path." >> "$REPORT_FILE"
    else
        echo -e "${GREEN}  lsof.ts was NOT deleted or moved.${NC}"
        echo "  lsof.ts is unchanged or modified in place." >> "$REPORT_FILE"
    fi
fi

# 5. Check package.json / package-lock.json conflicts
echo -e "${YELLOW}Checking package dependency changes...${NC}"
{
    echo ""
    echo "--- Package.json changes (if any) ---"
    git diff "$BASE_BRANCH" "$REMOTE/$BRANCH" -- package.json package-lock.json 2>/dev/null || echo "No package.json or package-lock.json changes."
} >> "$REPORT_FILE"

# 6. Identify files changed in both branches (potential merge conflicts)
echo -e "${YELLOW}Identifying potential merge conflicts...${NC}"
# Get files changed on remote relative to merge base
MERGE_BASE=$(git merge-base "$BASE_BRANCH" "$REMOTE/$BRANCH")
REMOTE_CHANGES=$(git diff --name-only "$MERGE_BASE" "$REMOTE/$BRANCH")
LOCAL_CHANGES=$(git diff --name-only "$MERGE_BASE" "$BASE_BRANCH")

CONFLICT_CANDIDATES=$(comm -12 <(echo "$LOCAL_CHANGES" | sort) <(echo "$REMOTE_CHANGES" | sort))
{
    echo ""
    echo "--- Files changed in BOTH branches (potential conflicts) ---"
    if [[ -z "$CONFLICT_CANDIDATES" ]]; then
        echo "None detected."
    else
        echo "$CONFLICT_CANDIDATES"
    fi
} >> "$REPORT_FILE"

# 7. Special check for test files
TEST_CONFLICTS=$(echo "$CONFLICT_CANDIDATES" | grep -E "\.test\.ts$" || true)
{
    echo ""
    echo "--- Test files with potential conflicts ---"
    if [[ -n "$TEST_CONFLICTS" ]]; then
        echo "$TEST_CONFLICTS"
        echo "Action: Manually merge test assertions from both branches."
    else
        echo "No test file conflicts detected."
    fi
} >> "$REPORT_FILE"

# 8. Check for new files that might affect observability (strace, notifySyscall)
echo -e "${YELLOW}Checking for new observability-related files...${NC}"
OBSERVABILITY_FILES=$(git diff --name-only "$BASE_BRANCH" "$REMOTE/$BRANCH" | grep -E "(strace|notifySyscall|syscall|trace|observability)" || true)
{
    echo ""
    echo "--- New or modified observability-related files ---"
    if [[ -n "$OBSERVABILITY_FILES" ]]; then
        echo "$OBSERVABILITY_FILES"
    else
        echo "None detected."
    fi
} >> "$REPORT_FILE"

# 9. Summary and recommendations
echo -e "${GREEN}=== Inspection Complete ===${NC}"
echo "Report saved to $REPORT_FILE"
echo ""
echo -e "${YELLOW}Recommendations:${NC}"
if [[ -n "$LSOF_STATUS" ]]; then
    echo "  - lsof.ts was deleted in remote. You will need to restore it after merge."
fi
if [[ -n "$CONFLICT_CANDIDATES" ]]; then
    echo "  - The following files will likely have merge conflicts:"
    echo "$CONFLICT_CANDIDATES" | sed 's/^/      /'
    echo "  - Resolve them manually using the strategy in your enhanced plan."
fi
if git diff "$BASE_BRANCH" "$REMOTE/$BRANCH" -- package.json | grep -q "^[+-]" 2>/dev/null; then
    echo "  - package.json has changed. Review dependencies and run 'npm install' after merge."
fi
echo ""
echo "You can now review $REPORT_FILE and proceed with merge or abort."

# Optional: Return to original branch if we switched
if [[ "$CURRENT_BRANCH" != "$BASE_BRANCH" ]]; then
    echo -e "${YELLOW}Returning to original branch: $CURRENT_BRANCH${NC}"
    git checkout "$CURRENT_BRANCH"
fi
