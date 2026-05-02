import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch12Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c12_e01',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you run an nginx container in the background with Podman?',
        options: [
            "podman run -d --name web nginx",
            "podman start nginx",
            "docker run nginx",
            "podman launch nginx"
        ],
        correctAnswer: "podman run -d --name web nginx",
        explanation: "-d detaches the container.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e02',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you list running containers?',
        options: ["podman ps", "podman list", "podman ls", "podman containers"],
        correctAnswer: "podman ps",
        explanation: "ps shows running containers.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e03',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman rm web' do?",
        options: ["Removes the container named web", "Stops web", "Restarts web", "Renames web"],
        correctAnswer: "Removes the container named web",
        explanation: "rm removes a stopped container.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e04',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you stop a running container?',
        options: ["podman stop web", "podman rm web", "podman kill web", "podman delete web"],
        correctAnswer: "podman stop web",
        explanation: "stop gracefully stops the container.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e05',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'What is a Containerfile?',
        options: [
            "A text file with instructions to build a container image (like Dockerfile)",
            "A log file",
            "A container snapshot",
            "A network configuration"
        ],
        correctAnswer: "A text file with instructions to build a container image (like Dockerfile)",
        explanation: "Podman uses Containerfile, but Dockerfile is compatible.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e06',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you build an image from a Containerfile?',
        options: [
            "podman build -t myapp .",
            "podman create myapp",
            "podman run myapp",
            "podman compile"
        ],
        correctAnswer: "podman build -t myapp .",
        explanation: "build creates an image.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e07',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'What is the main security advantage of rootless Podman?',
        options: [
            "Containers run as the user's UID on the host, not root",
            "No firewall needed",
            "Faster networking",
            "Better performance"
        ],
        correctAnswer: "Containers run as the user's UID on the host, not root",
        explanation: "Rootless mode reduces privilege escalation risks.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e08',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "How do you publish a container's port to the host?",
        options: [
            "podman run -p 8080:80 myapp",
            "podman expose 8080",
            "podman port 8080",
            "podman publish 8080"
        ],
        correctAnswer: "podman run -p 8080:80 myapp",
        explanation: "-p maps host port to container port.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e09',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you see logs of a container?',
        options: ["podman logs web", "podman ps -l", "journalctl -u web", "dmesg | grep web"],
        correctAnswer: "podman logs web",
        explanation: "podman logs fetches container output.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e10',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you generate a systemd unit from a running container?',
        options: [
            "podman generate systemd --name web --files",
            "systemctl generate podman",
            "podman unit web",
            "podman export systemd"
        ],
        correctAnswer: "podman generate systemd --name web --files",
        explanation: "generate systemd creates unit files.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e11',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman pull' do?",
        options: [
            "Downloads a container image from a registry",
            "Extracts a container",
            "Starts a container",
            "Deletes an image"
        ],
        correctAnswer: "Downloads a container image from a registry",
        explanation: "pull fetches images.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e12',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you create a persistent volume?',
        options: [
            "podman volume create mydata",
            "mkdir /var/lib/podman/volumes/mydata",
            "podman create --volume",
            "podman storage create"
        ],
        correctAnswer: "podman volume create mydata",
        explanation: "volume create makes a named volume.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e13',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman network create mynet' do?",
        options: [
            "Creates a user-defined network for containers",
            "Creates a physical network",
            "Creates a Wi-Fi network",
            "Links containers"
        ],
        correctAnswer: "Creates a user-defined network for containers",
        explanation: "Networks isolate containers.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e14',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'Which flag deletes a container after it exits?',
        options: ["--rm", "--delete", "--remove", "--auto-remove"],
        correctAnswer: "--rm",
        explanation: "--rm performs automatic cleanup.",
        difficulty: 'easy'
    },
    {
        id: 't2c12_e15',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'What command lists available images?',
        options: ["podman images", "podman ps -a", "podman list-images", "podman rmi"],
        correctAnswer: "podman images",
        explanation: "images shows locally stored images.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c12_m01',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'What is the difference between Podman and Docker?',
        options: [
            "Podman is daemonless and supports rootless by default; Docker relies on a daemon run as root",
            "No difference",
            "Podman can only run rootless",
            "Docker is daemonless"
        ],
        correctAnswer: "Podman is daemonless and supports rootless by default; Docker relies on a daemon run as root",
        explanation: "Podman doesn't require a central daemon.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m02',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'Why might you use the :Z suffix when mounting a host directory?',
        options: [
            "To relabel the directory for SELinux on shared volumes",
            "To compress the volume",
            "To mark it as a zone",
            "To mount in read-only"
        ],
        correctAnswer: "To relabel the directory for SELinux on shared volumes",
        explanation: ":Z tells SELinux to relabel the content for the container.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m03',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you start a container with an interactive shell?',
        options: [
            "podman run -it image /bin/bash",
            "podman exec -it image bash",
            "podman run --shell image",
            "podman interactive image"
        ],
        correctAnswer: "podman run -it image /bin/bash",
        explanation: "-it allocates a pseudo-TTY and keeps stdin open.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m04',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'loginctl enable-linger' do for rootless containers?",
        options: [
            "Allows user systemd processes to keep running after logout",
            "Enables loginctl",
            "Delays logout",
            "Disables timeout"
        ],
        correctAnswer: "Allows user systemd processes to keep running after logout",
        explanation: "linger keeps the user's systemd instance alive.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m05',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you run a container as a different user inside the container?',
        options: [
            "podman run --user 1000 image",
            "podman run -u username image",
            "Add USER in Containerfile",
            "All of the above"
        ],
        correctAnswer: "All of the above",
        explanation: "Multiple ways to set the container user.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m06',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you update a container to a new image without losing data?',
        options: [
            "Stop container, pull new image, recreate container with same volumes",
            "podman update",
            "podman refresh",
            "Not possible"
        ],
        correctAnswer: "Stop container, pull new image, recreate container with same volumes",
        explanation: "Containers are ephemeral; data should be in volumes.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m07',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman exec' do?",
        options: [
            "Runs a command inside an already running container",
            "Starts a new container",
            "Stops a container",
            "Removes a container"
        ],
        correctAnswer: "Runs a command inside an already running container",
        explanation: "exec is for running commands in a running container.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m08',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you pass environment variables to a container?',
        options: [
            "podman run -e VAR=value image",
            "podman config VAR=value",
            "podman setenv",
            "Export in Containerfile only"
        ],
        correctAnswer: "podman run -e VAR=value image",
        explanation: "-e sets environment inside the container.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m09',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'What is a Podman pod?',
        options: [
            "A group of containers sharing network namespace and storage",
            "A single container",
            "A Kubernetes node",
            "A volume group"
        ],
        correctAnswer: "A group of containers sharing network namespace and storage",
        explanation: "Pods are the smallest deployable units.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m10',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you view resource usage of containers?',
        options: ["podman stats", "podman top", "podman ps --size", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "Multiple ways to see usage.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m11',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman auto-update' do?",
        options: [
            "Automatically updates containers when new images are available (with proper labels)",
            "Updates the podman binary",
            "Refreshes the system",
            "Deletes old images"
        ],
        correctAnswer: "Automatically updates containers when new images are available (with proper labels)",
        explanation: "Used for automated rolling updates.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m12',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you copy a file from a container to the host?',
        options: [
            "podman cp web:/path/file ./hostfile",
            "scp web:/file .",
            "docker cp",
            "ftp"
        ],
        correctAnswer: "podman cp web:/path/file ./hostfile",
        explanation: "podman cp transfers files.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m13',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is the purpose of 'podman save' and 'podman load'?",
        options: [
            "Export and import images (tar format)",
            "Save running containers",
            "Backup volumes",
            "Load balancing"
        ],
        correctAnswer: "Export and import images (tar format)",
        explanation: "Save/load move images between registries.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m14',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you run a container with a specific hostname?',
        options: [
            "podman run --hostname myhost image",
            "podman run -h myhost image",
            "podman run --name myhost",
            "Both A and B"
        ],
        correctAnswer: "Both A and B",
        explanation: "--hostname or -h sets the container's hostname.",
        difficulty: 'medium'
    },
    {
        id: 't2c12_m15',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is the 'ENTRYPOINT' in a Containerfile?",
        options: [
            "The default command that runs when the container starts",
            "The build script",
            "The volume mount",
            "The network config"
        ],
        correctAnswer: "The default command that runs when the container starts",
        explanation: "ENTRYPOINT or CMD define the runtime command.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c12_h01',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How does user namespace remapping work in rootless Podman?',
        options: [
            "The container's root UID 0 is mapped to the host user's UID via newuidmap/newgidmap",
            "It uses cgroups",
            "It's done by SELinux",
            "Containers share UIDs"
        ],
        correctAnswer: "The container's root UID 0 is mapped to the host user's UID via newuidmap/newgidmap",
        explanation: "User namespaces isolate UID/GID.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h02',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is the difference between 'podman run --rm' and 'podman rm'?",
        options: [
            "--rm automatically removes the container when it exits; podman rm is manual",
            "No difference",
            "--rm is only for rootless",
            "podman rm only works for stopped containers"
        ],
        correctAnswer: "--rm automatically removes the container when it exits; podman rm is manual",
        explanation: "--rm combines run and remove.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h03',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "How can you limit a container's memory usage?",
        options: [
            "podman run --memory=256m image",
            "podman limit --memory 256",
            "Edit the Containerfile",
            "Not possible"
        ],
        correctAnswer: "podman run --memory=256m image",
        explanation: "--memory sets a hard limit.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h04',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is a 'quadlet' in the context of Podman?",
        options: [
            "A systemd‑friendly container unit file format that simplifies running containers under systemd",
            "A container format",
            "A quadruple volume",
            "A Kubernetes pod"
        ],
        correctAnswer: "A systemd‑friendly container unit file format that simplifies running containers under systemd",
        explanation: "Quadlets are the next generation of container systemd integration.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h05',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you set up a container to restart always?',
        options: [
            "podman run --restart=always ...",
            "systemctl enable container",
            "podman --autorestart",
            "Edit the Containerfile"
        ],
        correctAnswer: "podman run --restart=always ...",
        explanation: "--restart policy controls restart behavior.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h06',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is the difference between 'podman run' and 'podman create'?",
        options: [
            "create defines a container but doesn't start it; run does both",
            "No difference",
            "create starts the container",
            "run is deprecated"
        ],
        correctAnswer: "create defines a container but doesn't start it; run does both",
        explanation: "create is for configuration; start later.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h07',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you share a socket between containers?',
        options: [
            "Use a shared volume (bind mount) or use podman's pod concept",
            "Not possible",
            "Use network=host",
            "Only through a registry"
        ],
        correctAnswer: "Use a shared volume (bind mount) or use podman's pod concept",
        explanation: "Volumes and pods enable sharing.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h08',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman system prune' do?",
        options: ["Removes all unused containers, images, networks, and volumes", "Deletes everything", "Cleans logs", "Restarts podman"],
        correctAnswer: "Removes all unused containers, images, networks, and volumes",
        explanation: "Prune frees up space.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h09',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you configure Podman to use a different registry mirror?',
        options: [
            "Edit /etc/containers/registries.conf or the user‑specific version",
            "podman registry set",
            "Not possible",
            "Only via environment variable"
        ],
        correctAnswer: "Edit /etc/containers/registries.conf or the user‑specific version",
        explanation: "registries.conf defines mirrors and search order.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h10',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is the purpose of 'podman play kube'?",
        options: [
            "Runs a Kubernetes pod definition (YAML) using Podman",
            "Plays a Kubernetes video",
            "Creates a Kubernetes cluster",
            "Installs Kubernetes"
        ],
        correctAnswer: "Runs a Kubernetes pod definition (YAML) using Podman",
        explanation: "It's for local testing of Kubernetes manifests.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h11',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you expose multiple ports from a container?',
        options: [
            "Use multiple -p flags: -p 8080:80 -p 8443:443",
            "podman expose 80,443",
            "Only one port per container",
            "Edit the image"
        ],
        correctAnswer: "Use multiple -p flags: -p 8080:80 -p 8443:443",
        explanation: "Several -p flags publish multiple ports.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h12',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What is the '--uts=private' namespace option?",
        options: [
            "Gives the container its own hostname and domain name (UTS namespace)",
            "Unified time sync",
            "User time slice",
            "Unprivileged terminal session"
        ],
        correctAnswer: "Gives the container its own hostname and domain name (UTS namespace)",
        explanation: "UTS isolates hostname.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h13',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How can you run a container in the same PID namespace as another container?',
        options: [
            "podman run --pid=container:other_name",
            "podman run --pid=host",
            "Not possible",
            "Only via pods"
        ],
        correctAnswer: "podman run --pid=container:other_name",
        explanation: "--pid container:<name> joins another container's PID namespace.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h14',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: 'How do you tag an image for a specific registry?',
        options: [
            "podman tag myapp docker.io/user/myapp:v1",
            "podman push myapp",
            "podman label",
            "Not needed"
        ],
        correctAnswer: "podman tag myapp docker.io/user/myapp:v1",
        explanation: "tag assigns a registry path.",
        difficulty: 'hard'
    },
    {
        id: 't2c12_h15',
        chapterId: 'track2-ch12',
        type: 'mcq',
        question: "What does 'podman container checkpoint' do?",
        options: [
            "Saves the state of a running container to disk and pauses it, allowing restore later",
            "Removes a container",
            "Creates a backup of the image",
            "Lists running containers"
        ],
        correctAnswer: "Saves the state of a running container to disk and pauses it, allowing restore later",
        explanation: "Checkpoint/restore is for live migration.",
        difficulty: 'hard'
    }
];
