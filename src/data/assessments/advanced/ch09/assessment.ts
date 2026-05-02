import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const t2ch09Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 't2c09_e01',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'Which file defines NFS exports on the server?',
        options: ["/etc/exports", "/etc/nfs.conf", "/etc/nfsexports", "/etc/exportfs"],
        correctAnswer: "/etc/exports",
        explanation: "/etc/exports lists shared directories.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e02',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you manually mount an NFS share?',
        options: [
            "mount -t nfs server:/path /mnt",
            "nfsmount server:/path /mnt",
            "mount.nfs server:/path /mnt",
            "netmount server:/path /mnt"
        ],
        correctAnswer: "mount -t nfs server:/path /mnt",
        explanation: "-t nfs specifies the type.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e03',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'What is the purpose of autofs?',
        options: [
            "Automounts filesystems on demand",
            "Automatically backups files",
            "Auto-fixes filesystems",
            "Auto-formats drives"
        ],
        correctAnswer: "Automounts filesystems on demand",
        explanation: "autofs mounts when accessed, unmounts after idle.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e04',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'Which file is the master configuration for autofs?',
        options: ["/etc/auto.master", "/etc/autofs.conf", "/etc/auto.mount", "/etc/automount"],
        correctAnswer: "/etc/auto.master",
        explanation: "auto.master defines map points.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e05',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does the '_netdev' mount option do?",
        options: [
            "Delays the mount until network is available",
            "Mounts a net device",
            "Enables networking on the filesystem",
            "Speeds up network I/O"
        ],
        correctAnswer: "Delays the mount until network is available",
        explanation: "Prevents mount failure during boot without network.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e06',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you apply changes to /etc/exports?',
        options: ["exportfs -a", "systemctl restart nfs", "nfs-reload", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "exportfs -a or restarting the service works.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e07',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'Which command shows NFS exports available from a server?',
        options: ["showmount -e server", "nfsmount --list", "exportfs -l", "nfslist"],
        correctAnswer: "showmount -e server",
        explanation: "showmount queries the NFS server.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e08',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'What is the default NFS version on RHEL 9?',
        options: ["NFSv4", "NFSv3", "NFSv2", "NFSv5"],
        correctAnswer: "NFSv4",
        explanation: "NFSv4 is the default.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e09',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you enable and start the NFS server?',
        options: [
            "systemctl enable --now nfs-server",
            "systemctl start nfsd",
            "nfs enable",
            "service nfs start"
        ],
        correctAnswer: "systemctl enable --now nfs-server",
        explanation: "nfs-server is the systemd service.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e10',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What do the parameters 'rw,sync' mean in exports?",
        options: [
            "Read-write access with synchronous writes",
            "Read-only, synchronous",
            "Root writes, sync",
            "Remote write sync"
        ],
        correctAnswer: "Read-write access with synchronous writes",
        explanation: "rw=read+write, sync=write operations are synchronous.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e11',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you check if autofs is running?',
        options: ["systemctl status autofs", "autofs --status", "ps -C automount", "Both A and C"],
        correctAnswer: "Both A and C",
        explanation: "systemctl status or checking for automount process.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e12',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does a wildcard '*' mean in an autofs map?",
        options: [
            "Matches any directory name accessed under the mountpoint",
            "All files",
            "No mount",
            "Only root"
        ],
        correctAnswer: "Matches any directory name accessed under the mountpoint",
        explanation: "* maps to any subdirectory.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e13',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'What is the typical timeout in autofs (seconds)?',
        options: ["60", "10", "3600", "Never"],
        correctAnswer: "60",
        explanation: "A typical idle timeout is 60 seconds.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e14',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you list currently mounted NFS shares?',
        options: ["df -h", "mount | grep nfs", "nfsstat -m", "All of the above"],
        correctAnswer: "All of the above",
        explanation: "All show NFS mounts.",
        difficulty: 'easy'
    },
    {
        id: 't2c09_e15',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does 'exportfs -v' show?",
        options: ["Detailed information about currently exported directories", "Verbose version", "Export version", "Nothing"],
        correctAnswer: "Detailed information about currently exported directories",
        explanation: "-v gives a verbose listing of exports.",
        difficulty: 'easy'
    },
    // Medium
    {
        id: 't2c09_m01',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does 'no_root_squash' do in an export?",
        options: [
            "Allows root on the client to have root privileges on the share (usually disabled for security)",
            "Disables root access",
            "Squashes root",
            "Forces root to nobody"
        ],
        correctAnswer: "Allows root on the client to have root privileges on the share (usually disabled for security)",
        explanation: "It disables the default root squashing.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m02',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you mount a specific NFS version (e.g., v4.2)?',
        options: [
            "mount -t nfs -o vers=4.2 server:/path /mnt",
            "mount -t nfs4 server:/path /mnt",
            "nfsmount -v 4.2",
            "Both A and B"
        ],
        correctAnswer: "Both A and B",
        explanation: "Both vers= and nfs4 type work.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m03',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the difference between a 'hard' and 'soft' NFS mount?",
        options: [
            "Hard mounts retry indefinitely; soft mounts time out and return an error",
            "No difference",
            "Soft is faster",
            "Hard is for disks"
        ],
        correctAnswer: "Hard mounts retry indefinitely; soft mounts time out and return an error",
        explanation: "soft prevents hangs but risks data loss.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m04',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does the automounter 'ghost' option do?",
        options: [
            "Creates permanent empty directories for all known maps, even when unaccessed",
            "Hides directories",
            "Deletes unused maps",
            "Shows hidden files"
        ],
        correctAnswer: "Creates permanent empty directories for all known maps, even when unaccessed",
        explanation: "Useful for browsing.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m05',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you reload the autofs maps without restarting?',
        options: ["systemctl reload autofs", "automount -r", "kill -HUP $(pidof automount)", "Both A and C"],
        correctAnswer: "Both A and C",
        explanation: "Both reload and HUP work.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m06',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the purpose of 'rpcbind' in NFS?",
        options: [
            "Portmapper that assigns ports to RPC services like NFS and mountd",
            "Binds NFS to a port",
            "Encrypts NFS",
            "Not used in NFSv4"
        ],
        correctAnswer: "Portmapper that assigns ports to RPC services like NFS and mountd",
        explanation: "NFSv3 and earlier require rpcbind; NFSv4 only needs port 2049.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m07',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you permanently specify NFS mount options in autofs?',
        options: [
            "Add options before the server:path in the map file",
            "In /etc/auto.master",
            "With exportfs",
            "Not possible"
        ],
        correctAnswer: "Add options before the server:path in the map file",
        explanation: "Map entries: mountpoint [options] location.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m08',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does the 'nofail' mount option do for NFS?",
        options: [
            "Prevents boot failure if the mount cannot be established",
            "Forces mount",
            "Removes the mount",
            "Ignores errors"
        ],
        correctAnswer: "Prevents boot failure if the mount cannot be established",
        explanation: "nofail is useful for non-critical mounts.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m09',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you see detailed NFS statistics?',
        options: ["nfsstat", "cat /proc/net/rpc/nfs", "nfsiostat", "Both A and B"],
        correctAnswer: "Both A and B",
        explanation: "nfsstat and /proc give details.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m10',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the 'sec=sys' option in NFS?",
        options: [
            "Uses standard UNIX authentication (UID/GID)",
            "Kerberos",
            "System security",
            "SELinux"
        ],
        correctAnswer: "Uses standard UNIX authentication (UID/GID)",
        explanation: "sys is the default legacy auth.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m11',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you configure autofs to mount home directories from a server?',
        options: [
            "In auto.master: /home /etc/auto.home, and auto.home: * server:/home/&",
            "Only possible with NFSv4",
            "Use /etc/fstab with wildcard",
            "Not possible"
        ],
        correctAnswer: "In auto.master: /home /etc/auto.home, and auto.home: * server:/home/&",
        explanation: "Standard home directory automount pattern.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m12',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'What firewall ports need to be open for NFS (v3 and earlier)?',
        options: [
            "2049 (nfs), 111 (rpcbind), and ports for mountd/statd (can be fixed)",
            "Only 2049",
            "80,443",
            "22"
        ],
        correctAnswer: "2049 (nfs), 111 (rpcbind), and ports for mountd/statd (can be fixed)",
        explanation: "NFSv4 only needs 2049; earlier versions require multiple ports.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m13',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does 'showmount -a' show?",
        options: [
            "List of clients currently mounting shares",
            "All exports",
            "NFS version",
            "Active NFS daemons"
        ],
        correctAnswer: "List of clients currently mounting shares",
        explanation: "showmount -a shows active mounts.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m14',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you stop autofs from automatically mounting at boot for a specific map?',
        options: [
            "Comment out the line in auto.master",
            "Use systemctl disable autofs",
            "Add --noauto",
            "Delete the map file"
        ],
        correctAnswer: "Comment out the line in auto.master",
        explanation: "Removing the entry disables that automount.",
        difficulty: 'medium'
    },
    {
        id: 't2c09_m15',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the purpose of 'nfsidmap'?",
        options: ["Maps NFSv4 names like user@domain to UIDs", "Manages NFS IDs", "Creates mapping for files", "Nothing"],
        correctAnswer: "Maps NFSv4 names like user@domain to UIDs",
        explanation: "Idmapper translates between string names and local UIDs.",
        difficulty: 'medium'
    },
    // Hard
    {
        id: 't2c09_h01',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How does NFSv4 differ from NFSv3 in terms of security?',
        options: [
            "Supports Kerberos natively, uses a single port (2049), and has better file locking",
            "Same security",
            "NFSv3 is more secure",
            "NFSv4 uses telnet"
        ],
        correctAnswer: "Supports Kerberos natively, uses a single port (2049), and has better file locking",
        explanation: "NFSv4 is a stateful protocol with stronger security.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h02',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you set up an NFS server with Kerberos authentication?',
        options: [
            "Use sec=krb5p mount option and configure Kerberos principals",
            "Not possible with RHEL",
            "Only via autofs",
            "Use NFSv3 with AUTH_SYS"
        ],
        correctAnswer: "Use sec=krb5p mount option and configure Kerberos principals",
        explanation: "NFSv4 supports Kerberos.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h03',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'What is pNFS?',
        options: [
            "Parallel NFS, an extension allowing clients to access data via multiple parallel paths",
            "Personal NFS",
            "Proxy NFS",
            "Primary NFS"
        ],
        correctAnswer: "Parallel NFS, an extension allowing clients to access data via multiple parallel paths",
        explanation: "pNFS scales bandwidth.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h04',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you configure a highly available NFS server?',
        options: [
            "Use a clustered filesystem (GFS2) and a Corosync/Pacemaker managed virtual IP",
            "Use two servers with rsync",
            "Not possible",
            "Only via NAS appliances"
        ],
        correctAnswer: "Use a clustered filesystem (GFS2) and a Corosync/Pacemaker managed virtual IP",
        explanation: "Active-passive with floating IP is common.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h05',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does the 'lookupcache' mount option control?",
        options: [
            "Controls how long NFS caches directory entry attributes",
            "Controls file cache",
            "Controls DNS cache",
            "Not used in NFS"
        ],
        correctAnswer: "Controls how long NFS caches directory entry attributes",
        explanation: "Affects getattr caching.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h06',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you configure autofs to use LDAP maps instead of local files?',
        options: [
            "Specify ldap in /etc/auto.master and configure /etc/autofs_ldap_auth.conf",
            "Not possible",
            "Only with NIS",
            "Use /etc/auto.map ldap"
        ],
        correctAnswer: "Specify ldap in /etc/auto.master and configure /etc/autofs_ldap_auth.conf",
        explanation: "Autofs supports LDAP as a map source.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h07',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the effect of 'noac' mount option?",
        options: [
            "Disables attribute caching, ensuring the client revalidates on every access",
            "No access control",
            "No accounting",
            "No asynchronous"
        ],
        correctAnswer: "Disables attribute caching, ensuring the client revalidates on every access",
        explanation: "Degrades performance but ensures consistency.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h08',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you mount an NFS share as read-only?',
        options: ["mount -o ro server:/path /mnt", "mount -t nfs -o rsize=0", "mount -R", "Not possible"],
        correctAnswer: "mount -o ro server:/path /mnt",
        explanation: "-o ro mounts read-only.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h09',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the difference between 'hard' and 'intr' mount options?",
        options: [
            "'hard' mounts retry forever; 'intr' allows signals to interrupt a blocked NFS operation (for hard mounts)",
            "No difference",
            "intr is for soft mounts",
            "hard is default for NFSv4"
        ],
        correctAnswer: "'hard' mounts retry forever; 'intr' allows signals to interrupt a blocked NFS operation (for hard mounts)",
        explanation: "intr is obsolete in later kernels but still documented.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h10',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How do you tune the number of NFS daemons on the server?',
        options: [
            "Set RPCNFSDCOUNT in /etc/sysconfig/nfs",
            "nfsd --count",
            "systemctl set-property nfs-server",
            "Edit /etc/nfs.conf"
        ],
        correctAnswer: "Edit /etc/nfs.conf",
        explanation: "Number of threads can be configured.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h11',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the purpose of 'fsid' export option?",
        options: [
            "Specifies a unique filesystem identifier, required if the filesystem is not a real device (e.g., for subdirectory exports)",
            "File system ID",
            "Feature ID",
            "File size ID"
        ],
        correctAnswer: "Specifies a unique filesystem identifier, required if the filesystem is not a real device (e.g., for subdirectory exports)",
        explanation: "fsid=0 sets the root filesystem for NFSv4.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h12',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you export a subdirectory of a filesystem with NFS?',
        options: [
            "With 'nohide' on the parent and explicit entry for the subdir; or using bind mounts",
            "Not possible",
            "Only using symbolic links",
            "Only with NFSv4"
        ],
        correctAnswer: "With 'nohide' on the parent and explicit entry for the subdir; or using bind mounts",
        explanation: "Subdirectory exports require 'nohide' or bind mounts.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h13',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What does 'blkmapd' do?",
        options: [
            "Daemon for pNFS block device mapping",
            "Maps NFS block devices",
            "Creates device maps",
            "Removes mappings"
        ],
        correctAnswer: "Daemon for pNFS block device mapping",
        explanation: "Used with pNFS layouts.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h14',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: 'How can you prevent root from accessing NFS shares?',
        options: [
            "Use 'root_squash' (default) in exports",
            "Set no_root_squash",
            "Disable root login",
            "Only by firewall"
        ],
        correctAnswer: "Use 'root_squash' (default) in exports",
        explanation: "root_squash maps root to nobody.",
        difficulty: 'hard'
    },
    {
        id: 't2c09_h15',
        chapterId: 'track2-ch09',
        type: 'mcq',
        question: "What is the autofs 'browse' mode?",
        options: [
            "Allows directories to be listed even if not mounted, by creating ghost entries",
            "Disables automount",
            "Creates maps",
            "Lists files"
        ],
        correctAnswer: "Allows directories to be listed even if not mounted, by creating ghost entries",
        explanation: "browse is equivalent to the 'ghost' option.",
        difficulty: 'hard'
    }
];
