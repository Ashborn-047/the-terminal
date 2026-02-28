# Lab Engine Documentation

**Version:** 1.0  
**Last Updated:** 2025-04-08  
**Owner:** Antigravity (Agentic Tool)  
**Status:** Approved for Implementation  

---

## 1. Overview

The Lab Engine is the core gameplay system of **The Terminal**. It manages lab definitions, user progress, verification logic, and the integration between the Virtual File System (VFS) and the command execution. The engine supports two lab types:

- **Guided Labs:** Step‑by‑step tutorials that verify the exact command entered.
- **DIY Labs:** Goal‑based challenges that verify the final state of the VFS or specific conditions.

---

## 2. Lab Definition Schema

Labs are defined in JSON files stored in `src/data/labs/`. Each lab file corresponds to one lab.

### 2.1 JSON Structure

```json
{
  "id": "filesystem-basics-1",
  "module": 1,
  "title": "Filesystem Basics: Navigation",
  "description": "Learn to navigate the Linux filesystem using `pwd`, `ls`, and `cd`.",
  "type": "guided",
  "xpReward": 50,
  "prerequisites": [],
  "initialVFS": "default",  // or path to custom VFS snapshot
  "steps": [
    {
      "id": "step-1",
      "instruction": "Check your current directory using `pwd`",
      "expectedCommand": "pwd",
      "hint": "Type `pwd` and press Enter"
    },
    {
      "id": "step-2",
      "instruction": "List the files in the current directory using `ls`",
      "expectedCommand": "ls",
      "hint": "Try `ls` to see what's here"
    }
  ],
  "completionMessage": "Great! You've mastered basic navigation."
}
```

### 2.2 DIY Lab Example

```json
{
  "id": "hpc-env-setup-1",
  "module": 9,
  "title": "HPC Environment Setup",
  "description": "Create the required directory structure for a simulation run.",
  "type": "diy",
  "xpReward": 150,
  "prerequisites": ["filesystem-basics-1"],
  "initialVFS": "hpc-base",
  "verification": {
    "conditions": [
      {
        "type": "directory_exists",
        "path": "/home/guest/simulation/data",
        "message": "Create the simulation/data directory"
      },
      {
        "type": "directory_exists",
        "path": "/home/guest/simulation/scripts",
        "message": "Create the simulation/scripts directory"
      },
      {
        "type": "file_exists",
        "path": "/home/guest/simulation/run.sh",
        "message": "Create an empty run.sh script file"
      },
      {
        "type": "file_contains",
        "path": "/home/guest/simulation/README.md",
        "content": "Simulation files",
        "message": "Create README.md with the text 'Simulation files'"
      }
    ]
  },
  "hints": [
    "You'll need `mkdir` and `touch` commands",
    "Use `mkdir -p` to create parent directories automatically"
  ],
  "completionMessage": "Perfect! Your HPC environment is ready."
}
```

### 2.3 Field Definitions

| **Field** | **Type** | **Description** |
|-----------|----------|-----------------|
| `id` | string | Unique identifier (kebab-case) |
| `module` | number | Module number (1–18) |
| `title` | string | Display title |
| `description` | string | Brief explanation |
| `type` | "guided" \| "diy" | Lab type |
| `xpReward` | number | XP awarded on completion |
| `prerequisites` | string[] | Lab IDs that must be completed first |
| `initialVFS` | string | VFS snapshot name (e.g., "default", "hpc-base") |
| `steps` | Step[] | Required for guided labs |
| `verification` | Verification | Required for DIY labs |
| `hints` | string[] | Progressive hints (optional) |
| `completionMessage` | string | Shown when lab is completed |

### 2.4 Step Object (Guided)

| **Field** | **Type** | **Description** |
|-----------|----------|-----------------|
| `id` | string | Step identifier |
| `instruction` | string | What the user should do |
| `expectedCommand` | string | Exact command to match |
| `hint` | string | Optional hint for this step |

### 2.5 Verification Object (DIY)

| **Field** | **Type** | **Description** |
|-----------|----------|-----------------|
| `conditions` | Condition[] | List of conditions to check |

### 2.6 Condition Types

