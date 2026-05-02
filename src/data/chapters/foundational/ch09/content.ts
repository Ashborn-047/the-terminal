import { ChapterContent } from '../../../types/chapters';

export const ch09Content: ChapterContent = {
    chapterId: 'track1-ch09',
    title: 'Configuring and Securing SSH',
    description: "Master the encrypted gateway. Learn to set up key‑based authentication, harden the SSH daemon, and protect your system from remote attacks.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "SSH (Secure Shell) is your encrypted gateway to remote Linux systems. Whether you're managing one server or a thousand, SSH is the tool. But out of the box, it’s not as secure as it could be.\n\nIn this chapter you’ll go beyond simple connections: you’ll set up key‑based authentication, harden the SSH daemon, and protect your system from the internet’s endless login attempts."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to connect to a remote machine with `ssh`.",
                "How to generate key pairs and use `ssh-keygen`.",
                "How to copy public keys with `ssh-copy-id`.",
                "How to configure the SSH server (`sshd_config`) for security.",
                "How to use `scp` and `sftp` for file transfers over SSH."
            ]
        },
        {
            type: 'interactive',
            id: 'connecting',
            heading: 'Connecting with SSH',
            content: "The basic command:",
            terminal_blocks: [
                { command: "ssh user@hostname_or_ip", showPrompt: true }
            ],
            tips: [
                "On first connection, you'll see a fingerprint. Type 'yes' to trust it. After that, the host key is cached in `~/.ssh/known_hosts`."
            ],
            terminal_blocks_after: [
                { command: "ssh -p 2222 user@host", showPrompt: true, output: "// Use a different port" }
            ]
        },
        {
            type: 'interactive',
            id: 'key_auth',
            heading: 'Key‑Based Authentication',
            content: "Passwords can be guessed. Keys are nearly impossible to brute‑force. Generate a key pair:",
            terminal_blocks: [
                { command: "ssh-keygen -t ed25519 -C \"your_email@example.com\"", showPrompt: true }
            ],
            tips: [
                "This creates:",
                "- `~/.ssh/id_ed25519` — your private key (keep secret!)",
                "- `~/.ssh/id_ed25519.pub` — the public key (share with servers)"
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Never share your private key. Protect it with a passphrase during key generation." }
            ]
        },
        {
            type: 'interactive',
            id: 'copy_key',
            heading: 'Copying Your Public Key',
            content: "Once the key pair is created, push the public key to the server:",
            terminal_blocks: [
                { command: "ssh-copy-id user@remote_host", showPrompt: true }
            ],
            tips: [
                "You'll be prompted for the password one last time. After that, login uses the key."
            ],
            terminal_blocks_after: [
                { command: "cat ~/.ssh/id_ed25519.pub | ssh user@host \"mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys\"", showPrompt: true, output: "// Manual method" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Connect to your VM, generate a key, and set up passwordless login." }
            ]
        },
        {
            type: 'interactive',
            id: 'sshd_config',
            heading: 'The SSH Daemon Configuration',
            content: "The SSH server reads `/etc/ssh/sshd_config`. After changes, restart sshd: `sudo systemctl restart sshd`.",
            tips: [
                "Key security settings:"
            ],
            terminal_blocks: [
                {
                    command: "PermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\nPort 2222\nAllowUsers alice bob",
                    showPrompt: false
                }
            ],
            list: [
                "**PermitRootLogin no** — block direct root login.",
                "**PasswordAuthentication no** — force key usage (after keys work!).",
                "**Port** — change from default 22 to reduce automated attacks.",
                "**AllowUsers** — whitelist specific users."
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Before disabling password authentication, ensure your key works. Always keep a root shell open while testing." }
            ]
        },
        {
            type: 'interactive',
            id: 'transfers',
            heading: 'Transferring Files – scp and sftp',
            content: "`scp` copies files over SSH:",
            terminal_blocks: [
                { command: "scp file.txt user@host:/remote/path/", showPrompt: true },
                { command: "scp -r folder user@host:/remote/path/", showPrompt: true }
            ],
            terminal_blocks_after: [
                { command: "sftp user@host\nsftp> put localfile\nsftp> get remotefile", showPrompt: false, output: "// sftp interactive session" }
            ],
            callouts: [
                { type: 'info', content: "Both use the same authentication (keys or password)." },
                { type: 'try_it', icon: '🧪', content: "Create a text file, copy it to your remote server with scp, then download it back." }
            ]
        },
        {
            type: 'interactive',
            id: 'ssh_agent',
            heading: 'SSH Agent and Key Management',
            content: "If your private key has a passphrase, you don't want to type it every time. `ssh-agent` manages keys in memory:",
            terminal_blocks: [
                { command: "eval \"$(ssh-agent -s)\"", showPrompt: true },
                { command: "ssh-add ~/.ssh/id_ed25519", showPrompt: true }
            ],
            tips: [
                "Now you can SSH without re‑entering the passphrase until the agent stops."
            ]
        },
        {
            type: 'text',
            id: 'fail2ban',
            heading: 'Hardening – Fail2Ban (the idea)',
            content: "Even with keys, attackers might try to brute‑force. `fail2ban` watches logs and temporarily bans IPs after repeated failures. While not covered in depth here, it's a must‑know for real servers."
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Locking yourself out** — disable password auth before testing key login.",
                "**Losing the private key** — no key, no access. Store it safely.",
                "**Allowing root login** — always forbid direct root; use sudo instead.",
                "**Using old key types (DSA, RSA)** — Ed25519 is modern and secure."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You now have a secure remote access toolkit. Next, we'll dive into logging — the journals and syslog files that tell you what's happening on your system.",
            list: [
                "`ssh user@host` — connect.",
                "`ssh-keygen` — create keys; `ssh-copy-id` — deploy.",
                "`sshd_config` — harden: no root, no passwords, allow specific users.",
                "`scp` / `sftp` — transfer files."
            ]
        }
    ]
};
