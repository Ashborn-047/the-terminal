import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch15Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch15_e01',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'uptime' display?",
        options: [
            'System uptime, number of users, and load average',
            'CPU temperature',
            'Network speed',
            'Memory usage'
        ],
        correctAnswer: 'System uptime, number of users, and load average',
        explanation: 'uptime shows how long the system has been up and load averages.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e02',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'Which command shows memory usage in human-readable format?',
        options: ['free -h', 'df -h', 'uptime', 'top'],
        correctAnswer: 'free -h',
        explanation: 'free displays memory; -h makes it human-readable.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e03',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'What does a load average of 1.00 mean on a single-core system?',
        options: [
            'The CPU was fully utilized on average',
            'The system is overloaded',
            'No processes running',
            'One user logged in'
        ],
        correctAnswer: 'The CPU was fully utilized on average',
        explanation: 'Load 1.0 means one process was running or waiting for CPU.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e04',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'Which tool creates a comprehensive system diagnostic report?',
        options: ['sos report', 'top', 'ps aux', 'dmesg'],
        correctAnswer: 'sos report',
        explanation: 'sos replaces the older sysreport tool.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e05',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'Where does sosreport save its output by default?',
        options: ['/var/tmp/', '/root/', '/etc/', '/home/user/'],
        correctAnswer: '/var/tmp/',
        explanation: 'sosreport archives are stored in /var/tmp/.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e06',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'Which command shows disk space usage?',
        options: ['df -h', 'du -sh', 'free -h', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'df shows filesystem usage; du shows directory usage.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e07',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'top -n1' do?",
        options: [
            'Runs top for a single iteration and exits',
            'Shows only 1 process',
            'Sorts by 1',
            'Prints first line'
        ],
        correctAnswer: 'Runs top for a single iteration and exits',
        explanation: '-n limits the number of refresh iterations.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e08',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'Which package provides iostat?',
        options: ['sysstat', 'coreutils', 'procps', 'util-linux'],
        correctAnswer: 'sysstat',
        explanation: 'iostat is part of the sysstat package.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e09',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What is the purpose of 'sos clean'?",
        options: [
            'Removes sensitive data (IPs, passwords) from sosreports',
            'Deletes reports',
            'Cleans the system',
            'Compresses reports'
        ],
        correctAnswer: 'Removes sensitive data (IPs, passwords) from sosreports',
        explanation: 'sos clean sanitizes the report for sharing.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e10',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you check the number of CPU cores?',
        options: ['nproc', 'lscpu', 'cat /proc/cpuinfo', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All show CPU count.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e11',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'vmstat' report?",
        options: [
            'Memory, swap, I/O, and CPU statistics',
            'Virtual machines',
            'Volume management',
            'Video memory'
        ],
        correctAnswer: 'Memory, swap, I/O, and CPU statistics',
        explanation: 'vmstat provides virtual memory statistics.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e12',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you run sosreport non-interactively?',
        options: ['sos report --batch', 'sos --auto', 'sosreport -y', 'sos report -q'],
        correctAnswer: 'sos report --batch',
        explanation: '--batch suppresses prompts.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e13',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'sar' stand for?",
        options: ['System Activity Reporter', 'System Analysis Report', 'Secure Audit Report', 'System Alert Reader'],
        correctAnswer: 'System Activity Reporter',
        explanation: 'sar collects and reports system activity.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e14',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'Which file contains historical sar data?',
        options: ['/var/log/sa/', '/var/log/sar/', '/tmp/sar/', '/var/run/sa/'],
        correctAnswer: '/var/log/sa/',
        explanation: 'sar logs are in /var/log/sa/.',
        difficulty: 'easy'
    },
    {
        id: 'ch15_e15',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can you install sos on RHEL?',
        options: ['dnf install sos', 'dnf install sosreport', 'yum install sos', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'Use dnf (or yum on older systems).',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch15_m01',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you interpret a load average of 4.00 on a 4-core system?',
        options: [
            'The CPU was fully utilized on average',
            'The system is overloaded',
            'Only 4 processes ran',
            'The system is idle'
        ],
        correctAnswer: 'The CPU was fully utilized on average',
        explanation: 'Load equals core count = fully busy.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m02',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'iostat -x' show?",
        options: [
            'Extended disk statistics including utilization, wait times',
            'Cross-platform stats',
            'Excludes disks',
            'Extra CPU info'
        ],
        correctAnswer: 'Extended disk statistics including utilization, wait times',
        explanation: '-x provides detailed disk metrics.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m03',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'sos report --all-logs' do?",
        options: [
            'Includes all available log files, even very large ones',
            'Only system logs',
            'Clears logs',
            'Rotates logs'
        ],
        correctAnswer: 'Includes all available log files, even very large ones',
        explanation: '--all-logs collects more log data.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m04',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'What is the difference between load average and CPU utilization?',
        options: [
            'Load includes processes waiting for I/O; CPU utilization only measures active CPU time',
            'They are the same',
            'CPU utilization is always higher',
            'Load average is for memory'
        ],
        correctAnswer: 'Load includes processes waiting for I/O; CPU utilization only measures active CPU time',
        explanation: 'Load includes processes in uninterruptible sleep (disk wait).',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m05',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can you see per-process I/O statistics?',
        options: ['iotop', 'iostat -p', 'pidstat -d', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'iotop and pidstat are common tools.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m06',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'sos report --plugins=logs,networking' do?",
        options: [
            'Only runs the logs and networking plugins',
            'Installs plugins',
            'Removes plugins',
            'Lists plugins'
        ],
        correctAnswer: 'Only runs the logs and networking plugins',
        explanation: 'You can limit plugins to speed up collection.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m07',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you view the CPU statistics collected by sar for today?',
        options: ['sar -u', 'sar -u -f /var/log/sa/sa$(date +%d)', 'cat /var/log/sar/today', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'sar -u shows current day; -f specifies a file.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m08',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'free -s 5' do?",
        options: [
            'Continuously prints memory statistics every 5 seconds',
            'Shows 5 lines',
            'Saves 5 reports',
            'Stops after 5 seconds'
        ],
        correctAnswer: 'Continuously prints memory statistics every 5 seconds',
        explanation: '-s sets the repeat interval.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m09',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'top -o %MEM' do?",
        options: ['Sorts by memory usage', 'Shows only memory', 'Hides memory column', 'Outputs memory to file'],
        correctAnswer: 'Sorts by memory usage',
        explanation: '-o selects the sort field.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m10',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "Why would you use 'sos report --case-id 12345'?",
        options: [
            'To tag the report with a support ticket number',
            'To limit report size',
            'To encrypt the report',
            'To archive with ID'
        ],
        correctAnswer: 'To tag the report with a support ticket number',
        explanation: 'Useful for organizing reports for a specific case.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m11',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'dmesg' display?",
        options: [
            'Kernel ring buffer messages',
            'System logs',
            'User messages',
            'Disk messages'
        ],
        correctAnswer: 'Kernel ring buffer messages',
        explanation: 'dmesg shows boot and kernel logs.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m12',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What is the difference between 'sos report' and 'journalctl'?",
        options: [
            'sos collects everything; journalctl only systemd journal logs',
            'No difference',
            'journalctl is for SOS reports',
            'sos is only for logs'
        ],
        correctAnswer: 'sos collects everything; journalctl only systemd journal logs',
        explanation: 'sos gathers configs, logs, command outputs, and more.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m13',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can you check swap usage?',
        options: ['free -h', 'swapon --show', 'cat /proc/swaps', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All provide swap info.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m14',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'sos report --estimate-only' do?",
        options: [
            'Shows how much space the report will require without collecting',
            'Estimates CPU usage',
            'Runs a quick scan',
            'Prints only OS info'
        ],
        correctAnswer: 'Shows how much space the report will require without collecting',
        explanation: 'Helps check disk space before generation.',
        difficulty: 'medium'
    },
    {
        id: 'ch15_m15',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you limit the sos report to only networking information?',
        options: [
            'sos report --only-plugins=networking',
            'sos report --plugins=networking',
            'sos network',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: '--only-plugins or --plugins restrict plugins.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch15_h01',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can you capture a system state before and after a change for comparison with sos?',
        options: [
            'Run sos report before and after, then diff the sos_commands directory',
            'Use sos diff',
            'Not possible',
            'Use snapshots'
        ],
        correctAnswer: 'Run sos report before and after, then diff the sos_commands directory',
        explanation: 'Two reports can be compared manually or with tools.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h02',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'iostat -x' column 'await' indicate?",
        options: [
            'Average time (ms) for I/O requests to be served',
            'Wait time for CPU',
            'Network latency',
            'Disk idle time'
        ],
        correctAnswer: 'Average time (ms) for I/O requests to be served',
        explanation: 'await includes queue time and service time.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h03',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can sos be configured to exclude certain directories?',
        options: [
            'Use --exclude-dir or configure sos.conf',
            'Edit /etc/sos.conf with [exclude]',
            'Set environment variables',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'sos.conf allows fine-grained control.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h04',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'pidstat 1' show?",
        options: [
            'Per-process CPU usage updated every second',
            'System-wide CPU',
            'Process IDs',
            'Memory of pid 1'
        ],
        correctAnswer: 'Per-process CPU usage updated every second',
        explanation: 'pidstat is like top for a specific interval.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h05',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you enable sar data collection at boot?',
        options: [
            'systemctl enable sysstat (and enable data collection in /etc/sysconfig/sysstat)',
            'sar --enable',
            'crontab entry',
            'Edit /etc/sar.conf'
        ],
        correctAnswer: 'systemctl enable sysstat (and enable data collection in /etc/sysconfig/sysstat)',
        explanation: 'The sysstat service starts collection.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h06',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does the 'si' and 'so' columns in vmstat mean?",
        options: [
            'Swap in / Swap out (memory swapped from/to disk)',
            'System input/output',
            'Socket in/out',
            'Signal in/out'
        ],
        correctAnswer: 'Swap in / Swap out (memory swapped from/to disk)',
        explanation: 'High swap activity indicates memory pressure.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h07',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can you analyze sosreport data without extracting the entire archive?',
        options: [
            "Use 'tar -tJf report.tar.xz' to list contents, then extract selectively",
            'Not possible',
            'Use sos-viewer',
            'Must extract all'
        ],
        correctAnswer: "Use 'tar -tJf report.tar.xz' to list contents, then extract selectively",
        explanation: 'tar can list and extract individual files.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h08',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What is a 'collated' sos report?",
        options: [
            'A report that gathers output from multiple nodes in a cluster',
            'A collapsed report',
            'A compressed report',
            'A cleaned report'
        ],
        correctAnswer: 'A report that gathers output from multiple nodes in a cluster',
        explanation: 'Cluster-wide collection is possible.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h09',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'mpstat -P ALL' show?",
        options: ['Per-CPU utilization', 'Memory statistics', 'Mount points', 'Process stats'],
        correctAnswer: 'Per-CPU utilization',
        explanation: 'mpstat reports CPU activity per processor.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h10',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How can you schedule a periodic sosreport collection?',
        options: [
            'Add a cron job or systemd timer',
            'Configure sos.conf interval',
            'Use sos-daemon',
            'sos --schedule'
        ],
        correctAnswer: 'Add a cron job or systemd timer',
        explanation: 'You can run sos report --batch via a timer.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h11',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'dmesg --ctime' do?",
        options: [
            'Shows human-readable timestamps',
            'Continuous time',
            'Clears the buffer',
            'Converts time'
        ],
        correctAnswer: 'Shows human-readable timestamps',
        explanation: "--ctime prints timestamps from the kernel's time.",
        difficulty: 'hard'
    },
    {
        id: 'ch15_h12',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How do you check for hardware errors in an sosreport?',
        options: [
            'Look in sos_commands/hardware/mcelog or rasdaemon logs',
            'grep error sosreport/',
            'Not possible',
            'dmesg only'
        ],
        correctAnswer: 'Look in sos_commands/hardware/mcelog or rasdaemon logs',
        explanation: 'Sos collects hardware error logs.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h13',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What does 'sos report --profile=system' do?",
        options: [
            'Uses a predefined set of plugins for a system profile',
            'Creates a system profile',
            'Profiles performance',
            'Edits profile'
        ],
        correctAnswer: 'Uses a predefined set of plugins for a system profile',
        explanation: 'Profiles bundle commonly needed plugins.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h14',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: 'How would you view the top 5 CPU-consuming processes over a 10-second interval using pidstat?',
        options: [
            'pidstat 10 1 | sort -nrk 8 | head',
            'pidstat -l',
            'Not possible with pidstat',
            'pidstat -C'
        ],
        correctAnswer: 'pidstat 10 1 | sort -nrk 8 | head',
        explanation: 'pidstat output can be piped to sort.',
        difficulty: 'hard'
    },
    {
        id: 'ch15_h15',
        chapterId: 'track1-ch15',
        type: 'mcq',
        question: "What is the purpose of 'sos report --verify'?",
        options: [
            'Checks the integrity of the generated report',
            'Verifies system health',
            'Runs checksums',
            'Validates plugin'
        ],
        correctAnswer: 'Checks the integrity of the generated report',
        explanation: '--verify ensures the archive is not corrupted.',
        difficulty: 'hard'
    }
];
