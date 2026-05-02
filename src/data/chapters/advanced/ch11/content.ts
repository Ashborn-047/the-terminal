import { ChapterContent } from '../../../../types/chapters';

export const t2ch11Content: ChapterContent = {
    chapterId: 'track2-ch11',
    title: 'Managing Network Security (firewalld)',
    description: "Build a network fortress with firewalld. Master zones, services, rich rules, masquerading, and port forwarding to protect your server.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "A server without a firewall is like a house with no doors. `firewalld` gives you dynamic network security — you can open or close ports, define trusted zones, and craft granular rules without restarting the whole firewall. In this chapter, you'll learn to build a fortress around your services using zones, services, and rich rules."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to check the active zone and list all zones with `firewall-cmd`.",
                "How to open and close ports permanently.",
                "How to assign interfaces to zones and create custom zones.",
                "How to write **rich rules** for fine‑grained control.",
                "How to set up masquerading and port forwarding."
            ]
        },
        {
            type: 'interactive',
            id: 'essentials',
            heading: 'Firewalld Essentials',
            content: "firewalld organizes rules into **zones**. Each zone represents a trust level. The default zone is **public**. Others include trusted, home, internal, dmz, etc.",
            terminal_blocks: [
                { command: "firewall-cmd --get-default-zone", showPrompt: true },
                { command: "firewall-cmd --get-active-zones", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'services_ports',
            heading: 'Managing Services and Ports',
            content: "You can open access by service name or by specific port numbers.",
            terminal_blocks: [
                { command: "sudo firewall-cmd --add-service=http --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --add-port=8080/tcp --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --reload", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Add HTTPS (port 443/tcp) to your firewall and confirm with `firewall-cmd --list-services`." }
            ],
            tips: [
                "Without the `--permanent` flag, rules are only active in the current session and will be lost on the next reload or reboot."
            ]
        },
        {
            type: 'interactive',
            id: 'list_remove',
            heading: 'Listing and Removing Rules',
            content: "Review and clean up your firewall configuration:",
            terminal_blocks: [
                { command: "firewall-cmd --list-all", showPrompt: true },
                { command: "sudo firewall-cmd --remove-service=http --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --reload", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'custom_zones',
            heading: 'Custom Zones',
            content: "Create isolated environments for specific networks:",
            terminal_blocks: [
                { command: "sudo firewall-cmd --new-zone=dmz_custom --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --reload", showPrompt: true },
                { command: "sudo firewall-cmd --zone=dmz_custom --change-interface=eth1 --permanent", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'rich_rules',
            heading: 'Rich Rules – Fine‑Grained Control',
            content: "Rich rules allow for complex conditions like source IP filtering and logging:",
            terminal_blocks: [
                { command: "sudo firewall-cmd --add-rich-rule='rule family=\"ipv4\" source address=\"192.168.1.10\" service name=\"ssh\" accept' --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --add-rich-rule='rule family=\"ipv4\" source address=\"10.0.0.5\" drop' --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --add-rich-rule='rule family=\"ipv4\" source address=\"192.168.1.0/24\" port port=\"80\" protocol=\"tcp\" log prefix=\"HTTP \" level=\"info\" reject' --permanent", showPrompt: true }
            ],
            callouts: [
                { type: 'pro_tip', icon: '🧠', content: "Use `firewall-cmd --list-rich-rules` to inspect all complex rules applied to the current zone." }
            ]
        },
        {
            type: 'interactive',
            id: 'nat_forwarding',
            heading: 'Masquerading and Port Forwarding',
            content: "Enable routing capabilities and expose internal services:",
            terminal_blocks: [
                { command: "sudo firewall-cmd --add-masquerade --permanent", showPrompt: true },
                { command: "sudo firewall-cmd --add-forward-port=port=2222:proto=tcp:toaddr=10.0.0.2:toport=22 --permanent", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'runtime_permanent',
            heading: 'Runtime vs Permanent',
            content: "A crucial concept: changes without `--permanent` apply instantly but disappear after a reload or reboot. Conversely, permanent changes are saved to disk but don't take effect until a reload. You can use `--runtime-to-permanent` to save your successful live tests into the persistent configuration."
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Missing the Reload** – Forgetting to run `firewall-cmd --reload` after making permanent changes; the new rules won't actually be protecting you yet.",
                "**Locking yourself out** – Blocking SSH access while connected remotely. Always test rules with an active secondary connection or a console escape hatch.",
                "**Service vs Port confusion** – Thinking a service name is the same as a port. A service definition (like `http`) can map to multiple ports and protocols."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Your network is now fortified. The final chapter: running containers with Podman.",
            list: [
                "Zones: Group rules by trust level.",
                "Services/Ports: Open standard or custom access points.",
                "Rich Rules: Implement granular filtering based on source IP and logging.",
                "NAT: Configure masquerading and port forwarding for routing tasks."
            ]
        }
    ]
};
