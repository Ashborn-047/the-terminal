import { ChapterAssessment } from '../../features/lab-engine/providers/QuestionProvider';

export const ch08Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch08_e01',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'Which command starts the SSH service?',
        options: ['systemctl start sshd', 'systemctl enable sshd', 'service sshd start', 'start sshd'],
        correctAnswer: 'systemctl start sshd',
        explanation: 'systemctl start starts the service immediately.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e02',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you check the status of the sshd service?',
        options: ['systemctl status sshd', 'systemctl check sshd', 'systemctl info sshd', 'systemctl test sshd'],
        correctAnswer: 'systemctl status sshd',
        explanation: 'status shows active state, enabled status, and recent logs.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e03',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'Which command enables a service to start at boot?',
        options: ['systemctl start sshd', 'systemctl enable sshd', 'systemctl boot sshd', 'systemctl activate sshd'],
        correctAnswer: 'systemctl enable sshd',
        explanation: 'enable creates the symlinks needed for boot startup.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e04',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl disable sshd' do?",
        options: [
          'Stops the service',
          'Prevents the service from starting at boot',
          'Deletes the service',
          'Masks the service'
        ],
        correctAnswer: 'Prevents the service from starting at boot',
        explanation: 'disable removes boot symlinks; it does not stop a running service.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e05',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you restart a service?',
        options: ['systemctl restart sshd', 'systemctl reboot sshd', 'systemctl reload sshd', 'systemctl start sshd'],
        correctAnswer: 'systemctl restart sshd',
        explanation: 'restart stops and starts the service.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e06',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'Which command masks a service?',
        options: ['systemctl mask sshd', 'systemctl disable sshd', 'systemctl hide sshd', 'systemctl block sshd'],
        correctAnswer: 'systemctl mask sshd',
        explanation: 'mask symlinks the unit file to /dev/null, preventing it from starting.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e07',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'What is systemd?',
        options: [
          'The init system and service manager for Linux',
          'A text editor',
          'A network tool',
          'A filesystem'
        ],
        correctAnswer: 'The init system and service manager for Linux',
        explanation: 'systemd is PID 1 and manages services, mounts, sockets, etc.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e08',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl is-enabled sshd' show?",
        options: [
          'Whether the service starts at boot',
          'If the service is running',
          'The service\'s PID',
          'Service logs'
        ],
        correctAnswer: 'Whether the service starts at boot',
        explanation: "is-enabled returns 'enabled', 'disabled', or 'masked'.",
        difficulty: 'easy'
    },
    {
        id: 'ch08_e09',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you list all active service units?',
        options: [
          'systemctl list-units --type=service',
          'systemctl list-services',
          'systemctl --all',
          'ps aux'
        ],
        correctAnswer: 'systemctl list-units --type=service',
        explanation: 'list-units with --type filter shows running/active units.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e10',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl reload sshd' do?",
        options: [
          'Reloads the service\'s configuration without a full restart',
          'Restarts the service',
          'Stops the service',
          'Enables the service'
        ],
        correctAnswer: 'Reloads the service\'s configuration without a full restart',
        explanation: 'reload applies new config if the service supports it.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e11',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'Which target is equivalent to the old runlevel 3 (multi-user CLI)?',
        options: ['multi-user.target', 'graphical.target', 'rescue.target', 'default.target'],
        correctAnswer: 'multi-user.target',
        explanation: 'multi-user.target provides a non-graphical multi-user system.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e12',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you switch to rescue mode?',
        options: [
          'systemctl isolate rescue.target',
          'systemctl rescue',
          'systemctl emergency',
          'systemctl single'
        ],
        correctAnswer: 'systemctl isolate rescue.target',
        explanation: 'isolate changes the current target to rescue.target.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e13',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'What command do you use after editing a systemd unit file?',
        options: ['systemctl daemon-reload', 'systemctl restart', 'systemctl reload', 'systemctl reboot'],
        correctAnswer: 'systemctl daemon-reload',
        explanation: 'daemon-reload tells systemd to re-read unit files.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e14',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you view logs for a specific service?',
        options: ['journalctl -u sshd', 'systemctl logs sshd', 'service logs sshd', 'tail -f /var/log/sshd'],
        correctAnswer: 'journalctl -u sshd',
        explanation: 'journalctl -u filters by unit.',
        difficulty: 'easy'
    },
    {
        id: 'ch08_e15',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl enable --now sshd' do?",
        options: [
          'Enables the service for boot AND starts it immediately',
          'Only enables it',
          'Only starts it',
          'Enables and restarts'
        ],
        correctAnswer: 'Enables the service for boot AND starts it immediately',
        explanation: '--now also starts the service right away.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch08_m01',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is the difference between 'restart' and 'reload'?",
        options: [
          'restart stops and starts; reload applies config without a full stop',
          'No difference',
          'reload is faster',
          'restart only works for systemd services'
        ],
        correctAnswer: 'restart stops and starts; reload applies config without a full stop',
        explanation: 'reload depends on the service supporting the reload signal.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m02',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl reset-failed' do?",
        options: [
          'Clears the failed state from units',
          'Restarts failed services',
          'Deletes failed units',
          'Resets systemd'
        ],
        correctAnswer: 'Clears the failed state from units',
        explanation: 'It resets the fail counter and clears the failed status.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m03',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you see the dependencies of a service?',
        options: [
          'systemctl list-dependencies sshd',
          'systemctl deps sshd',
          'systemctl show sshd',
          'systemctl list sshd'
        ],
        correctAnswer: 'systemctl list-dependencies sshd',
        explanation: 'list-dependencies shows what a unit requires and wants.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m04',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'What directory do admin-custom unit files typically go in?',
        options: [
          '/etc/systemd/system/',
          '/usr/lib/systemd/system/',
          '/lib/systemd/',
          '/opt/systemd/'
        ],
        correctAnswer: '/etc/systemd/system/',
        explanation: '/etc/systemd/system/ overrides /usr/lib/systemd/system/.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m05',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl set-default multi-user.target' do?",
        options: [
          'Sets the default boot target to multi-user',
          'Immediately boots into multi-user',
          'Enables multi-user target',
          'Starts multi-user target'
        ],
        correctAnswer: 'Sets the default boot target to multi-user',
        explanation: 'It changes the symlink /etc/systemd/system/default.target.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m06',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How can you see the entire unit file content of sshd?',
        options: ['systemctl cat sshd', 'systemctl show sshd', 'cat /etc/systemd/system/sshd.service', 'systemctl edit sshd'],
        correctAnswer: 'systemctl cat sshd',
        explanation: 'cat displays the unit file and any override snippets.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m07',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is the difference between 'mask' and 'disable'?",
        options: [
          'disable removes boot symlinks; mask symlinks to /dev/null preventing any start',
          'No difference',
          'mask is permanent, disable is temporary',
          'disable also stops the service'
        ],
        correctAnswer: 'disable removes boot symlinks; mask symlinks to /dev/null preventing any start',
        explanation: 'masking makes it impossible to start, even manually.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m08',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl show sshd' do?",
        options: [
          'Displays all properties of the sshd unit',
          'Shows the status',
          'Starts sshd',
          'Edits the unit'
        ],
        correctAnswer: 'Displays all properties of the sshd unit',
        explanation: 'show dumps all properties in key=value format.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m09',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you check if a service failed?',
        options: [
          'systemctl is-failed sshd',
          'systemctl status sshd',
          'journalctl -u sshd --lines=5',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'All can indicate failure.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m10',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is a 'wanted' dependency in systemd?",
        options: [
          'A weak dependency that won\'t fail the main unit if missing',
          'A required dependency',
          'A masked dependency',
          'A target'
        ],
        correctAnswer: 'A weak dependency that won\'t fail the main unit if missing',
        explanation: "'Wants' are optional; 'Requires' are mandatory.",
        difficulty: 'medium'
    },
    {
        id: 'ch08_m11',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl list-sockets' show?",
        options: [
          'Socket-activated units and their listening sockets',
          'All open network sockets',
          'Service status',
          'Unit files'
        ],
        correctAnswer: 'Socket-activated units and their listening sockets',
        explanation: 'It shows socket units, often used for on-demand services.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m12',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you stop a service from running until it is unmasked?',
        options: ['systemctl mask servicename', 'systemctl disable servicename', 'systemctl stop servicename', 'systemctl hide servicename'],
        correctAnswer: 'systemctl mask servicename',
        explanation: 'Only mask prevents it from starting at all.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m13',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl edit sshd' do?",
        options: [
          'Opens an override file for the unit',
          'Edits the main unit file',
          'Shows the unit file',
          'Starts an editor for logs'
        ],
        correctAnswer: 'Opens an override file for the unit',
        explanation: 'edit creates an override snippet in /etc/systemd/system/.',
        difficulty: 'medium'
    },
    {
        id: 'ch08_m14',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How can you schedule a service to start after another?',
        options: [
          'Use After= in the unit file or modify dependencies',
          'Use \'systemctl after\'',
          'Only by timers',
          'Not possible'
        ],
        correctAnswer: 'Use After= in the unit file or modify dependencies',
        explanation: "Unit file directives 'After=' and 'Requires=' control ordering.",
        difficulty: 'medium'
    },
    {
        id: 'ch08_m15',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'What is a systemd timer?',
        options: [
          'A unit that schedules other units, similar to cron',
          'A stopwatch',
          'A service that times out',
          'A kernel timer'
        ],
        correctAnswer: 'A unit that schedules other units, similar to cron',
        explanation: 'Timers replace cron jobs in systemd.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch08_h01',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is the difference between 'systemctl kill' and 'systemctl stop'?",
        options: [
          'kill sends a signal; stop uses the service\'s stop command',
          'No difference',
          'kill is more graceful',
          'stop only works on targets'
        ],
        correctAnswer: 'kill sends a signal; stop uses the service\'s stop command',
        explanation: 'kill sends arbitrary signals; stop runs ExecStop.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h02',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl list-unit-files --state=masked' show?",
        options: ['All masked unit files', 'All enabled units', 'All disabled units', 'All failed units'],
        correctAnswer: 'All masked unit files',
        explanation: 'Filter by state to see only masked units.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h03',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How would you run a one-shot command at boot using systemd?',
        options: [
          'Create a unit file with Type=oneshot and ExecStart, then enable it',
          'Add to rc.local',
          'Use a cron @reboot job',
          'systemctl boot-command'
        ],
        correctAnswer: 'Create a unit file with Type=oneshot and ExecStart, then enable it',
        explanation: 'oneshot units run once and exit, perfect for boot scripts.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h04',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'What happens if you mask a running service?',
        options: [
          'It continues running, but can\'t be restarted after it stops',
          'It immediately stops',
          'The mask fails',
          'It unmask itself'
        ],
        correctAnswer: 'It continues running, but can\'t be restarted after it stops',
        explanation: 'mask only prevents future starts; it doesn\'t affect the current process.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h05',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you reload systemd after adding a new unit file without disrupting services?',
        options: [
          'systemctl daemon-reload',
          'systemctl restart',
          'reboot',
          'systemctl daemon-restart'
        ],
        correctAnswer: 'systemctl daemon-reload',
        explanation: 'daemon-reload is safe and doesn\'t restart running services.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h06',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl enable --runtime' do?",
        options: [
          'Enables the unit only until the next reboot',
          'Enables permanently',
          'Starts the unit',
          'Disables after runtime'
        ],
        correctAnswer: 'Enables the unit only until the next reboot',
        explanation: '--runtime writes to /run/systemd/system/, which is volatile.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h07',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is the purpose of 'systemd-analyze'?",
        options: [
          'Analyzes boot performance and blame',
          'Scans logs',
          'Monitors CPU',
          'Checks disk'
        ],
        correctAnswer: 'Analyzes boot performance and blame',
        explanation: 'systemd-analyze blame shows which units slowed down boot.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h08',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'After=network.target' in a unit file do?",
        options: [
          'Ensures the network is up before starting this unit',
          'Starts after the unit',
          'Creates a network target',
          'Disables networking'
        ],
        correctAnswer: 'Ensures the network is up before starting this unit',
        explanation: 'After= sets ordering; combine with Wants= to pull in the target.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h09',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How can you override a parameter in a unit file without editing the original?',
        options: [
          'systemctl edit unit --full',
          'Create an override.conf in /etc/systemd/system/unit.d/',
          'Copy to /opt/systemd/',
          'Not possible'
        ],
        correctAnswer: 'Create an override.conf in /etc/systemd/system/unit.d/',
        explanation: 'Drop-in files in unit.d/ override specific directives.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h10',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is the difference between 'Wants=' and 'Requires=' in a unit file?",
        options: [
          'Requires is strict: failure of the dependency fails the unit; Wants is soft',
          'No difference',
          'Wants is for services, Requires is for targets',
          'Requires only works for network'
        ],
        correctAnswer: 'Requires is strict: failure of the dependency fails the unit; Wants is soft',
        explanation: 'Requires will stop the unit if a dependency fails; Wants will not.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h11',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How would you create a custom systemd service that runs a script on startup?',
        options: [
          'Create a .service file in /etc/systemd/system/ with ExecStart, then enable',
          'Add script to /etc/init.d/',
          'Use rc.local',
          'Start the script in .bashrc'
        ],
        correctAnswer: 'Create a .service file in /etc/systemd/system/ with ExecStart, then enable',
        explanation: 'Systemd service files are the standard way.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h12',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What does 'systemctl list-timers' show?",
        options: [
          'Scheduled systemd timers and their next run times',
          'Cron jobs',
          'Running services',
          'Boot time'
        ],
        correctAnswer: 'Scheduled systemd timers and their next run times',
        explanation: 'Timers are systemd units that schedule service activation.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h13',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What happens if you 'systemctl set-default' to a nonexistent target?",
        options: [
          'The command fails',
          'It falls back to rescue.target',
          'It creates the target',
          'System boots into emergency mode'
        ],
        correctAnswer: 'The command fails',
        explanation: 'systemctl will refuse with an error.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h14',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: 'How do you view only the last 50 lines of the sshd journal?',
        options: [
          'journalctl -u sshd -n 50',
          'journalctl -u sshd --tail=50',
          'journalctl -u sshd | tail -50',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: '-n and --tail are equivalent; piping also works.',
        difficulty: 'hard'
    },
    {
        id: 'ch08_h15',
        chapterId: 'track1-ch08',
        type: 'mcq',
        question: "What is the purpose of 'systemd-tmpfiles'?",
        options: [
          'Creates, deletes, and cleans up temporary files and directories',
          'Manages swap',
          'Edits config files',
          'Monitors memory'
        ],
        correctAnswer: 'Creates, deletes, and cleans up temporary files and directories',
        explanation: 'systemd-tmpfiles handles volatile and temporary files per configuration.',
        difficulty: 'hard'
    }
];
