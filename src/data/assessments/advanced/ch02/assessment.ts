import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch02Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c02_e01',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'Which command schedules a one‑time task?',
        options: ['at', 'cron', 'timer', 'schedule'],
        correctAnswer: 'at',
        explanation: 'at runs a command at a specific future time.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e02',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you edit your user crontab?',
        options: ['crontab -e', 'cronedit', 'edit cron', 'vim /etc/crontab'],
        correctAnswer: 'crontab -e',
        explanation: 'crontab -e opens the personal crontab for editing.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e03',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does '30 4 * * 1' mean?",
        options: [
            '4:30 AM every Monday',
            '30th of April',
            'Every 30 minutes',
            '4:30 PM daily'
        ],
        correctAnswer: '4:30 AM every Monday',
        explanation: 'minute=30, hour=4, day of week 1 (Monday).',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e04',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you list pending at jobs?',
        options: ['atq', 'at -l', 'at list', 'jobs'],
        correctAnswer: 'atq',
        explanation: 'atq lists queued at jobs.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e05',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What is the shortcut for 'every year' in cron?",
        options: ['@yearly', '@annual', '@once', '@year'],
        correctAnswer: '@yearly',
        explanation: '@yearly (or @annually) runs once a year.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e06',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'Where are system‑wide crontab files often placed?',
        options: ['/etc/cron.d/', '/etc/crontab', '/etc/cron.allow', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'System‑wide jobs can be in /etc/crontab or /etc/cron.d/.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e07',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'Which command shows active systemd timers?',
        options: ['systemctl list-timers', 'systemctl timers', 'timer list', 'timectl'],
        correctAnswer: 'systemctl list-timers',
        explanation: 'systemctl list-timers displays timer units.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e08',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'What unit type does a systemd timer activate?',
        options: ['A service unit', 'A target', 'A socket', 'A mount'],
        correctAnswer: 'A service unit',
        explanation: 'Timer triggers a .service unit.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e09',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you remove a single at job?',
        options: ['atrm jobnumber', 'at -r jobnumber', 'atq -d', 'kill job'],
        correctAnswer: 'atrm jobnumber',
        explanation: 'atrm deletes the specified job ID.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e10',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'OnCalendar=*-*-* 00:00:00' mean?",
        options: ['Every day at midnight', 'Once a year', 'First of each month', 'Never'],
        correctAnswer: 'Every day at midnight',
        explanation: 'The pattern matches every day at 00:00.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e11',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'Which command shows your personal crontab entries?',
        options: ['crontab -l', 'crontab -e', 'cron -l', 'list cron'],
        correctAnswer: 'crontab -l',
        explanation: '-l lists the current crontab.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e12',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does the 'PATH' environment have to do with cron?",
        options: [
            "Cron has a very limited PATH; many commands fail unless full paths are specified",
            "Nothing",
            "PATH is always the same as your login shell",
            "PATH is passed from the terminal"
        ],
        correctAnswer: "Cron has a very limited PATH; many commands fail unless full paths are specified",
        explanation: "Cron's PATH is minimal; always use absolute paths or set PATH in the script.",
        difficulty: 'easy'
    },
    {
        id: 't2c02_e13',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you enable a systemd timer to start at boot?',
        options: ['systemctl enable mytimer.timer', 'systemctl start mytimer.timer', 'systemctl enable --now mytimer.timer', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'enable creates the symlink; --now also starts it immediately.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e14',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'What file controls which users can use cron?',
        options: ['/etc/cron.allow and /etc/cron.deny', '/etc/cron.perm', '/etc/cron/users', '~/.cronrc'],
        correctAnswer: '/etc/cron.allow and /etc/cron.deny',
        explanation: 'If cron.allow exists, only those users can use cron.',
        difficulty: 'easy'
    },
    {
        id: 't2c02_e15',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'Persistent=true' mean in a systemd timer?",
        options: [
            "If the system was off when the timer should have triggered, it runs immediately on boot",
            "Keeps logs persistent",
            "Runs forever",
            "Stays enabled"
        ],
        correctAnswer: "If the system was off when the timer should have triggered, it runs immediately on boot",
        explanation: "Persistent ensures missed jobs catch up.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c02_m01',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What is the difference between 'at now + 5 minutes' and 'sleep 300; command'?",
        options: [
            "at schedules with the atd daemon and persists across logouts; sleep depends on the terminal session",
            "No difference",
            "at is more accurate",
            "sleep runs in the background"
        ],
        correctAnswer: "at schedules with the atd daemon and persists across logouts; sleep depends on the terminal session",
        explanation: "at jobs are independent of the current shell.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m02',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How would you run a script every 15 minutes in cron?',
        options: ["*/15 * * * * script", "0,15,30,45 * * * * script", "*/15 * * * * script", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "* /15 or comma-separated both work.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m03',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'crontab -r' do?",
        options: ["Removes your entire crontab", "Reads crontab", "Replaces crontab", "Restarts cron"],
        correctAnswer: "Removes your entire crontab",
        explanation: "-r deletes your crontab file without confirmation.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m04',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you debug a cron job that is not running?',
        options: [
            "Check cron logs (journalctl -u crond), add output redirection to a file",
            "Restart the service",
            "Use at instead",
            "Check /var/run/cron"
        ],
        correctAnswer: "Check cron logs (journalctl -u crond), add output redirection to a file",
        explanation: "Logs and capturing output are the first steps.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m05',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'What is a monotonic timer in systemd?',
        options: [
            "A timer based on time since boot, not calendar time",
            "A repeating timer",
            "A one‑time timer",
            "A timer that runs monotonously"
        ],
        correctAnswer: "A timer based on time since boot, not calendar time",
        explanation: "OnBootSec, OnUnitActiveSec are monotonic.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m06',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How can you restrict systemd timers to a user?',
        options: [
            "Place the timer and service in ~/.config/systemd/user/ and use systemctl --user",
            "Add User= in the unit file",
            "Not possible",
            "Only works with cron"
        ],
        correctAnswer: "Place the timer and service in ~/.config/systemd/user/ and use systemctl --user",
        explanation: "User timers are managed with 'systemctl --user'.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m07',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does '0 0 1 1 *' mean?",
        options: [
            "Midnight on January 1st",
            "First day of every month",
            "Every Monday at midnight",
            "January 1st of any year"
        ],
        correctAnswer: "Midnight on January 1st",
        explanation: "minute 0, hour 0, day 1, month 1, any weekday.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m08',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'Why might a cron job fail silently?',
        options: [
            "No output redirection; script uses relative paths; cron's minimal environment",
            "Cron is not running",
            "The script is not executable",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Many reasons; checking logs and environment is key.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m09',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you create a weekly cron job that runs Sunday at 4am?',
        options: ["0 4 * * 0", "0 4 * * Sun", "0 4 * * 7", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "0 or 7 both represent Sunday.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m10',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'systemctl daemon-reload' do in the context of timers?",
        options: [
            "Reloads unit files, required after editing timer or service files",
            "Restarts all timers",
            "Enables timers",
            "Stops timers"
        ],
        correctAnswer: "Reloads unit files, required after editing timer or service files",
        explanation: "systemd must re‑read unit files.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m11',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'Can you schedule a cron job as a regular user?',
        options: [
            "Yes, using crontab -e",
            "No, only root",
            "Yes, by editing /etc/crontab",
            "Only via /etc/cron.allow"
        ],
        correctAnswer: "Yes, using crontab -e",
        explanation: "Normal users can have personal crontabs.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m12',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'OnUnitActiveSec=1h' do?",
        options: [
            "Triggers the timer 1 hour after the last activation of the associated service",
            "Every hour since boot",
            "Daily",
            "At boot +1 hour"
        ],
        correctAnswer: "Triggers the timer 1 hour after the last activation of the associated service",
        explanation: "It's a relative timer based on the unit's last run.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m13',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you temporarily prevent a timer from running?',
        options: [
            "systemctl stop timer.timer",
            "systemctl disable timer.timer",
            "systemctl mask timer.timer",
            "Both A and B"
        ],
        correctAnswer: "Both A and B",
        explanation: "stop stops the next trigger; disable prevents future starts; mask is stronger.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m14',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'What directory contains scripts that run daily via cron?',
        options: ["/etc/cron.daily/", "/etc/cron.d/", "/var/spool/cron/", "/etc/cron.hourly/"],
        correctAnswer: "/etc/cron.daily/",
        explanation: "Scripts in /etc/cron.daily are run by run-parts.",
        difficulty: 'medium'
    },
    {
        id: 't2c02_m15',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How can you pass environment variables to a cron job?',
        options: [
            "Set them inside the crontab file before the command, e.g., 'PATH=/usr/bin'",
            "Use /etc/environment",
            "Use .bashrc",
            "Not possible"
        ],
        correctAnswer: "Set them inside the crontab file before the command, e.g., 'PATH=/usr/bin'",
        explanation: "You can define variables in the crontab on separate lines.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c02_h01',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What is the difference between 'at' and 'batch'?",
        options: [
            "batch runs when system load drops below a threshold; at runs at a specific time",
            "No difference",
            "batch requires root",
            "at is interactive"
        ],
        correctAnswer: "batch runs when system load drops below a threshold; at runs at a specific time",
        explanation: "batch queues jobs for low-load execution.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h02',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you view the next trigger time of a specific systemd timer?',
        options: [
            "systemctl status mytimer.timer",
            "systemctl list-timers mytimer.timer",
            "timerctl next",
            "systemctl show mytimer.timer | grep NextElapse"
        ],
        correctAnswer: "systemctl status mytimer.timer",
        explanation: "status shows next trigger time and other info.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h03',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'RandomizedDelaySec=300' do in a timer?",
        options: [
            "Delays the trigger by a random amount up to 300 seconds to spread load",
            "Delays by exactly 5 minutes",
            "Randomizes calendar",
            "Not a valid option"
        ],
        correctAnswer: "Delays the trigger by a random amount up to 300 seconds to spread load",
        explanation: "Useful for preventing many systems from doing something simultaneously.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h04',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How can you schedule a job that runs exactly on the first Monday of each month?',
        options: [
            "Cron: 0 8 1-7 * 1 (if Monday, it will run on the first Monday)",
            "Systemd timer: OnCalendar=Mon *-*-1..7 08:00:00",
            "Both are valid",
            "Not possible"
        ],
        correctAnswer: "Both are valid",
        explanation: "Both cron and OnCalendar can express this with the 'first weekday' logic.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h05',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'cronie' provide?",
        options: [
            "A modern cron daemon with PAM and inotify support",
            "A GUI for cron",
            "A backup tool",
            "An enhanced version of at"
        ],
        correctAnswer: "A modern cron daemon with PAM and inotify support",
        explanation: "cronie is the default cron daemon on RHEL.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h06',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you prevent a cron job from running simultaneously (lock file)?',
        options: [
            "Use flock in the script",
            "Use a .lock file and check it",
            "Systemd timer handles this with RemainAfterExit",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Multiple mechanisms, but systemd can also handle it.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h07',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What is the function of 'run-parts'?",
        options: [
            "Runs all executable scripts in a directory sequentially",
            "Runs parts of a script",
            "Splits jobs",
            "Partitions cron"
        ],
        correctAnswer: "Runs all executable scripts in a directory sequentially",
        explanation: "Used by crond to execute /etc/cron.hourly etc.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h08',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How can you test a cron expression for correctness?',
        options: [
            "Use an online validator or write a script that prints timestamps",
            "crontab --test",
            "Not possible",
            "Run cron in debug mode"
        ],
        correctAnswer: "Use an online validator or write a script that prints timestamps",
        explanation: "No built-in verification; test manually or with external tools.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h09',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'systemctl list-timers --all' show?",
        options: [
            "All timers including inactive ones",
            "Only active timers",
            "Timer definitions",
            "Service associated with timers"
        ],
        correctAnswer: "All timers including inactive ones",
        explanation: "--all includes timers that aren't running.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h10',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you convert an existing cron job to a systemd timer?',
        options: [
            "Create a matching .service and .timer unit, then disable the cron entry",
            "systemctl convert cron",
            "cron-to-timer command",
            "Not possible"
        ],
        correctAnswer: "Create a matching .service and .timer unit, then disable the cron entry",
        explanation: "Manual migration is straightforward.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h11',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What is the effect of 'AccuracySec=' in a timer?",
        options: [
            "Specifies the window within which the timer activation can be batched to save power",
            "Sets the clock accuracy",
            "Randomizes timer",
            "Nothing"
        ],
        correctAnswer: "Specifies the window within which the timer activation can be batched to save power",
        explanation: "Defaults to 1 minute; can be tightened.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h12',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What does 'at -c jobid' do?",
        options: ["Shows the command that will be executed", "Cancels the job", "Clones the job", "Checks the job"],
        correctAnswer: "Shows the command that will be executed",
        explanation: "-c prints the job details.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h13',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How do you allow only specific users to schedule at jobs?',
        options: ["Create /etc/at.allow", "Edit /etc/at.deny", "Use at -u", "Not configurable"],
        correctAnswer: "Create /etc/at.allow",
        explanation: "at.allow / at.deny work like cron's.",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h14',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: "What is the difference between 'OnCalendar' and 'OnBootSec'?",
        options: [
            "OnCalendar is wall-clock; OnBootSec is relative to boot time",
            "Both are calendar",
            "OnBootSec is daily",
            "No difference"
        ],
        correctAnswer: "OnCalendar is wall-clock; OnBootSec is relative to boot time",
        explanation: "Timer types: realtime (calendar) and monotonic (relative).",
        difficulty: 'hard'
    },
    {
        id: 't2c02_h15',
        chapterId: 'track2-ch02',
        type: 'mcq',
        question: 'How can you verify that a systemd timer is correctly linked to its service?',
        options: [
            "Inspect the timer unit file for 'Unit=myservice.service'",
            "systemctl list-dependencies timer",
            "systemctl show timer | grep Unit",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "All methods show the association.",
        difficulty: 'hard'
    }
];
