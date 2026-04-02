import { CommandContext, CommandResult } from '../types';

export const dig = async (args: string[], context: CommandContext): Promise<CommandResult> => {
    const domain = args.filter(a => !a.startsWith('-') && !a.startsWith('+'))[0] || 'example.com';
    const outputLines = [
        '',
        `; <<>> DiG 9.18.1 <<>> ${domain}`,
        ';; global options: +cmd',
        ';; Got answer:',
        ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 42069',
        ';; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1',
        '',
        ';; OPT PSEUDOSECTION:',
        '; EDNS: version: 0, flags:; udp: 65494',
        ';; QUESTION SECTION:',
        `;${domain}.			IN	A`,
        '',
        ';; ANSWER SECTION:',
        `${domain}.		300	IN	A	93.184.216.34`,
        '',
        ';; Query time: 12 msec',
        `;; SERVER: 127.0.0.53#53(127.0.0.53) (simulated)`,
        `;; WHEN: ${new Date().toString()}`,
        ';; MSG SIZE  rcvd: 56',
        ''
    ];
    return { output: outputLines.join('\n'), exitCode: 0 };
};
