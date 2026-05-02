import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch07Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch07_e01',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'What does PID stand for?',
        options: ['Process ID', 'Program ID', 'Parent ID', 'Priority ID'],
        correctAnswer: 'Process ID',
        explanation: 'PID uniquely identifies a running process.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e02',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'Which command shows a dynamic, real-time view of processes?',
        options: ['ps', 'top', 'ls', 'pstree'],
        correctAnswer: 'top',
        explanation: 'top refreshes live; ps gives a static snapshot.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e03',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you send a SIGTERM to process 5678?',
        options: ['kill 5678', 'kill -9 5678', 'pkill 5678', 'stop 5678'],
        correctAnswer: 'kill 5678',
        explanation: 'kill sends SIGTERM by default.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e04',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'Which signal number is SIGKILL?',
        options: ['1', '9', '15', '19'],
        correctAnswer: '9',
        explanation: 'SIGKILL is signal 9.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e05',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'ps aux' display?",
        options: [
          'Only the current user\'s processes',
          'All processes in BSD format',
          'All processes in Unix format',
          'Only running processes'
        ],
        correctAnswer: 'All processes in BSD format',
        explanation: 'ps aux shows all processes for all users with BSD-style columns.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e06',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you run a command in the background?',
        options: ['command &bg', 'command &', 'bg command', 'bg command &'],
        correctAnswer: 'command &',
        explanation: 'Appending & to a command runs it in the background.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e07',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'fg' do?",
        options: [
          'Brings a background job to the foreground',
          'Starts a new foreground job',
          'Kills the current job',
          'Formats a disk'
        ],
        correctAnswer: 'Brings a background job to the foreground',
        explanation: 'fg resumes a suspended/background job in the foreground.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e08',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'Which command lists your background jobs?',
        options: ['jobs', 'bg', 'ps', 'list'],
        correctAnswer: 'jobs',
        explanation: 'jobs shows the jobs started in the current shell.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e09',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'pstree' show?",
        options: [
          'Process hierarchy tree',
          'Directory tree',
          'File system layout',
          'Package dependencies'
        ],
        correctAnswer: 'Process hierarchy tree',
        explanation: 'pstree visualizes parent-child process relationships.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e10',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'Which signal is used to politely ask a process to terminate?',
        options: ['SIGKILL', 'SIGTERM', 'SIGSTOP', 'SIGHUP'],
        correctAnswer: 'SIGTERM',
        explanation: 'SIGTERM (15) allows clean shutdown; SIGKILL is forceful.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e11',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'uptime' show?",
        options: [
          'How long the system has been running and load average',
          'Current time',
          'User login time',
          'Process running time'
        ],
        correctAnswer: 'How long the system has been running and load average',
        explanation: 'uptime displays system uptime and load averages.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e12',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you check available memory?',
        options: ['free -h', 'df -h', 'ps aux', 'top'],
        correctAnswer: 'free -h',
        explanation: 'free shows memory; -h makes it human-readable.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e13',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'killall firefox' do?",
        options: [
          'Kills all processes named firefox',
          'Kills the oldest firefox',
          'Restarts firefox',
          'Locks firefox'
        ],
        correctAnswer: 'Kills all processes named firefox',
        explanation: 'killall matches exact process names.',
        difficulty: 'easy'
    },
    {
        id: 'ch07_e14',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What is the default signal sent by 'kill'?",
        options: ['SIGKILL', 'SIGSTOP', 'SIGTERM', 'SIGHUP'],
        correctAnswer: 'SIGTERM',
        explanation: "kill sends SIGTERM (15) unless another signal is specified.",
        difficulty: 'easy'
    },
    {
        id: 'ch07_e15',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "Which key quits the 'top' command?",
        options: ['q', 'Ctrl+C', 'Esc', 'x'],
        correctAnswer: 'q',
        explanation: 'Press q to quit top.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch07_m01',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'What is the PPID?',
        options: [
          'Parent Process ID',
          'Priority Process ID',
          'Program Process ID',
          'Primary Process ID'
        ],
        correctAnswer: 'Parent Process ID',
        explanation: 'PPID is the PID of the process that spawned this one.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m02',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'kill -9 1234' do?",
        options: [
          'Sends SIGKILL, which forces process 1234 to stop immediately',
          'Sends SIGTERM',
          'Suspends the process',
          'Resumes the process'
        ],
        correctAnswer: 'Sends SIGKILL, which forces process 1234 to stop immediately',
        explanation: '-9 is the signal number for SIGKILL.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m03',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you send a SIGHUP to process 4321?',
        options: ['kill -1 4321', 'kill -HUP 4321', 'kill -SIGHUP 4321', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'You can use the number, the short name, or the full name.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m04',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'What does a load average of 1.00 mean on a single-CPU system?',
        options: [
          'The CPU was fully utilized exactly',
          'The system is overloaded',
          'No processes are running',
          'One user is logged in'
        ],
        correctAnswer: 'The CPU was fully utilized exactly',
        explanation: 'Load average 1.00 means one process was using or waiting for CPU on average.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m05',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What is the difference between 'pkill firefox' and 'killall firefox'?",
        options: [
          'pkill matches substrings, killall matches exact names',
          'No difference',
          'killall is safer',
          'pkill works only with PIDs'
        ],
        correctAnswer: 'pkill matches substrings, killall matches exact names',
        explanation: "pkill firefox matches firefox-bin; killall only matches 'firefox' exactly.",
        difficulty: 'medium'
    },
    {
        id: 'ch07_m06',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "How do you list all processes owned by user 'alice'?",
        options: ['ps -u alice', 'ps aux | grep alice', 'ps -U alice', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: "ps -u alice (by name) and ps -U alice (by UID) both work.",
        difficulty: 'medium'
    },
    {
        id: 'ch07_m07',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does the STAT column 'Z' mean?",
        options: ['Zombie', 'Sleeping', 'Running', 'Stopped'],
        correctAnswer: 'Zombie',
        explanation: 'Z indicates a zombie process that has finished but hasn\'t been reaped.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m08',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you pause a running process?',
        options: ['kill -STOP PID', 'kill -19 PID', 'Ctrl+Z', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'SIGSTOP (19) and Ctrl+Z (SIGTSTP) both pause.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m09',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'Ctrl+Z' do in the terminal?",
        options: [
          'Suspends the foreground job with SIGTSTP',
          'Kills the process',
          'Puts it in the background',
          'Exits the terminal'
        ],
        correctAnswer: 'Suspends the foreground job with SIGTSTP',
        explanation: 'Ctrl+Z sends SIGTSTP, suspending the job.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m10',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'bg %1' do?",
        options: [
          'Resumes job 1 in the background',
          'Kills job 1',
          'Brings job 1 to the foreground',
          'Lists job 1'
        ],
        correctAnswer: 'Resumes job 1 in the background',
        explanation: 'bg resumes a suspended job in the background.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m11',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How can you see the process hierarchy of a specific PID?',
        options: ['pstree -p PID', 'ps --forest', 'pstree -s PID', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'pstree -s PID shows ancestors; pstree -p PID shows children.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m12',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'nice -n 10 command' do?",
        options: [
          'Runs command with lower priority',
          'Runs command with higher priority',
          'Stops command',
          'Changes the user'
        ],
        correctAnswer: 'Runs command with lower priority',
        explanation: 'Positive niceness means lower priority.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m13',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "Which signal is commonly used to reload a daemon's configuration?",
        options: ['SIGHUP (1)', 'SIGKILL (9)', 'SIGTERM (15)', 'SIGINT (2)'],
        correctAnswer: 'SIGHUP (1)',
        explanation: "SIGHUP originally meant 'hangup' but many daemons use it to reload configs.",
        difficulty: 'medium'
    },
    {
        id: 'ch07_m14',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'disown' do?",
        options: [
          'Removes a job from the shell\'s job table, preventing SIGHUP on shell exit',
          'Kills a process',
          'Changes ownership',
          'Stops a job'
        ],
        correctAnswer: 'Removes a job from the shell\'s job table, preventing SIGHUP on shell exit',
        explanation: 'disown lets a background job live after you close the terminal.',
        difficulty: 'medium'
    },
    {
        id: 'ch07_m15',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you display all processes with a tree view?',
        options: ['ps -ejH', 'ps axjf', 'pstree', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'ps -ejH, ps axjf, and pstree all show tree-like output.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch07_h01',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'What is a zombie process?',
        options: [
          'A process that has terminated but still has an entry in the process table',
          'A process that is running slowly',
          'A process that cannot be killed',
          'A kernel thread'
        ],
        correctAnswer: 'A process that has terminated but still has an entry in the process table',
        explanation: 'Zombies exist until the parent reaps them via wait().',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h02',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'Why might SIGKILL not terminate a process?',
        options: [
          'The process is stuck in uninterruptible sleep (D state) waiting for I/O',
          'The process ignores all signals',
          'You don\'t have root permissions',
          'SIGKILL can always be ignored'
        ],
        correctAnswer: 'The process is stuck in uninterruptible sleep (D state) waiting for I/O',
        explanation: 'Processes in D state can\'t be killed until the I/O completes.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h03',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does the 'ps -o' option do?",
        options: [
          'Allows custom formatting of output columns',
          'Outputs to a file',
          'Orders by PID',
          'Shows only owned processes'
        ],
        correctAnswer: 'Allows custom formatting of output columns',
        explanation: '-o lets you specify exactly which fields to display.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h04',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What is the difference between 'ps -e' and 'ps -A'?",
        options: [
          'No difference; both show all processes',
          '-e shows everything, -A only active',
          '-A shows all; -e shows environment',
          '-e is for Linux; -A is for BSD'
        ],
        correctAnswer: 'No difference; both show all processes',
        explanation: 'Both are equivalent and list all processes.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h05',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you find the parent PID of a given process?',
        options: ['ps -o ppid= -p PID', 'pstree -s PID', 'cat /proc/PID/status | grep PPid', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All methods reveal the parent PID.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h06',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What is the meaning of the 'D' state in ps?",
        options: [
          'Uninterruptible sleep (usually waiting for I/O)',
          'Daemon',
          'Dead',
          'Detached'
        ],
        correctAnswer: 'Uninterruptible sleep (usually waiting for I/O)',
        explanation: 'D state processes cannot be interrupted by signals.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h07',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How can you change the priority of an already running process?',
        options: ['renice -n -5 -p PID', 'nice -5 PID', 'kill -SIGPRI PID', 'top and press r'],
        correctAnswer: 'top and press r',
        explanation: 'Both renice and top\'s r key can adjust priority.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h08',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'pgrep -u alice ssh' do?",
        options: [
          'Lists PIDs of ssh processes owned by alice',
          'Kills ssh processes of alice',
          'Starts ssh as alice',
          'Lists all processes of alice'
        ],
        correctAnswer: 'Lists PIDs of ssh processes owned by alice',
        explanation: 'pgrep searches processes by name and user.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h09',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What happens if you try to 'fg' a job that doesn't exist?",
        options: ['Error: no such job', 'Nothing', 'The terminal freezes', 'It lists available jobs'],
        correctAnswer: 'Error: no such job',
        explanation: "The shell will report 'fg: no such job'.",
        difficulty: 'hard'
    },
    {
        id: 'ch07_h10',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How do you run a command immune to hangups (nohup)?',
        options: ['nohup command &', 'command --nohup', 'disown command', 'bg command'],
        correctAnswer: 'nohup command &',
        explanation: 'nohup prevents the process from receiving SIGHUP when the terminal closes.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h11',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What is the effect of 'kill -0 PID'?",
        options: [
          'Tests if a PID exists without sending a real signal',
          'Kills the process with signal 0 (nonexistent)',
          'Pauses the process',
          'Nothing'
        ],
        correctAnswer: 'Tests if a PID exists without sending a real signal',
        explanation: 'Signal 0 is used to check process existence and permissions.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h12',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does 'ps -C sshd' do?",
        options: [
          'Selects processes by command name (sshd)',
          'Lists child processes of sshd',
          'Counts sshd processes',
          'Kills sshd'
        ],
        correctAnswer: 'Selects processes by command name (sshd)',
        explanation: '-C selects processes by executable name.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h13',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "How do you limit a process's CPU usage?",
        options: ['cpulimit -p PID', 'nice -n 19', 'ulimit -t', 'renice -n 20'],
        correctAnswer: 'cpulimit -p PID',
        explanation: 'cpulimit throttles CPU usage; nice only adjusts priority.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h14',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: "What does the 'T' state mean in ps?",
        options: ['Stopped (by job control signal)', 'Terminated', 'Traced', 'Timed out'],
        correctAnswer: 'Stopped (by job control signal)',
        explanation: 'T indicates the process is stopped, usually by SIGSTOP or Ctrl+Z.',
        difficulty: 'hard'
    },
    {
        id: 'ch07_h15',
        chapterId: 'track1-ch07',
        type: 'mcq',
        question: 'How can you view real-time per-process I/O?',
        options: ['iotop', 'top -i', 'iostat -p PID', 'vmstat'],
        correctAnswer: 'iotop',
        explanation: 'iotop provides a top-like interface for disk I/O.',
        difficulty: 'hard'
    }
];
