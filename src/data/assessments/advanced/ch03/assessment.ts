import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch03Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c03_e01',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which command starts a command with lower priority?',
        options: ['nice -n 10 command', 'renice 10 command', 'prio 10 command', 'low 10 command'],
        correctAnswer: 'nice -n 10 command',
        explanation: 'nice sets the priority when launching.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e02',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the range of niceness values?',
        options: ['-20 to 19', '0 to 39', '1 to 100', '-10 to 10'],
        correctAnswer: '-20 to 19',
        explanation: '-20 is highest priority, 19 is lowest.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e03',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which command changes the priority of a running process?',
        options: ['renice', 'nice', 'prio', 'setpriority'],
        correctAnswer: 'renice',
        explanation: 'renice alters niceness of existing processes.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e04',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the default niceness of a new process?',
        options: ['0', '10', '-10', '5'],
        correctAnswer: '0',
        explanation: 'Processes inherit 0 unless modified.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e05',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which command shows the current tuned profile?',
        options: ['tuned-adm active', 'tuned profile', 'tuned show', 'tuned-adm list'],
        correctAnswer: 'tuned-adm active',
        explanation: 'active displays the active profile.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e06',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you list available tuned profiles?',
        options: ['tuned-adm list', 'tuned-adm profiles', 'tuned list', 'cat /etc/tuned/profiles'],
        correctAnswer: 'tuned-adm list',
        explanation: 'tuned-adm list shows all profiles.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e07',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'renice +5 1234' do?",
        options: [
            "Increases the niceness of PID 1234 by 5 (lower priority)",
            "Decreases priority",
            "Set priority to 5",
            "Kills PID 1234"
        ],
        correctAnswer: "Increases the niceness of PID 1234 by 5 (lower priority)",
        explanation: "Positive number = lower priority.",
        difficulty: 'easy'
    },
    {
        id: 't2c03_e08',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Who can set a nice value lower than 0?',
        options: ['Only root', 'Any user', 'Only systemd', 'Nobody'],
        correctAnswer: 'Only root',
        explanation: 'Negative nice values require root.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e09',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the purpose of tuned?',
        options: [
            "System‑wide performance tuning through kernel parameters",
            "Audio tuning",
            "Network tuning only",
            "Disk formatting"
        ],
        correctAnswer: "System‑wide performance tuning through kernel parameters",
        explanation: "tuned adjusts sysctl, power, and I/O settings.",
        difficulty: 'easy'
    },
    {
        id: 't2c03_e10',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you enable and start tuned?',
        options: ['systemctl enable --now tuned', 'tuned --enable', 'tuned-adm start', 'service tuned on'],
        correctAnswer: 'systemctl enable --now tuned',
        explanation: "It's a standard systemd service.",
        difficulty: 'easy'
    },
    {
        id: 't2c03_e11',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which profile is recommended for a virtual machine guest?',
        options: ['virtual-guest', 'throughput-performance', 'balanced', 'powersave'],
        correctAnswer: 'virtual-guest',
        explanation: 'virtual-guest optimizes for VMs.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e12',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'nice -n -10' attempt to do?",
        options: [
            "Set a high priority (requires root)",
            "Set low priority",
            "Fails always",
            "Nice with negative is not allowed"
        ],
        correctAnswer: "Set a high priority (requires root)",
        explanation: "Negative values are allowed only for root.",
        difficulty: 'easy'
    },
    {
        id: 't2c03_e13',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which command shows the nice value of a process?',
        options: ['top (NI column)', 'ps -l', 'renice -l', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'top and ps -l display niceness.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e14',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you change the priority of all processes belonging to a user?',
        options: ['renice 10 -u alice', 'renice alice', 'nice -u alice', 'userpri alice'],
        correctAnswer: 'renice 10 -u alice',
        explanation: 'renice -u affects all processes of the user.',
        difficulty: 'easy'
    },
    {
        id: 't2c03_e15',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What does \'ionice\' control?',
        options: ['I/O scheduling priority', 'CPU priority', 'Memory priority', 'Network priority'],
        correctAnswer: 'I/O scheduling priority',
        explanation: 'ionice is the I/O analogue of nice.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c03_m01',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the difference between PR and NI in top?',
        options: [
            "PR is the actual scheduling priority as seen by the kernel; NI is the user‑set nice value",
            "They are the same",
            "PR is lower priority",
            "NI is always higher"
        ],
        correctAnswer: "PR is the actual scheduling priority as seen by the kernel; NI is the user‑set nice value",
        explanation: "PR = 20 + NI for regular processes.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m02',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you permanently set a nice value for a service?',
        options: [
            "Add 'Nice=5' to the service's unit file in systemd",
            "Use renice every boot",
            "Edit /etc/niceness",
            "Use nice in .bashrc"
        ],
        correctAnswer: "Add 'Nice=5' to the service's unit file in systemd",
        explanation: "Nice= in the [Service] section sets niceness persistently.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m03',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'tuned-adm recommend' do?",
        options: [
            "Suggests a profile based on system class (e.g., VM vs bare metal)",
            "Applies the recommended profile automatically",
            "Lists profiles",
            "Nothing"
        ],
        correctAnswer: "Suggests a profile based on system class (e.g., VM vs bare metal)",
        explanation: "It outputs the recommended profile but does not change it.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m04',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you verify that a tuned profile is applied correctly?',
        options: [
            "Check sysctl values with 'sysctl -a' and compare to expected changes",
            "tuned-adm verify",
            "Run benchmarks",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Verifying involves checking that parameters changed.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m05',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What happens if a regular user tries \'renice -5 1234\'?',
        options: ['Permission denied', 'Priority decreased', 'Priority increased', 'Nothing'],
        correctAnswer: 'Permission denied',
        explanation: 'Regular users can only increase niceness.',
        difficulty: 'medium'
    },
    {
        id: 't2c03_m06',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'renice -n 5 -p $(pgrep firefox)' do?",
        options: [
            "Sets niceness of all firefox processes to 5",
            "Kills firefox",
            "Starts firefox with nice 5",
            "Lists firefox PIDs"
        ],
        correctAnswer: "Sets niceness of all firefox processes to 5",
        explanation: "pgrep provides PIDs; renice adjusts them.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m07',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How can you revert tuned to the default profile?',
        options: ['tuned-adm profile balanced', 'tuned-adm off', 'systemctl stop tuned', 'tuned-reset'],
        correctAnswer: 'tuned-adm profile balanced',
        explanation: "Setting a profile explicitly works; there is no 'default' reset command.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m08',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the effect of the \'throughput-performance\' profile?',
        options: [
            "Maximizes CPU and I/O throughput at the expense of power saving",
            "Balances performance and power",
            "Lowers latency",
            "Saves battery"
        ],
        correctAnswer: "Maximizes CPU and I/O throughput at the expense of power saving",
        explanation: "It sets the CPU governor to performance and adjusts I/O scheduler.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m09',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you see the current CPU governor?',
        options: ['cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor', 'cpu-info', 'tuned-adm governor', 'cpugovernor'],
        correctAnswer: 'cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor',
        explanation: 'The scaling_governor file shows the current governor.',
        difficulty: 'medium'
    },
    {
        id: 't2c03_m10',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'renice' stand for?",
        options: ["Re-nice", "Renewed priority", "Rename nice", "Real nice"],
        correctAnswer: "Re-nice",
        explanation: "It's literally 're-nice'.",
        difficulty: 'medium'
    },
    {
        id: 't2c03_m11',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which service must be running for tuned profiles to take effect?',
        options: ['tuned.service', 'profile.service', 'tuned-adm.service', 'systemd-tuned'],
        correctAnswer: 'tuned.service',
        explanation: 'The tuned daemon applies profiles.',
        difficulty: 'medium'
    },
    {
        id: 't2c03_m12',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How can you adjust I/O priority alongside CPU priority?',
        options: ['Use ionice', 'Use renice -i', 'Use nice -io', 'I/O priority cannot be changed'],
        correctAnswer: 'Use ionice',
        explanation: 'ionice sets I/O scheduler class and priority.',
        difficulty: 'medium'
    },
    {
        id: 't2c03_m13',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the default I/O scheduling class for processes?',
        options: ['Best-effort', 'Real-time', 'Idle', 'None'],
        correctAnswer: 'Best-effort',
        explanation: 'Best-effort is the default with a priority derived from CPU nice.',
        difficulty: 'medium'
    },
    {
        id: 't2c03_m14',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you check if tuned is active?',
        options: ['systemctl status tuned', 'tuned-adm status', 'cat /proc/tuned', 'tuned active'],
        correctAnswer: 'systemctl status tuned',
        explanation: 'systemctl status shows active state.',
        difficulty: 'medium'
    },
    {
        id: 't2c03_m15',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'Which profile is best for a database server?',
        options: [
            "throughput-performance or latency-performance depending on needs",
            "powersave",
            "balanced",
            "virtual-guest"
        ],
        correctAnswer: "throughput-performance or latency-performance depending on needs",
        explanation: "Databases often benefit from high throughput or low latency.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c03_h01',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is the relationship between nice value and kernel scheduling?',
        options: [
            "Nice influences time slice allocation, not absolute priority; POSIX defines the mapping",
            "Nice directly maps to a fixed priority",
            "Only affects real-time tasks",
            "It's ignored in Linux"
        ],
        correctAnswer: "Nice influences time slice allocation, not absolute priority; POSIX defines the mapping",
        explanation: "The CFS scheduler uses nice as a weight factor for CPU share.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h02',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "How does the 'latency-performance' profile differ from 'throughput-performance'?",
        options: [
            "Latency-performance tunes for lower latency, often at the cost of throughput",
            "No difference",
            "Throughput-performance is for networks only",
            "Latency-performance disables all power management"
        ],
        correctAnswer: "Latency-performance tunes for lower latency, often at the cost of throughput",
        explanation: "It adjusts interrupt coalescing and power states.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h03',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'tuned-adm profile none' do?",
        options: [
            "Disables tuned's dynamic tuning but leaves the service running",
            "Deletes all profiles",
            "Stops tuned",
            "Applies no profile (some settings may revert to default)"
        ],
        correctAnswer: "Applies no profile (some settings may revert to default)",
        explanation: "It selects the 'none' profile, often resetting to kernel defaults.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h04',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How can you create a custom tuned profile?',
        options: [
            "Create a directory in /etc/tuned/ with a tuned.conf and profile name",
            "Write a .tuned file in /etc/",
            "Use tuned-adm --create",
            "Not possible"
        ],
        correctAnswer: "Create a directory in /etc/tuned/ with a tuned.conf and profile name",
        explanation: "Custom profiles are defined in /etc/tuned/<profilename>/.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h05',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'PerformanceGovernor=performance' achieve?",
        options: [
            "Sets the CPU scaling governor to always run at max frequency",
            "Enables powersave",
            "Disables CPU",
            "Sets I/O scheduler"
        ],
        correctAnswer: "Sets the CPU scaling governor to always run at max frequency",
        explanation: "The performance governor locks the CPU to maximum frequency.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h06',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How can you run a process with a specific I/O priority and CPU nice simultaneously?',
        options: [
            "nice -n 10 ionice -c2 -n7 command",
            "Not possible",
            "Use renice -io",
            "Only by editing unit files"
        ],
        correctAnswer: "nice -n 10 ionice -c2 -n7 command",
        explanation: "You can chain nice and ionice.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h07',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What is the function of 'tuned-adm auto_profile'?",
        options: [
            "Automatically switches between profiles based on activity (if configured)",
            "Installs a profile",
            "Shows recommended profile",
            "Creates a profile"
        ],
        correctAnswer: "Automatically switches between profiles based on activity (if configured)",
        explanation: "Auto-profile can react to system conditions.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h08',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How can you apply a tuned profile only to a specific network interface?',
        options: [
            "Use a custom tuned profile with device-specific rules",
            "tuned-adm interface",
            "Not possible; it's system-wide",
            "Edit /etc/sysctl.d/ only"
        ],
        correctAnswer: "Use a custom tuned profile with device-specific rules",
        explanation: "Custom profiles can include per-interface settings.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h09',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What is the difference between 'renice' and 'setpriority'?",
        options: [
            "renice is the command-line tool for the setpriority system call",
            "No difference",
            "setpriority is obsolete",
            "renice only works on process groups"
        ],
        correctAnswer: "renice is the command-line tool for the setpriority system call",
        explanation: "renice calls setpriority internally.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h10',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'NOOP' in I/O scheduler mean?",
        options: ["A simple FIFO scheduler, often used in VMs", "No operation", "Network scheduler", "CPU scheduler"],
        correctAnswer: "A simple FIFO scheduler, often used in VMs",
        explanation: "Noop is simple, passing I/O to the hypervisor.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h11',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How do you view the current disk I/O scheduler?',
        options: [
            "cat /sys/block/sda/queue/scheduler",
            "lsblk --scheduler",
            "iostat -x",
            "df -i"
        ],
        correctAnswer: "cat /sys/block/sda/queue/scheduler",
        explanation: "The scheduler file shows [active] scheduler.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h12',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What effect does 'LimitNICE= -5' have in a systemd service unit?",
        options: [
            "Allows the service to set its niceness down to -5 (requires privileges)",
            "Sets nice to -5",
            "Limits memory",
            "Nothing"
        ],
        correctAnswer: "Allows the service to set its niceness down to -5 (requires privileges)",
        explanation: "It grants permission for negative nice values.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h13',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'How can you monitor the real-time effect of a tuned profile?',
        options: [
            "Use 'tuned-adm profile_info' or check sysfs values before and after",
            "Only by benchmarking",
            "Not possible",
            "Use top"
        ],
        correctAnswer: "Use 'tuned-adm profile_info' or check sysfs values before and after",
        explanation: "Examining /sys/class/ can show changes.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h14',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: "What does 'CPUAffinity' do in a tuned profile?",
        options: [
            "Pins processes to specific CPUs",
            "Controls CPU frequency",
            "Manages interrupts",
            "Sets CPU governor"
        ],
        correctAnswer: "Pins processes to specific CPUs",
        explanation: "Affinity restricts processes to certain cores.",
        difficulty: 'hard'
    },
    {
        id: 't2c03_h15',
        chapterId: 'track2-ch03',
        type: 'mcq',
        question: 'What is \'Transparent Huge Pages\' and how can tuned adjust them?',
        options: [
            "THP can be set to 'always', 'madvise', or 'never' via sysctl; tuned profiles can configure this",
            "A filesystem feature",
            "Network buffer",
            "A memory leak"
        ],
        correctAnswer: "THP can be set to 'always', 'madvise', or 'never' via sysctl; tuned profiles can configure this",
        explanation: "Tuned can include THP settings in its sysctl templates.",
        difficulty: 'hard'
    }
];