| **Type** | **Fields** | **Description** |
|----------|------------|-----------------|
| `directory_exists` | `path: string` | Check if directory exists |
| `file_exists` | `path: string` | Check if file exists |
| `file_contains` | `path: string`, `content: string` | Check if file contains exact string |
| `file_matches_regex` | `path: string`, `pattern: string` | Check if file matches regex |
| `permission_equals` | `path: string`, `mode: string` | Check permissions (e.g., "755") |
| `owner_equals` | `path: string`, `owner: string` | Check file owner |
| `group_equals` | `path: string`, `group: string` | Check file group |
| `custom` | `validator: string` | Custom JavaScript function name |

---

## 3. Lab Engine Core

### 3.1 State Management (Zustand)

**`stores/labStore.ts`**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lab, LabProgress } from '../types/lab';

interface LabState {
  // All lab definitions (loaded from JSON)
  labs: Map<string, Lab>;
  
  // Current lab session
  currentLabId: string | null;
  currentStepIndex: number;
  labProgress: Record<string, LabProgress>; // labId -> progress
  
  // Actions
  loadLabs: () => Promise<void>;
  startLab: (labId: string) => void;
  completeStep: (labId: string, stepId: string) => void;
  completeLab: (labId: string) => void;
  resetLab: (labId: string) => void;
  getLabStatus: (labId: string) => 'locked' | 'available' | 'in-progress' | 'completed';
}

interface LabProgress {
  labId: string;
  startedAt: number;
  completedAt?: number;
  completedSteps: string[]; // step IDs for guided labs
  verified: boolean; // for DIY labs
}
```

### 3.2 Lab Loader

Load all lab JSON files at startup.

**`lib/lab/loader.ts`**
```typescript
import labFiles from '../data/labs/*.json'; // Vite glob import

export async function loadLabs(): Promise<Map<string, Lab>> {
  const labs = new Map();
  for (const file of labFiles) {
    const lab = file as Lab;
    labs.set(lab.id, lab);
  }
  return labs;
}
```

### 3.3 Verification Engine

#### Guided Lab Verification

```typescript
export function verifyGuidedStep(
  lab: Lab,
  currentStepIndex: number,
  command: string
): { success: boolean; nextStep?: Step; completed: boolean } {
  const step = lab.steps[currentStepIndex];
  if (!step) return { success: false, completed: false };
  
  // Normalize command (trim, remove extra spaces)
  const normalizedCommand = command.trim().replace(/\s+/g, ' ');
  const expected = step.expectedCommand.trim();
  
  if (normalizedCommand === expected) {
    const nextStepIndex = currentStepIndex + 1;
    const completed = nextStepIndex >= lab.steps.length;
    return {
      success: true,
      nextStep: lab.steps[nextStepIndex],
      completed
    };
  }
  
  return { success: false, completed: false };
}
```

#### DIY Lab Verification

```typescript
import { VFS } from '../vfs/VFS';

export function verifyDIYLab(lab: Lab, vfs: VFS): {
  success: boolean;
  failedConditions: string[];
} {
  const failed: string[] = [];
  
  for (const condition of lab.verification.conditions) {
    const result = checkCondition(condition, vfs);
    if (!result.passed) {
      failed.push(condition.message || result.message);
    }
  }
  
  return {
    success: failed.length === 0,
    failedConditions: failed
  };
}

