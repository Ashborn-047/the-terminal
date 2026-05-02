import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch11Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c11_e01',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'Which command lists all firewall rules in the default zone?',
        options: ["firewall-cmd --list-all", "firewall-cmd --list", "iptables -L", "firewall-list"],
        correctAnswer: "firewall-cmd --list-all",
        explanation: "firewall-cmd --list-all shows the zone configuration.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e02',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you permanently open HTTP (port 80) using firewalld?',
        options: [
            "firewall-cmd --add-service=http --permanent && firewall-cmd --reload",
            "firewall-cmd --add-port=80 --permanent",
            "systemctl enable httpd",
            "iptables -A INPUT -p tcp --dport 80 -j ACCEPT"
        ],
        correctAnswer: "firewall-cmd --add-service=http --permanent && firewall-cmd --reload",
        explanation: "Services are pre‑defined; --permanent makes it survive reboots.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e03',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What does 'firewall-cmd --reload' do?",
        options: [
            "Applies permanent configuration to the runtime without dropping existing connections",
            "Restarts the firewall",
            "Deletes all rules",
            "Reboots the system"
        ],
        correctAnswer: "Applies permanent configuration to the runtime without dropping existing connections",
        explanation: "Reload preserves current state while applying permanent changes.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e04',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you see which zones are active?',
        options: ["firewall-cmd --get-active-zones", "firewall-cmd --list-zones", "firewall-cmd --zone active", "ls /etc/firewalld/zones"],
        correctAnswer: "firewall-cmd --get-active-zones",
        explanation: "--get-active-zones shows active zones and interfaces.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e05',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you open a specific port, say 8080/tcp?',
        options: [
            "firewall-cmd --add-port=8080/tcp --permanent",
            "firewall-cmd --add-service=8080",
            "iptables -A INPUT -p tcp --dport 8080 -j ACCEPT",
            "All of the above"
        ],
        correctAnswer: "firewall-cmd --add-port=8080/tcp --permanent",
        explanation: "--add-port specifies a port and protocol.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e06',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'What is the default zone in firewalld?',
        options: ["public", "trusted", "home", "internal"],
        correctAnswer: "public",
        explanation: "public is the default zone unless changed.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e07',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you remove a service from the current zone?',
        options: [
            "firewall-cmd --remove-service=ssh --permanent",
            "firewall-cmd --delete-service=ssh",
            "iptables -D INPUT ...",
            "systemctl stop firewalld"
        ],
        correctAnswer: "firewall-cmd --remove-service=ssh --permanent",
        explanation: "--remove-service deletes a service rule.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e08',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'Which command lists all supported services by name?',
        options: [
            "firewall-cmd --get-services",
            "cat /etc/services",
            "firewall-cmd --list-services",
            "ls /usr/lib/firewalld/services/"
        ],
        correctAnswer: "firewall-cmd --get-services",
        explanation: "--get-services prints the list of known services.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e09',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is a 'rich rule' in firewalld?",
        options: [
            "A detailed rule with source/destination, logging, and specific actions",
            "A rule for rich users",
            "A complex service definition",
            "A direct iptables rule"
        ],
        correctAnswer: "A detailed rule with source/destination, logging, and specific actions",
        explanation: "Rich rules provide granular control.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e10',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you enable masquerading (NAT) on a zone?',
        options: [
            "firewall-cmd --add-masquerade --permanent",
            "firewall-cmd --enable-masq",
            "iptables -t nat -A POSTROUTING -j MASQUERADE",
            "masq on"
        ],
        correctAnswer: "firewall-cmd --add-masquerade --permanent",
        explanation: "--add-masquerade enables IP masquerading.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e11',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the difference between '--permanent' and runtime changes?",
        options: [
            "Permanent changes are saved to config files; runtime changes are lost after reload/reboot",
            "No difference",
            "Runtime changes are permanent",
            "Permanent changes don't apply until reload"
        ],
        correctAnswer: "Permanent changes are saved to config files; runtime changes are lost after reload/reboot",
        explanation: "Runtime is immediate but ephemeral; permanent persists.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e12',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you assign an interface to a specific zone?',
        options: [
            "firewall-cmd --zone=home --change-interface=eth1 --permanent",
            "ifconfig eth1 zone home",
            "nmcli device zone home",
            "Edit /etc/zone"
        ],
        correctAnswer: "firewall-cmd --zone=home --change-interface=eth1 --permanent",
        explanation: "--change-interface binds an interface to a zone.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e13',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'Which command lists rich rules in the current zone?',
        options: [
            "firewall-cmd --list-rich-rules",
            "firewall-cmd --get-rich-rules",
            "iptables -L -n",
            "firewall-cmd --show-rules"
        ],
        correctAnswer: "firewall-cmd --list-rich-rules",
        explanation: "--list-rich-rules displays them.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e14',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you create a new custom zone?',
        options: [
            "firewall-cmd --new-zone=myzone --permanent",
            "mkdir /etc/firewalld/zones/myzone",
            "firewall-cmd --add-zone=myzone",
            "zone create myzone"
        ],
        correctAnswer: "firewall-cmd --new-zone=myzone --permanent",
        explanation: "--new-zone creates a new permanent zone.",
        difficulty: 'easy'
    },
    {
        id: 't2c11_e15',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What does 'firewall-cmd --state' show?",
        options: ["Running / not running", "Firewall rules", "Zone info", "Default zone"],
        correctAnswer: "Running / not running",
        explanation: "It prints 'running' or 'not running'.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c11_m01',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you make a runtime rule permanent without losing current state?',
        options: [
            "firewall-cmd --runtime-to-permanent",
            "Copy the rule manually",
            "systemctl restart firewalld",
            "Not possible"
        ],
        correctAnswer: "firewall-cmd --runtime-to-permanent",
        explanation: "--runtime-to-permanent saves active runtime rules.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m02',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the difference between 'reject' and 'drop' in rich rules?",
        options: [
            "Reject sends an ICMP error, drop silently discards",
            "Drop sends a reject message",
            "Both are the same",
            "Reject is slower"
        ],
        correctAnswer: "Reject sends an ICMP error, drop silently discards",
        explanation: "Reject informs the sender; drop does not.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m03',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you allow HTTP from only a specific source IP?',
        options: [
            "firewall-cmd --add-rich-rule='rule family=\"ipv4\" source address=\"1.2.3.4\" service name=\"http\" accept'",
            "firewall-cmd --add-source=1.2.3.4 --add-service=http",
            "Both A and B",
            "Not possible"
        ],
        correctAnswer: "Both A and B",
        explanation: "Both rich rules and source‑based rules work.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m04',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What does the 'drop' zone do?",
        options: [
            "All incoming packets are dropped without any reply; only outgoing connections allowed",
            "Allows everything",
            "Blocks outgoing",
            "Same as trusted"
        ],
        correctAnswer: "All incoming packets are dropped without any reply; only outgoing connections allowed",
        explanation: "The drop zone has the strictest default.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m05',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you log dropped packets in firewalld?',
        options: [
            "Add a rich rule with 'log' and 'drop' actions",
            "firewalld logs all drops by default",
            "Use --log-denied",
            "Set LogDenied=all in firewalld.conf"
        ],
        correctAnswer: "Add a rich rule with 'log' and 'drop' actions",
        explanation: "Explicit rich rules can log and drop/reject.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m06',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is a 'direct rule' in firewalld?",
        options: [
            "A raw iptables rule inserted at a specific chain position",
            "A shortcut for rich rules",
            "A rule that bypasses the zone system",
            "A rule for direct connections"
        ],
        correctAnswer: "A raw iptables rule inserted at a specific chain position",
        explanation: "Direct rules are advanced and not zone‑based.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m07',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you list all available zone definitions?',
        options: [
            "firewall-cmd --list-all-zones",
            "firewall-cmd --get-zones",
            "ls /etc/firewalld/zones/",
            "Both B and C"
        ],
        correctAnswer: "Both B and C",
        explanation: "--get-zones lists names; files in /etc/firewalld/zones/ contain config.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m08',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'What happens if you reload firewalld while a connection is active?',
        options: [
            "Established connections are generally not interrupted",
            "All connections drop",
            "Only new connections are allowed",
            "The system reboots"
        ],
        correctAnswer: "Established connections are generally not interrupted",
        explanation: "Reload uses connection tracking to preserve state.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m09',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you add a forward port rule for port 2222 to internal 22?',
        options: [
            "firewall-cmd --add-forward-port=port=2222:proto=tcp:toport=22 --permanent",
            "firewall-cmd --add-forward-port=2222:22",
            "iptables -t nat -A PREROUTING -p tcp --dport 2222 -j DNAT --to-destination :22",
            "Both A and C"
        ],
        correctAnswer: "Both A and C",
        explanation: "Both firewalld and iptables can do port forwarding.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m10',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the purpose of 'firewall-offline-cmd'?",
        options: [
            "Configures firewalld while it's not running (e.g., during system installation or rescue mode)",
            "Disables firewalld",
            "Runs firewall offline",
            "Checks firewall logs"
        ],
        correctAnswer: "Configures firewalld while it's not running (e.g., during system installation or rescue mode)",
        explanation: "Useful for pre‑configuration.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m11',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you set the default zone permanently?',
        options: [
            "firewall-cmd --set-default-zone=home --permanent",
            "Edit /etc/firewalld/firewalld.conf",
            "systemctl set-default home",
            "Both A and B"
        ],
        correctAnswer: "Both A and B",
        explanation: "Both methods set the default zone.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m12',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What does 'firewall-cmd --zone=public --query-service=ssh' do?",
        options: [
            "Returns yes/no whether the service is allowed in public zone",
            "Adds the service",
            "Removes the service",
            "Starts the service"
        ],
        correctAnswer: "Returns yes/no whether the service is allowed in public zone",
        explanation: "--query-service checks if the service is active.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m13',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you ensure a port is only open during business hours?',
        options: [
            "Use a rich rule with a time constraint (not directly supported in standard firewalld, but can use cron to add/remove)",
            "Not possible",
            "Use --time parameter",
            "Schedule firewalld reload"
        ],
        correctAnswer: "Use a rich rule with a time constraint (not directly supported in standard firewalld, but can use cron to add/remove)",
        explanation: "firewalld itself doesn't have time‑based rules; external scripting is needed.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m14',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you check if a specific port is currently allowed?',
        options: [
            "firewall-cmd --query-port=80/tcp",
            "firewall-cmd --list-ports",
            "netstat -an | grep 80",
            "Both A and B"
        ],
        correctAnswer: "Both A and B",
        explanation: "Multiple ways to verify.",
        difficulty: 'medium'
    },
    {
        id: 't2c11_m15',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What does 'firewall-cmd --panic-on' do?",
        options: [
            "Drops all incoming and outgoing packets immediately (emergency mode)",
            "Reboots the system",
            "Enables logging",
            "Shuts down network"
        ],
        correctAnswer: "Drops all incoming and outgoing packets immediately (emergency mode)",
        explanation: "Panic mode is a last‑resort measure.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c11_h01',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How does firewalld implement its rules under the hood?',
        options: [
            "Using the nftables framework (or iptables in older versions)",
            "Directly in the kernel",
            "Via systemd",
            "Through ebtables"
        ],
        correctAnswer: "Using the nftables framework (or iptables in older versions)",
        explanation: "Modern firewalld uses nftables.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h02',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the difference between 'firewalld' and 'iptables'?",
        options: [
            "firewalld is a dynamic management daemon; iptables is the low-level tool",
            "No difference",
            "iptables replaces firewalld",
            "firewalld only works on IPv6"
        ],
        correctAnswer: "firewalld is a dynamic management daemon; iptables is the low-level tool",
        explanation: "firewalld uses iptables/nftables as backend.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h03',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you allow traffic from a specific MAC address?',
        options: [
            "Use a direct rule or rich rule with mac source (firewalld 0.6+ supports MAC in rich rules)",
            "Not possible",
            "Only via iptables",
            "Use --add-source-mac"
        ],
        correctAnswer: "Use a direct rule or rich rule with mac source (firewalld 0.6+ supports MAC in rich rules)",
        explanation: "Rich rules support MAC address filtering.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h04',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the 'ingress' zone in firewalld 1.0+?",
        options: [
            "A new feature for filtering incoming traffic before routing decisions",
            "The default zone",
            "A GUI zone",
            "A deprecated zone"
        ],
        correctAnswer: "A new feature for filtering incoming traffic before routing decisions",
        explanation: "Ingress zone applies to packets on wire before routing.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h05',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you import a zone definition from an XML file?',
        options: [
            "Place the .xml file in /etc/firewalld/zones/ and reload",
            "firewall-cmd --import-zone",
            "Not supported",
            "Use iptables-restore"
        ],
        correctAnswer: "Place the .xml file in /etc/firewalld/zones/ and reload",
        explanation: "Zone files are XML and can be dropped in or created manually.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h06',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the effect of 'firewall-cmd --complete-reload'?",
        options: [
            "Restarts firewalld completely, potentially breaking connections",
            "Same as reload",
            "Deletes all zones",
            "Applies only permanent rules"
        ],
        correctAnswer: "Restarts firewalld completely, potentially breaking connections",
        explanation: "Complete reload resets the state.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h07',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you set a custom rule for rate limiting SSH connections?',
        options: [
            "Use a rich rule with 'limit' parameter",
            "Not possible",
            "Only via fail2ban",
            "Use --limit-connection"
        ],
        correctAnswer: "Use a rich rule with 'limit' parameter",
        explanation: "Rich rules support rate limiting directly.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h08',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the purpose of 'firewalld.richlanguage'?",
        options: [
            "Defines the syntax for rich rules",
            "A GUI tool",
            "A log format",
            "A configuration file"
        ],
        correctAnswer: "Defines the syntax for rich rules",
        explanation: "It's the man page section for rich rule syntax.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h09',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you analyze which zone a specific packet would match?',
        options: [
            "Use 'firewall-cmd --query-packet' (not standard; use testing with logs)",
            "firewall-cmd --simulate",
            "tcpdump",
            "Not possible"
        ],
        correctAnswer: "Use 'firewall-cmd --query-packet' (not standard; use testing with logs)",
        explanation: "No built‑in simulator; must test by applying and checking logs.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h10',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is 'ipset' support in firewalld?",
        options: [
            "Allows referencing an ipset list inside a rich rule",
            "A set of IP addresses",
            "A replacement for zones",
            "Not related"
        ],
        correctAnswer: "Allows referencing an ipset list inside a rich rule",
        explanation: "Rich rules can use 'source ipset=...'.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h11',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you restrict the number of parallel connections from an IP?',
        options: [
            "A rich rule with connection‑limit",
            "Not directly in firewalld; use connlimit in iptables",
            "firewall-cmd --connlimit",
            "Only with Fail2Ban"
        ],
        correctAnswer: "A rich rule with connection‑limit",
        explanation: "Rich rules support connection‑limit.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h12',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What does 'firewall-cmd --lockdown-on' do?",
        options: [
            "Prevents local applications from modifying the firewall (lockdown mode)",
            "Blocks all traffic",
            "Locks the system",
            "Disables remote access"
        ],
        correctAnswer: "Prevents local applications from modifying the firewall (lockdown mode)",
        explanation: "Lockdown restricts D‑Bus access to firewalld.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h13',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How do you add a service definition that uses multiple ports?',
        options: [
            "Create an XML file in /etc/firewalld/services/ with multiple port entries",
            "Use --add-service multiple times",
            "Not possible",
            "Only through rich rules"
        ],
        correctAnswer: "Create an XML file in /etc/firewalld/services/ with multiple port entries",
        explanation: "Custom service definitions can include multiple ports and protocols.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h14',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: "What is the benefit of using firewalld's 'direct' rules?",
        options: [
            "Allows using raw iptables/nftables syntax when firewalld's abstractions are not enough",
            "Faster processing",
            "Simpler syntax",
            "Better logging"
        ],
        correctAnswer: "Allows using raw iptables/nftables syntax when firewalld's abstractions are not enough",
        explanation: "Direct rules escape the zone model.",
        difficulty: 'hard'
    },
    {
        id: 't2c11_h15',
        chapterId: 'track2-ch11',
        type: 'mcq',
        question: 'How can you verify that a rich rule is syntactically correct?',
        options: [
            "Add it with --permanent and check for errors; or use firewall-cmd --check-config",
            "firewalld --validate",
            "No validation exists",
            "Use iptables -C"
        ],
        correctAnswer: "Add it with --permanent and check for errors; or use firewall-cmd --check-config",
        explanation: "firewall-cmd reports syntax errors on addition.",
        difficulty: 'hard'
    }
];
