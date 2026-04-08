import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { CanvasAddon } from '@xterm/addon-canvas';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

import { useTerminal } from '../../hooks/useTerminal';
import { Lexer } from '../../features/command-engine/shell/lexer';
import { Parser } from '../../features/command-engine/shell/parser';
import { ShellExecutor } from '../../features/command-engine/shell/executor';
import { ShellEnvironment } from '../../features/command-engine/shell/environment';
import { TabCompleter } from '../../features/command-engine/shell/completion';
import { useTerminalStore } from '../../stores/terminalStore';
import { Signal } from '../../features/command-engine/types';

export const TerminalComponent: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const shellEnvRef = useRef<ShellEnvironment | null>(null);
    
    const { vfs, userId, cwd, executeCommand } = useTerminal();
    const foregroundProcess = useTerminalStore((state) => state.foregroundProcess);
    const sendSignal = useTerminalStore((state) => state.sendSignal);
    
    const [inputBuffer, setInputBuffer] = useState('');
    const inputBufferRef = useRef('');

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize XTerm
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            theme: {
                background: '#0A0A0A',
                foreground: '#00FF9D',
                cursor: '#00FF9D',
                selectionBackground: '#FFFFFF',
                black: '#0A0A0A',
                white: '#FFFFFF',
                green: '#00FF9D',
                red: '#FF4D4D',
                blue: '#00CCFF',
                yellow: '#FFE600',
            },
            allowProposedApi: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon());
        
        // Try to load Canvas addon (falls back to DOM if hardware accel is missing)
        try {
            term.loadAddon(new CanvasAddon());
        } catch (e) {
            console.warn('Xterm Canvas addon failed to load, falling back to DOM renderer', e);
        }

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize Shell Environment
        if (!shellEnvRef.current) {
            shellEnvRef.current = new ShellEnvironment({
                USER: userId,
                HOME: `/home/${userId}`,
                PWD: cwd,
                PATH: '/usr/bin:/bin',
                TERM: 'xterm-256color',
                PS1: `\\x1b[1;37m[\\u@the-terminal \\W]$\\x1b[0m `
            });
        }

        // Welcome message
        term.writeln('\x1b[1;32mWelcome to the Linux Simulator (Engine Wave 2)\x1b[0m');
        term.writeln('Type \x1b[1;36mhelp\x1b[0m to see available commands.');
        term.writeln('');
        
        const ps1 = `\x1b[1;37m[${userId}@the-terminal ${cwd === '/' ? '/' : cwd.split('/').pop()}]$\x1b[0m `;
        term.write(ps1);

        // Handle Input
        term.onData(data => {
            if (data === '\r') { // Enter
                const cmd = inputBufferRef.current;
                term.write('\r\n');
                handleExecute(cmd);
                inputBufferRef.current = '';
                setInputBuffer('');
            } else if (data === '\x7f') { // Backspace
                if (inputBufferRef.current.length > 0) {
                    inputBufferRef.current = inputBufferRef.current.slice(0, -1);
                    setInputBuffer(inputBufferRef.current);
                    term.write('\b \b');
                }
            } else if (data === '\x03') { // Ctrl+C
                term.write('^C\r\n');
                if (foregroundProcess) {
                    sendSignal(foregroundProcess, Signal.SIGINT);
                }
                inputBufferRef.current = '';
                setInputBuffer('');
                term.write(getPrompt());
            } else if (data === '\x1a') { // Ctrl+Z
                term.write('^Z\r\n');
                term.writeln('\x1b[1;33mJob control coming soon\x1b[0m');
                term.write(getPrompt());
            } else if (data === '\x09') { // Tab
                const completer = new TabCompleter(vfs);
                const results = completer.complete(inputBufferRef.current, shellEnvRef.current!, userId);
                
                if (results.length === 1) {
                    const currentParts = inputBufferRef.current.split(/\s+/);
                    const lastPart = currentParts[currentParts.length - 1];
                    const completion = results[0].substring(lastPart.length);
                    
                    inputBufferRef.current += completion;
                    setInputBuffer(inputBufferRef.current);
                    term.write(completion);
                } else if (results.length > 1) {
                    term.write('\r\n' + results.join('  ') + '\r\n');
                    term.write(getPrompt() + inputBufferRef.current);
                }
            } else {
                inputBufferRef.current += data;
                setInputBuffer(inputBufferRef.current);
                term.write(data);
            }
        });

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        };
    }, []);

    const getPrompt = () => {
        const currentCwd = shellEnvRef.current?.get('PWD') || cwd;
        const displayCwd = currentCwd === '/' ? '/' : currentCwd.split('/').pop();
        return `\x1b[1;37m[${userId}@the-terminal ${displayCwd}]$\x1b[0m `;
    };

    const handleExecute = async (input: string) => {
        const term = xtermRef.current;
        if (!term || !shellEnvRef.current) return;

        const trimmed = input.trim();
        if (!trimmed) {
            term.write(getPrompt());
            return;
        }

        try {
            const lexer = new Lexer(trimmed);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();
            
            const executor = new ShellExecutor(vfs);
            
            // Current CommandContext (Simplified for now)
            const context: any = {
                cwd: shellEnvRef.current.get('PWD'),
                userId,
                groups: userId === 'root' ? ['root'] : [userId, 'users'],
                resolvePath: (path: string) => {
                    const base = shellEnvRef.current?.get('PWD') || '/';
                    if (path.startsWith('/')) return path;
                    if (path.startsWith('~/')) return `/home/${userId}${path.substring(1)}`;
                    return base === '/' ? `/${path}` : `${base}/${path}`;
                },
                isInterrupted: () => false,
            };

            const result = await executor.execute(ast, context, shellEnvRef.current);
            
            if (result.stream) {
                for await (const chunk of result.stream) {
                    term.write(chunk);
                }
            } else if (result.output) {
                term.writeln(result.output);
            }

            if (result.error) {
                term.writeln(`\x1b[1;31m${result.error}\x1b[0m`);
            }

            // Sync CWD if changed (special case for cd)
            // In a better implementation, executor would update environment directly
            // For now, let's assume cd was handled if result has something or executor updated it
            
            term.write(getPrompt());
        } catch (e: any) {
            term.writeln(`\x1b[1;31mbash: ${e.message}\x1b[0m`);
            term.write(getPrompt());
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-brutal-black font-mono text-brutal-green p-4 border-3 border-brutal-white shadow-brutal-lg">
            <div 
                ref={terminalRef} 
                className="w-full h-full overflow-hidden" 
                data-testid="terminal-container" 
            />
        </div>
    );
};
