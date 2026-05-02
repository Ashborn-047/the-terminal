import { ChapterContent } from '../../../../types/chapters';

export const t2ch12Content: ChapterContent = {
    chapterId: 'track2-ch12',
    title: 'Running Containers (Podman)',
    description: "Enter the world of cloud-native administration. Master Podman for running, building, and managing daemonless, rootless containers integrated with systemd.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Containers package applications with their dependencies, making them portable and consistent across environments. `podman` brings this power to the Linux terminal without a big daemon. It runs rootless by default, integrates with systemd, and even plays well with Kubernetes. Mastering Podman is your entry into modern cloud‑native administration."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to run, list, stop, and remove containers with Podman.",
                "How to build images using `Containerfile` (Dockerfile).",
                "How to run containers rootless for enhanced security.",
                "How to manage storage, networking, and volumes.",
                "How to let systemd manage your containers as services."
            ]
        },
        {
            type: 'text',
            id: 'podman_vs_docker',
            heading: 'Podman vs Docker',
            content: "Podman is daemonless — there's no background engine like dockerd. It is also rootless by default, meaning containers don't run as the root user on the host, greatly reducing the attack surface. Its command‑line interface is almost identical to Docker, so you'll feel right at home."
        },
        {
            type: 'interactive',
            id: 'basic_ops',
            heading: 'Basic Container Operations',
            content: "Manage the lifecycle of your containers:",
            terminal_blocks: [
                { command: "podman run -d --name web -p 8080:80 nginx", showPrompt: true },
                { command: "podman ps", showPrompt: true },
                { command: "podman stop web", showPrompt: true },
                { command: "podman rm web", showPrompt: true },
                { command: "podman logs web", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run the official 'hello-world' container with podman. Check its output." }
            ]
        },
        {
            type: 'interactive',
            id: 'images_build',
            heading: 'Images and Containerfile',
            content: "Build custom images using a `Containerfile`:",
            terminal_blocks: [
                { command: "podman search httpd", showPrompt: true },
                { command: "podman pull docker.io/library/httpd", showPrompt: true },
                { command: "# Example Containerfile\nFROM nginx:latest\nCOPY index.html /usr/share/nginx/html/\nEXPOSE 80", showPrompt: false },
                { command: "podman build -t mynginx .", showPrompt: true }
            ]
        },
        {
            type: 'text',
            id: 'rootless',
            heading: 'Rootless Containers',
            content: "When you run Podman as a normal user, containers run in a user namespace. The container thinks it has root, but on the host it's just your UID. This is one of the strongest security features of Podman. No `sudo` is needed for most operations.",
            tips: [
                "To use privileged ports (below 1024) in rootless mode, you may need to adjust the sysctl parameter `net.ipv4.ip_unprivileged_port_start`."
            ]
        },
        {
            type: 'interactive',
            id: 'storage',
            heading: 'Volumes and Persistent Storage',
            content: "Containers are ephemeral, so use volumes for persistent data:",
            terminal_blocks: [
                { command: "podman volume create mydata", showPrompt: true },
                { command: "podman run -v mydata:/data alpine", showPrompt: true },
                { command: "podman run -v /home/user/data:/data:Z alpine", showPrompt: true }
            ],
            tips: [
                "The `:Z` suffix automatically re-labels the content for SELinux, preventing 'Permission denied' errors on host bind-mounts."
            ]
        },
        {
            type: 'interactive',
            id: 'networking',
            heading: 'Podman Networking',
            content: "Isolate container communication with custom networks:",
            terminal_blocks: [
                { command: "podman network create mynet", showPrompt: true },
                { command: "podman run -d --name=app --net=mynet myapp", showPrompt: true }
            ]
        },
        {
            type: 'interactive',
            id: 'systemd',
            heading: 'Systemd Integration',
            content: "Manage containers as native system services:",
            terminal_blocks: [
                { command: "podman generate systemd --name web --files", showPrompt: true },
                { command: "mkdir -p ~/.config/systemd/user/", showPrompt: true },
                { command: "mv container-web.service ~/.config/systemd/user/", showPrompt: true },
                { command: "systemctl --user enable --now container-web.service", showPrompt: true }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Run a simple container, generate a systemd unit, and enable it. Reboot and check if it's still running." }
            ],
            tips: [
                "Run `loginctl enable-linger` to allow rootless systemd services to keep running after you log out."
            ]
        },
        {
            type: 'interactive',
            id: 'kube',
            heading: 'Podman and Kubernetes (Pod)',
            content: "Smooth the path to cloud-native deployments:",
            terminal_blocks: [
                { command: "podman generate kube mypod > mypod.yaml", showPrompt: true }
            ],
            tips: [
                "Podman pods group containers together with shared network and storage resources, mirroring the Kubernetes architecture."
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Socket Confusion** – Trying to use the `docker` command in rootless mode without setting up the podman socket.",
                "**SELinux Denial** – Forgetting the `:Z` or `:z` labels when bind-mounting directories from the host.",
                "**Orphaned Containers** – Forgetting to use `--rm` for one-off tasks, leading to a build-up of stopped containers.",
                "**Linger Status** – Not enabling 'linger' for the user, causing rootless systemd containers to stop as soon as the SSH session ends."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "Congratulations — you've completed the advanced track. You're now ready to handle real‑world enterprise environments.",
            list: [
                "Lifecycle: Master `run`, `stop`, `rm`, and `ps` for container management.",
                "Security: Utilize rootless containers and user namespaces.",
                "Persistence: Manage data with volumes and bind-mounts.",
                "Automation: Integrate containers into systemd services for production stability."
            ]
        }
    ]
};
