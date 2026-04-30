import { ChapterAssessment } from '../../../features/lab-engine/providers/QuestionProvider';

export const ch11Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch11_e01',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'Which command shows IP addresses of all interfaces?',
        options: ['ip addr', 'ifconfig', 'ipconfig', 'netstat'],
        correctAnswer: 'ip addr',
        explanation: 'ip addr (or ip a) displays interface IP addresses.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e02',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli device status' display?",
        options: ['Network interfaces and their state', 'Wi-Fi passwords', 'DNS servers', 'Routing table'],
        correctAnswer: 'Network interfaces and their state',
        explanation: 'It shows devices, type, and state.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e03',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you ping a host 4 times?',
        options: ['ping -c 4 host', 'ping -4 host', 'ping --count 4 host', 'ping 4 host'],
        correctAnswer: 'ping -c 4 host',
        explanation: '-c limits the number of packets.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e04',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'Which command sets the static hostname?',
        options: ['hostnamectl set-hostname newname', 'hostname newname', 'nmcli hostname newname', 'set-hostname newname'],
        correctAnswer: 'hostnamectl set-hostname newname',
        explanation: 'hostnamectl manages the system hostname persistently.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e05',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'What file maps hostnames to IP addresses locally?',
        options: ['/etc/hosts', '/etc/resolv.conf', '/etc/hostname', '/etc/network/interfaces'],
        correctAnswer: '/etc/hosts',
        explanation: '/etc/hosts provides static hostname resolution.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e06',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What is the purpose of 'dig'?",
        options: ['DNS lookup utility', 'Network discovery', 'Packet capture', 'Interface configuration'],
        correctAnswer: 'DNS lookup utility',
        explanation: 'dig queries DNS servers.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e07',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'Which file lists DNS resolvers used by the system?',
        options: ['/etc/resolv.conf', '/etc/hosts', '/etc/dns.conf', '/etc/network.conf'],
        correctAnswer: '/etc/resolv.conf',
        explanation: 'resolv.conf contains nameserver entries.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e08',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli connection show' list?",
        options: ['Saved network connection profiles', 'Active connections only', 'Wi-Fi networks', 'Firewall rules'],
        correctAnswer: 'Saved network connection profiles',
        explanation: 'It displays all known connections.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e09',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "How do you activate a connection named 'ens33'?",
        options: ['nmcli connection up ens33', 'ifup ens33', 'ip link set ens33 up', 'netstart ens33'],
        correctAnswer: 'nmcli connection up ens33',
        explanation: 'nmcli connection up activates the profile.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e10',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'traceroute' do?",
        options: [
            'Shows the path packets take to a destination',
            'Traces network speed',
            'Routes traffic',
            'Configures routing'
        ],
        correctAnswer: 'Shows the path packets take to a destination',
        explanation: 'traceroute displays each hop.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e11',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'What is the default method for IP configuration if not set to manual?',
        options: ['DHCP', 'Static', 'None', 'Link-local'],
        correctAnswer: 'DHCP',
        explanation: 'auto (DHCP) is usually the default.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e12',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'Which command sets the DNS server on a connection?',
        options: [
            'nmcli connection modify ens33 ipv4.dns "8.8.8.8"',
            'echo 8.8.8.8 > /etc/resolv.conf',
            'setdns 8.8.8.8',
            'dns-set 8.8.8.8'
        ],
        correctAnswer: 'nmcli connection modify ens33 ipv4.dns "8.8.8.8"',
        explanation: 'nmcli provides persistent DNS configuration.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e13',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you check the current hostname?',
        options: ['hostname', 'hostnamectl', 'uname -n', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All three commands show the hostname.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e14',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'Which protocol does ping use?',
        options: ['ICMP', 'TCP', 'UDP', 'HTTP'],
        correctAnswer: 'ICMP',
        explanation: 'ping sends ICMP echo requests.',
        difficulty: 'easy'
    },
    {
        id: 'ch11_e15',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli connection mod' abbreviation mean?",
        options: ['modify', 'module', 'model', 'modem'],
        correctAnswer: 'modify',
        explanation: 'mod is short for modify.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch11_m01',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'ip link set eth0 up' do?",
        options: [
            'Enables the eth0 interface',
            'Disables eth0',
            'Changes IP address',
            'Restarts networking'
        ],
        correctAnswer: 'Enables the eth0 interface',
        explanation: 'ip link up/down controls interface administrative state.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m02',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you add a secondary IP to an interface with nmcli?',
        options: [
            'nmcli connection modify ens33 +ipv4.addresses 10.0.0.5/24',
            'ip addr add 10.0.0.5/24 dev ens33',
            'Edit /etc/sysconfig/network-scripts/ifcfg-ens33',
            'Both A and B (though A is persistent, B is transient)'
        ],
        correctAnswer: 'Both A and B (though A is persistent, B is transient)',
        explanation: 'nmcli makes it permanent, ip addr adds it temporarily.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m03',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'What is the difference between /etc/hosts and /etc/resolv.conf?',
        options: [
            '/etc/hosts is static name resolution; resolv.conf defines DNS servers',
            'No difference',
            'resolv.conf is static; hosts is dynamic',
            'One is for IPv4, one for IPv6'
        ],
        correctAnswer: '/etc/hosts is static name resolution; resolv.conf defines DNS servers',
        explanation: 'hosts maps names to IPs locally; resolv.conf points to DNS.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m04',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you make NetworkManager re-read connection files?',
        options: [
            'nmcli connection reload',
            'systemctl restart NetworkManager',
            'nmcli device reapply',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'Reloading or restarting NM picks up new config.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m05',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'dig +short google.com' do?",
        options: [
            'Outputs only the IP address',
            'Shows short explanation',
            'Time-limited query',
            'Shortens timeout'
        ],
        correctAnswer: 'Outputs only the IP address',
        explanation: '+short gives concise output.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m06',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli device disconnect ens33' do?",
        options: [
            'Brings the interface down and deactivates the connection',
            'Deletes the connection',
            'Restarts the interface',
            'Only disables Wi-Fi'
        ],
        correctAnswer: 'Brings the interface down and deactivates the connection',
        explanation: 'disconnect tears down the connection.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m07',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How can you check the routing table?',
        options: ['ip route', 'route -n', 'netstat -r', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All show the routing table.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m08',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What is the purpose of the 'ipv4.gateway' property in nmcli?",
        options: [
            'Sets the default gateway',
            'Sets DNS',
            'Sets IP address',
            'Sets the hostname'
        ],
        correctAnswer: 'Sets the default gateway',
        explanation: 'gateway defines the next hop for outbound traffic.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m09',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you add a static entry to /etc/hosts?',
        options: [
            'Add \'IP_address hostname\' on a new line',
            'Use \'addhost hostname IP\'',
            'Edit /etc/hostname',
            'Use nmcli'
        ],
        correctAnswer: 'Add \'IP_address hostname\' on a new line',
        explanation: 'Format: IP hostname [alias...]',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m10',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'hostnamectl --static' show?",
        options: [
            'The static hostname (persistent)',
            'The transient hostname',
            'The pretty hostname',
            'The IP address'
        ],
        correctAnswer: 'The static hostname (persistent)',
        explanation: '--static gives the /etc/hostname value.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m11',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'Why would you change the default gateway?',
        options: [
            'To route traffic through a different network',
            'To change the IP address',
            'To disable DNS',
            'To change the hostname'
        ],
        correctAnswer: 'To route traffic through a different network',
        explanation: 'The gateway is where non-local traffic is sent.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m12',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you view the current DNS settings applied by NetworkManager?',
        options: [
            'nmcli device show | grep DNS',
            'cat /etc/resolv.conf',
            'nmcli connection show active-profile | grep DNS',
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'Multiple ways to see DNS.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m13',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'ping -c 0' do?",
        options: [
            'No packets sent; sometimes used to test name resolution without pinging',
            'Pings forever',
            'Sends 0 packets then exits',
            'Error'
        ],
        correctAnswer: 'No packets sent; sometimes used to test name resolution without pinging',
        explanation: 'Some implementations use it to trigger DNS resolution.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m14',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you set a specific interface to use DHCP using nmcli?',
        options: [
            'nmcli connection modify eth0 ipv4.method auto',
            'nmcli device dhcp eth0',
            'dhclient eth0',
            'nmcli con up eth0'
        ],
        correctAnswer: 'nmcli connection modify eth0 ipv4.method auto',
        explanation: 'Setting method to auto enables DHCP.',
        difficulty: 'medium'
    },
    {
        id: 'ch11_m15',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What is a 'connection profile' in NetworkManager?",
        options: [
            'A saved set of network settings that can be applied to an interface',
            'A Wi-Fi password',
            'A firewall rule',
            'A VPN configuration'
        ],
        correctAnswer: 'A saved set of network settings that can be applied to an interface',
        explanation: 'Profiles contain IP, DNS, gateway, etc.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch11_h01',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What is the difference between 'nmcli connection reload' and 'nmcli connection up'?",
        options: [
            'reload re-reads config files; up activates a specific connection',
            'No difference',
            'up reloads all connections',
            'reload brings all interfaces up'
        ],
        correctAnswer: 'reload re-reads config files; up activates a specific connection',
        explanation: 'reload is for configuration changes; up applies a connection.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h02',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How can you override DNS settings for a specific connection without affecting global settings?',
        options: [
            'Use \'nmcli connection modify <con> ipv4.dns <IP> ipv4.ignore-auto-dns yes\'',
            'Edit /etc/resolv.conf',
            'Set /etc/hosts',
            'Not possible'
        ],
        correctAnswer: 'Use \'nmcli connection modify <con> ipv4.dns <IP> ipv4.ignore-auto-dns yes\'',
        explanation: 'ignore-auto-dns prevents DHCP from overriding custom DNS.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h03',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does the 'ipv4.addresses 192.168.1.100/24' option in nmcli set?",
        options: [
            'Static IP address and subnet mask',
            'DHCP range',
            'DNS server',
            'Gateway'
        ],
        correctAnswer: 'Static IP address and subnet mask',
        explanation: 'It assigns a static IP with CIDR notation.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h04',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How would you add a static route using nmcli?',
        options: [
            'nmcli connection modify <con> +ipv4.routes "10.0.0.0/24 192.168.1.254"',
            'route add -net 10.0.0.0/24 gw 192.168.1.254',
            'ip route add 10.0.0.0/24 via 192.168.1.254',
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'All methods add a route, but nmcli makes it persistent.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h05',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'systemctl restart NetworkManager' do?",
        options: [
            'Restarts the NetworkManager daemon, which may briefly disrupt connectivity',
            'Refreshes DNS',
            'Re-reads /etc/hosts',
            'Enables Wi-Fi'
        ],
        correctAnswer: 'Restarts the NetworkManager daemon, which may briefly disrupt connectivity',
        explanation: 'Restarting NM resets all connections temporarily.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h06',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How can you check which DNS server your system is actually using for resolution?',
        options: [
            'dig +short google.com and observe SERVER section',
            'cat /etc/resolv.conf (if not overridden by systemd-resolved)',
            'nmcli device show <interface> | grep DNS',
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'Multiple ways to verify active DNS.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h07',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What is the purpose of 'ip route add default via 192.168.1.1'?",
        options: [
            'Sets the default gateway',
            'Adds a DNS server',
            'Deletes a route',
            'Enables interface'
        ],
        correctAnswer: 'Sets the default gateway',
        explanation: 'ip route add default ... adds a default gateway.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h08',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli general hostname' do?",
        options: [
            'Displays the current hostname',
            'Sets the hostname',
            'Lists all hostnames',
            'Clears hostname'
        ],
        correctAnswer: 'Displays the current hostname',
        explanation: 'Without arguments, it shows the hostname.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h09',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you configure a connection to start automatically on boot?',
        options: [
            'nmcli connection modify <con> connection.autoconnect yes',
            'systemctl enable network',
            'Add ONBOOT=yes in ifcfg file',
            'Both A and C'
        ],
        correctAnswer: 'Both A and C',
        explanation: 'Autoconnect is the key; older systems use ONBOOT.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h10',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What is the function of 'arping'?",
        options: [
            'Sends ARP requests to discover MAC addresses on the local network',
            'Pings a website',
            'Traces routes',
            'Scans ports'
        ],
        correctAnswer: 'Sends ARP requests to discover MAC addresses on the local network',
        explanation: 'arping works at the link layer.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h11',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli device wifi list' show?",
        options: [
            'Available Wi-Fi networks',
            'Connected devices',
            'Wi-Fi passwords',
            'Signal strength only'
        ],
        correctAnswer: 'Available Wi-Fi networks',
        explanation: 'Lists SSIDs and security parameters.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h12',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How can you force a connection to renegotiate DHCP?',
        options: [
            'nmcli connection down <con> && nmcli connection up <con>',
            'dhclient -r && dhclient',
            'nmcli device reapply',
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'Down/up cycles, reapply triggers renewal.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h13',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'nmcli -t' do?",
        options: [
            'Terse output suitable for scripting',
            'Test mode',
            'Terminal type',
            'Timeout'
        ],
        correctAnswer: 'Terse output suitable for scripting',
        explanation: '-t suppresses headers and formats output for parsing.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h14',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: 'How do you set a default DNS domain search list with nmcli?',
        options: [
            'nmcli connection modify <con> ipv4.dns-search "example.com"',
            'Edit /etc/resolv.conf domain',
            'Set DNSDOMAIN environment',
            'Use /etc/hosts'
        ],
        correctAnswer: 'nmcli connection modify <con> ipv4.dns-search "example.com"',
        explanation: 'dns-search adds domain suffixes for DNS lookups.',
        difficulty: 'hard'
    },
    {
        id: 'ch11_h15',
        chapterId: 'track1-ch11',
        type: 'mcq',
        question: "What does 'ip neigh' show?",
        options: [
            'ARP cache (neighbor table)',
            'Routing table',
            'Interface addresses',
            'DNS cache'
        ],
        correctAnswer: 'ARP cache (neighbor table)',
        explanation: 'ip neigh displays entries that map IPs to MAC addresses.',
        difficulty: 'hard'
    }
];
