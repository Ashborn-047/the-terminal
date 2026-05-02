import { ChapterContent } from '../../../../types/chapters';

export const ch12Content: ChapterContent = {
    chapterId: 'track1-ch12',
    title: 'Archiving and Transferring Files',
    description: "Files often need to be bundled, compressed, and sent across the network. Learn to use tar, gzip, scp, and rsync to manage files efficiently.",
    sections: [
        {
            type: 'text',
            id: 'why_matters',
            heading: 'Why This Matters',
            content: "Files often need to be bundled, compressed, and sent across the network. Whether you're backing up a project, deploying an application, or just moving stuff between servers, the combination of `tar`, `gzip`, `scp`, and `rsync` is your Swiss Army knife.\n\nThis chapter covers archiving, compression, and efficient remote transfer — skills you'll use every day."
        },
        {
            type: 'text',
            id: 'what_learn',
            heading: "What You'll Learn",
            list: [
                "How to create and extract tar archives (`tar -cvf`, `tar -xvf`).",
                "How to compress and decompress with `gzip`, `bzip2`, `xz`.",
                "How to combine tar with compression (`tar -czvf`).",
                "How to securely copy files with `scp`.",
                "How to synchronize directories with `rsync`."
            ]
        },
        {
            type: 'interactive',
            id: 'tar_archiving',
            heading: 'Archiving with tar',
            content: "`tar` (tape archive) bundles multiple files into one file. Create an archive:",
            terminal_blocks: [
                { command: "tar -cvf archive.tar folder/", showPrompt: true }
            ],
            tips: [
                "Options: `c` create, `v` verbose (list files), `f` filename.",
                "Extract with `tar -xvf archive.tar`.",
                "List contents without extracting: `tar -tvf archive.tar`"
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a directory with a few files, tar it, then extract to a new location." }
            ]
        },
        {
            type: 'text',
            id: 'compression_tools',
            heading: 'Compression Tools',
            content: "Compression reduces file size. Three common tools:",
            table: {
                headers: ["Tool", "Extension", "Speed", "Compression"],
                rows: [
                    ["gzip", ".gz", "Fast", "Good"],
                    ["bzip2", ".bz2", "Slower", "Better"],
                    ["xz", ".xz", "Slowest", "Best"]
                ]
            },
            tips: [
                "Compress with `gzip file.txt`, `bzip2 file.txt`, or `xz file.txt`.",
                "Decompress with `gunzip`, `bunzip2`, or `unxz`."
            ]
        },
        {
            type: 'interactive',
            id: 'tar_compression',
            heading: 'tar + Compression = One Step',
            content: "tar can compress on the fly by adding a compression flag:",
            list: [
                "`-z` for gzip → `.tar.gz` or `.tgz`",
                "`-j` for bzip2 → `.tar.bz2`",
                "`-J` for xz → `.tar.xz`"
            ],
            terminal_blocks: [
                { command: "tar -czvf archive.tar.gz folder/", showPrompt: true, output: "// Create compressed archive" },
                { command: "tar -xzvf archive.tar.gz", showPrompt: true, output: "// Extract compressed archive" }
            ],
            callouts: [
                { type: 'try_it', icon: '🧪', content: "Create a .tar.gz of your home directory's Documents folder. Compare file sizes before and after." }
            ]
        },
        {
            type: 'interactive',
            id: 'scp_copy',
            heading: 'Secure Copy with scp',
            content: "Copy files between hosts over SSH:",
            terminal_blocks: [
                { command: "scp localfile user@remote:/path/", showPrompt: true },
                { command: "scp user@remote:/path/file localdir/", showPrompt: true }
            ],
            tips: [
                "Copy entire directories with `-r`: `scp -r myfolder user@remote:/backup/`.",
                "Use `-P` for a non-default port."
            ]
        },
        {
            type: 'interactive',
            id: 'rsync_sync',
            heading: 'Efficient Sync with rsync',
            content: "`rsync` only transfers differences, making it incredibly efficient for large directories. Basic syntax:",
            terminal_blocks: [
                { command: "rsync -av source/ destination/", showPrompt: true }
            ],
            list: [
                "**-a** — archive mode (preserves permissions, timestamps).",
                "**-v** — verbose.",
                "**-z** — compress during transfer.",
                "**--delete** — remove files in dest that don't exist in source."
            ],
            terminal_blocks_after: [
                { command: "rsync -avz -e ssh user@remote:/data/ /local/backup/", showPrompt: true, output: "// Remote sync over SSH" }
            ],
            callouts: [
                { type: 'caution', icon: '⚠️', content: "Trailing slashes matter! `source/` copies contents; `source` copies the folder itself." },
                { type: 'try_it', icon: '🧪', content: "Sync a local directory to another local directory, then delete a file in the source and sync again with `--delete`." }
            ]
        },
        {
            type: 'text',
            id: 'scp_vs_rsync',
            heading: 'Comparing scp and rsync',
            content: "`scp` is simple and secure, but always copies everything. `rsync` only sends changes, resumes interrupted transfers, and can delete extra files. For one-time small files, scp is fine. For backups and syncs, rsync wins."
        },
        {
            type: 'interactive',
            id: 'deploy_example',
            heading: 'Practical Example: Deploy a Website',
            content: "A common workflow: archive your site locally, copy it to the server, extract:",
            terminal_blocks: [
                { 
                    command: "tar -czf site.tar.gz public_html/\nscp site.tar.gz user@webserver:/tmp/\nssh user@webserver \"cd /var/www && tar -xzf /tmp/site.tar.gz\"", 
                    showPrompt: true 
                }
            ],
            tips: [
                "Or better, with rsync directly:",
                "rsync -avz public_html/ user@webserver:/var/www/html/"
            ]
        },
        {
            type: 'text',
            id: 'mistakes',
            heading: 'Common Mistakes',
            list: [
                "**Forgetting `f` in tar** — without `-f`, tar tries to use a tape drive.",
                "**Using `scp -r` but forgetting destination** — can overwrite files accidentally.",
                "**rsync trailing slash errors** — test with `--dry-run` first.",
                "**Omitting `-e ssh` with rsync to remote** — default might use rsh instead of SSH."
            ]
        },
        {
            type: 'summary',
            id: 'summary',
            heading: 'Looking Ahead & Summary',
            content: "You're now a file-moving master. Next we'll dive into software management — installing, updating, and removing packages with DNF and RPM.",
            list: [
                "`tar -cvf` create, `-xvf` extract, `-tvf` list.",
                "Compress with `gzip`/`bzip2`/`xz`; combine with tar `-z/-j/-J`.",
                "`scp` secure copy; `-r` recursive.",
                "`rsync -avz` efficient sync; `--delete` for mirroring."
            ]
        }
    ]
};
