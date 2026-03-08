export interface Module {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const MODULES: Module[] = [
    {
        id: 1,
        title: "Foundations",
        description: "Master the shell basics, navigation, and terminal fundamentals.",
        icon: "⌨️",
        color: "bg-brutal-green",
    },
    {
        id: 2,
        title: "File Mastery",
        description: "Learn to create, modify, copy, and manage files like a pro.",
        icon: "📂",
        color: "bg-brutal-yellow",
    },
    {
        id: 3,
        title: "Power Tools",
        description: "Harness the power of grep, pipes, and data streams.",
        icon: "🔍",
        color: "bg-brutal-blue",
    },
    {
        id: 4,
        title: "Security & Perms",
        description: "Deep dive into Linux octal permissions and ownership.",
        icon: "🔐",
        color: "bg-brutal-red",
    },
    {
        id: 5,
        title: "Environment",
        description: "Configure your shell, environment variables, and HPC settings.",
        icon: "⚙️",
        color: "bg-brutal-gray",
    },
    {
        id: 6,
        title: "Identity Management",
        description: "Managing users, groups, and system identity.",
        icon: "👥",
        color: "bg-brutal-orange",
    },
    {
        id: 7,
        title: "Process Control",
        description: "Monitor and control running system processes.",
        icon: "⚡",
        color: "bg-brutal-purple",
    },
    {
        id: 8,
        title: "Storage & Disk",
        description: "Disk usage analysis, archiving, and compression.",
        icon: "💾",
        color: "bg-brutal-pink",
    },
    {
        id: 9,
        title: "Networking",
        description: "Linux networking fundamentals and connectivity tools.",
        icon: "🌐",
        color: "bg-brutal-blue",
    },
    {
        id: 10,
        title: "SysAdmin Basics",
        description: "Services, daemons, and package management.",
        icon: "🛠️",
        color: "bg-brutal-yellow",
    },
];
