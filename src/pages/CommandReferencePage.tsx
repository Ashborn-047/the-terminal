import React, { useState, useMemo } from 'react';
import { COMMAND_DOCS } from '../data/commandDocs';
import { 
    tokens, 
    Card, 
    Badge, 
    Divider 
} from '../components/ui/AshbornDesignSystem';
import { Search, ChevronRight, BookOpen, Hash, Code } from 'lucide-react';

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
            padding: tokens.space[8],
            height: '100%',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: tokens.color.bg.base,
            color: tokens.color.text.primary,
        }}>
            {/* Header Area */}
            <div style={{ marginBottom: tokens.space[8], maxWidth: 1024 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                    <BookOpen size={32} style={{ color: tokens.color.amber.base }} />
                    <h1 style={{
                        fontFamily: tokens.font.sans,
                        fontSize: tokens.fontSize['3xl'],
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: tokens.color.text.primary,
                        margin: 0,
                        letterSpacing: tokens.letterSpacing.widest
                    }}>
                        Command Reference
                    </h1>
                </div>
                <p style={{ fontFamily: tokens.font.sans, fontSize: tokens.fontSize.sm, color: tokens.color.text.tertiary, margin: 0 }}>
                    {allCommands.length} essential binaries identified in the terminal environment.
                </p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div style={{ position: 'relative', maxWidth: 400 }}>
                    <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: tokens.color.text.tertiary }} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="SEARCH_BINARIES..."
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 40px',
                            background: tokens.color.bg.overlay,
                            border: `1px solid ${tokens.color.border.default}`,
                            color: tokens.color.lime.base,
                            fontFamily: tokens.font.mono,
                            fontSize: 12,
                            outline: 'none',
                            borderRadius: 4,
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = tokens.color.lime.base)}
                        onBlur={e => (e.currentTarget.style.borderColor = tokens.color.border.default)}
                    />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <button
                        onClick={() => setActiveCategory(null)}
                        style={{
                            padding: '6px 12px',
                            background: !activeCategory ? tokens.color.lime.base : tokens.color.bg.surface,
                            color: !activeCategory ? tokens.color.bg.base : tokens.color.text.secondary,
                            border: `1px solid ${!activeCategory ? tokens.color.lime.base : tokens.color.border.default}`,
                            fontFamily: tokens.font.sans,
                            fontWeight: 700,
                            fontSize: 10,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            borderRadius: 2
                        }}
                    >
                        ALL_INDEX
                    </button>
                    {Object.keys(CATEGORIES).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                            style={{
                                padding: '6px 12px',
                                background: activeCategory === cat ? tokens.color.amber.base : tokens.color.bg.surface,
                                color: activeCategory === cat ? tokens.color.bg.base : tokens.color.text.secondary,
                                border: `1px solid ${activeCategory === cat ? tokens.color.amber.base : tokens.color.border.default}`,
                                fontFamily: tokens.font.sans,
                                fontWeight: 700,
                                fontSize: 10,
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                borderRadius: 2
                            }}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Layout */}
            <div style={{ flex: 1, display: 'flex', gap: 24, minHeight: 0 }}>
                {/* List Container */}
                <div style={{ 
                    flex: selectedDoc ? 1 : 1, 
                    display: 'grid', 
                    gridTemplateColumns: selectedDoc ? '1fr' : 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 8, 
                    overflowY: 'auto',
                    paddingRight: 8,
                    alignContent: 'start'
                }}>
                    {filteredCommands.map(cmd => (
                        <button
                            key={cmd}
                            onClick={() => setSelectedCmd(selectedCmd === cmd ? null : cmd)}
                            style={{
                                padding: '12px 16px',
                                background: selectedCmd === cmd ? tokens.color.lime.alpha[8] : tokens.color.bg.surface,
                                color: selectedCmd === cmd ? tokens.color.lime.base : tokens.color.text.primary,
                                border: `1px solid ${selectedCmd === cmd ? tokens.color.lime.base : tokens.color.border.default}`,
                                fontFamily: tokens.font.mono,
                                fontSize: 13,
                                fontWeight: 700,
                                textAlign: 'left',
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            {cmd}
                            {selectedCmd === cmd && <ChevronRight size={14} />}
                        </button>
                    ))}
                </div>

                {/* Detail Panel */}
                {selectedDoc && (
                    <div style={{ flex: 1.5, overflowY: 'auto' }}>
                        <Card variant="default" style={{ padding: tokens.space[6], borderLeft: `2px solid ${tokens.color.lime.base}` }}>
                            <div style={{ marginBottom: 24 }}>
                                <Badge variant="lime" style={{ marginBottom: 12 }}>BINARY_DOC</Badge>
                                <h2 style={{
                                    fontFamily: tokens.font.mono,
                                    fontSize: tokens.fontSize.xl,
                                    fontWeight: 900,
                                    color: tokens.color.lime.base,
                                    margin: 0,
                                    letterSpacing: 1
                                }}>
                                    {selectedDoc.name.toUpperCase()}
                                </h2>
                                <p style={{
                                    fontFamily: tokens.font.mono,
                                    color: tokens.color.text.tertiary,
                                    fontSize: 11,
                                    margin: '8px 0 0 0',
                                    fontStyle: 'italic'
                                }}>
                                    {selectedDoc.synopsis}
                                </p>
                            </div>

                            <Divider style={{ margin: '24px 0' }} />

                            <div style={{ marginBottom: 32 }}>
                                <h3 style={{
                                    fontFamily: tokens.font.sans,
                                    fontSize: 10,
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    color: tokens.color.amber.base,
                                    marginBottom: 12,
                                    letterSpacing: 1
                                }}>
                                    Executive Summary
                                </h3>
                                <p style={{ margin: 0, lineHeight: '1.7', fontSize: 13, color: tokens.color.text.secondary }}>
                                    {selectedDoc.description}
                                </p>
                            </div>

                            {selectedDoc.options.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{
                                        fontFamily: tokens.font.sans,
                                        fontSize: 10,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: tokens.color.amber.base,
                                        marginBottom: 12,
                                        letterSpacing: 1
                                    }}>
                                        Available Flags
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {selectedDoc.options.map((opt, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                gap: 16,
                                                padding: '10px 0',
                                                borderBottom: `1px solid ${tokens.color.bg.overlay}`,
                                            }}>
                                                <code style={{
                                                    fontFamily: tokens.font.mono,
                                                    color: tokens.color.lime.base,
                                                    fontSize: 12,
                                                    minWidth: 80,
                                                    fontWeight: 700
                                                }}>
                                                    {opt.flag}
                                                </code>
                                                <span style={{ color: tokens.color.text.secondary, fontSize: 12 }}>{opt.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDoc.examples.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{
                                        fontFamily: tokens.font.sans,
                                        fontSize: 10,
                                        fontWeight: 900,
                                        textTransform: 'uppercase',
                                        color: tokens.color.amber.base,
                                        marginBottom: 12,
                                        letterSpacing: 1
                                    }}>
                                        Execution Examples
                                    </h3>
                                    <div style={{
                                        background: tokens.color.bg.overlay,
                                        border: `1px solid ${tokens.color.border.default}`,
                                        padding: tokens.space[4],
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                        borderRadius: 4
                                    }}>
                                        {selectedDoc.examples.map((ex, i) => (
                                            <div key={i} style={{ 
                                                fontFamily: tokens.font.mono, 
                                                fontSize: 12, 
                                                color: tokens.color.lime.base,
                                                display: 'flex',
                                                gap: 8
                                            }}>
                                                <span style={{ opacity: 0.5 }}>$</span>
                                                {ex}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedDoc.seeAlso.length > 0 && (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <span style={{ fontSize: 9, fontFamily: tokens.font.mono, color: tokens.color.text.tertiary, textTransform: 'uppercase' }}>SYMLINKED:</span>
                                    {selectedDoc.seeAlso.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedCmd(s)}
                                            style={{
                                                background: tokens.color.bg.overlay,
                                                border: `1px solid ${tokens.color.border.default}`,
                                                color: tokens.color.lime.base,
                                                fontFamily: tokens.font.mono,
                                                fontSize: 10,
                                                padding: '2px 6px',
                                                cursor: 'pointer',
                                                borderRadius: 2
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.borderColor = tokens.color.lime.base}
                                            onMouseOut={(e) => e.currentTarget.style.borderColor = tokens.color.border.default}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
