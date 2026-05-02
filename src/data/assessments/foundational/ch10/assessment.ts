import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch10Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch10_e01',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Which command shows logs for the sshd service using journalctl?',
        options: ['journalctl -u sshd', 'journalctl sshd', 'journalctl --service sshd', 'journalctl -l sshd'],
        correctAnswer: 'journalctl -u sshd',
        explanation: '-u filters by unit (service).',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e02',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How do you follow the journal in real time?',
        options: ['journalctl -f', 'journalctl --follow', 'journalctl -t', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: '-f is short for --follow.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e03',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Where are traditional syslog messages stored?',
        options: ['/var/log/messages', '/var/log/journal', '/var/log/syslog', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: "On RHEL it's /var/log/messages; on Debian it's /var/log/syslog.",
        difficulty: 'easy'
    },
    {
        id: 'ch10_e04',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'tail -f /var/log/messages' do?",
        options: [
            'Prints the last 10 lines and waits for new ones',
            'Prints the whole file',
            'Deletes the log',
            'Rotates the log'
        ],
        correctAnswer: 'Prints the last 10 lines and waits for new ones',
        explanation: '-f follows the file, showing appended lines.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e05',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How do you make the systemd journal persistent?',
        options: [
            'Create /var/log/journal',
            'systemctl enable journald',
            'Edit /etc/journald.conf',
            'journalctl --persistent'
        ],
        correctAnswer: 'Create /var/log/journal',
        explanation: 'Creating /var/log/journal enables persistent storage.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e06',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Which tool rotates, compresses, and removes old logs?',
        options: ['logrotate', 'journalrotate', 'rotatelog', 'cleanlogs'],
        correctAnswer: 'logrotate',
        explanation: 'logrotate is the standard log management utility.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e07',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How do you view the last 20 lines of the journal?',
        options: ['journalctl -n 20', 'journalctl -20', 'journalctl --lines 20', 'journalctl -l 20'],
        correctAnswer: 'journalctl -n 20',
        explanation: '-n specifies the number of recent entries to show.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e08',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Which file typically contains authentication-related logs?',
        options: ['/var/log/secure', '/var/log/messages', '/var/log/auth.log', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'RHEL uses secure, Debian uses auth.log.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e09',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl --since today' show?",
        options: [
            'All journal entries from today',
            'Today\'s date',
            'System boot time',
            'Kernel messages'
        ],
        correctAnswer: 'All journal entries from today',
        explanation: '--since filters entries starting from a given time.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e10',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'What command tests logrotate configuration without making changes?',
        options: ['logrotate -d', 'logrotate --dry-run', 'logrotate -t', 'logrotate --test'],
        correctAnswer: 'logrotate -d',
        explanation: '-d runs in debug mode, showing what would be done.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e11',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Where are logrotate configuration files stored?',
        options: ['/etc/logrotate.conf and /etc/logrotate.d/', '/etc/logrotate/conf', '/var/log/logrotate', '/etc/logrotate.cfg'],
        correctAnswer: '/etc/logrotate.conf and /etc/logrotate.d/',
        explanation: 'The main file and drop-in directory.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e12',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'What is the default storage location for the volatile systemd journal?',
        options: ['/run/log/journal', '/var/log/journal', '/tmp/journal', '/var/run/journal'],
        correctAnswer: '/run/log/journal',
        explanation: '/run is volatile (tmpfs), lost on reboot.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e13',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Which command can send syslog messages to a remote server?',
        options: ['rsyslog', 'syslog-ng', 'journald', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'Both rsyslog and syslog-ng can forward logs.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e14',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'tail -F' do that 'tail -f' does not?",
        options: [
            'Reopens the file if it is rotated',
            'Shows the entire file',
            'Filters by error',
            'Writes to a file'
        ],
        correctAnswer: 'Reopens the file if it is rotated',
        explanation: '-F detects renames/rotations and reopens.',
        difficulty: 'easy'
    },
    {
        id: 'ch10_e15',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How do you restart the systemd journal daemon?',
        options: ['systemctl restart systemd-journald', 'systemctl restart journald', 'systemctl restart rsyslog', 'journalctl restart'],
        correctAnswer: 'systemctl restart systemd-journald',
        explanation: 'The service is named systemd-journald.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch10_m01',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'What is the difference between the systemd journal and traditional syslog?',
        options: [
            'Journal is a structured binary log; syslog is plain text',
            'No difference',
            'Journal only collects kernel logs',
            'Syslog is newer'
        ],
        correctAnswer: 'Journal is a structured binary log; syslog is plain text',
        explanation: 'Journald stores logs in an indexed binary format, while syslog uses text files.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m02',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl -k' show?",
        options: ['Kernel messages only', 'All logs', 'Killed processes', 'Key logs'],
        correctAnswer: 'Kernel messages only',
        explanation: '-k is equivalent to --dmesg.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m03',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How do you configure rsyslog to forward logs to a remote server?',
        options: [
            'Add \'*.* @server:514\' to /etc/rsyslog.conf',
            'systemctl enable rsyslog-forward',
            'journalctl --forward',
            'Configure logrotate'
        ],
        correctAnswer: 'Add \'*.* @server:514\' to /etc/rsyslog.conf',
        explanation: 'A line with @ (UDP) or @@ (TCP) sends logs.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m04',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What is the purpose of the 'notifempty' option in logrotate?",
        options: [
            'Skips rotation if the log file is empty',
            'Rotates even if empty',
            'Deletes empty logs',
            'Sends notification if empty'
        ],
        correctAnswer: 'Skips rotation if the log file is empty',
        explanation: 'notifempty prevents rotating zero-byte files.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m05',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you force logrotate to run a specific configuration?',
        options: [
            'logrotate -f /etc/logrotate.d/myapp',
            'systemctl restart logrotate',
            'logrotate --run',
            'rotate -f'
        ],
        correctAnswer: 'logrotate -f /etc/logrotate.d/myapp',
        explanation: '-f forces rotation even if not due.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m06',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl -b -1' show?",
        options: [
            'Logs from the previous boot',
            'Logs from boot ID 1',
            'Last line of the journal',
            'Binary log'
        ],
        correctAnswer: 'Logs from the previous boot',
        explanation: '-b with negative offsets shows earlier boots if persistent.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m07',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Which priority levels does syslog support (in order)?',
        options: [
            'emerg, alert, crit, err, warning, notice, info, debug',
            'debug, info, notice, warning, err, crit, alert, emerg',
            'emerg, warning, info, debug',
            'Only debug and info'
        ],
        correctAnswer: 'emerg, alert, crit, err, warning, notice, info, debug',
        explanation: 'Standard syslog severity levels.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m08',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl --disk-usage' show?",
        options: [
            'How much space the journal is using on disk',
            'Free disk space',
            'Journal file size',
            'Log entry count'
        ],
        correctAnswer: 'How much space the journal is using on disk',
        explanation: 'It reports the total size of journal files.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m09',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you limit the size of the journal?',
        options: [
            'Set \'SystemMaxUse=\' in /etc/systemd/journald.conf',
            'Use logrotate on the journal',
            'Not possible',
            'Delete /var/log/journal'
        ],
        correctAnswer: 'Set \'SystemMaxUse=\' in /etc/systemd/journald.conf',
        explanation: 'journald.conf allows size caps.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m10',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'Which command shows all messages from a specific PID?',
        options: ['journalctl _PID=1234', 'journalctl -p 1234', 'journalctl --pid 1234', 'journalctl _UID=1234'],
        correctAnswer: 'journalctl _PID=1234',
        explanation: '_PID= field filters by process ID.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m11',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'What happens if you delete /var/log/messages while syslog is running?',
        options: [
            'The file will be recreated when new logs arrive',
            'Syslogd crashes',
            'Logging stops',
            'All logs are lost'
        ],
        correctAnswer: 'The file will be recreated when new logs arrive',
        explanation: 'The syslog daemon will reopen or recreate the file.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m12',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What is the 'rotate 4' directive in logrotate?",
        options: [
            'Keep 4 rotated archive files before deleting',
            'Rotate every 4 days',
            'Rotate 4 times a day',
            'Creates 4 log files'
        ],
        correctAnswer: 'Keep 4 rotated archive files before deleting',
        explanation: 'rotate specifies how many historical copies to keep.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m13',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you see which logrotate configuration applies to a file?',
        options: ['logrotate -d /etc/logrotate.conf 2>&1 | grep filename', 'logrotate --show-config', 'cat /etc/logrotate.conf', 'logrotate -l'],
        correctAnswer: 'logrotate -d /etc/logrotate.conf 2>&1 | grep filename',
        explanation: 'Debug mode shows the decision process.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m14',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl --vacuum-size=200M' do?",
        options: [
            'Deletes journal files until total size is under 200 MB',
            'Sets journal size to 200 MB',
            'Compresses journal to 200 MB',
            'Creates a 200 MB journal file'
        ],
        correctAnswer: 'Deletes journal files until total size is under 200 MB',
        explanation: 'Vacuum removes old files to meet size limit.',
        difficulty: 'medium'
    },
    {
        id: 'ch10_m15',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How would you view logs from a specific boot and a specific service?',
        options: [
            'journalctl -b -1 -u sshd',
            'journalctl --boot=-1 --unit=sshd',
            'journalctl -b-1 sshd',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'Combine boot offset and unit filter.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch10_h01',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'What is the purpose of /etc/systemd/journald.conf?',
        options: [
            'Configures the journal daemon settings (storage, compression, limits)',
            'Starts the journal',
            'Writes logs',
            'Rotates journals'
        ],
        correctAnswer: 'Configures the journal daemon settings (storage, compression, limits)',
        explanation: 'It sets options like Storage=, SystemMaxUse=, etc.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h02',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you forward systemd journal logs to syslog in real-time?',
        options: [
            'Set \'ForwardToSyslog=yes\' in journald.conf',
            'Not possible',
            'Use journalctl --forward',
            'Enable a socket'
        ],
        correctAnswer: 'Set \'ForwardToSyslog=yes\' in journald.conf',
        explanation: 'The journal can be configured to pass all messages to rsyslog.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h03',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What is the difference between 'maxsize' and 'size' in logrotate?",
        options: [
            '\'size\' rotates when the file EXCEEDS the given size; \'maxsize\' rotates even if time hasn\'t passed but size is exceeded',
            'No difference',
            '\'maxsize\' is the maximum size before deletion',
            '\'size\' is for daily rotation'
        ],
        correctAnswer: '\'size\' rotates when the file EXCEEDS the given size; \'maxsize\' rotates even if time hasn\'t passed but size is exceeded',
        explanation: "Both trigger on size, but 'maxsize' overrides time constraints.",
        difficulty: 'hard'
    },
    {
        id: 'ch10_h04',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does the 'sharedscripts' directive in logrotate do?",
        options: [
            'Runs the prerotate/postrotate scripts only once for all matched files, not per file',
            'Shares rotation config',
            'Enables parallel rotation',
            'Logs shared scripts'
        ],
        correctAnswer: 'Runs the prerotate/postrotate scripts only once for all matched files, not per file',
        explanation: 'Prevents duplicate script runs when multiple logs match.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h05',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How would you export the entire current boot journal to a text file?',
        options: ['journalctl -b > journal.txt', 'journalctl --export', 'journalctl -o text', 'All of the above'],
        correctAnswer: 'journalctl -b > journal.txt',
        explanation: 'Standard redirection works; journalctl -b outputs all, > saves.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h06',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'What is the \'journald\' rate-limiting mechanism?',
        options: [
            'RateLimitInterval and RateLimitBurst in journald.conf',
            'No rate limiting',
            'Only applies to kernel logs',
            'Uses logrotate'
        ],
        correctAnswer: 'RateLimitInterval and RateLimitBurst in journald.conf',
        explanation: 'Prevents a runaway process from flooding logs.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h07',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you combine multiple journalctl filters with AND logic?',
        options: [
            'journalctl _UID=1000 _COMM=sshd',
            'journalctl --AND',
            'journalctl +',
            'Not possible'
        ],
        correctAnswer: 'journalctl _UID=1000 _COMM=sshd',
        explanation: 'Multiple field matches are combined with a logical AND.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h08',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "In rsyslog, what does the configuration '*.crit /var/log/critical' do?",
        options: [
            'Logs all messages of severity \'crit\' and higher to that file',
            'Logs only critical kernel messages',
            'Criticizes log entries',
            'Nothing'
        ],
        correctAnswer: 'Logs all messages of severity \'crit\' and higher to that file',
        explanation: "*.crit matches any facility with priority 'crit' or worse.",
        difficulty: 'hard'
    },
    {
        id: 'ch10_h09',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What is the function of 'imjournal' module in rsyslog?",
        options: [
            'Reads logs from the systemd journal and feeds them into rsyslog',
            'Writes to the journal',
            'Deletes journal files',
            'Compresses logs'
        ],
        correctAnswer: 'Reads logs from the systemd journal and feeds them into rsyslog',
        explanation: 'imjournal bridges systemd journal and classic syslog.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h10',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you determine which logrotate configuration file rotates /var/log/messages?',
        options: [
            'Look in /etc/logrotate.d/syslog or /etc/logrotate.conf',
            'cat /var/log/messages',
            'Not possible',
            'Use logrotate -i'
        ],
        correctAnswer: 'Look in /etc/logrotate.d/syslog or /etc/logrotate.conf',
        explanation: 'The configuration for syslog files is usually in /etc/logrotate.d/syslog.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h11',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl --vacuum-time=2weeks' do?",
        options: [
            'Deletes journal entries older than 2 weeks',
            'Sets journal retention to 2 weeks',
            'Compresses old logs',
            'Archives logs'
        ],
        correctAnswer: 'Deletes journal entries older than 2 weeks',
        explanation: 'Vacuum-time purges old entries.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h12',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How do you change the storage location for the systemd journal?',
        options: [
            'Set \'Storage=persistent\' and \'JournalDirectory=\' in journald.conf',
            'Move /var/log/journal',
            'Not possible',
            'Set environment variable'
        ],
        correctAnswer: 'Set \'Storage=persistent\' and \'JournalDirectory=\' in journald.conf',
        explanation: 'JournalDirectory specifies a custom path; Storage controls volatility.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h13',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What is a use case for 'journalctl -o json'?",
        options: [
            'Export logs in JSON format for programmatic processing',
            'Convert logs to HTML',
            'Encrypt logs',
            'Pretty print logs'
        ],
        correctAnswer: 'Export logs in JSON format for programmatic processing',
        explanation: 'JSON output is ideal for scripts and log aggregators.',
        difficulty: 'hard'
    },
    {
        id: 'ch10_h14',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: 'How can you send logs from a container to the host\'s journal?',
        options: [
            'Bind mount /run/systemd/journal/socket',
            'Use logdriver journald in Docker',
            'Not possible',
            'Only via syslog'
        ],
        correctAnswer: 'Use logdriver journald in Docker',
        explanation: "Docker's journald logging driver sends directly to journald.",
        difficulty: 'hard'
    },
    {
        id: 'ch10_h15',
        chapterId: 'track1-ch10',
        type: 'mcq',
        question: "What does 'journalctl --cursor-file=/tmp/cursor' do?",
        options: [
            'Saves/uses a cursor to resume reading where you left off',
            'Curses the journal',
            'Shows cursor position',
            'Edits the journal'
        ],
        correctAnswer: 'Saves/uses a cursor to resume reading where you left off',
        explanation: 'Cursors enable incremental log reading.',
        difficulty: 'hard'
    }
];
