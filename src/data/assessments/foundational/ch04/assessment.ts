import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch04Assessment: ChapterAssessment[] = [
    // --- TRACK1-CH04: Mastering Vim ---
    // EASY
    {
        id: "ch04_e01",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which mode is Vim in when you first open it?",
        options: ["Insert mode", "Normal mode", "Visual mode", "Command mode"],
        correctAnswer: "Normal mode",
        hint: "Vim starts in Normal mode, where keys are commands."
    },
    {
        id: "ch04_e02",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you enter Insert mode?",
        options: ["Press i", "Press Esc", "Press :", "Press v"],
        correctAnswer: "Press i",
        hint: "i switches to Insert mode before the cursor."
    },
    {
        id: "ch04_e03",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you save a file and quit Vim?",
        options: [":q", ":w", ":wq", ":save"],
        correctAnswer: ":wq",
        hint: ":wq writes and quits. :x does the same."
    },
    {
        id: "ch04_e04",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you quit without saving?",
        options: [":q", ":q!", ":wq", ":x"],
        correctAnswer: ":q!",
        hint: ":q! forces quit, discarding changes."
    },
    {
        id: "ch04_e05",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key deletes a line in Normal mode?",
        options: ["x", "dd", "d", "dl"],
        correctAnswer: "dd",
        hint: "dd deletes the entire current line."
    },
    {
        id: "ch04_e06",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key copies (yanks) a line?",
        options: ["yy", "cc", "dd", "pp"],
        correctAnswer: "yy",
        hint: "yy yanks the current line into the buffer."
    },
    {
        id: "ch04_e07",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you paste yanked or deleted text?",
        options: ["Ctrl+v", "p", "y", "i"],
        correctAnswer: "p",
        hint: "p pastes after the cursor."
    },
    {
        id: "ch04_e08",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you undo in Vim?",
        options: ["Ctrl+z", "u", "Undo", ":undo"],
        correctAnswer: "u",
        hint: "u undoes the last change."
    },
    {
        id: "ch04_e09",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key moves the cursor up in Normal mode?",
        options: ["j", "k", "h", "l"],
        correctAnswer: "k",
        hint: "k moves up, j moves down."
    },
    {
        id: "ch04_e10",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you search for 'error' forward?",
        options: ["/error", "?error", "s/error", "f error"],
        correctAnswer: "/error",
        hint: "/ searches forward, ? searches backward."
    },
    {
        id: "ch04_e11",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you replace all occurrences of 'foo' with 'bar' in a file?",
        options: [":s/foo/bar/g", ":%s/foo/bar/g", ":replace foo bar", ":g/foo/bar"],
        correctAnswer: ":%s/foo/bar/g",
        hint: "% means whole file, s means substitute, g means global on each line."
    },
    {
        id: "ch04_e12",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which key enters Visual mode for line selection?",
        options: ["v", "V", "Ctrl+v", "s"],
        correctAnswer: "V",
        hint: "V selects whole lines; v selects characters."
    },
    {
        id: "ch04_e13",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you go to the end of the file?",
        options: ["G", "gg", "$", "End"],
        correctAnswer: "G",
        hint: "G goes to the last line; gg goes to the first."
    },
    {
        id: "ch04_e14",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'dw' do in Normal mode?",
        options: ["Deletes the whole file", "Deletes a word", "Duplicates a word", "Draws a window"],
        correctAnswer: "Deletes a word",
        hint: "dw is the delete operator + word motion."
    },
    {
        id: "ch04_e15",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you append text at the end of the current line?",
        options: ["a", "A", "i", "o"],
        correctAnswer: "A",
        hint: "A jumps to end of line and enters Insert mode."
    },

    // MEDIUM
    {
        id: "ch04_m01",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is the difference between :wq and :x?",
        options: [
            "No difference — both save and quit",
            ":wq always writes, :x only writes if changed",
            ":x doesn't work on new files",
            ":wq quits without saving"
        ],
        correctAnswer: ":wq always writes, :x only writes if changed",
        hint: ":x saves only if the file was modified; :wq always writes."
    },
    {
        id: "ch04_m02",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you delete from the cursor to the end of the line?",
        options: ["d$", "dd", "dw", "d0"],
        correctAnswer: "d$",
        hint: "d$ uses the motion $ (end of line) with the delete operator."
    },
    {
        id: "ch04_m03",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'cw' do?",
        options: [
            "Copies a word",
            "Changes (deletes) a word and enters Insert mode",
            "Counts words",
            "Searches for a word"
        ],
        correctAnswer: "Changes (deletes) a word and enters Insert mode",
        hint: "cw is change word: deletes to end of word and enters Insert mode."
    },
    {
        id: "ch04_m04",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you redo after an undo?",
        options: ["Ctrl+r", "Ctrl+y", "u again", "R"],
        correctAnswer: "Ctrl+r",
        hint: "Ctrl+r redoes the last undone change."
    },
    {
        id: "ch04_m05",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "Which command deletes lines 5 through 10?",
        options: [":5,10d", ":d5-10", "5,10dd", ":delete 5 10"],
        correctAnswer: ":5,10d",
        hint: ":5,10d applies the delete command to that range."
    },
    {
        id: "ch04_m06",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you search for the word under the cursor?",
        options: ["*", "/word", "?word", "s/word"],
        correctAnswer: "*",
        hint: "Pressing * searches forward for the word under the cursor."
    },
    {
        id: "ch04_m07",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'yy' followed by '5p' do?",
        options: [
            "Pastes the yanked line 5 times",
            "Yanks 5 lines and pastes them",
            "Prints line 5",
            "Nothing"
        ],
        correctAnswer: "Pastes the yanked line 5 times",
        hint: "A number before p repeats the paste that many times."
    },
    {
        id: "ch04_m08",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you open a new line below the current one and enter Insert mode?",
        options: ["o", "O", "i", "Enter"],
        correctAnswer: "o",
        hint: "o opens a line below; O opens above."
    },
    {
        id: "ch04_m09",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':%s/old/new/gc' do?",
        options: [
            "Replace all 'old' with 'new', asking for confirmation each time",
            "Replace all without asking",
            "Only count matches",
            "Replace in current line only"
        ],
        correctAnswer: "Replace all 'old' with 'new', asking for confirmation each time",
        hint: "The c flag prompts for confirmation before each substitution."
    },
    {
        id: "ch04_m10",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you go to line 42?",
        options: [":42", "42G", "42gg", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: ":42 and 42G both jump to line 42."
    },
    {
        id: "ch04_m11",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'dG' do?",
        options: [
            "Deletes from cursor to end of file",
            "Deletes the whole file",
            "Deletes to beginning of file",
            "Duplicates the file"
        ],
        correctAnswer: "Deletes from cursor to end of file",
        hint: "dG deletes from current line to the end of the file."
    },
    {
        id: "ch04_m12",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you record a macro in Vim?",
        options: ["q followed by a register letter", "Ctrl+r", "m", ":macro"],
        correctAnswer: "q followed by a register letter",
        hint: "q<letter> starts recording; q again stops."
    },
    {
        id: "ch04_m13",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does Visual Block mode (Ctrl+v) allow you to do?",
        options: [
            "Select rectangular blocks of text",
            "Select whole lines only",
            "Draw ASCII art",
            "Select words"
        ],
        correctAnswer: "Select rectangular blocks of text",
        hint: "Ctrl+v enters Visual Block mode for column-wise selection."
    },
    {
        id: "ch04_m14",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you indent a block of selected lines?",
        options: [">", "<", "Tab", "i"],
        correctAnswer: ">",
        hint: "> indents; < unindents selected lines."
    },
    {
        id: "ch04_m15",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':%!sort' do?",
        options: [
            "Runs the external sort command on the file contents",
            "Sorts lines alphabetically inside Vim",
            "Opens the sort menu",
            "Nothing"
        ],
        correctAnswer: "Runs the external sort command on the file contents",
        hint: "%! pipes the entire buffer through an external command."
    },

    // HARD
    {
        id: "ch04_h01",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you open a file in read-only mode with Vim?",
        options: ["vim -R file", "vim -r file", "vim --readonly file", "view file"],
        correctAnswer: "view file",
        hint: "view opens Vim in read-only mode (equivalent to vim -R)."
    },
    {
        id: "ch04_h02",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is the difference between 'd' and 'x' in Normal mode?",
        options: [
            "d is an operator that takes a motion; x deletes a single character",
            "x is faster",
            "d works only on lines",
            "No difference"
        ],
        correctAnswer: "d is an operator that takes a motion; x deletes a single character",
        hint: "d combines with motions (dw, dd); x is a single character delete."
    },
    {
        id: "ch04_h03",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':set nu' do?",
        options: [
            "Enables line numbers",
            "Sets the number of lines",
            "Counts lines",
            "Clears the buffer"
        ],
        correctAnswer: "Enables line numbers",
        hint: ":set nu (or :set number) displays line numbers."
    },
    {
        id: "ch04_h04",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you split a window horizontally?",
        options: [":split", ":vsplit", ":sp", "Both A and C"],
        correctAnswer: "Both A and C",
        hint: ":split and :sp both open a horizontal split."
    },
    {
        id: "ch04_h05",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':e!' do?",
        options: [
            "Reloads the file from disk, discarding changes",
            "Opens a new file",
            "Exits Vim",
            "Executes a macro"
        ],
        correctAnswer: "Reloads the file from disk, discarding changes",
        hint: ":e! reloads the current file, losing unsaved changes."
    },
    {
        id: "ch04_h06",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is a Vim register?",
        options: [
            "A storage location for yanked or deleted text",
            "A window pane",
            "A file type",
            "A macro recording"
        ],
        correctAnswer: "A storage location for yanked or deleted text",
        hint: "Registers store text; \"ay yanks into register a, \"ap pastes from it."
    },
    {
        id: "ch04_h07",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you execute a macro recorded in register 'a' 10 times?",
        options: ["10@a", "@a10", "10a", "macro a 10"],
        correctAnswer: "10@a",
        hint: "A count before @ repeats the macro that many times."
    },
    {
        id: "ch04_h08",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':set paste' do?",
        options: [
            "Enables paste mode to avoid auto-indentation when pasting",
            "Pastes from clipboard",
            "Deletes all text",
            "Saves the file"
        ],
        correctAnswer: "Enables paste mode to avoid auto-indentation when pasting",
        hint: "paste mode disables auto-indent and other formatting for clean pasting."
    },
    {
        id: "ch04_h09",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you convert tabs to spaces in Vim?",
        options: [":set expandtab", ":retab", ":set noexpandtab", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: ":set expandtab tells Vim to use spaces; :retab converts existing tabs."
    },
    {
        id: "ch04_h10",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What is the Vim leader key?",
        options: [
            "A customizable prefix for custom shortcuts",
            "The Esc key",
            "The colon key",
            "The same as Ctrl"
        ],
        correctAnswer: "A customizable prefix for custom shortcuts",
        hint: "The leader key (default \) allows custom key mappings."
    },
    {
        id: "ch04_h11",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does ':bufdo' do?",
        options: [
            "Executes a command on all open buffers",
            "Closes all buffers",
            "Lists buffers",
            "Saves all buffers"
        ],
        correctAnswer: "Executes a command on all open buffers",
        hint: ":bufdo applies a command to every buffer."
    },
    {
        id: "ch04_h12",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you diff two files in Vim?",
        options: ["vimdiff file1 file2", "vim -d file1 file2", ":diff file1 file2", "Both A and B"],
        correctAnswer: "Both A and B",
        hint: "vimdiff and vim -d both open a side-by-side diff."
    },
    {
        id: "ch04_h13",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'gg=G' do?",
        options: [
            "Re-indents the entire file",
            "Goes to top and bottom",
            "Deletes all lines",
            "Copies all lines"
        ],
        correctAnswer: "Re-indents the entire file",
        hint: "gg goes to top, = is the format operator, G is the motion to bottom."
    },
    {
        id: "ch04_h14",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "How do you view open buffers and switch between them?",
        options: [":ls then :bN", ":buffers then :bN", ":files", "All of the above"],
        correctAnswer: "All of the above",
        hint: ":ls or :buffers lists them; :b<number> switches."
    },
    {
        id: "ch04_h15",
        chapterId: "track1-ch04",
        type: "mcq",
        question: "What does 'cit' do?",
        options: [
            "Change inside tag (HTML/XML)",
            "Change inside text",
            "Count in text",
            "None of the above"
        ],
        correctAnswer: "Change inside tag (HTML/XML)",
        hint: "Vim text objects allow acting inside tags (it), quotes (i\"), etc."
    }
];
