import { ChapterContent } from '../../../../types/chapters';

export const t2ch09Content: ChapterContent = {
    chapterId: 'track2-ch09',
    title: 'Accessing Network-Attached Storage (NFS, autofs)',
    description: "Connect to remote storage seamlessly with Network File System (NFS) and implement on-demand mounting using autofs for efficient resource management.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Storage doesn't always live inside your machine. Network File System (NFS) lets you access remote directories as if they were local. When combined with **autofs**, mounts happen on demand, keeping your system clean and speeding up boot times. This is essential for centralized home directories, shared data, and scalable infrastructures."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to set up an NFS server and export directories.",
                "How to manually mount an NFS share with `mount -t nfs`.",
                "How to configure **autofs** for automatic, on-demand mounting.",
                "How to troubleshoot NFS access issues."
            ]
        },
        {
            type: 'interactive',
            id: 'nfs_server',
            heading: 'NFS Server Setup',
            content: "Exporting a directory requires the NFS server utility and configuration in `/etc/exports`.",
            terminal_blocks: [
                { command: "sudo dnf install nfs-utils", showPrompt: true },
                { command: "echo '/shared 192.168.1.0/24(rw,sync,no_root_squash)' | sudo tee -a /etc/exports", showPrompt: true },
                { command: "sudo exportfs -a", showPrompt: true },
                { command: "sudo systemctl enable --now nfs-server", showPrompt: true }
            ],
            tips: [
                "Use `exportfs -v` to verify your active exports and their specific options."
            ]
        },
        {
            type: 'interactive',
            id: 'nfs_client',
            heading: 'NFS Client Mount',
            content: "On the client side, you can mount the share manually or permanently via `/etc/fstab`.",
            terminal_blocks: [
                { command: "sudo dnf install nfs-utils", showPrompt: true },
                { command: "sudo mount -t nfs server:/shared /mnt/nfs", showPrompt: true },
                { command: "df -h", showPrompt: true }
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "In `/etc/fstab`, always use the `_netdev` option for network mounts (e.g., `server:/shared /mnt/nfs nfs defaults,_netdev 0 0`). This prevents the system from attempting to mount before the network is fully initialized during boot." }
            ]
        },
        {
            type: 'interactive',
            id: 'autofs_intro',
            heading: 'Autofs – On‑Demand Mounting',
            content: "Autofs mounts directories only when they are accessed and unmounts them after a period of inactivity. This is ideal for shared environments.",
            terminal_blocks: [
                { command: "sudo dnf install autofs", showPrompt: true },
                { command: "sudo systemctl enable --now autofs", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'autofs_config',
            heading: 'Autofs Configuration',
            content: "Autofs uses a master map (`/etc/auto.master`) that points to specific map files.",
            terminal_blocks: [
                { command: "echo '/mnt/nfs /etc/auto.nfs --timeout=60' | sudo tee -a /etc/auto.master", showPrompt: true },
                { command: "echo 'shared -rw,soft server:/shared' | sudo tee -a /etc/auto.nfs", showPrompt: true },
                { command: "sudo systemctl reload autofs", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Set up autofs for an NFS directory. Access the path (e.g., `cd /mnt/nfs/shared`) and run `df -h` to see the mount appear automatically." }
            ]
        },
        {
            type: 'interactive',
            id: 'wildcards',
            heading: 'Wildcard Maps',
            content: "Wildcards allow dynamic mounting of subdirectories (like user home folders) from a single server.",
            terminal_blocks: [
                { command: "* -rw,soft server:/home/&", showPrompt: false }
            ],
            tips: [
                "The `&` symbol in the map file is replaced by the specific directory name you attempt to access."
            ]
        },
        {
            type: 'text',
            id: 'troubleshooting',
            heading: 'Troubleshooting NFS & autofs',
            list: [
                "**Server Status** – Check `systemctl status nfs-server` on the host.",
                "**Visibility** – Run `showmount -e server` from the client to see available exports.",
                "**Logs** – Monitor `journalctl -u autofs` for mounting errors.",
                "**Protocol** – Explicitly use `mount -t nfs4` if auto-negotiation fails."
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Stale Exports** – Forgetting to run `exportfs -a` after modifying `/etc/exports`.",
                "**Firewall Blocks** – NFSv4 requires port 2049; earlier versions also need 111 (rpcbind) and dynamic mountd ports.",
                "**Boot Hangs** – Omitting `_netdev` in `/etc/fstab`, causing the system to wait indefinitely for a network that isn't up yet."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Network storage is now at your fingertips. Next, we take control of the boot process itself.",
            list: [
                "NFS Server: Managed via `/etc/exports` and `exportfs`.",
                "NFS Client: Manual mounts with `mount -t nfs` or persistent via `fstab`.",
                "Autofs: On-demand mounting using `/etc/auto.master` and map files.",
                "Maintenance: Always use `_netdev` and verify server visibility with `showmount`."
            ]
        }
    ]
};
