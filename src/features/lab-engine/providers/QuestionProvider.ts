export type AssessmentType = 'mcq' | 'syntax_drill' | 'finale_terminal';

export interface ChapterAssessment {
    id: string;
    chapterId: string;
    type: AssessmentType;
    question: string;
    options?: string[]; // Only used if type is 'mcq'
    correctAnswer: string;
    regexMatch?: boolean; // If true, correctAnswer is treated as a regex (useful for terminal verification)
    hint?: string;
}

// Since there are 27 chapters with 15+ questions each, defining them all statically would create a massive file.
// We will use procedural generators for syntax drills to provide infinite replayability,
// alongside a static bank for specific MCQ theory questions.

export const staticQuestionBank: ChapterAssessment[] = [
    // --- SYS1-CH01: Core Desktop & Shell ---
    {
        id: 'q-sys1-01-01',
        chapterId: 'sys1-ch01',
        type: 'mcq',
        question: 'Which of the following environments provides the standard graphical desktop interface in modern Enterprise Linux?',
        options: ['KDE Plasma', 'GNOME', 'XFCE', 'Cinnamon'],
        correctAnswer: 'GNOME',
        hint: 'It is the default Wayland-based desktop environment.'
    },
    {
        id: 'q-sys1-01-02',
        chapterId: 'sys1-ch01',
        type: 'syntax_drill',
        question: 'What command displays the current user\'s identity and group memberships?',
        correctAnswer: 'id',
        hint: 'Two letters, stands for identity.'
    },

    // --- SYS1-CH02: File Management ---
    {
        id: 'q-sys1-02-01',
        chapterId: 'sys1-ch02',
        type: 'syntax_drill',
        question: 'Write the command to create a directory named "reports" inside /var/log, including any necessary parent directories that might not exist.',
        correctAnswer: 'mkdir -p /var/log/reports',
        hint: 'Use the flag that creates parent directories.'
    },
    {
        id: 'q-sys1-02-02',
        chapterId: 'sys1-ch02',
        type: 'mcq',
        question: 'Which absolute path represents the directory where system configuration files are typically stored?',
        options: ['/var', '/usr', '/etc', '/opt'],
        correctAnswer: '/etc',
        hint: 'Etcetera.'
    },

    // --- SYS2-CH05: SELinux ---
    {
        id: 'q-sys2-05-01',
        chapterId: 'sys2-ch05',
        type: 'syntax_drill',
        question: 'Write the command to view the current operational mode of SELinux (Enforcing, Permissive, or Disabled).',
        correctAnswer: 'getenforce',
        hint: 'Get the enforce status.'
    },
    {
        id: 'q-sys2-05-02',
        chapterId: 'sys2-ch05',
        type: 'syntax_drill',
        question: 'Write the command to permanently change the default SELinux context of the /webdata directory (and its contents) to httpd_sys_content_t.',
        correctAnswer: 'semanage fcontext -a -t httpd_sys_content_t "/webdata(/.*)?"',
        hint: 'Use semanage fcontext with the add and type flags, followed by a regex for the directory.'
    },

    // --- SYS2-CH07: Logical Volumes (LVM) ---
    {
        id: 'q-sys2-07-01',
        chapterId: 'sys2-ch07',
        type: 'syntax_drill',
        question: 'Write the command to create a Volume Group named "data_vg" using the physical volume /dev/sdb1.',
        correctAnswer: 'vgcreate data_vg /dev/sdb1',
        hint: 'VG create.'
    },
    {
        id: 'q-sys2-07-02',
        chapterId: 'sys2-ch07',
        type: 'syntax_drill',
        question: 'Write the command to extend the logical volume "db_lv" in "data_vg" by exactly 5 Gigabytes.',
        correctAnswer: 'lvextend -L +5G /dev/data_vg/db_lv',
        hint: 'Use lvextend with the -L flag and a plus sign.'
    },

    // --- SYS2-CH12: Containers ---
    {
        id: 'q-sys2-12-01',
        chapterId: 'sys2-ch12',
        type: 'syntax_drill',
        question: 'Write the command to search the default configured registries for a container image named "httpd".',
        correctAnswer: 'podman search httpd',
        hint: 'podman is the tool.'
    },
    {
        id: 'q-sys2-12-02',
        chapterId: 'sys2-ch12',
        type: 'syntax_drill',
        question: 'Write the command to run a detached container named "web" using the "nginx" image, mapping host port 8080 to container port 80.',
        correctAnswer: 'podman run -d --name web -p 8080:80 nginx',
        hint: 'run detached (-d), name it, and publish (-p) ports host:container.'
    }
];

export class QuestionProvider {
    /**
     * Fetches a session subset of questions for a specific chapter.
     * In a full implementation, this would procedurally generate drills
     * based on the chapter ID to provide infinite replayability.
     */
    static async fetchSessionQuestions(chapterId: string, count: number = 5): Promise<ChapterAssessment[]> {
        // 1. Filter static bank
        const chapterQs = staticQuestionBank.filter(q => q.chapterId === chapterId);

        // 2. Procedural Generation (Fallback/Augmentation)
        // If we don't have enough static questions authored yet, generate synthetic ones
        // to ensure the UI doesn't break during this migration phase.
        while (chapterQs.length < count) {
            chapterQs.push(this.generateSyntheticDrill(chapterId, chapterQs.length));
        }

        // 3. Shuffle (Fisher-Yates)
        for (let i = chapterQs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chapterQs[i], chapterQs[j]] = [chapterQs[j], chapterQs[i]];
        }

        return chapterQs.slice(0, count);
    }

    private static generateSyntheticDrill(chapterId: string, index: number): ChapterAssessment {
        // A temporary synthetic generator to fulfill the "massive replayability" requirement
        // while the content team authors the thousands of specific variations required for all 27 chapters.
        const tools = ['grep', 'tar', 'systemctl', 'podman', 'nmcli', 'semanage', 'lvcreate'];
        const randomTool = tools[Math.floor(Math.random() * tools.length)];

        return {
            id: `synth-${chapterId}-${index}-${Date.now()}`,
            chapterId: chapterId,
            type: 'syntax_drill',
            question: `[Placeholder] Write a common command utilizing the ${randomTool} utility. (Type 'man ${randomTool}' to bypass)`,
            correctAnswer: `man ${randomTool}`,
            hint: 'This is a procedurally generated placeholder until the content DB is fully seeded.'
        };
    }
}