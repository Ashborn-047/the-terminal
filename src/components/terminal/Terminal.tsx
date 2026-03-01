import React, { useState, useEffect, useRef } from 'react';
import { useTerminal } from '@/hooks/useTerminal';
import { TerminalEntry } from '@/types/terminal';

export const TerminalComponent: React.FC = () => {
    const { history, cwd, userId, executeCommand } = useTerminal();
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [flashClass, setFlashClass] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click anywhere in terminal
    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const command = input;
            setInput('');
            setHistoryIndex(-1);
            const result = await executeCommand(command);

            // Micro-interaction: success flash or error shake
            if (result) {
                if (result.exitCode === 0 && result.output) {
                    setFlashClass('success-flash');
                } else if (result.error || result.exitCode !== 0) {
                    setFlashClass('error-shake');
                }
                setTimeout(() => setFlashClass(''), 800);
            }
        } else if (e.key === 'ArrowUp') {
            if (history.length > 0) {
                const newIndex = Math.min(historyIndex + 1, history.length - 1);
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex].command);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex].command);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
            e.preventDefault();
        }
    };

    return (
        <div
            className={`flex flex-col w-full h-full bg-brutal-black font-mono text-brutal-green p-4 overflow-y-auto cursor-text border-3 border-brutal-white shadow-brutal-lg ${flashClass}`}
            onClick={handleTerminalClick}
        >
            {/* History */}
            <div className="flex flex-col gap-2">
                {history.map((entry) => (
                    <div key={entry.id} className="flex flex-col">
                        <div className="flex gap-2">
                            <span className="text-brutal-white">[{userId}@the-terminal {entry.cwd === '/' ? '/' : entry.cwd.split('/').pop()}]$</span>
                            <span className="text-brutal-white">{entry.command}</span>
                        </div>
                        {entry.output && (
                            <pre className="whitespace-pre-wrap mt-1 opacity-90">{entry.output}</pre>
                        )}
                        {entry.error && (
                            <div className="text-brutal-red mt-1 font-bold">Error: {entry.error}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Current Input */}
            <div className="flex gap-2 mt-2 items-center">
                <span className="text-brutal-white">[{userId}@the-terminal {cwd === '/' ? '/' : cwd.split('/').pop()}]$</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-brutal-white caret-transparent"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
                {/* Block cursor blink */}
                <span className="terminal-cursor" />
            </div>

            <div ref={bottomRef} className="h-4" />
        </div>
    );
};