function checkCondition(condition: any, vfs: VFS): { passed: boolean; message: string } {
  switch (condition.type) {
    case 'directory_exists':
      return {
        passed: vfs.exists(condition.path) && vfs.isDirectory(condition.path),
        message: `Directory ${condition.path} does not exist`
      };
      
    case 'file_exists':
      return {
        passed: vfs.exists(condition.path) && vfs.isFile(condition.path),
        message: `File ${condition.path} does not exist`
      };
      
    case 'file_contains':
      const content = vfs.readFile(condition.path);
      return {
        passed: content?.includes(condition.content) || false,
        message: `File ${condition.path} does not contain "${condition.content}"`
      };
      
    // Add other condition types...
      
    default:
      return { passed: false, message: `Unknown condition type: ${condition.type}` };
  }
}
```

---

## 4. Integration with Command Engine

The Lab Engine hooks into the command execution pipeline to:

1. **Check guided steps** after each command.
2. **Auto‑verify DIY labs** when the user requests verification (or automatically after certain commands).

### 4.1 Command Interceptor

In the terminal's command execution flow:

```typescript
// In useTerminal hook
const executeCommand = async (input: string) => {
  // 1. Parse and execute command (updates VFS)
  const result = await commandEngine.execute(input, vfs);
  
  // 2. Add to terminal history
  addToHistory(result);
  
  // 3. Check lab progress if a lab is active
  const { currentLab, labType } = labStore.getState();
  if (currentLab) {
    if (labType === 'guided') {
      const verification = verifyGuidedStep(currentLab, currentStepIndex, input);
      if (verification.success) {
        labStore.getState().completeStep(currentLab.id, currentLab.steps[currentStepIndex].id);
        if (verification.completed) {
          labStore.getState().completeLab(currentLab.id);
          awardXP(currentLab.xpReward);
        }
      }
    }
  }
  
  return result;
};
```

### 4.2 Manual Verification for DIY Labs

Add a "Verify Lab" button that calls:

```typescript
const handleVerify = () => {
  const { currentLab, vfs } = useStore();
  const result = verifyDIYLab(currentLab, vfs);
  if (result.success) {
    labStore.getState().completeLab(currentLab.id);
    awardXP(currentLab.xpReward);
    showSuccess("Lab completed!");
  } else {
    showFailure(`Not yet: ${result.failedConditions[0]}`);
  }
};
```

---

## 5. Hint System

### 5.1 Progressive Hints

Labs can have multiple hints. The UI shows one hint at a time, with a "More Help" button.

```typescript
export function useHints(lab: Lab) {
  const [hintIndex, setHintIndex] = useState(0);
  
  const currentHint = lab.hints?.[hintIndex];
  const hasMoreHints = hintIndex < (lab.hints?.length || 0) - 1;
  
  const nextHint = () => {
    if (hasMoreHints) setHintIndex(hintIndex + 1);
  };
  
  return { currentHint, hasMoreHints, nextHint };
}
```

### 5.2 Hint Storage

Track which hints have been viewed (for analytics or to avoid showing same hint twice).

---

## 6. Lab Progress & Persistence

### 6.1 LocalStorage Persistence

```typescript
export const useLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'lta-lab-progress',
      partialize: (state) => ({
        labProgress: state.labProgress,
        currentLabId: state.currentLabId,
        currentStepIndex: state.currentStepIndex,
      }),
    }
  )
);
```

### 6.2 Syncing with SpacetimeDB

When a lab is completed, also update the backend:

```typescript
const completeLab = async (labId: string) => {
  // Update local state
  set((state) => ({
    labProgress: {
      ...state.labProgress,
      [labId]: {
        ...state.labProgress[labId],
        completedAt: Date.now(),
      },
    },
  }));
  
  // Sync to SpacetimeDB
  const reducer = client.reducers.completeLab;
  await reducer(labId, getLabXpReward(labId));
};
```

---

## 7. UI Components

### 7.1 LabCard

```typescript
interface LabCardProps {
  lab: Lab;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: number; // for guided labs: steps completed / total steps
}

