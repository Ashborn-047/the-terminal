import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch03Assessment: ChapterAssessment[] = [
    // --- TRACK1-CH03: Reading the Story ---
    // EASY
    {
        id: "ch03_e01",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command displays the entire content of a file?",
        options: ["head", "tail", "cat", "wc"],
        correctAnswer: "cat",
        hint: "cat concatenates and prints the whole file."
    },
    {
        id: "ch03_e02",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'head -n 5 file.txt' do?",
        options: [
            "Shows last 5 lines",
            "Shows first 5 lines",
            "Deletes first 5 lines",
            "Counts lines"
        ],
        correctAnswer: "Shows first 5 lines",
        hint: "head outputs the first lines; -n 5 specifies the count."
    },
    {
        id: "ch03_e03",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command shows the last 10 lines of a file?",
        options: ["head -10", "tail -10", "cat -10", "wc -l"],
        correctAnswer: "tail -10",
        hint: "tail outputs the last part of a file."
    },
    {
        id: "ch03_e04",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does the '>' symbol do in a command?",
        options: [
            "Appends output to a file",
            "Redirects output overwriting a file",
            "Chains commands",
            "Comments"
        ],
        correctAnswer: "Redirects output overwriting a file",
        hint: "> redirects stdout to a file, overwriting it."
    },
    {
        id: "ch03_e05",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which symbol appends output to a file without overwriting?",
        options: [">", ">>", "|", "<"],
        correctAnswer: ">>",
        hint: ">> appends to a file."
    },
    {
        id: "ch03_e06",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does the pipe '|' do?",
        options: [
            "Redirects output to a file",
            "Sends output of one command as input to another",
            "Separates commands on one line",
            "Grep pattern"
        ],
        correctAnswer: "Sends output of one command as input to another",
        hint: "| connects stdout of the left command to stdin of the right."
    },
    {
        id: "ch03_e07",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command sorts lines alphabetically?",
        options: ["uniq", "sort", "grep", "wc"],
        correctAnswer: "sort",
        hint: "sort orders lines."
    },
    {
        id: "ch03_e08",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'uniq' do?",
        options: [
            "Sorts unique lines",
            "Removes adjacent duplicate lines",
            "Counts characters",
            "Transliterates"
        ],
        correctAnswer: "Removes adjacent duplicate lines",
        hint: "uniq removes or reports adjacent duplicate lines."
    },
    {
        id: "ch03_e09",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you combine 'sort' and 'uniq' to get only unique lines?",
        options: [
            "sort | uniq",
            "uniq | sort",
            "sort -u",
            "Both sort | uniq and sort -u"
        ],
        correctAnswer: "Both sort | uniq and sort -u",
        hint: "sort file | uniq and sort -u both work."
    },
    {
        id: "ch03_e10",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'tail -f' do?",
        options: [
            "Shows last 10 lines and exits",
            "Follows a file, displaying new lines as added",
            "Shows file format",
            "Formats output"
        ],
        correctAnswer: "Follows a file, displaying new lines as added",
        hint: "tail -f keeps watching for appended data."
    },
    {
        id: "ch03_e11",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command counts lines, words, and characters?",
        options: ["wc", "count", "wc -l", "ls"],
        correctAnswer: "wc",
        hint: "wc (word count) with no flags shows all three."
    },
    {
        id: "ch03_e12",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you redirect stderr to a file?",
        options: [">", "2>", "&>", "1>"],
        correctAnswer: "2>",
        hint: "2> redirects standard error."
    },
    {
        id: "ch03_e13",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What is the output of 'cat file1 file2'?",
        options: [
            "Appends file2 to file1",
            "Displays file1 then file2",
            "Only file1",
            "Error"
        ],
        correctAnswer: "Displays file1 then file2",
        hint: "cat concatenates and prints the combined content."
    },
    {
        id: "ch03_e14",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command combines stdout and stderr into one file?",
        options: ["> file 2>&1", "&> file", "1>&2", "Both > file 2>&1 and &> file"],
        correctAnswer: "Both > file 2>&1 and &> file",
        hint: "Both > file 2>&1 and &> file redirect both streams."
    },
    {
        id: "ch03_e15",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -r' do?",
        options: [
            "Sorts randomly",
            "Sorts in reverse order",
            "Removes duplicates",
            "Sorts numerically"
        ],
        correctAnswer: "Sorts in reverse order",
        hint: "-r reverses the sort order."
    },

    // MEDIUM
    {
        id: "ch03_m01",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'cat file.txt > file.txt' do?",
        options: [
            "Doubles file size",
            "Empties the file",
            "Does nothing",
            "Shows error"
        ],
        correctAnswer: "Empties the file",
        hint: "The shell truncates the output file before cat reads it."
    },
    {
        id: "ch03_m02",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How would you display only the 3rd line of a file?",
        options: [
            "head -3 file | tail -1",
            "tail -3 file | head -1",
            "sed -n '3p' file",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All are valid methods."
    },
    {
        id: "ch03_m03",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -n' do?",
        options: [
            "Sorts numerically",
            "Sorts by name",
            "Sorts ignoring case",
            "Sorts unique"
        ],
        correctAnswer: "Sorts numerically",
        hint: "-n sorts by numeric value."
    },
    {
        id: "ch03_m04",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Why might 'uniq file' not remove all duplicates?",
        options: [
            "uniq only works on sorted input",
            "uniq only removes adjacent duplicates",
            "uniq requires -d",
            "uniq is for unique files only"
        ],
        correctAnswer: "uniq only removes adjacent duplicates",
        hint: "uniq works on adjacent lines, so duplicates must be grouped."
    },
    {
        id: "ch03_m05",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which pipeline gives a count of each unique line?",
        options: [
            "sort | uniq -c",
            "sort | uniq -d",
            "sort -u | wc -l",
            "uniq -c | sort"
        ],
        correctAnswer: "sort | uniq -c",
        hint: "sort groups them, uniq -c prepends counts."
    },
    {
        id: "ch03_m06",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'tee' do?",
        options: [
            "Splits output, writing to files and stdout",
            "Creates a pipe",
            "Counts lines",
            "Truncates files"
        ],
        correctAnswer: "Splits output, writing to files and stdout",
        hint: "tee reads stdin and writes to both files and stdout."
    },
    {
        id: "ch03_m07",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What will 'ls -l 2> error.log' do?",
        options: [
            "Redirects errors to error.log, normal output to screen",
            "Redirects all output to error.log",
            "Ignores errors",
            "Sends errors to screen"
        ],
        correctAnswer: "Redirects errors to error.log, normal output to screen",
        hint: "2> redirects only stderr."
    },
    {
        id: "ch03_m08",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you avoid the 'Useless Use of Cat'?",
        options: [
            "Use grep file instead of cat file | grep",
            "Always use cat",
            "Use awk instead",
            "Never use pipes"
        ],
        correctAnswer: "Use grep file instead of cat file | grep",
        hint: "grep can read files directly: grep pattern file."
    },
    {
        id: "ch03_m09",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command concatenates two files and saves the output?",
        options: [
            "cat file1 file2 > output",
            "cp file1+file2 output",
            "mv file1 file2 output",
            "join file1 file2"
        ],
        correctAnswer: "cat file1 file2 > output",
        hint: "cat file1 file2 > output does the job."
    },
    {
        id: "ch03_m10",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -t: -k3,3 /etc/passwd' do?",
        options: [
            "Sorts by third field using ':' as delimiter",
            "Sorts reverse",
            "Sorts unique",
            "Sorts ignoring colons"
        ],
        correctAnswer: "Sorts by third field using ':' as delimiter",
        hint: "-t sets delimiter, -k selects field."
    },
    {
        id: "ch03_m11",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'wc -l' count?",
        options: ["Words", "Characters", "Lines", "Files"],
        correctAnswer: "Lines",
        hint: "-l counts lines."
    },
    {
        id: "ch03_m12",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you redirect both stdout and stderr to the same file using simple syntax?",
        options: ["&> file", "> file 2>&1", "2>&1 > file", "Both &> file and > file 2>&1"],
        correctAnswer: "Both &> file and > file 2>&1",
        hint: "&> and > file 2>&1 both work."
    },
    {
        id: "ch03_m13",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command displays the file with line numbers?",
        options: ["cat -n", "nl", "wc -l", "Both cat -n and nl"],
        correctAnswer: "Both cat -n and nl",
        hint: "cat -n and nl both add line numbers."
    },
    {
        id: "ch03_m14",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does '2>&1' mean?",
        options: [
            "Redirects stderr to stdout",
            "Redirects stdout to stderr",
            "Sends file descriptor 2 to file 1",
            "Error"
        ],
        correctAnswer: "Redirects stderr to stdout",
        hint: "It makes stderr go to the same place as stdout."
    },
    {
        id: "ch03_m15",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "If you run 'sort -u file', what is the equivalent pipeline?",
        options: [
            "sort file | uniq",
            "uniq file | sort",
            "cat file | uniq -c",
            "sort file | wc -l"
        ],
        correctAnswer: "sort file | uniq",
        hint: "sort -u outputs unique sorted lines, same as sort | uniq."
    },

    // HARD
    {
        id: "ch03_h01",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you reverse the order of lines in a file?",
        options: ["tac file", "sort -r file", "rev file", "cat file | reverse"],
        correctAnswer: "tac file",
        hint: "tac concatenates files in reverse line order."
    },
    {
        id: "ch03_h02",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What will 'sort -t: -k2n /etc/passwd' do?",
        options: [
            "Sort by second field numerically",
            "Sort by first field",
            "Remove duplicates",
            "Translate delimiters"
        ],
        correctAnswer: "Sort by second field numerically",
        hint: "-t: sets delimiter, -k2n means second field numeric sort."
    },
    {
        id: "ch03_h03",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which of these is equivalent to 'tail -n +10 file'?",
        options: [
            "sed '1,9d' file",
            "awk 'NR>=10' file",
            "head -n -9 file",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All skip the first 9 lines and print rest."
    },
    {
        id: "ch03_h04",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you join lines of a file into a single line, separated by commas?",
        options: [
            "paste -s -d, file",
            "tr '\\n' ',' < file",
            "awk '{printf \"%s,\", $0}' file",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        hint: "All achieve the same result."
    },
    {
        id: "ch03_h05",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'split -l 100 file' do?",
        options: [
            "Splits the file into pieces of 100 lines each",
            "Deletes 100 lines",
            "Counts every 100 lines",
            "Shows 100 lines"
        ],
        correctAnswer: "Splits the file into pieces of 100 lines each",
        hint: "split creates smaller files based on line count."
    },
    {
        id: "ch03_h06",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What is the effect of 'cat *.log > combined.log'?",
        options: [
            "Concatenates all .log files into combined.log",
            "Creates a directory named combined.log",
            "Lists all .log files",
            "Error"
        ],
        correctAnswer: "Concatenates all .log files into combined.log",
        hint: "Wildcard * matches all .log files, cat combines them, > redirects to combined.log."
    },
    {
        id: "ch03_h07",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you search for 'root' in /etc/passwd and see the line number?",
        options: ["grep -n root /etc/passwd", "cat -n /etc/passwd | grep root", "grep -c root /etc/passwd", "Both grep -n and cat -n | grep"],
        correctAnswer: "Both grep -n and cat -n | grep",
        hint: "Both methods provide the line number."
    },
    {
        id: "ch03_h08",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'shuf file.txt' do?",
        options: [
            "Sorts the file",
            "Randomly permutes the lines",
            "Shifts lines left",
            "Splits lines"
        ],
        correctAnswer: "Randomly permutes the lines",
        hint: "shuf outputs a random permutation of input lines."
    },
    {
        id: "ch03_h09",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command shows only the lines that are unique to each of two sorted files?",
        options: ["comm -3 file1 file2", "diff file1 file2", "cmp file1 file2", "uniq -u file1 file2"],
        correctAnswer: "comm -3 file1 file2",
        hint: "comm -3 suppresses lines appearing in both files."
    },
    {
        id: "ch03_h10",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'head -c 10 file' do?",
        options: [
            "Shows first 10 lines",
            "Shows first 10 characters (bytes)",
            "Shows 10 columns",
            "Error"
        ],
        correctAnswer: "Shows first 10 characters (bytes)",
        hint: "-c specifies byte count."
    },
    {
        id: "ch03_h11",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "How do you append the text 'EOF' to a file named 'config'?",
        options: ["echo 'EOF' >> config", "cat 'EOF' >> config", "append 'EOF' config", "echo 'EOF' > config"],
        correctAnswer: "echo 'EOF' >> config",
        hint: "echo with >> appends the string."
    },
    {
        id: "ch03_h12",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'sort -M' do?",
        options: [
            "Sorts by month (JAN, FEB, etc.)",
            "Sorts by size",
            "Sorts by modification time",
            "Sorts merge"
        ],
        correctAnswer: "Sorts by month (JAN, FEB, etc.)",
        hint: "-M sorts by three-letter month abbreviations."
    },
    {
        id: "ch03_h13",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command would you use to see if two files are identical byte-for-byte?",
        options: ["cmp file1 file2", "diff file1 file2", "comm file1 file2", "cat file1 file2"],
        correctAnswer: "cmp file1 file2",
        hint: "cmp compares files byte by byte and stops at the first difference."
    },
    {
        id: "ch03_h14",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "What does 'tail -q file1 file2' do?",
        options: [
            "Shows last lines without headers",
            "Shows last lines with headers",
            "Quiet mode",
            "Quick mode"
        ],
        correctAnswer: "Shows last lines without headers",
        hint: "-q (quiet) suppresses headers when multiple files are given."
    },
    {
        id: "ch03_h15",
        chapterId: "track1-ch03",
        type: "mcq",
        question: "Which command converts tabs to spaces in a file?",
        options: ["expand file", "unexpand file", "tabs file", "tr '\\t' ' ' < file"],
        correctAnswer: "expand file",
        hint: "expand converts tabs to spaces; unexpand does the opposite."
    }
];
