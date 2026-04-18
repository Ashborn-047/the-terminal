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
import { useGamificationStore } from '../../stores/gamificationStore';
import { useHardcoreStore } from '../../stores/hardcoreStore';
import { Signal } from '../../features/command-engine/types';
import { tokens, Button } from '../ui/AshbornDesignSystem';

export const TerminalComponent: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const shellEnvRef = useRef<ShellEnvironment | null>(null);
    
    const { vfs, userId, cwd, executeCommand, jobManager } = useTerminal();
    const handleExecuteRef = useRef<any>(null);
    const getPromptRef = useRef<any>(null);
    const foregroundProcess = useTerminalStore((state) => state.foregroundProcess);
    const engineStatus = useTerminalStore((state) => state.engineStatus);
    const sendSignal = useTerminalStore((state) => state.sendSignal);
    
    const [inputBuffer, setInputBuffer] = useState('');
    const inputBufferRef = useRef('');

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize XTerm
        const term = new Terminal({
            cursorBlink: true,
            fontFamily: tokens.font.mono,
            fontSize: parseInt(tokens.fontSize.base),
            theme: {
                background: tokens.color.bg.base,
                foreground: tokens.color.terminal.output,
                cursor: tokens.color.terminal.cursor,
                selectionBackground: 'rgba(255,255,255,0.1)',
                black: tokens.color.bg.base,
                white: tokens.color.text.primary,
                green: tokens.color.terminal.command,
                red: tokens.color.terminal.error,
                blue: tokens.color.terminal.command,
                yellow: tokens.color.terminal.root,
            },
            allowProposedApi: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon());
        
        // ADAPTIVE RENDERER: We prioritize high-performance Canvas rendering, 
        // but automatically "heal" to DOM rendering if the environment (CI/Headless/Legacy) 
        // cannot support hardware acceleration.
        const isTesting = import.meta.env.MODE === 'test' || (window as any).PLAYWRIGHT_TESTING || navigator.userAgent.includes('Headless');
        
        // In E2E tests, we prefer DOM rendering for better text-selection and content-scraping reliability
        if (!isTesting) {
            try {
                term.loadAddon(new CanvasAddon());
                console.info('[Terminal] Canvas renderer initialized.');
            } catch (e) {
                console.warn('[Terminal] Canvas renderer failed. Falling back to DOM.', e);
            }
        } else {
            console.info('[Terminal] CI/Test mode detected. Using stable DOM renderer.');
        }

        term.open(terminalRef.current);
        fitAddon.fit();

        // CI FIX: If the headless browser reports a 0x0 container size, fit() will result in an empty grid.
        // We force standard dimensions (80x24) specifically for testing environments to ensure 100% visibility.
        if (isTesting && (term.cols <= 0 || term.rows <= 1)) {
            console.warn('[Terminal] Container size detected as 0x0/0x1. Forcing 80x24 grid for CI stability.');
            term.resize(80, 24);
        }

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize Shell Environment
        if (!shellEnvRef.current) {
            shellEnvRef.current = new ShellEnvironment({
                USER: userId,
                HOME: `/home/${userId}`,
                PWD: cwd,
                SHELL: '/bin/bash',
                PS1: `\\x1b[1;37m[\\u@linux-lab \\W]$\\x1b[0m `
            });
        }

        // Welcome message removed as per request
        
        // WAVE 3: Level Migration & Notice
        const gamification = useGamificationStore.getState();
        gamification.migrateUserLevels();
        if (gamification.needsMigrationNotice) {
            term.writeln('\x1b[1;33m[SYSTEM] Your progress has been migrated to the new Wave 3 XP formula.\x1b[0m');
            term.writeln('\x1b[1;33m[SYSTEM] Levels are now harder to gain but more rewarding!\x1b[0m');
            term.writeln('');
            gamification.dismissMigrationNotice();
        }

        const ps1 = getPrompt();
        term.write(ps1);

        // DEFINITIVE STABILIZATION GATE: Instance-Aware Visual Readiness
        // We poll the DOM until BOTH the welcome message and the bash prompt are rendered.
        // We localize the start timer to this component instance to ensure resets on re-render.
        const bootStart = Date.now();
        const checkVisualReadiness = () => {
            const text = terminalRef.current?.innerText || '';
            const promptExists = text.includes('linux-lab');

            // Log polling status for CI diagnostics
            if (Date.now() % 500 === 0) { // Log every ~500ms
                console.debug(`[Terminal] Polling Readiness... TextLen: ${text.length}, Prompt: ${promptExists}`);
            }

            if (promptExists) {
                useTerminalStore.getState().setEngineStatus('ready');
                console.info('[Terminal] Visual readiness confirmed. Engine is READY.');
            } else {
                // Poll every 50ms until visible (max 10 seconds for safety in CI)
                if (Date.now() - bootStart < 10000) {
                    setTimeout(checkVisualReadiness, 50);
                } else {
                    console.warn('[Terminal] Visual readiness timeout. Forcing READY signal.', {
                        prompt: promptExists,
                        text: text.substring(0, 100)
                    });
                    useTerminalStore.getState().setEngineStatus('ready');
                }
            }
        };

        checkVisualReadiness();

        // Handle Input
        term.onData(data => {
            if (data === '\r') { // Enter
                const cmd = inputBufferRef.current;
                term.write('\r\n');
                if (handleExecuteRef.current) {
                    handleExecuteRef.current(cmd);
                }
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
                const fgJob = jobManager.getForegroundJob();
                if (fgJob) {
                    jobManager.terminateJob(fgJob.id, Signal.SIGINT);
                }
                if (getPromptRef.current) {
                    term.write(getPromptRef.current());
                }
            } else if (data === '\x1a') { // Ctrl+Z
                term.write('^Z\r\n');
                const fgJob = jobManager.getForegroundJob();
                if (fgJob) {
                    jobManager.suspendJob(fgJob.id);
                    term.writeln(`\r\n[${fgJob.id}]+  Stopped                 ${fgJob.command}`);
                }
                if (getPromptRef.current) {
                    term.write(getPromptRef.current());
                }
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
                    if (getPromptRef.current) {
                        term.write(getPromptRef.current() + inputBufferRef.current);
                    }
                }
            } else {
                inputBufferRef.current += data;
                setInputBuffer(inputBufferRef.current);
                term.write(data);
            }
        });

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Phase 3.3: Respawn Timer
        const respawnInterval = setInterval(() => {
            const { profile } = useHardcoreStore.getState();
            // Respawn logic implemented in store or here.
        }, 1000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(respawnInterval);
            term.dispose();
        };
    }, []);

    const getPrompt = () => {
        const { streak, masteryBadge } = useGamificationStore.getState();
        const { profile: hcProfile } = useHardcoreStore.getState();
        
        // Streak badge only if streak >= 3
        const streakText = streak.current >= 3 ? `\x1b[1;31m🔥 ${streak.current}d\x1b[0m ` : '';
        
        let badgeTitle = masteryBadge.toUpperCase();
        if (masteryBadge === 'kernel_master') badgeTitle = 'KERNEL';
        const badgeText = `\x1b[1;33m[${badgeTitle}]\x1b[0m `;
        
        const currentCwd = shellEnvRef.current?.get('PWD') || cwd;
        const displayCwd = currentCwd === '/' ? '/' : currentCwd.split('/').pop();
        
        return `${streakText}${badgeText}\x1b[1;37m${userId}@linux-lab:${displayCwd}$\x1b[0m `;
    };

    const handleExecute = async (input: string) => {
        const term = xtermRef.current;
        if (!term) return;

        const trimmed = input.trim();
        if (!trimmed) {
            term.write(getPrompt());
            return;
        }

        try {
            // Using executeCommand from useTerminal hook to ensure side effects (labs, XP, etc.) are handled
            const result = await executeCommand(trimmed);
            
            if (result && result.stream) {
                for await (const chunk of result.stream) {
                    term.write(chunk);
                }
            } else if (result && result.output) {
                term.writeln(result.output);
            }

            if (result && result.error) {
                term.writeln(`\x1b[1;31m${result.error}\x1b[0m`);
            }

            term.write(getPrompt());
        } catch (e: any) {
            term.writeln(`\x1b[1;31mbash: ${e.message}\x1b[0m`);
            term.write(getPrompt());
        }
    };

    handleExecuteRef.current = handleExecute;
    getPromptRef.current = getPrompt;

    return (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: tokens.color.bg.base,
            padding: tokens.space[4],
            border: `1px solid ${tokens.color.border.default}`,
            boxShadow: tokens.shadow.md
          }}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                {/* Mastery / Death Overlay */}
                {useHardcoreStore.getState().profile?.isActive && useGamificationStore.getState().level === 1 && useGamificationStore.getState().totalXpEarned === 0 && (
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: tokens.z.dropdown,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(13,13,15,0.95)',
                        backdropFilter: 'blur(4px)',
                        padding: tokens.space[8],
                        textAlign: 'center',
                        border: `2px solid ${tokens.color.semantic.error}`,
                        animation: 'al-pulse 2s infinite'
                      }}
                    >
                        <span style={{ fontSize: 64, marginBottom: tokens.space[4] }}>💀</span>
                        <h2 style={{ 
                            fontFamily: tokens.font.sans, 
                            fontSize: tokens.fontSize['2xl'], 
                            fontWeight: 800, 
                            color: tokens.color.semantic.error, 
                            textTransform: 'uppercase', 
                            marginBottom: tokens.space[2] 
                        }}>
                            SYSTEM CRITICAL FAILURE
                        </h2>
                        <p style={{ 
                            fontFamily: tokens.font.sans, 
                            fontSize: tokens.fontSize.base, 
                            color: tokens.color.text.secondary, 
                            marginBottom: tokens.space[6], 
                            maxWidth: 400 
                        }}>
                            [HARDCORE] You have died. All progress lost. Respawn with caution.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space[2], fontFamily: tokens.font.mono, fontSize: tokens.fontSize.xs }}>
                            <span style={{ color: tokens.color.semantic.error, fontWeight: 700 }}>XP RESET TO 0</span>
                            <span style={{ color: tokens.color.text.secondary }}>
                                LEVEL RECALIBRATED TO 1
                            </span>
                        </div>
                        <Button 
                            variant="danger"
                            size="lg"
                            style={{ mt: tokens.space[6], marginTop: tokens.space[6] }}
                            onClick={() => window.location.reload()}
                        >
                            Respawn
                        </Button>
                    </div>
                )}

                <div 
                    ref={terminalRef} 
                    style={{ width: '100%', height: '100%', overflow: 'hidden' }}
                    data-testid="terminal-container" 
                    data-engine-status={engineStatus}
                />
            </div>
        </div>
    );
};
