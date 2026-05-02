import { ChapterAssessment } from '../../../../features/lab-engine/providers/QuestionProvider';

export const ch12Assessment: ChapterAssessment[] = [
    // Easy
    {
        id: 'ch12_e01',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which command creates a tar archive?',
        options: ['tar -cvf archive.tar files', 'tar -xvf archive.tar', 'tar -tvf archive.tar', 'tar -zcvf archive.tar.gz'],
        correctAnswer: 'tar -cvf archive.tar files',
        explanation: '-c create, -v verbose, -f file.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e02',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which flag to tar compresses with gzip?',
        options: ['-z', '-j', '-J', '-g'],
        correctAnswer: '-z',
        explanation: '-z calls gzip.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e03',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you extract a .tar.gz file?',
        options: ['tar -xzvf file.tar.gz', 'tar -xvf file.tar.gz', 'gunzip file.tar.gz | tar -x', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All are valid methods.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e04',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which command compresses a file with gzip?',
        options: ['gzip file', 'gunzip file', 'bzip2 file', 'compress file'],
        correctAnswer: 'gzip file',
        explanation: 'gzip creates a .gz file.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e05',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'scp file.txt user@host:/tmp/' do?",
        options: [
            'Copies file.txt to /tmp/ on the remote host via SSH',
            'Deletes the file',
            'Moves the file',
            'Lists the file'
        ],
        correctAnswer: 'Copies file.txt to /tmp/ on the remote host via SSH',
        explanation: 'scp securely copies files over SSH.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e06',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync -av source/ dest/' do?",
        options: [
            'Synchronizes source to dest with archive mode and verbose output',
            'Deletes dest',
            'Copies only new files',
            'Compresses files in place'
        ],
        correctAnswer: 'Synchronizes source to dest with archive mode and verbose output',
        explanation: '-a archive, -v verbose.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e07',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which option to rsync enables compression during transfer?',
        options: ['-z', '-c', '-compress', '-j'],
        correctAnswer: '-z',
        explanation: '-z turns on stream compression.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e08',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'tar -tvf archive.tar' do?",
        options: [
            'Lists contents of the archive without extracting',
            'Extracts the archive',
            'Compresses the archive',
            'Deletes the archive'
        ],
        correctAnswer: 'Lists contents of the archive without extracting',
        explanation: '-t lists, -v verbose, -f file.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e09',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you decompress a .gz file?',
        options: ['gunzip file.gz', 'gzip -d file.gz', 'zcat file.gz > file', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All methods decompress.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e10',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'scp -r' do?",
        options: [
            'Copies directories recursively',
            'Runs in reverse',
            'Renames files',
            'Resumes transfer'
        ],
        correctAnswer: 'Copies directories recursively',
        explanation: '-r copies entire directory trees.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e11',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which tool provides the best compression among gzip, bzip2, and xz?',
        options: ['xz', 'gzip', 'bzip2', 'They are identical'],
        correctAnswer: 'xz',
        explanation: 'xz usually achieves the highest compression ratio.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e12',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you create a .tar.bz2 archive?',
        options: ['tar -cjvf archive.tar.bz2 files', 'tar -czvf ...', 'tar -xzvf ...', 'bzip2 archive.tar'],
        correctAnswer: 'tar -cjvf archive.tar.bz2 files',
        explanation: '-j enables bzip2 compression.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e13',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync --delete' do?",
        options: [
            'Removes files in destination that are not in source',
            'Deletes the source after sync',
            'Deletes everything',
            'Deletes old backups'
        ],
        correctAnswer: 'Removes files in destination that are not in source',
        explanation: 'It makes destination an exact mirror.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e14',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which command securely transfers a file from a remote server to your local machine?',
        options: ['scp user@host:/remote/path localpath', 'scp localpath user@host:/remote/path', 'rsync localpath user@host:remote', 'ftp get'],
        correctAnswer: 'scp user@host:/remote/path localpath',
        explanation: 'First argument is source, second is destination.',
        difficulty: 'easy'
    },
    {
        id: 'ch12_e15',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'What is the extension for an xz-compressed tar archive?',
        options: ['.tar.xz', '.tar.gz', '.tar.bz2', '.txz'],
        correctAnswer: '.tar.xz',
        explanation: 'tar with -J produces .tar.xz.',
        difficulty: 'easy'
    },
    // Medium
    {
        id: 'ch12_m01',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does the 'v' option in tar do?",
        options: [
            'Verbose: list files processed',
            'Verify archive',
            'Create a volume',
            'View contents'
        ],
        correctAnswer: 'Verbose: list files processed',
        explanation: '-v prints filenames as they are added/extracted.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m02',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you extract a specific file from a tar archive?',
        options: ['tar -xvf archive.tar file.txt', 'tar -e archive.tar file.txt', 'Not possible', 'tar -xtract file.txt'],
        correctAnswer: 'tar -xvf archive.tar file.txt',
        explanation: 'After the archive name, list the file(s) to extract.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m03',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync -a' preserve?",
        options: [
            'Permissions, ownership, timestamps, symlinks, etc.',
            'Only file contents',
            'Only timestamps',
            'Only directories'
        ],
        correctAnswer: 'Permissions, ownership, timestamps, symlinks, etc.',
        explanation: '-a is equivalent to -rlptgoD (recursive, links, perms, times, group, owner, devices).',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m04',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'What is the advantage of rsync over scp for large directory syncs?',
        options: [
            'rsync only transfers the differences (delta transfer)',
            'rsync is faster because it compresses',
            'scp is more secure',
            'rsync uses less encryption'
        ],
        correctAnswer: 'rsync only transfers the differences (delta transfer)',
        explanation: "rsync's delta algorithm sends only changed parts.",
        difficulty: 'medium'
    },
    {
        id: 'ch12_m05',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you perform a dry run with rsync?',
        options: ['rsync -av --dry-run source/ dest/', 'rsync --dry', 'rsync -n', 'Not possible'],
        correctAnswer: 'rsync -av --dry-run source/ dest/',
        explanation: '--dry-run (or -n) shows what would happen without making changes.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m06',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'tar -C /tmp' do?",
        options: [
            'Changes to /tmp directory before performing the tar operation',
            'Creates archive in /tmp',
            'Compresses to /tmp',
            'Checks /tmp'
        ],
        correctAnswer: 'Changes to /tmp directory before performing the tar operation',
        explanation: '-C changes directory first.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m07',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What happens if you run 'gzip file.txt' on a file that already exists?",
        options: [
            'It overwrites the existing .gz file without warning, or may prompt depending on aliases',
            'It appends',
            'It fails',
            'It renames the old file'
        ],
        correctAnswer: 'It overwrites the existing .gz file without warning, or may prompt depending on aliases',
        explanation: 'gzip will replace the old .gz silently if the -f option is used; by default gzip may ask.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m08',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How can you view the contents of a compressed text file without decompressing to disk?',
        options: ['zcat file.gz', 'gunzip -c file.gz', 'zless file.gz', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'zcat outputs to stdout, gunzip -c does the same, zless opens in pager.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m09',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync -e ssh' specify?",
        options: [
            'Uses SSH as the remote shell for rsync',
            'Excludes ssh files',
            'Enables SSH encryption',
            'Errors to ssh'
        ],
        correctAnswer: 'Uses SSH as the remote shell for rsync',
        explanation: '-e ssh tells rsync to tunnel through SSH.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m10',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "Why might you use '--partial' with rsync?",
        options: [
            'To keep partially transferred files so they can be resumed',
            'To compress partially',
            'To delete partially',
            'To sync only new files'
        ],
        correctAnswer: 'To keep partially transferred files so they can be resumed',
        explanation: 'Partial files are kept if transfer is interrupted.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m11',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'Which compression utility is typically the fastest?',
        options: ['gzip', 'bzip2', 'xz', 'lzma'],
        correctAnswer: 'gzip',
        explanation: 'gzip is optimized for speed.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m12',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you create a tar archive that excludes certain files?',
        options: ["tar --exclude='*.log' -cvf archive.tar dir/", 'tar -x --exclude', 'not possible', 'tar -ignore'],
        correctAnswer: "tar --exclude='*.log' -cvf archive.tar dir/",
        explanation: '--exclude option filters files.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m13',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'scp -C' do?",
        options: [
            'Enables compression during transfer',
            'Copies recursively',
            'Checks consistency',
            'Enables checksum'
        ],
        correctAnswer: 'Enables compression during transfer',
        explanation: '-C compresses data on the fly.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m14',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What is the difference between 'tar -cvf' and 'tar -czvf'?",
        options: [
            'The latter compresses the archive with gzip',
            'No difference',
            'The former creates zip',
            'The latter is for extracting'
        ],
        correctAnswer: 'The latter compresses the archive with gzip',
        explanation: '-z adds gzip compression.',
        difficulty: 'medium'
    },
    {
        id: 'ch12_m15',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you synchronize two local directories with rsync?',
        options: ['rsync -av /source/ /dest/', 'rsync local', 'sync -r', 'cp -r'],
        correctAnswer: 'rsync -av /source/ /dest/',
        explanation: 'rsync works locally as well.',
        difficulty: 'medium'
    },
    // Hard
    {
        id: 'ch12_h01',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'tar --transform' do?",
        options: [
            'Applies a sed expression to filenames as they are added/extracted',
            'Converts file encoding',
            'Changes permissions',
            'Transforms archive format'
        ],
        correctAnswer: 'Applies a sed expression to filenames as they are added/extracted',
        explanation: '--transform allows renaming files on the fly.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h02',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "How can you limit rsync's bandwidth usage?",
        options: ['--bwlimit=1000 (in KB/s)', '--speed=1000', '--limit=1000', 'Not possible'],
        correctAnswer: '--bwlimit=1000 (in KB/s)',
        explanation: '--bwlimit restricts transfer rate.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h03',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync --link-dest=DIR' do?",
        options: [
            'Creates hard links from DIR for unchanged files to save space',
            'Links the destination',
            'Deletes links',
            'Syncs only links'
        ],
        correctAnswer: 'Creates hard links from DIR for unchanged files to save space',
        explanation: 'Useful for incremental backups with hard links.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h04',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What is the difference between 'gzip' and 'zlib'?",
        options: [
            'gzip is a program, zlib is a library for deflate compression',
            'No difference',
            'zlib is faster',
            'gzip is only for .txt files'
        ],
        correctAnswer: 'gzip is a program, zlib is a library for deflate compression',
        explanation: 'gzip uses the deflate algorithm implemented in zlib.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h05',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How can you append files to an existing tar archive?',
        options: ['tar -rvf archive.tar newfile', 'tar -c append', 'not possible', 'tar -update'],
        correctAnswer: 'tar -rvf archive.tar newfile',
        explanation: '-r appends to an archive (only works for uncompressed archives).',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h06',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync --checksum' do?",
        options: [
            'Determines changed files by checksum instead of time/size',
            'Verifies archive after transfer',
            'Checksum the source',
            'Slows transfer'
        ],
        correctAnswer: 'Determines changed files by checksum instead of time/size',
        explanation: 'Useful when file times are unreliable.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h07',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What is the purpose of 'scp -3'?",
        options: [
            'Routes the copy through the local machine (between two remotes)',
            'Uses protocol 3',
            'Enables compression level 3',
            'Copies 3 files'
        ],
        correctAnswer: 'Routes the copy through the local machine (between two remotes)',
        explanation: '-3 transfers between two remote hosts via the local machine.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h08',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How can you encrypt a tar archive with a passphrase?',
        options: [
            'Use gpg (gpg -c file.tar)',
            'tar --encrypt',
            'not possible',
            'Use openssl enc'
        ],
        correctAnswer: 'Use gpg (gpg -c file.tar)',
        explanation: "tar alone doesn't encrypt; pipe to gpg or openssl.",
        difficulty: 'hard'
    },
    {
        id: 'ch12_h09',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'tar --transform 's,^,prefix/,' do?",
        options: [
            "Adds 'prefix/' to the start of every filename in the archive",
            'Deletes prefix',
            'Renames prefix',
            'Sorts files'
        ],
        correctAnswer: "Adds 'prefix/' to the start of every filename in the archive",
        explanation: 'The sed expression prepends a path.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h10',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How would you resume a large scp transfer that was interrupted?',
        options: [
            "You typically can't; re-run scp (rsync is better for this)",
            'scp --continue',
            'scp -r',
            'sftp reget'
        ],
        correctAnswer: "You typically can't; re-run scp (rsync is better for this)",
        explanation: "scp doesn't support resume; rsync or sftp reget do.",
        difficulty: 'hard'
    },
    {
        id: 'ch12_h11',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync --remove-source-files' do?",
        options: [
            'Deletes source files after successful transfer (like moving)',
            'Removes files from destination',
            'Cleans up temp files',
            'Deletes old files'
        ],
        correctAnswer: 'Deletes source files after successful transfer (like moving)',
        explanation: 'Useful for migrating files.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h12',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How can you create a multi-part tar archive (like split volumes)?',
        options: [
            'tar -cvf - directory/ | split -b 100M - archive.tar.',
            'tar --multi-volume',
            'tar -M',
            'Both A and C'
        ],
        correctAnswer: 'Both A and C',
        explanation: 'Piping to split is an easy method; tar -M is traditional.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h13',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What is the 'xz' command's equivalent of 'gzip -9'?",
        options: ['xz -9', 'xz --best', 'xz -9e (extreme)', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: '-9 sets the highest compression level, -9e uses more memory for even smaller files.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h14',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: 'How do you extract a .tar.xz file with a single command?',
        options: ['tar -xJvf file.tar.xz', 'unxz file.tar.xz | tar -x', 'xz -dc file.tar.xz | tar -x', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: 'All methods work.',
        difficulty: 'hard'
    },
    {
        id: 'ch12_h15',
        chapterId: 'track1-ch12',
        type: 'mcq',
        question: "What does 'rsync --fuzzy' do?",
        options: [
            'Looks for similar files in destination to use as basis for delta transfer',
            'Syncs roughly',
            'Ignores files',
            'Matches patterns fuzzily'
        ],
        correctAnswer: 'Looks for similar files in destination to use as basis for delta transfer',
        explanation: '--fuzzy can re-use existing files even if not exact match.',
        difficulty: 'hard'
    }
];
