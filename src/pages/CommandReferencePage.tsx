import React, { useState, useMemo } from 'react';
import { COMMAND_DOCS, CommandDoc } from '../data/commandDocs';

const CATEGORIES: Record<string, string[]> = {
    'Navigation': ['cd', 'pwd', 'ls', 'find'],
    'File Operations': ['cat', 'cp', 'mv', 'rm', 'mkdir', 'touch', 'ln', 'head', 'tail', 'tee', 'file', 'stat'],
    'Text Processing': ['grep', 'sort', 'uniq', 'cut', 'sed', 'awk', 'wc', 'tr'],
    'Permissions & Users': ['chmod', 'chown', 'id', 'groups', 'whoami', 'useradd', 'passwd', 'sudo'],
    'System Info': ['uname', 'uptime', 'df', 'free', 'ps', 'top', 'kill', 'du', 'hostname', 'date', 'env'],
    'Compression': ['tar', 'gzip', 'gunzip'],
    'Networking': ['ping', 'curl', 'wget', 'ssh', 'scp', 'dig'],
    'Shell': ['echo', 'export', 'alias', 'unalias', 'history', 'clear', 'help', 'man', 'which', 'type', 'xargs', 'sleep', 'true', 'false', 'seq', 'basename', 'dirname'],
};

export default function CommandReferencePage() {
    const [search, setSearch] = useState('');
    const [selectedCmd, setSelectedCmd] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const allCommands = useMemo(() => Object.keys(COMMAND_DOCS).sort(), []);

    const filteredCommands = useMemo(() => {
        let cmds = allCommands;
        if (search) {
            const q = search.toLowerCase();
            cmds = cmds.filter(c => c.includes(q) || COMMAND_DOCS[c].description.toLowerCase().includes(q));
        }
        if (activeCategory) {
            const catCmds = CATEGORIES[activeCategory] || [];
            cmds = cmds.filter(c => catCmds.includes(c));
        }
        return cmds;
    }, [search, activeCategory, allCommands]);

    const selectedDoc = selectedCmd ? COMMAND_DOCS[selectedCmd] : null;

    return (
        <div style={{
            padding: '2rem',
            minHeight: '100vh',
            color: '#F0F0F0',
            fontFamily: 'Inter, sans-serif',
        }}>
            {/* Header */}
            <h1 style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: '2rem',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                color: '#00FF9D',
            }}>
                Command Reference
            </h1>
            <p style={{ color: '#A0A0A0', marginBottom: '1.5rem' }}>
                {allCommands.length} commands available — click any command for full documentation.
            </p>

            {/* Search */}
            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search commands..."
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '0.75rem 1rem',
                    background: '#1E1E1E',
                    border: '2px solid #FFFFFF',
                    color: '#F0F0F0',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    marginBottom: '1.5rem',
                    outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = '#00FF9D')}
                onBlur={e => (e.target.style.borderColor = '#FFFFFF')}
            />

            {/* Category Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveCategory(null)}
                    style={{
                        padding: '0.4rem 0.75rem',
                        background: !activeCategory ? '#00FF9D' : '#1E1E1E',
                        color: !activeCategory ? '#0A0A0A' : '#F0F0F0',
                        border: '2px solid #FFFFFF',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}
                >
                    ALL
                </button>
                {Object.keys(CATEGORIES).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                        style={{
                            padding: '0.4rem 0.75rem',
                            background: activeCategory === cat ? '#00FF9D' : '#1E1E1E',
                            color: activeCategory === cat ? '#0A0A0A' : '#F0F0F0',
                            border: '2px solid #FFFFFF',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 1.5fr' : '1fr', gap: '1.5rem' }}>
                {/* Command List */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '0.5rem',
                    alignContent: 'start',
                }}>
                    {filteredCommands.map(cmd => (
                        <button
                            key={cmd}
                            onClick={() => setSelectedCmd(selectedCmd === cmd ? null : cmd)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: selectedCmd === cmd ? '#00FF9D' : '#1E1E1E',
                                color: selectedCmd === cmd ? '#0A0A0A' : '#00FF9D',
                                border: selectedCmd === cmd ? '2px solid #00FF9D' : '2px solid #333',
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.1s',
                            }}
                            onMouseEnter={e => {
                                if (selectedCmd !== cmd) {
                                    (e.target as HTMLElement).style.borderColor = '#00FF9D';
                                }
                            }}
                            onMouseLeave={e => {
                                if (selectedCmd !== cmd) {
                                    (e.target as HTMLElement).style.borderColor = '#333';
                                }
                            }}
                        >
                            {cmd}
                        </button>
                    ))}
                    {filteredCommands.length === 0 && (
                        <p style={{ color: '#A0A0A0', gridColumn: '1 / -1' }}>No commands match your search.</p>
                    )}
                </div>

                {/* Detail Panel */}
                {selectedDoc && (
                    <div style={{
                        background: '#1E1E1E',
                        border: '3px solid #FFFFFF',
                        padding: '1.5rem',
                    }}>
                        <h2 style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '1.5rem',
                            color: '#00FF9D',
                            marginBottom: '0.25rem',
                        }}>
                            {selectedDoc.name}
                        </h2>
                        <p style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            color: '#A0A0A0',
                            fontSize: '0.875rem',
                            marginBottom: '1rem',
                        }}>
                            {selectedDoc.synopsis}
                        </p>

                        <h3 style={{
                            fontFamily: 'Archivo Black, sans-serif',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            color: '#FFE600',
                            marginBottom: '0.5rem',
                        }}>
                            Description
                        </h3>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                            {selectedDoc.description}
                        </p>

                        {selectedDoc.options.length > 0 && (
                            <>
                                <h3 style={{
                                    fontFamily: 'Archivo Black, sans-serif',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    color: '#FFE600',
                                    marginBottom: '0.5rem',
                                }}>
                                    Options
                                </h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    {selectedDoc.options.map((opt, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            padding: '0.25rem 0',
                                            borderBottom: '1px solid #333',
                                        }}>
                                            <code style={{
                                                fontFamily: 'JetBrains Mono, monospace',
                                                color: '#00CCFF',
                                                minWidth: '80px',
                                                flexShrink: 0,
                                            }}>
                                                {opt.flag}
                                            </code>
                                            <span style={{ color: '#A0A0A0' }}>{opt.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {selectedDoc.examples.length > 0 && (
                            <>
                                <h3 style={{
                                    fontFamily: 'Archivo Black, sans-serif',
                                    fontSize: '0.875rem',
                                    textTransform: 'uppercase',
                                    color: '#FFE600',
                                    marginBottom: '0.5rem',
                                }}>
                                    Examples
                                </h3>
                                <div style={{
                                    background: '#0A0A0A',
                                    border: '1px solid #333',
                                    padding: '0.75rem',
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '0.875rem',
                                    marginBottom: '1rem',
                                }}>
                                    {selectedDoc.examples.map((ex, i) => (
                                        <div key={i} style={{ color: '#00FF9D', padding: '0.15rem 0' }}>
                                            $ {ex}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {selectedDoc.seeAlso.length > 0 && (
                            <p style={{ color: '#A0A0A0', fontSize: '0.875rem' }}>
                                See also:{' '}
                                {selectedDoc.seeAlso.map((s, i) => (
                                    <span key={s}>
                                        <span
                                            style={{ color: '#00CCFF', cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => COMMAND_DOCS[s] && setSelectedCmd(s)}
                                        >
                                            {s}
                                        </span>
                                        {i < selectedDoc.seeAlso.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
