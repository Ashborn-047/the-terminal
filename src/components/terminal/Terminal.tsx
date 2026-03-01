import React, { useState, useEffect, useRef } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import { TerminalEntry } from '../../types/terminal';

const parseAnsi = (text: string) => {
    // Basic regex for ANSI escape codes like \x1b[1;34m
    const regex = /\x1b\[([\d;]+)m/g;
    const parts = text.split(regex);
    const result: React.ReactNode[] = [];

    let currentClass = '';

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            // These are the codes
            const codes = parts[i];
            if (codes === '0') currentClass = '';
            else if (codes === '1;34') currentClass = 'text-brutal-blue font-bold';
            else if (codes === '1;36') currentClass = 'text-brutal-cyan font-bold';
            else if (codes === '1;32') currentClass = 'text-brutal-green font-bold';
            else if (codes === '1;31') currentClass = 'text-brutal-red font-bold';
        } else {
            // This is the text
            if (parts[i]) {
                result.push(currentClass ? <span key={i} className={currentClass}>{parts[i]}</span> : parts[i]);
            }
        }
    }
    return result;
};

export const TerminalComponent: React.FC = () => {
    const { history, cwd, userId, executeCommand, pendingPrompt, resolvePrompt, handleTabComplete } = useTerminal();
    const [input, setInput] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [flashClass, setFlashClass] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
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
        if (e.key === 'Tab') {
            e.preventDefault();
            const completed = handleTabComplete(input);
            setInput(completed);
        } else if (e.key === 'Enter') {
            if (pendingPrompt) {
                const answer = input;
                setInput('');
                resolvePrompt(answer);
                return;
            }
            const command = input;
            setInput('');
            setHistoryIndex(-1);
            setIsExecuting(true);
            const result = await executeCommand(command);
            setIsExecuting(false);

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
                {history.map((entry: TerminalEntry) => (
                    <div key={entry.id} className="flex flex-col">
                        <div className="flex gap-2">
                            <span className="text-brutal-white">[{userId}@the-terminal {entry.cwd === '/' ? '/' : entry.cwd.split('/').pop()}]$</span>
                            <span className="text-brutal-white">{entry.command}</span>
                        </div>
                        {entry.output && (
                            <pre className="whitespace-pre-wrap mt-1 opacity-90">{parseAnsi(entry.output)}</pre>
                        )}
                        {entry.error && (
                            <div className="text-brutal-red mt-1 font-bold">Error: {entry.error}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Current Input */}
            <div className="flex gap-2 mt-2 items-center">
                <span className="text-brutal-white">
                    {pendingPrompt ? pendingPrompt.message : `[${userId}@the-terminal ${cwd === '/' ? '/' : cwd.split('/').pop()}]$`}
                </span>
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
                    disabled={isExecuting}
                />
                {/* Block cursor blink or loading underscore */}
                {isExecuting ? (
                    <span className="loading-underscore" />
                ) : (
                    <span className="terminal-cursor" />
                )}
            </div>

            <div ref={bottomRef} className="h-4" />
        </div>
    );
};
