import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch01Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c01_e01',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'What is the first line of a Bash script?',
        options: ['#!/bin/bash', '// bash', '#!/bin/sh', 'start bash'],
        correctAnswer: '#!/bin/bash',
        explanation: 'The shebang #!/bin/bash tells the system which interpreter to use.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e02',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you make a script executable?',
        options: ['chmod +x script.sh', 'exec script.sh', 'run script.sh', 'bash script.sh'],
        correctAnswer: 'chmod +x script.sh',
        explanation: 'chmod +x adds the execute permission.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e03',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What is the output of 'echo $HOME'?",
        options: ['Your home directory path', "The string '$HOME'", 'Error', 'Nothing'],
        correctAnswer: 'Your home directory path',
        explanation: '$HOME expands to the current user\'s home directory.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e04',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'Which loop iterates over a list of words?',
        options: ['for', 'while', 'until', 'case'],
        correctAnswer: 'for',
        explanation: 'for var in list; do ... done.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e05',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you assign a value to a variable in Bash?',
        options: ['name=value', 'name = value', 'set name=value', 'var name value'],
        correctAnswer: 'name=value',
        explanation: 'No spaces around =.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e06',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'grep ^root /etc/passwd' find?",
        options: [
            "Lines starting with 'root'",
            "Lines ending with 'root'",
            "Lines containing 'root' anywhere",
            "Hidden root files"
        ],
        correctAnswer: "Lines starting with 'root'",
        explanation: '^ matches the beginning of a line.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e07',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you run a command and capture its output?',
        options: ['$(command)', '$command', '{command}', '[command]'],
        correctAnswer: '$(command)',
        explanation: 'Command substitution uses $(command) or backticks.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e08',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'Which keyword starts a conditional block?',
        options: ['if', 'then', 'case', 'when'],
        correctAnswer: 'if',
        explanation: 'if [ condition ]; then commands; fi.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e09',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'sed s/old/new/' do?",
        options: [
            "Replaces the first 'old' with 'new' on each line",
            "Deletes lines with 'old'",
            "Prints lines with 'new'",
            "Creates a new file"
        ],
        correctAnswer: "Replaces the first 'old' with 'new' on each line",
        explanation: 's stands for substitute.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e10',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'What character matches the end of a line in regex?',
        options: ['$', '^', '*', '/'],
        correctAnswer: '$',
        explanation: '$ anchors the pattern to the end of the line.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e11',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you comment a single line in Bash?',
        options: ['# comment', '// comment', '; comment', '/* comment */'],
        correctAnswer: '# comment',
        explanation: 'The hash # begins a comment.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e12',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'wc -l file.txt' count?",
        options: ['Lines', 'Words', 'Characters', 'Bytes'],
        correctAnswer: 'Lines',
        explanation: '-l counts lines.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e13',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'Which command prints the first column of a file?',
        options: ["awk '{print $1}'", 'cut -f1', 'head -n1', 'ls -1'],
        correctAnswer: "awk '{print $1}'",
        explanation: "awk's print $1 outputs the first field.",
        difficulty: 'easy'
    },
    {
        id: 't2c01_e14',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "In a while loop, what does '((count++))' do?",
        options: ['Increments count by 1', 'Decrements count', 'Squares count', 'Nothing'],
        correctAnswer: 'Increments count by 1',
        explanation: '(( )) is arithmetic evaluation; ++ increments.',
        difficulty: 'easy'
    },
    {
        id: 't2c01_e15',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you handle input from a user?',
        options: ['read variable', 'input variable', 'get variable', 'scan variable'],
        correctAnswer: 'read variable',
        explanation: 'read captures input into a variable.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c01_m01',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What is the difference between ' ' and \" \" in Bash?",
        options: [
            'Single quotes prevent all expansion; double quotes allow variable and command expansion',
            'No difference',
            'Double quotes prevent expansion, single quotes allow',
            'Single quotes mark strong quoting, double weak'
        ],
        correctAnswer: 'Single quotes prevent all expansion; double quotes allow variable and command expansion',
        explanation: 'Single quotes are literal; double quotes expand variables and commands.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m02',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'for file in *; do echo $file; done' do?",
        options: [
            'Lists all files in the current directory',
            'Deletes all files',
            "Prints the word 'file'",
            'Nothing'
        ],
        correctAnswer: 'Lists all files in the current directory',
        explanation: '* expands to all filenames.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m03',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you redirect both stdout and stderr to the same file?',
        options: ['command &> file', 'command > file 2>&1', 'command 2>&1 > file', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: '&> is a shortcut; > file 2>&1 also works.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m04',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'grep -i' do?",
        options: ['Case‑insensitive search', 'Invert match', 'Interactive', 'Insert mode'],
        correctAnswer: 'Case‑insensitive search',
        explanation: '-i ignores case.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m05',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How can you iterate over numbers 1 to 10 in a for loop?',
        options: ['for i in {1..10}', 'for i in $(seq 1 10)', 'for ((i=1;i<=10;i++))', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All are valid methods.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m06',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'test -f /etc/passwd' check?",
        options: [
            'If the file exists and is a regular file',
            'If the file is a directory',
            'If the file is readable',
            'If the file is empty'
        ],
        correctAnswer: 'If the file exists and is a regular file',
        explanation: '-f tests for a regular file.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m07',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'What is the return value of a successful command?',
        options: ['0', '1', 'null', 'true'],
        correctAnswer: '0',
        explanation: '0 indicates success; non-zero indicates error.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m08',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you catch errors in a script?',
        options: [
            "Add 'set -e' at the top",
            "Use 'trap'",
            "Check '$?' after commands",
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'Multiple ways to handle errors.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m09',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'sed -n '5p' file' do?",
        options: ['Prints line 5', 'Deletes line 5', 'Prints all lines except 5', 'Nothing'],
        correctAnswer: 'Prints line 5',
        explanation: '-n suppresses automatic printing; p prints the line.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m10',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'What is the value of ${#variable}?',
        options: ['Length of variable', 'First character', 'If variable is set', 'Value of variable'],
        correctAnswer: 'Length of variable',
        explanation: '# returns the string length.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m11',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you write a multi‑condition if?',
        options: ['if [ cond1 ] && [ cond2 ]; then', 'if [ cond1 -a cond2 ]; then', 'if [[ cond1 && cond2 ]]; then', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All are valid but [[ ]] is preferred in modern bash.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m12',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'awk -F: '{print $NF}' /etc/passwd' show?",
        options: ['The last field of each line', 'The first field', 'The number of fields', 'Nothing'],
        correctAnswer: 'The last field of each line',
        explanation: 'NF is the number of fields; $NF is the value of the last field.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m13',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you prevent word splitting on a variable?',
        options: ['Double quote it: "$var"', 'Use single quotes', 'Use curly braces', 'Always use echo'],
        correctAnswer: 'Double quote it: "$var"',
        explanation: 'Quoting preserves spaces and special characters.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m14',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'set -x' do?",
        options: ['Prints each command before executing (debugging)', 'Exits on error', 'Disables command output', 'Sets a variable'],
        correctAnswer: 'Prints each command before executing (debugging)',
        explanation: '-x enables trace mode.',
        difficulty: 'medium'
    },
    {
        id: 't2c01_m15',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you read a file line by line?',
        options: [
            'while IFS= read -r line; do echo "$line"; done < file',
            'cat file | while read line; do ... done',
            'for line in $(cat file); do ... done',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'Both A and B are valid; A preserves whitespace better.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c01_h01',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'grep -P '\\d{3}-\\d{2}-\\d{4}' do?",
        options: [
            'Matches SSN-like patterns using Perl regex',
            'Fails because -P is not standard',
            'Lists processes',
            'Nothing'
        ],
        correctAnswer: 'Matches SSN-like patterns using Perl regex',
        explanation: '-P enables Perl-compatible regex.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h02',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What is the difference between '[' and '[['?",
        options: [
            '[[ is a bash keyword with more features (&&, ||, regex); [ is a built-in with limited operators',
            'No difference',
            '[[ works only in sh',
            '[ is faster'
        ],
        correctAnswer: '[[ is a bash keyword with more features (&&, ||, regex); [ is a built-in with limited operators',
        explanation: '[[ ]] supports pattern matching and is safer with empty variables.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h03',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How can you store the result of a command in an array?',
        options: [
            'readarray -t arr < <(command)',
            'arr=($(command))',
            'array=$(command)',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'readarray fills array by line; arr=() splits on words.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h04',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'IFS=' mean?",
        options: [
            'Sets the Internal Field Separator to empty, often used with read to preserve leading/trailing whitespace',
            'Infinite file system',
            'Input field size',
            'Inode file storage'
        ],
        correctAnswer: 'Sets the Internal Field Separator to empty, often used with read to preserve leading/trailing whitespace',
        explanation: 'IFS= disables word splitting on the read delimiter.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h05',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you debug a specific section of a Bash script?',
        options: [
            "Use 'set -x' before the section and 'set +x' after",
            'Add echo statements',
            'Use bashdb',
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'All are valid debugging techniques.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h06',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does ': ${VAR:=default}' do?",
        options: [
            "If VAR is unset or null, assign 'default' to it",
            'Prints VAR',
            'Exports VAR',
            'Deletes VAR'
        ],
        correctAnswer: "If VAR is unset or null, assign 'default' to it",
        explanation: ':= provides a default value assignment.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h07',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you create a function in Bash?',
        options: ['function_name() { commands; }', 'function function_name { commands; }', 'define function_name { commands; }', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'Both forms are valid.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h08',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'declare -r VAR=5' do?",
        options: ['Makes VAR read-only', 'Removes VAR', 'Reads VAR', 'Makes VAR 5'],
        correctAnswer: 'Makes VAR read-only',
        explanation: '-r creates a constant.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h09',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How can you redirect stderr through a pipe?',
        options: ['command 2>&1 | next', 'command 2> pipe', 'command |& next', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: '2>&1 merges stderr to stdout; |& is shorthand in bash 4+.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h10',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'trap 'echo interrupted' SIGINT' do?",
        options: [
            'Prints a message when Ctrl+C is pressed, instead of terminating',
            'Traps signals and exits',
            'Interrupts the script',
            'Ignors signals'
        ],
        correctAnswer: 'Prints a message when Ctrl+C is pressed, instead of terminating',
        explanation: 'trap catches signals and runs a command.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h11',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How do you convert a string to lowercase in Bash?',
        options: ['${var,,}', "tr '[:upper:]' '[:lower:]'", "awk '{print tolower($0)}'", 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All methods work.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h12',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'sed '1!G;h;$!d' file' do?",
        options: ['Reverses the order of lines', 'Deletes empty lines', 'Prints double spaced', 'Removes first line'],
        correctAnswer: 'Reverses the order of lines',
        explanation: 'A classic sed recipe to reverse the file.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h13',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'How can you find duplicate lines in a file with awk?',
        options: ["awk 'seen[$0]++' file", "awk '!seen[$0]++' file", 'uniq -d file', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'Several ways to detect duplicates.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h14',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: "What does 'shift' do in a script?",
        options: [
            'Shifts positional parameters ($2 becomes $1, etc.)',
            'Shifts file descriptors',
            'Moves to the next line',
            'Deletes arguments'
        ],
        correctAnswer: 'Shifts positional parameters ($2 becomes $1, etc.)',
        explanation: 'shift handles command‑line arguments.',
        difficulty: 'hard'
    },
    {
        id: 't2c01_h15',
        chapterId: 'track2-ch01',
        type: 'mcq',
        question: 'What is a here document?',
        options: [
            'A way to pass multi‑line input to a command using <<',
            'A file descriptor',
            'An archive',
            'A variable'
        ],
        correctAnswer: 'A way to pass multi‑line input to a command using <<',
        explanation: '<<EOF ... EOF redirects a block of text to stdin.',
        difficulty: 'hard'
    }
];
