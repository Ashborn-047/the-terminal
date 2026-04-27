import React from 'react';
import {
    tokens,
    Card,
    Display,
    Label,
    Button
} from '../components/ui/AshbornDesignSystem';
import { Terminal, Database, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * AboutLinuxPage — Educational resource covering basic concepts.
 */
export const AboutLinuxPage: React.FC = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "The Linux Kernel",
            icon: <Zap size={24} color={tokens.color.lime.base} />,
            content: "The kernel is the core of the Linux operating system. It manages hardware resources, memory, and processes. When you type a command, the shell translates it into system calls that the kernel understands, effectively bridging the gap between userland applications and the physical hardware."
        },
        {
            title: "Filesystem Hierarchy Standard (FHS)",
            icon: <Database size={24} color={tokens.color.amber.base} />,
            content: "Linux organizes files in a strict hierarchical tree starting from the root directory (/). Important directories include /bin (essential binaries), /etc (system configuration), /home (user directories), and /var (variable data like logs). Understanding the FHS is critical for navigating the system."
        },
        {
            title: "The Shell",
            icon: <Terminal size={24} color={tokens.color.text.secondary} />,
            content: "The shell (like Bash or Zsh) is a command-line interpreter. It provides the prompt where you type commands, reads your input, and executes the corresponding programs. The shell also supports powerful features like scripting, pipes, and redirection, allowing you to chain commands together."
        },
        {
            title: "The CLI Philosophy",
            icon: <Shield size={24} color={tokens.color.lime.alpha[8]} />,
            content: "The Unix philosophy emphasizes building simple, modular tools that do one thing well. By combining these tools using pipelines (e.g., `ls | grep .txt`), users can accomplish complex tasks efficiently without needing monolithic applications with heavy graphical interfaces."
        }
    ];

    return (
        <div style={{
            padding: tokens.space[8],
            maxWidth: 800,
            margin: '0 auto',
            height: '100%',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.space[8] }}>
                <div>
                    <Display as="h1" size="lg" color={tokens.color.lime.base}>About Linux</Display>
                    <Label size="md" color={tokens.color.text.secondary}>Core Architecture & Philosophy</Label>
                </div>
                <Button variant="outline" onClick={() => navigate('/labs')}>BACK TO CURRICULUM</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {sections.map((sec, i) => (
                    <Card key={i} variant="default" style={{
                        border: `2px solid ${tokens.color.border.strong}`,
                        boxShadow: `4px 4px 0px ${tokens.color.border.strong}`
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: tokens.space[4] }}>
                            {sec.icon}
                            <Display as="h2" size="sm" color={tokens.color.text.primary}>{sec.title}</Display>
                        </div>
                        <Label size="sm" color={tokens.color.text.secondary} style={{ lineHeight: 1.6 }}>
                            {sec.content}
                        </Label>
                    </Card>
                ))}
            </div>

            <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Button variant="lime" size="lg" onClick={() => navigate('/terminal')}>
                    OPEN TERMINAL
                </Button>
            </div>
        </div>
    );
};

export default AboutLinuxPage;