function LabCard({ lab, status, progress }: LabCardProps) {
  return (
    <div className={`lab-card border-2 border-brutal-white p-4 ${
      status === 'locked' ? 'opacity-50' : ''
    }`}>
      <h3 className="font-heading uppercase text-xl">{lab.title}</h3>
      <p className="text-brutal-gray mt-2">{lab.description}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-brutal-green">+{lab.xpReward} XP</span>
        
        {status === 'completed' && (
          <span className="bg-brutal-green text-brutal-black px-3 py-1">COMPLETED</span>
        )}
        
        {status === 'in-progress' && (
          <div className="w-24 h-2 bg-brutal-dark border border-brutal-white">
            <div 
              className="h-full bg-brutal-green"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {status === 'locked' && (
          <span className="text-brutal-gray">LOCKED</span>
        )}
        
        {status === 'available' && (
          <button className="border-2 border-brutal-white px-4 py-1 hover:bg-brutal-white hover:text-brutal-black">
            START
          </button>
        )}
      </div>
    </div>
  );
}
```

### 7.2 LabInstructions (Guided)

```typescript
function GuidedLabInstructions({ lab, currentStepIndex }) {
  const currentStep = lab.steps[currentStepIndex];
  const { currentHint, hasMoreHints, nextHint } = useHints(lab);
  
  return (
    <div className="border-2 border-brutal-white p-4 bg-brutal-dark">
      <h4 className="font-heading text-lg">Step {currentStepIndex + 1}/{lab.steps.length}</h4>
      <p className="mt-2">{currentStep.instruction}</p>
      
      {currentHint && (
        <div className="mt-4 border-l-4 border-brutal-yellow pl-3">
          <p className="text-brutal-yellow">💡 Hint: {currentHint}</p>
          {hasMoreHints && (
            <button 
              onClick={nextHint}
              className="text-sm underline mt-1"
            >
              More help
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

### 7.3 LabInstructions (DIY)

```typescript
function DIYLabInstructions({ lab, failedConditions }) {
  return (
    <div className="border-2 border-brutal-white p-4 bg-brutal-dark">
      <h4 className="font-heading text-lg">Objective</h4>
      <p className="mt-2">{lab.description}</p>
      
      <h5 className="font-heading mt-4">Requirements:</h5>
      <ul className="list-disc pl-5 mt-2">
        {lab.verification.conditions.map((cond, i) => (
          <li key={i} className={
            failedConditions?.includes(cond.message) 
              ? 'text-brutal-red' 
              : 'text-brutal-green'
          }>
            {cond.message}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={verifyLab}
        className="mt-4 border-2 border-brutal-green text-brutal-green px-4 py-2 hover:bg-brutal-green hover:text-brutal-black"
      >
        VERIFY LAB
      </button>
    </div>
  );
}
```

---

## 8. Lab Flow & User Experience

### 8.1 Sequence Diagram

```
User          Terminal        LabEngine        VFS        SpacetimeDB
  |               |               |             |             |
  | Start Lab     |               |             |             |
  |-------------->|               |             |             |
  |               | loadLab()      |             |             |
  |               |--------------->|             |             |
  |               |                | loadVFS()   |             |
  |               |                |------------>|             |
  |               |                |             |             |
  | Type command  |                |             |             |
  |-------------->| execute()      |             |             |
  |               |--------------->|             |             |
  |               |                | update()    |             |
  |               |                |------------>|             |
  |               |                |             |             |
  |               | verifyStep()   |             |             |
  |               |<---------------|             |             |
  |               |                |             |             |
  |               | [if success]   |             |             |
  |               | completeStep() |             |             |
  |               |--------------->|             |             |
  |               |                |             | sync()      |
  |               |                |             |------------>|
  |               |                |             |             |
  | [if completed]|                |             |             |
  |               | completeLab()  |             |             |
  |               |--------------->|             |             |
  |               |                | awardXP()   |             |
  |               |                |------------>|             |
```

### 8.2 UX Considerations

- **Auto‑advance** – after a correct step, show next instruction immediately.
- **Failure feedback** – if command is wrong, show subtle error (red border, message).
- **Progress saved** – users can leave and return to the same step.
- **Reset option** – allow restarting a lab (clears VFS to initial state).

---

## 9. Testing Lab Engine

### 9.1 Unit Tests

```typescript
describe('verifyGuidedStep', () => {
  it('should match exact command', () => {
    const lab = { steps: [{ expectedCommand: 'ls -la' }] } as Lab;
    const result = verifyGuidedStep(lab, 0, 'ls -la');
    expect(result.success).toBe(true);
  });
  
  it('should ignore extra spaces', () => {
    const lab = { steps: [{ expectedCommand: 'ls -la' }] } as Lab;
    const result = verifyGuidedStep(lab, 0, '  ls   -la  ');
    expect(result.success).toBe(true);
  });
});
```

### 9.2 Integration Tests

Test a full DIY lab with VFS:

```typescript
it('should verify HPC lab correctly', () => {
  const vfs = new VFS();
  vfs.mkdir('/home/guest/simulation/data');
  vfs.mkdir('/home/guest/simulation/scripts');
  vfs.touch('/home/guest/simulation/run.sh');
  vfs.writeFile('/home/guest/simulation/README.md', 'Simulation files');
  
  const lab = loadLab('hpc-env-setup-1');
  const result = verifyDIYLab(lab, vfs);
  expect(result.success).toBe(true);
});
```

---

## 10. Implementation Checklist

- [ ] Define lab JSON schemas and validation.
- [ ] Create lab loader (glob import).
- [ ] Implement Zustand lab store with persistence.
- [ ] Build guided step verification.
- [ ] Build DIY condition checking.
- [ ] Integrate with command engine (interceptor).
- [ ] Create hint system.
- [ ] Build UI components (LabCard, LabInstructions, etc.).
- [ ] Add lab reset functionality.
- [ ] Write unit tests for verification logic.
- [ ] Integrate with SpacetimeDB for syncing completions.

---

**This document provides a complete blueprint for the Lab Engine. All team members (including Antigravity) must adhere to these specifications when implementing lab functionality.**
