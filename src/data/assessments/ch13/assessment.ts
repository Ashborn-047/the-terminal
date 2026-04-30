import { ChapterAssessment } from '../../../features/lab-engine/providers/QuestionProvider';

export const ch13Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch13_e01',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "Which command searches for a package named 'nginx'?",
        options: ['dnf search nginx', 'dnf find nginx', 'dnf locate nginx', 'rpm -q nginx'],
        correctAnswer: 'dnf search nginx',
        explanation: 'dnf search queries package names and descriptions.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e02',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you install a package with dnf?',
        options: ['dnf install pkgname', 'dnf add pkgname', 'dnf get pkgname', 'dnf fetch pkgname'],
        correctAnswer: 'dnf install pkgname',
        explanation: 'install adds a package to the system.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e03',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'Which command removes a package?',
        options: ['dnf remove pkgname', 'dnf delete pkgname', 'dnf uninstall pkgname', 'rpm -e pkgname'],
        correctAnswer: 'dnf remove pkgname',
        explanation: 'remove is the standard dnf verb for uninstalling.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e04',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you list all installed packages?',
        options: ['dnf list installed', 'rpm -qa', 'dnf list all', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'dnf list installed and rpm -qa both show installed packages.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e05',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'Which command updates all packages?',
        options: ['dnf update', 'dnf upgrade', 'dnf refresh', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: 'dnf update and dnf upgrade are equivalent.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e06',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you list available repositories?',
        options: ['dnf repolist', 'dnf repos', 'dnf list repos', 'rpm -q --repos'],
        correctAnswer: 'dnf repolist',
        explanation: 'dnf repolist shows enabled repositories.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e07',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'What is the typical path for repository configuration files?',
        options: ['/etc/yum.repos.d/', '/etc/dnf/repos/', '/etc/repos.conf', '/var/dnf/repos'],
        correctAnswer: '/etc/yum.repos.d/',
        explanation: 'Repo files ending in .repo are stored in /etc/yum.repos.d/.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e08',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'Which command shows the transaction history?',
        options: ['dnf history', 'dnf log', 'dnf transactions', 'rpm --history'],
        correctAnswer: 'dnf history',
        explanation: 'dnf history lists past install/update/remove actions.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e09',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you undo a dnf transaction (e.g., ID 10)?',
        options: ['dnf history undo 10', 'dnf revert 10', 'dnf rollback 10', 'dnf undo 10'],
        correctAnswer: 'dnf history undo 10',
        explanation: 'history undo reverses a specific transaction.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e10',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'rpm -qa' show?",
        options: [
            'All installed packages',
            'All available packages',
            'Query details of a package',
            'Architecture of packages'
        ],
        correctAnswer: 'All installed packages',
        explanation: '-q queries, -a lists all installed.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e11',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "How do you verify a package's integrity with rpm?",
        options: ['rpm -V pkg', 'rpm --check pkg', 'rpm -c pkg', 'rpm --verify pkg'],
        correctAnswer: 'rpm -V pkg',
        explanation: '-V verifies files against the package database.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e12',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "Which command shows information about the 'bash' package?",
        options: ['rpm -qi bash', 'rpm -ql bash', 'rpm -qa bash', 'rpm -qc bash'],
        correctAnswer: 'rpm -qi bash',
        explanation: '-qi provides install info like version and description.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e13',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you list the config files from an installed package?',
        options: ['rpm -qc httpd', 'rpm -ql httpd', 'dnf config httpd', 'cat /etc/httpd/conf'],
        correctAnswer: 'rpm -qc httpd',
        explanation: '-qc lists configuration files of a package.',
        difficulty: 'easy'
    },
    {
        id: 'ch13_e14',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf group list' show?",
        options: [
            'Available package groups (collections)',
            'User groups',
            'System groups',
            'Group listings of files'
        ],
        correctAnswer: 'Available package groups (collections)',
        explanation: "Package groups are metapackages like 'Development Tools'.",
        difficulty: 'easy'
    },
    {
        id: 'ch13_e15',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf localinstall' do?",
        options: [
            'Installs a local .rpm file while resolving dependencies from repositories',
            'Installs only local packages with no network',
            'Copies .rpm locally',
            'Installs into /usr/local'
        ],
        correctAnswer: 'Installs a local .rpm file while resolving dependencies from repositories',
        explanation: 'localinstall handles a local rpm file and uses repos for dependencies.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch13_m01',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What is the difference between 'dnf update' and 'dnf upgrade'?",
        options: [
            'No difference — they are aliases',
            'upgrade also removes obsolete packages',
            'update only shows what would be done',
            'upgrade is for major version bumps'
        ],
        correctAnswer: 'No difference — they are aliases',
        explanation: 'dnf treats update and upgrade identically.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m02',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "How do you list all files installed by 'nginx'?",
        options: ['rpm -ql nginx', 'dnf list files nginx', 'ls /usr/bin/nginx*', 'rpm -qa nginx'],
        correctAnswer: 'rpm -ql nginx',
        explanation: '-ql lists all files in the package.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m03',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf provides /bin/ls' tell you?",
        options: [
            'Which package owns the file /bin/ls',
            'The full path of ls',
            'If ls is installed',
            'The version of ls'
        ],
        correctAnswer: 'Which package owns the file /bin/ls',
        explanation: 'dnf provides finds the package that supplies a given file or command.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m04',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you enable a disabled repository using dnf?',
        options: [
            'dnf config-manager --set-enabled repo-id',
            'dnf repolist --enable',
            'Edit .repo file and set enabled=1',
            'Both A and C'
        ],
        correctAnswer: 'Both A and C',
        explanation: 'config-manager or editing the .repo file both work.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m05',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf --enablerepo=epel install pkg' do?",
        options: [
            'Temporarily enables EPEL to install a package',
            'Permanently enables EPEL',
            'Disables all other repos',
            'Installs EPEL'
        ],
        correctAnswer: 'Temporarily enables EPEL to install a package',
        explanation: '--enablerepo activates a repo for that single command.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m06',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you check if any updates are available without installing them?',
        options: ['dnf check-update', 'dnf list updates', 'dnf update --dry-run', 'Both A and C'],
        correctAnswer: 'Both A and C',
        explanation: 'check-update and update --dry-run show available updates.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m07',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'rpm -e pkgname' do?",
        options: ['Removes (erases) the package', 'Exports the package', 'Examines the package', 'Edits the package'],
        correctAnswer: 'Removes (erases) the package',
        explanation: '-e erases/uninstalls a package.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m08',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "Why might 'rpm -e pkg' fail?",
        options: [
            'Other packages depend on it',
            'pkg is not installed',
            'You forgot sudo',
            'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'rpm checks dependencies before erasing.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m09',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'What is the purpose of /etc/yum.repos.d/?',
        options: [
            'Directory containing .repo files for dnf/yum',
            'Cache of downloaded packages',
            'Log files for dnf',
            'Temporary files'
        ],
        correctAnswer: 'Directory containing .repo files for dnf/yum',
        explanation: 'It holds repository definitions.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m10',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you clean the dnf cache?',
        options: ['dnf clean all', 'dnf cache clear', 'dnf --refresh', 'rm -rf /var/cache/dnf'],
        correctAnswer: 'dnf clean all',
        explanation: 'dnf clean all removes cached metadata and packages.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m11',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'What is the EPEL repository?',
        options: [
            'Extra Packages for Enterprise Linux — community maintained packages',
            'Enterprise Product Environment Library',
            'The main RHEL repo',
            'Kernel modules'
        ],
        correctAnswer: 'Extra Packages for Enterprise Linux — community maintained packages',
        explanation: 'EPEL provides additional packages not in base RHEL.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m12',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'rpm -q --changelog bash' do?",
        options: [
            'Shows the package changelog/update history',
            'Changes log file',
            'Logs changes',
            'Records modifications'
        ],
        correctAnswer: 'Shows the package changelog/update history',
        explanation: '--changelog displays version history from the package.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m13',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How can you install a package from a specific repository?',
        options: ['dnf --repo=reponame install pkg', 'dnf --enablerepo=reponame install pkg', 'dnf install pkg-repo', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: '--repo and --enablerepo both work.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m14',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf history rollback 5' do?",
        options: [
            'Reverts the system to the state after transaction 5',
            'Undoes transaction 5',
            'Rolls back 5 transactions',
            'Shows transaction 5'
        ],
        correctAnswer: 'Reverts the system to the state after transaction 5',
        explanation: 'rollback sets packages to the exact set from that transaction.',
        difficulty: 'medium'
    },
    {
        id: 'ch13_m15',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'rpm --import' do?",
        options: [
            'Imports a GPG key for verifying package signatures',
            'Installs a package',
            'Imports files',
            'Verifies signatures'
        ],
        correctAnswer: 'Imports a GPG key for verifying package signatures',
        explanation: 'GPG keys are used to sign and verify packages.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch13_h01',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What is the difference between 'dnf update' and 'dnf distro-sync'?",
        options: [
            'distro-sync can downgrade packages to match the repo; update only upgrades',
            'No difference',
            'distro-sync only works for kernel',
            'update also downgrades'
        ],
        correctAnswer: 'distro-sync can downgrade packages to match the repo; update only upgrades',
        explanation: 'distro-sync aligns packages with repository versions, even if that means downgrading.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h02',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you find out which repository a package came from?',
        options: [
            "dnf repoquery --info pkg | grep 'From repo'",
            'dnf info pkg',
            'dnf list pkg',
            'rpm -qi pkg'
        ],
        correctAnswer: "dnf repoquery --info pkg | grep 'From repo'",
        explanation: 'repoquery can show the repo that supplied a package.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h03',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'What is a modular package in RHEL 8/9?',
        options: [
            'A package that provides multiple versions (streams) for different use cases',
            'Kernel module',
            'A split package',
            'A debug package'
        ],
        correctAnswer: 'A package that provides multiple versions (streams) for different use cases',
        explanation: 'Modules allow maintaining different versions of the same software.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h04',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you list module streams for a package?',
        options: ['dnf module list', 'dnf module provides pkg', 'rpm --module', 'dnf module install pkg'],
        correctAnswer: 'dnf module provides pkg',
        explanation: 'dnf module list shows available streams.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h05',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf versionlock' do?",
        options: [
            'Prevents specific packages from being updated',
            'Locks the dnf version',
            'Lock repository URLs',
            'Locks the database'
        ],
        correctAnswer: 'Prevents specific packages from being updated',
        explanation: 'versionlock plugin holds packages at a specified version.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h06',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How can you verify the signature of an RPM file without installing?',
        options: ['rpm --checksig file.rpm', 'rpm -K file.rpm', 'rpm -V file.rpm', 'Both A and B'],
        correctAnswer: 'Both A and B',
        explanation: '--checksig and -K both check signatures.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h07',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What is a 'copr' repository?",
        options: [
            'Community‑maintained repositories (Fedora‑style)',
            'Copy of the official repo',
            'A caching proxy',
            'Corporate repository'
        ],
        correctAnswer: 'Community‑maintained repositories (Fedora‑style)',
        explanation: "COPR (Cool Other Package Repo) is Fedora's third-party build system, also usable on RHEL.",
        difficulty: 'hard'
    },
    {
        id: 'ch13_h08',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf --setopt' do?",
        options: [
            'Overrides a configuration option for this single command',
            'Sets permanent option',
            'Optimizes dnf',
            'Sets password'
        ],
        correctAnswer: 'Overrides a configuration option for this single command',
        explanation: 'Temporary override of repo or dnf settings.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h09',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you configure dnf to exclude certain packages from updates?',
        options: [
            "Add 'exclude=pkg1 pkg2' in /etc/dnf/dnf.conf",
            'dnf exclude pkg',
            'rpm --exclude',
            'Set environment variable'
        ],
        correctAnswer: "Add 'exclude=pkg1 pkg2' in /etc/dnf/dnf.conf",
        explanation: 'The exclude directive in dnf.conf prevents updates to those packages.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h10',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'What is the dnf automatic tool?',
        options: [
            'A service that can apply updates automatically on a schedule',
            'The main dnf executable',
            'A GUI frontend',
            'A repo mirror'
        ],
        correctAnswer: 'A service that can apply updates automatically on a schedule',
        explanation: 'dnf-automatic runs updates unattended.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h11',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'rpm --rebuilddb' do?",
        options: [
            'Rebuilds the RPM database if it gets corrupted',
            'Rebuilds packages',
            'Rescans the filesystem',
            'Removes old kernels'
        ],
        correctAnswer: 'Rebuilds the RPM database if it gets corrupted',
        explanation: 'Rebuilds database files from installed package headers.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h12',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How do you find which package provides a specific library (.so)?',
        options: [
            'dnf provides */libname.so',
            'rpm -q --whatprovides libname.so',
            'locate libname.so',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'dnf provides and rpm -q --whatprovides both work.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h13',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What does 'dnf history list' show?",
        options: [
            'A compact list of past transactions with IDs',
            'Full details of each transaction',
            'Only adds/removes',
            'Error list'
        ],
        correctAnswer: 'A compact list of past transactions with IDs',
        explanation: 'history list is a terse summary.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h14',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: 'How can you see pending transactions (jobs) after a dnf command?',
        options: [
            'dnf history info last',
            'dnf history info <id>',
            'dnf history',
            'Both A and B'
        ],
        correctAnswer: 'Both A and B',
        explanation: 'history info shows packages changed in a transaction.',
        difficulty: 'hard'
    },
    {
        id: 'ch13_h15',
        chapterId: 'track1-ch13',
        type: 'mcq',
        question: "What is the purpose of 'dnf makecache'?",
        options: [
            'Downloads and refreshes repository metadata',
            'Creates cache for offline use',
            'Clears cache',
            'Builds packages'
        ],
        correctAnswer: 'Downloads and refreshes repository metadata',
        explanation: 'makecache pulls the latest repodata.',
        difficulty: 'hard'
    }
];
