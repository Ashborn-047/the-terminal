/**
 * Command documentation for the `man` command.
 * Each entry matches the structure described in project_documentation.md §4.4
 */

export interface CommandDoc {
    name: string;
    synopsis: string;
    description: string;
    options: { flag: string; desc: string }[];
    examples: string[];
    seeAlso: string[];
}

export const COMMAND_DOCS: Record<string, CommandDoc> = {
    ls: {
        name: 'ls',
        synopsis: 'ls [OPTION]... [FILE]...',
        description: 'List directory contents. By default, lists the current directory.',
        options: [
            { flag: '-a', desc: 'Do not ignore entries starting with .' },
            { flag: '-l', desc: 'Use a long listing format' },
            { flag: '-la', desc: 'Combine long format with hidden files' },
        ],
        examples: ['ls', 'ls -la', 'ls /etc'],
        seeAlso: ['cd', 'pwd', 'find'],
    },
    cd: {
        name: 'cd',
        synopsis: 'cd [DIR]',
        description: 'Change the current working directory. Without arguments, changes to the home directory.',
        options: [],
        examples: ['cd /home', 'cd ..', 'cd ~'],
        seeAlso: ['pwd', 'ls'],
    },
    pwd: {
        name: 'pwd',
        synopsis: 'pwd',
        description: 'Print the full pathname of the current working directory.',
        options: [],
        examples: ['pwd'],
        seeAlso: ['cd'],
    },
    mkdir: {
        name: 'mkdir',
        synopsis: 'mkdir [OPTION] DIRECTORY...',
        description: 'Create one or more directories.',
        options: [
            { flag: '-p', desc: 'Create parent directories as needed, no error if existing' },
        ],
        examples: ['mkdir mydir', 'mkdir -p projects/web/src'],
        seeAlso: ['rmdir', 'ls'],
    },
    touch: {
        name: 'touch',
        synopsis: 'touch FILE...',
        description: 'Create an empty file or update the access/modification times of an existing file.',
        options: [],
        examples: ['touch newfile.txt', 'touch a.txt b.txt'],
        seeAlso: ['cat', 'rm'],
    },
    cat: {
        name: 'cat',
        synopsis: 'cat FILE...',
        description: 'Concatenate and display file contents.',
        options: [],
        examples: ['cat /etc/hostname', 'cat file1.txt file2.txt'],
        seeAlso: ['head', 'tail', 'grep'],
    },
    rm: {
        name: 'rm',
        synopsis: 'rm [OPTION] FILE...',
        description: 'Remove files or directories.',
        options: [
            { flag: '-r', desc: 'Remove directories and their contents recursively' },
            { flag: '-f', desc: 'Ignore nonexistent files, never prompt' },
            { flag: '-rf', desc: 'Forcefully remove recursively' },
        ],
        examples: ['rm file.txt', 'rm -rf mydir'],
        seeAlso: ['mkdir', 'touch'],
    },
    cp: {
        name: 'cp',
        synopsis: 'cp [OPTION] SOURCE DEST',
        description: 'Copy files and directories.',
        options: [
            { flag: '-r', desc: 'Copy directories recursively' },
            { flag: '-R', desc: 'Same as -r' },
        ],
        examples: ['cp file.txt backup.txt', 'cp -r src/ dest/'],
        seeAlso: ['mv', 'rm'],
    },
    mv: {
        name: 'mv',
        synopsis: 'mv SOURCE DEST',
        description: 'Move (rename) files or directories.',
        options: [],
        examples: ['mv old.txt new.txt', 'mv file.txt /tmp/'],
        seeAlso: ['cp', 'rm'],
    },
    grep: {
        name: 'grep',
        synopsis: 'grep [OPTION] PATTERN FILE...',
        description: 'Search for lines matching a pattern in files.',
        options: [
            { flag: '-i', desc: 'Ignore case distinctions' },
            { flag: '-v', desc: 'Invert match: select non-matching lines' },
            { flag: '-n', desc: 'Prefix each line with line number' },
        ],
        examples: ['grep root /etc/passwd', 'grep -i error /var/log/syslog'],
        seeAlso: ['find', 'cat', 'wc'],
    },
    chmod: {
        name: 'chmod',
        synopsis: 'chmod MODE FILE...',
        description: 'Change file mode (permissions). MODE is given as an octal number (e.g., 755).',
        options: [],
        examples: ['chmod 755 script.sh', 'chmod 644 file.txt'],
        seeAlso: ['chown', 'ls -l'],
    },
    chown: {
        name: 'chown',
        synopsis: 'chown OWNER FILE...',
        description: 'Change file owner. Only root can change ownership.',
        options: [],
        examples: ['chown root /etc/hostname'],
        seeAlso: ['chmod'],
    },
    ln: {
        name: 'ln',
        synopsis: 'ln -s TARGET LINK_NAME',
        description: 'Create a symbolic link to a target.',
        options: [
            { flag: '-s', desc: 'Create symbolic (soft) link' },
        ],
        examples: ['ln -s /etc/hostname mylink'],
        seeAlso: ['ls', 'rm'],
    },
    find: {
        name: 'find',
        synopsis: 'find [PATH] [OPTIONS]',
        description: 'Search for files in a directory hierarchy.',
        options: [
            { flag: '-name PATTERN', desc: 'Match files by name (supports * and ? globbing)' },
        ],
        examples: ['find /etc -name "*.conf"', 'find .'],
        seeAlso: ['grep', 'ls'],
    },
    echo: {
        name: 'echo',
        synopsis: 'echo [STRING]...',
        description: 'Display text. Supports $VAR environment variable expansion.',
        options: [],
        examples: ['echo hello world', 'echo $HOME'],
        seeAlso: ['env', 'cat'],
    },
    whoami: {
        name: 'whoami',
        synopsis: 'whoami',
        description: 'Print the current user name.',
        options: [],
        examples: ['whoami'],
        seeAlso: ['id', 'sudo'],
    },
    uname: {
        name: 'uname',
        synopsis: 'uname [OPTION]',
        description: 'Print system information.',
        options: [
            { flag: '-a', desc: 'Print all information' },
        ],
        examples: ['uname', 'uname -a'],
        seeAlso: ['hostname'],
    },
    sudo: {
        name: 'sudo',
        synopsis: 'sudo COMMAND [ARGS]...',
        description: 'Execute a command as root. In this simulation, sudo always succeeds.',
        options: [],
        examples: ['sudo chown root file.txt', 'sudo rm -rf /tmp/junk'],
        seeAlso: ['whoami', 'chown'],
    },
    history: {
        name: 'history',
        synopsis: 'history',
        description: 'Display the command history for the current session.',
        options: [],
        examples: ['history'],
        seeAlso: ['clear'],
    },
    head: {
        name: 'head',
        synopsis: 'head [-n NUM] FILE',
        description: 'Display the first lines of a file (default: 10).',
        options: [
            { flag: '-n NUM', desc: 'Number of lines to display' },
        ],
        examples: ['head /etc/passwd', 'head -n 5 /var/log/syslog'],
        seeAlso: ['tail', 'cat'],
    },
    tail: {
        name: 'tail',
        synopsis: 'tail [-n NUM] FILE',
        description: 'Display the last lines of a file (default: 10).',
        options: [
            { flag: '-n NUM', desc: 'Number of lines to display' },
        ],
        examples: ['tail /var/log/syslog', 'tail -n 3 file.txt'],
        seeAlso: ['head', 'cat'],
    },
    wc: {
        name: 'wc',
        synopsis: 'wc FILE...',
        description: 'Print newline, word, and byte counts for each file.',
        options: [],
        examples: ['wc /etc/passwd'],
        seeAlso: ['cat', 'grep'],
    },
};
