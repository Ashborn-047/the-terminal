# Terminal Renderer Migration: Transitioning from DOM to Canvas (Xterm.js)

## Executive Summary
The current implementation of the terminal interface (`src/components/terminal/Terminal.tsx`) uses a standard React DOM-based rendering approach. Every command execution maps over an array of historical entries, rendering nested `<div>` and `<pre>` tags. While perfectly acceptable for a prototype, this architecture is a ticking time bomb for performance and inherently blocks the implementation of interactive CLI applications (like `vim`, `nano`, or `top`). To achieve enterprise-grade fidelity, the rendering layer must migrate to an industry-standard Canvas/WebGL emulator like Xterm.js.

## 9.1 — The DOM Bloat and Performance Collapse

### [SEVERITY: P0] React DOM Thrashing
**What**: The `Terminal.tsx` component stores every command and its output string in a state array. It renders a massive `<div className="flex-1 overflow-y-auto...">` containing mapped `HistoryEntry` components.
**Why it matters**:
1. **The Tab Crash**: If a student accidentally runs `cat /var/log/syslog` on a simulated 50,000-line file, React will attempt to mount 50,000 DOM nodes instantly. This will freeze the browser main thread and crash the tab, forcing the user to lose their SpacetimeDB connection and local session state.
2. **Scroll Lag**: Even with just a few hundred lines of history, standard DOM scrolling combined with React reconciliation loops creates noticeable input latency when typing new commands.
**Who benefits**: All users (eliminates tab crashes and typing latency).
**When to implement**: Alongside Phase E (Missing Command Implementations) of the fidelity roadmap.
**How to fix**:
1. Remove the React array mapping for history.
2. Integrate `xterm` and `xterm-addon-fit`.
3. The React wrapper should simply mount the Xterm instance into a `ref`.
```tsx
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export const TerminalComponent = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const term = new Terminal({ theme: { background: '#000000', foreground: '#00ff00' }});
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        // Pipe executor stream to term.write()
    }, []);
    return <div ref={terminalRef} className="w-full h-full" />;
};
```
**Verification**: Generate a file with 100,000 lines. Run `cat file.txt`. The terminal must stream the text smoothly without dropping below 30FPS and without crashing the browser.

## 9.2 — The Missing ANSI Parser

### [SEVERITY: P1] Inability to Render Interactive Tools
**What**: The current DOM renderer simply outputs literal strings. It does not parse standard ANSI escape sequences (e.g., `\x1b[31m` for red text, `\x1b[2J` to clear the screen, `\x1b[H` to move the cursor to the top left).
**Why it matters**: It is mathematically impossible to implement `vim`, `nano`, `top`, `less`, or even complex progress bars (like `wget`) using `<div>` mapping. These tools work by sending ANSI codes to manipulate the cursor position over a fixed character grid. Without them, LFCS certification paths are completely blocked.
**Who benefits**: Advanced learners requiring interactive text editing (`vim`) and process monitoring (`top`).
**When to implement**: Prerequisite for Phase E (Missing Command Implementations).
**How to fix**:
1. Xterm.js natively handles VT100/ANSI escape sequences.
2. The `CommandContext` streaming output (from Phase D's File Descriptor refactor) should pipe raw bytes containing ANSI codes directly into `term.write()`.
3. Commands like `top` can now run a loop, periodically writing `\x1b[2J\x1b[H` followed by the updated process table string.
**Verification**: Execute `echo -e "\x1b[31mRed\x1b[0m \x1b[32mGreen\x1b[0m"`. The terminal must render colored text, not the literal escape characters.

## 9.3 — Terminal Input Emulation & Keyboard Trapping

### [SEVERITY: P2] React Keyboard Event Conflicts
**What**: Currently, user input is managed by a standard HTML `<input>` or a globally attached React `onKeyDown` listener.
**Why it matters**: Standard browser inputs intercept critical terminal shortcuts. Pressing `Ctrl+C` copies text instead of sending `SIGINT`. Pressing `Ctrl+W` closes the browser tab instead of deleting a word. Pressing `Up Arrow` requires custom array logic instead of natively scanning an emulator buffer.
**Who benefits**: Power users whose muscle memory expects standard Linux shell keyboard shortcuts.
**When to implement**: During the Xterm.js migration.
**How to fix**:
1. Xterm.js natively captures raw keystrokes via `term.onData(data => ...)`.
2. The terminal component must trap browser defaults using `e.preventDefault()` for registered shell shortcuts (e.g., `Ctrl+C`, `Ctrl+D`, `Ctrl+Z`).
3. Send the raw byte streams into the parser/executor, interpreting `\x03` as a `SIGINT` trigger rather than a UI event.
**Verification**: While a simulated `sleep 100` command is running, pressing `Ctrl+C` must immediately kill the process, return the prompt, and NOT trigger the browser's native text copy function.

## Conclusion
The React DOM is a document renderer, not a terminal emulator. Continuing to use `<div>` mapping will continually block the implementation of crucial RHCSA features like `vim` and `top`, and poses a severe stability risk when handling large text outputs. Migrating to Xterm.js unblocks the path to true 1:1 POSIX visual fidelity.