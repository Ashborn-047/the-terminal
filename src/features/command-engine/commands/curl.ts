import { CommandContext, CommandResult } from '../types';

export const curl = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    if (args.length === 0) {
        return {
            output: '',
            error: 'curl: try \'curl --help\' for more information',
            exitCode: 2
        };
    }

    const url = args.find(a => !a.startsWith('-')) || 'http://example.com';

    async function* progressStream() {
        const barWidth = 40;
        const totalSteps = 100;

        yield `\r  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n`;
        yield `                                 Dload  Upload   Total   Spent    Left  Speed\n`;

        for (let i = 0; i <= totalSteps; i += 5) {
            if (context.isInterrupted()) break;

            const percentage = i;
            const spent = `0:00:0${Math.floor(i / 20)}`;
            const left = `0:00:0${5 - Math.floor(i / 20)}`;
            
            // ANSI escape for "Up one line, Clear line" is not needed if we stay on same line
            // But curl uses multiple lines. For simplicity, let's just do a single line progress bar first.
            // Actually, let's do the "high-fidelity" way:
            yield `\r${percentage.toString().padStart(3)}  100k  ${percentage.toString().padStart(3)}  100k    0     0  12.3k      0 --:--:-- ${spent} --:--:-- 12.4k`;
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        yield '\n';
        yield `<!DOCTYPE html>\n<html>\n<head>\n    <title>Example Domain</title>\n</head>\n<body>\n    <h1>Example Domain</h1>\n    <p>This domain is for use in illustrative examples in documents.</p>\n</body>\n</html>\n`;
    }

    return {
        output: '',
        exitCode: 0,
        stream: progressStream()
    };
};
