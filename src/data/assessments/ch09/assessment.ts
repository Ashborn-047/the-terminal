import { ChapterAssessment } from '../../features/lab-engine/providers/QuestionProvider';

export const ch09Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch09_e01',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'What does SSH stand for?',
        options: ['Secure Shell', 'System Shell', 'Simple Shell', 'Super Shell'],
        correctAnswer: 'Secure Shell',
        explanation: 'SSH provides encrypted remote shell access.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e02',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "How do you connect to a remote machine as user 'alice'?",
        options: ['ssh alice@remote', 'ssh remote alice', 'connect alice remote', 'telnet remote'],
        correctAnswer: 'ssh alice@remote',
        explanation: 'ssh user@host is the standard syntax.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e03',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'Which command generates SSH key pairs?',
        options: ['ssh-keygen', 'ssh-genkey', 'ssh-copy-id', 'ssh-agent'],
        correctAnswer: 'ssh-keygen',
        explanation: 'ssh-keygen creates public/private key pairs.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e04',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How do you copy your public key to a remote server?',
        options: ['ssh-copy-id user@host', 'scp key user@host', 'ssh-send-key', 'ftp key'],
        correctAnswer: 'ssh-copy-id user@host',
        explanation: 'ssh-copy-id appends the public key to authorized_keys.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e05',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'Which file contains public keys allowed to log in?',
        options: ['~/.ssh/authorized_keys', '~/.ssh/id_rsa.pub', '/etc/ssh/sshd_config', '~/.ssh/known_hosts'],
        correctAnswer: '~/.ssh/authorized_keys',
        explanation: 'authorized_keys lists public keys that can authenticate.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e06',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'What command securely copies a file to a remote server?',
        options: ['scp file user@host:/path', 'cp --remote file', 'sftp put', 'rsync file'],
        correctAnswer: 'scp file user@host:/path',
        explanation: 'scp copies over SSH.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e07',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'Which SSH daemon configuration file is used to set security options?',
        options: ['/etc/ssh/sshd_config', '/etc/ssh/ssh_config', '~/.ssh/config', '/etc/sshd.conf'],
        correctAnswer: '/etc/ssh/sshd_config',
        explanation: 'sshd_config controls the SSH server.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e08',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'PermitRootLogin no' do?",
        options: [
          'Prevents direct root login via SSH',
          'Allows root login',
          'Stops root processes',
          'Locks root account'
        ],
        correctAnswer: 'Prevents direct root login via SSH',
        explanation: 'It disables root login over SSH.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e09',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'PasswordAuthentication no' enforce?",
        options: [
          'Only key-based authentication is allowed',
          'Root can\'t login',
          'No authentication',
          'Password is required'
        ],
        correctAnswer: 'Only key-based authentication is allowed',
        explanation: 'Disables password login, forcing public key authentication.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e10',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'What is the default SSH port?',
        options: ['22', '21', '80', '443'],
        correctAnswer: '22',
        explanation: 'SSH listens on TCP port 22 by default.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e11',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'sftp' do?",
        options: [
          'Interactive file transfer over SSH',
          'Secure FTP without SSH',
          'Simple file transfer',
          'SSH file test'
        ],
        correctAnswer: 'Interactive file transfer over SSH',
        explanation: 'sftp provides an FTP-like interface over SSH.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e12',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'Which file stores the fingerprints of hosts you\'ve connected to?',
        options: ['~/.ssh/known_hosts', '~/.ssh/authorized_keys', '/etc/ssh/ssh_host_key', '~/.ssh/config'],
        correctAnswer: '~/.ssh/known_hosts',
        explanation: 'known_hosts caches host keys to detect MITM attacks.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e13',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is the purpose of 'ssh-agent'?",
        options: [
          'Caches decrypted private keys in memory',
          'Manages SSH connections',
          'Copies keys',
          'Generates keys'
        ],
        correctAnswer: 'Caches decrypted private keys in memory',
        explanation: 'ssh-agent holds keys so you don\'t retype passphrases.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e14',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'Which command adds a private key to the SSH agent?',
        options: ['ssh-add', 'ssh-agent', 'ssh-copy-id', 'ssh-keygen'],
        correctAnswer: 'ssh-add',
        explanation: 'ssh-add loads a key into the agent.',
        difficulty: 'easy'
    },
    {
        id: 'ch09_e15',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'What is the recommended modern key type?',
        options: ['Ed25519', 'RSA', 'DSA', 'ECDSA'],
        correctAnswer: 'Ed25519',
        explanation: 'Ed25519 is fast, secure, and compact.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch09_m01',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'ssh -p 2222' do?",
        options: [
          'Connects to SSH on port 2222 instead of 22',
          'Uses protocol 2222',
          'Sets priority',
          'Pauses for 2222 seconds'
        ],
        correctAnswer: 'Connects to SSH on port 2222 instead of 22',
        explanation: '-p specifies a non-default port.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m02',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'ssh-copy-id' actually do?",
        options: [
          'Appends your public key to the remote ~/.ssh/authorized_keys',
          'Copies the private key',
          'Creates a new key pair',
          'Installs SSH server'
        ],
        correctAnswer: 'Appends your public key to the remote ~/.ssh/authorized_keys',
        explanation: 'It adds the public key, enabling passwordless login.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m03',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'Why should you disable password authentication after enabling key-based auth?',
        options: [
          'Keys are much harder to brute-force',
          'Passwords are faster',
          'It\'s just a convention',
          'It breaks SSH'
        ],
        correctAnswer: 'Keys are much harder to brute-force',
        explanation: 'Password brute-forcing is the most common attack; keys eliminate that vector.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m04',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'What happens if you change the SSH port but the firewall still blocks it?',
        options: [
          'You can\'t connect',
          'SSH falls back to port 22',
          'It automatically opens the port',
          'Connection is slower'
        ],
        correctAnswer: 'You can\'t connect',
        explanation: 'Both the server and firewall must allow the new port.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m05',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "Where does 'ssh-copy-id' place the public key?",
        options: [
          'Remote ~/.ssh/authorized_keys',
          'Local ~/.ssh/authorized_keys',
          'Remote /etc/ssh/authorized_keys',
          'Local ~/.ssh/id_rsa.pub'
        ],
        correctAnswer: 'Remote ~/.ssh/authorized_keys',
        explanation: "It appends to the user's authorized_keys on the remote host.",
        difficulty: 'medium'
    },
    {
        id: 'ch09_m06',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'AllowUsers bob' in sshd_config do?",
        options: [
          'Only bob can SSH in; all others denied',
          'Bob is allowed to run sudo',
          'Bob can edit sshd_config',
          'Bob is root'
        ],
        correctAnswer: 'Only bob can SSH in; all others denied',
        explanation: 'AllowUsers restricts which users can authenticate.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m07',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How do you view the fingerprint of a host\'s key?',
        options: ['ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub', 'ssh-fingerprint', 'ssh-copy-id', 'ssh -v'],
        correctAnswer: 'ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub',
        explanation: 'ssh-keygen -l displays the fingerprint.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m08',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'scp -r' do?",
        options: ['Copies directories recursively', 'Resumes transfer', 'Remote copy', 'Reverse copy'],
        correctAnswer: 'Copies directories recursively',
        explanation: '-r copies entire directory trees.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m09',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'What is the difference between /etc/ssh/sshd_config and /etc/ssh/ssh_config?',
        options: [
          'sshd_config is server; ssh_config is client',
          'No difference',
          'sshd_config is client; ssh_config is server',
          'One is for keys, one for config'
        ],
        correctAnswer: 'sshd_config is server; ssh_config is client',
        explanation: 'sshd_config configures the daemon, ssh_config configures the client.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m10',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'ssh -v' show?",
        options: ['Debugging connection details', 'Version', 'Verbose output from remote', 'Very secure'],
        correctAnswer: 'Debugging connection details',
        explanation: '-v enables verbose output for troubleshooting.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m11',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How can you test sshd_config for syntax errors?',
        options: ['sshd -t', 'systemctl config sshd', 'ssh --check-config', 'configtest'],
        correctAnswer: 'sshd -t',
        explanation: 'sshd -t validates the config file syntax.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m12',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'PubkeyAuthentication yes' do in sshd_config?",
        options: [
          'Enables public key authentication',
          'Disables password auth',
          'Creates keys',
          'Copies keys'
        ],
        correctAnswer: 'Enables public key authentication',
        explanation: 'This setting allows key-based logins.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m13',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How do you limit SSH to specific groups?',
        options: ['AllowGroups developers', 'AllowUsers @developers', 'GroupAuth on', 'Not possible'],
        correctAnswer: 'AllowGroups developers',
        explanation: 'AllowGroups restricts access to members of the listed groups.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m14',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is the purpose of the 'Banner' directive in sshd_config?",
        options: [
          'Displays a message before login',
          'Sets the terminal banner',
          'Starts a welcome script',
          'Logs connections'
        ],
        correctAnswer: 'Displays a message before login',
        explanation: 'Banner shows a file\'s content to connecting users.',
        difficulty: 'medium'
    },
    {
        id: 'ch09_m15',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'MaxAuthTries 3' do?",
        options: [
          'Limits authentication attempts to 3 before disconnecting',
          'Allows 3 simultaneous logins',
          'Sets password length to 3',
          'Retries 3 times'
        ],
        correctAnswer: 'Limits authentication attempts to 3 before disconnecting',
        explanation: 'Reduces brute-force risk by limiting tries per connection.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch09_h01',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is the difference between 'ssh -L' and 'ssh -R'?",
        options: [
          '-L local port forwarding, -R remote port forwarding',
          '-L remote forwarding, -R local',
          '-L listens, -R runs',
          'No difference'
        ],
        correctAnswer: '-L local port forwarding, -R remote port forwarding',
        explanation: 'Local (-L) forwards a local port to remote; remote (-R) does the reverse.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h02',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'ssh -D 1080' do?",
        options: [
          'Starts a dynamic SOCKS proxy on port 1080',
          'Disables password auth on port 1080',
          'Daemonizes SSH',
          'Debug mode'
        ],
        correctAnswer: 'Starts a dynamic SOCKS proxy on port 1080',
        explanation: '-D opens a SOCKS tunnel for proxying traffic.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h03',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How do you run a command on a remote host without an interactive shell?',
        options: ['ssh user@host \'command\'', 'ssh -t command', 'scp command', 'Not possible'],
        correctAnswer: 'ssh user@host \'command\'',
        explanation: 'Appending a command after the host executes it remotely.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h04',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is SSH agent forwarding ('-A') and why is it risky?",
        options: [
          'Exposes your agent to the remote host; a compromised server can use your keys',
          'Forwards connections securely',
          'Adds extra authentication',
          'Disables key checking'
        ],
        correctAnswer: 'Exposes your agent to the remote host; a compromised server can use your keys',
        explanation: 'Agent forwarding can be abused by a malicious admin.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h05',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is the purpose of 'ssh-keyscan'?",
        options: [
          'Collects SSH host keys from a server',
          'Scans for open ports',
          'Copies keys',
          'Generates host keys'
        ],
        correctAnswer: 'Collects SSH host keys from a server',
        explanation: 'ssh-keyscan retrieves public host keys, useful for populating known_hosts.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h06',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How would you restrict a user to only run a specific command via SSH?',
        options: [
          'Use the \'command=\' directive in authorized_keys',
          'Set shell to /bin/rbash',
          'Use AllowUsers with argument',
          'Modify /etc/ssh/sshd_config with ForceCommand'
        ],
        correctAnswer: 'Use the \'command=\' directive in authorized_keys',
        explanation: 'command= limits that key to running only the specified command.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h07',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'ChrootDirectory' in sshd_config do?",
        options: [
          'Confines users to a specific directory subtree (chroot jail)',
          'Sets the home directory',
          'Changes the root user',
          'Creates a new filesystem'
        ],
        correctAnswer: 'Confines users to a specific directory subtree (chroot jail)',
        explanation: 'ChrootDirectory isolates the user to that directory root.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h08',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is the 'Match' block in sshd_config used for?",
        options: [
          'Applies settings conditionally based on user, group, or host',
          'Matches passwords',
          'Logs matches',
          'Validates keys'
        ],
        correctAnswer: 'Applies settings conditionally based on user, group, or host',
        explanation: 'Match allows per-user or per-group configuration.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h09',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How do you increase the verbosity of SSH client for debugging?',
        options: ['ssh -vvv', 'ssh -debug', 'ssh -V', 'ssh --log-level debug'],
        correctAnswer: 'ssh -vvv',
        explanation: '-v, -vv, -vvv increase verbosity.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h10',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'PermitEmptyPasswords no' do?",
        options: [
          'Block accounts with empty passwords',
          'Allow empty passwords',
          'Generate empty passwords',
          'Delete passwords'
        ],
        correctAnswer: 'Block accounts with empty passwords',
        explanation: 'It prohibits logins with empty password fields.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h11',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How can you disable SFTP while keeping SSH?',
        options: [
          'Comment out or remove Subsystem sftp in sshd_config',
          'systemctl disable sftp',
          'chmod 000 /usr/lib/sftp-server',
          'Not possible'
        ],
        correctAnswer: 'Comment out or remove Subsystem sftp in sshd_config',
        explanation: 'The SFTP subsystem is defined in sshd_config; removing it disables SFTP.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h12',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What does 'X11Forwarding yes' do?",
        options: [
          'Allows graphical applications to display remotely',
          'Forwards X11 attacks',
          'Enables X11 server',
          'Sends X11 logs'
        ],
        correctAnswer: 'Allows graphical applications to display remotely',
        explanation: 'It tunnels X11 over SSH.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h13',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How do you generate a host key for SSH?',
        options: ['ssh-keygen -A', 'ssh-keygen -t host', 'ssh-host-gen', 'Done automatically on install'],
        correctAnswer: 'ssh-keygen -A',
        explanation: 'ssh-keygen -A generates missing host keys.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h14',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: "What is the difference between 'ssh -N' and 'ssh -T'?",
        options: [
          '-N executes no remote command (forwarding only); -T disables pseudo-terminal',
          'No difference',
          '-N uses no authentication; -T tests connection',
          '-N is new connection; -T terminates'
        ],
        correctAnswer: '-N executes no remote command (forwarding only); -T disables pseudo-terminal',
        explanation: 'Both are often combined for tunnels without a shell.',
        difficulty: 'hard'
    },
    {
        id: 'ch09_h15',
        chapterId: 'track1-ch09',
        type: 'mcq',
        question: 'How can you configure a host-specific alias in ~/.ssh/config?',
        options: [
          'Host myserver\n  HostName server.example.com\n  User bob\n  Port 2222',
          'alias myserver=\'ssh bob@server.example.com -p 2222\'',
          'export SSH_ALIAS_myserver=bob@server.example.com:2222',
          'Write a script'
        ],
        correctAnswer: 'Host myserver\n  HostName server.example.com\n  User bob\n  Port 2222',
        explanation: '~/.ssh/config allows shortcuts for hosts, users, keys, and ports.',
        difficulty: 'hard'
    }
];
