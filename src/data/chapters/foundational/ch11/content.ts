import { ChapterContent } from '../../../../types/chapters';

export const ch11Content: ChapterContent = {
    chapterId: 'track1-ch11',
    title: 'Managing Enterprise Networking',
    description: "Without networking, your Linux machine is an island. Learn to configure IP addresses, DNS, and routing using nmcli and standard tools.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Without networking, your Linux machine is an island. Whether it's a cloud VM or a physical server, you need to configure IP addresses, DNS, and routing so it can talk to the world. In enterprise Linux, `nmcli` (NetworkManager) is the tool that tames the complexity.\n\nIn this chapter, you'll learn to view your network configuration, set static IPs, manage DNS, and troubleshoot connectivity — all from the command line."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to inspect network interfaces with `ip addr` and `nmcli`.",
                "How to configure static IP addresses and manage connections.",
                "How to set the system hostname with `hostnamectl`.",
                "How to test DNS resolution with `dig` and `ping`.",
                "How the `/etc/hosts` file works."
            ]
        },
        {
            type: 'interactive',
            id: 'checking_network',
            heading: 'Checking Your Network',
            content: "See all interfaces and IPs:",
            terminal_blocks: [
                { command: "ip addr show", showPrompt: true },
                { command: "ip a", showPrompt: true, output: "// Abbreviated" }
            ],
            terminal_blocks_after: [
                { command: "nmcli device status\nnmcli connection show", showPrompt: true, output: "// NetworkManager view" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run `ip addr` and identify your primary interface (eth0, ens33, etc.) and its IP address." }
            ]
        },
        {
            type: 'interactive',
            id: 'nm_connections',
            heading: 'NetworkManager Connections',
            content: "A \"connection\" is a saved configuration for an interface. To see all connections:",
            terminal_blocks: [
                { command: "nmcli connection show", showPrompt: true }
            ],
            tips: [
                "To view details of a specific connection:",
                "nmcli connection show \"System eth0\""
            ]
        },
        {
            type: 'interactive',
            id: 'static_ip_cmd',
            heading: 'Setting a Static IP (Method 1)',
            content: "List connections, note the name (e.g., 'ens33'), then edit:",
            terminal_blocks: [
                { 
                    command: "sudo nmcli connection modify \"ens33\" ipv4.addresses 192.168.1.100/24\nsudo nmcli connection modify \"ens33\" ipv4.gateway 192.168.1.1\nsudo nmcli connection modify \"ens33\" ipv4.dns \"8.8.8.8 8.8.4.4\"\nsudo nmcli connection modify \"ens33\" ipv4.method manual\nsudo nmcli connection up \"ens33\"", 
                    showPrompt: true 
                }
            ],
            tips: [
                "Changes are persistent and survive reboots."
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Always verify connectivity immediately after applying changes. Keep a backup connection method in case of mistakes." }
            ]
        },
        {
            type: 'interactive',
            id: 'static_ip_tui',
            heading: 'Setting a Static IP (Interactive)',
            content: "Alternatively, use the interactive editor:",
            terminal_blocks: [
                { command: "nmtui", showPrompt: true }
            ],
            tips: [
                "This opens a terminal-based GUI that guides you through connection editing."
            ]
        },
        {
            type: 'interactive',
            id: 'hostname',
            heading: 'Hostname Management',
            content: "View and set the system hostname:",
            terminal_blocks: [
                { command: "hostnamectl", showPrompt: true },
                { command: "sudo hostnamectl set-hostname mynewhost.example.com", showPrompt: true }
            ],
            tips: [
                "This updates `/etc/hostname` and the transient hostname immediately."
            ]
        },
        {
            type: 'interactive',
            id: 'hosts_file',
            heading: 'The /etc/hosts File',
            content: "Before DNS, the hosts file maps hostnames to IPs locally:",
            terminal_blocks: [
                { 
                    command: "127.0.0.1   localhost\n192.168.1.10   dbserver", 
                    showPrompt: false 
                }
            ],
            tips: [
                "It's still used for small networks, testing, or overriding DNS.",
                "Edit with `sudo vim /etc/hosts`. Changes take effect immediately."
            ]
        },
        {
            type: 'interactive',
            id: 'ping_test',
            heading: 'Testing Connectivity – ping',
            content: "The simplest network test:",
            terminal_blocks: [
                { command: "ping 8.8.8.8\nping google.com", showPrompt: true }
            ],
            tips: [
                "Press `Ctrl+C` to stop. It sends ICMP echo requests and measures round-trip time."
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Use `ping -c 4` to send exactly 4 packets and stop automatically — great for scripts." }
            ]
        },
        {
            type: 'interactive',
            id: 'dns_lookup',
            heading: 'DNS Lookup – dig and host',
            content: "The DNS debugger:",
            terminal_blocks: [
                { command: "dig google.com\ndig -x 8.8.8.8", showPrompt: true, output: "// -x is for reverse lookup" }
            ],
            terminal_blocks_after: [
                { command: "host google.com", showPrompt: true, output: "// Simpler alternative" },
                { command: "cat /etc/resolv.conf", showPrompt: true, output: "// Check active DNS servers" }
            ]
        },
        {
            type: 'interactive',
            id: 'traceroute',
            heading: 'Troubleshooting with traceroute',
            content: "Trace the path packets take to a destination:",
            terminal_blocks: [
                { command: "traceroute google.com", showPrompt: true }
            ],
            tips: [
                "(Install with `sudo dnf install traceroute` if missing.)"
            ]
        },
        {
            type: 'text',
            id: 'firewall_awareness',
            heading: 'Firewall Zone Awareness',
            content: "Remember: even if your network config is perfect, the firewall can block you. Use `firewall-cmd --list-all` to check the active zone. (We'll dive deep into the firewall later.)"
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting to set ipv4.method to manual** — reverts to DHCP on reboot.",
                "**Incorrect netmask** — e.g., using /24 when you meant /16.",
                "**Editing /etc/resolv.conf directly** — it gets overwritten by NetworkManager. Use nmcli or nmtui.",
                "**Ping fails but network is fine** — ICMP might be blocked by firewall."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Your system is now a networked citizen. Next we'll move to file packaging and transfer — tar, scp, rsync.",
            list: [
                "`ip addr` / `nmcli` — network overview.",
                "`nmcli connection modify` — set static IP, DNS, gateway.",
                "`hostnamectl` — manage hostname.",
                "`/etc/hosts` — local name resolution.",
                "`ping`, `dig`, `traceroute` — troubleshoot."
            ]
        }
    ]
};
