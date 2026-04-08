import { describe, it, expect, beforeEach } from 'vitest';
import { VerificationEngine } from '../verification';
import { VFS } from '../../vfs/vfs';
import { Lab } from '../types';

describe('VerificationEngine', () => {
    describe('verifyGuidedStep', () => {
        const mockLab: Lab = {
            id: 'test-guided',
            title: 'Test',
            description: 'Test',
            module: 1,
            type: 'guided',
            xpReward: 10,
            prerequisites: [],
            steps: [
                { id: '1', instruction: 'Run pwd', expectedCommand: 'pwd' },
                { id: '2', instruction: 'Run ls -a', expectedCommand: 'ls -a' },
                { id: '3', instruction: 'Run any cd', expectedCommand: '^cd\\s+.*$', regexMatch: true },
            ],
            tags: [],
            author: 'Test',
            completionMessage: 'Done'
        };

        it('should return true for an exact command match', () => {
            expect(VerificationEngine.verifyGuidedStep(mockLab, 0, 'pwd')).toBe(true);
        });

        it('should return false for an incorrect command', () => {
            expect(VerificationEngine.verifyGuidedStep(mockLab, 0, 'ls')).toBe(false);
        });

        it('should handle extra whitespace gracefully', () => {
            expect(VerificationEngine.verifyGuidedStep(mockLab, 1, '  ls    -a  ')).toBe(true);
        });

        it('should return true for a regex match', () => {
            expect(VerificationEngine.verifyGuidedStep(mockLab, 2, 'cd /home')).toBe(true);
            expect(VerificationEngine.verifyGuidedStep(mockLab, 2, 'cd ..')).toBe(true);
        });

        it('should return false if regex fails', () => {
            expect(VerificationEngine.verifyGuidedStep(mockLab, 2, 'pwd')).toBe(false);
        });

        it('should return false if step index is out of bounds', () => {
            expect(VerificationEngine.verifyGuidedStep(mockLab, 5, 'pwd')).toBe(false);
        });

        it('should accept alternative commands', () => {
            const labWithAlts: Lab = {
                ...mockLab,
                steps: [
                    { id: 'alt-1', instruction: 'List files', expectedCommand: 'ls -la', alternativeCommands: ['ls -al', 'ls -la --color'] },
                ],
            };
            expect(VerificationEngine.verifyGuidedStep(labWithAlts, 0, 'ls -la')).toBe(true);
            expect(VerificationEngine.verifyGuidedStep(labWithAlts, 0, 'ls -al')).toBe(true);
            expect(VerificationEngine.verifyGuidedStep(labWithAlts, 0, 'ls -la --color')).toBe(true);
            expect(VerificationEngine.verifyGuidedStep(labWithAlts, 0, 'ls -l')).toBe(false);
        });

        it('should return false for a sequence step when using verifyGuidedStep', () => {
            const seqLab: Lab = {
                ...mockLab,
                steps: [
                    { id: 'seq-1', instruction: 'Do sequence', requiredSequence: ['mkdir test', 'cd test'] },
                ],
            };
            expect(VerificationEngine.verifyGuidedStep(seqLab, 0, 'mkdir test')).toBe(false);
        });
    });

    describe('verifyGuidedSequenceStep', () => {
        const seqLab: Lab = {
            id: 'test-seq',
            title: 'Sequence Test',
            description: '',
            module: 1,
            type: 'guided',
            xpReward: 10,
            prerequisites: [],
            steps: [
                { id: 'seq-2', instruction: 'Create and enter dir', requiredSequence: ['mkdir mydir', 'cd mydir', 'pwd'] },
            ],
            tags: [],
            author: 'Test',
            completionMessage: 'Done'
        };

        it('should advance sequence index on correct command', () => {
            expect(VerificationEngine.verifyGuidedSequenceStep(seqLab, 0, 'mkdir mydir', 0)).toBe(1);
        });

        it('should return -1 on wrong command', () => {
            expect(VerificationEngine.verifyGuidedSequenceStep(seqLab, 0, 'ls', 0)).toBe(-1);
        });

        it('should advance through the full sequence', () => {
            expect(VerificationEngine.verifyGuidedSequenceStep(seqLab, 0, 'mkdir mydir', 0)).toBe(1);
            expect(VerificationEngine.verifyGuidedSequenceStep(seqLab, 0, 'cd mydir', 1)).toBe(2);
            expect(VerificationEngine.verifyGuidedSequenceStep(seqLab, 0, 'pwd', 2)).toBe(3);
        });

        it('should return -1 for out-of-bounds step index', () => {
            expect(VerificationEngine.verifyGuidedSequenceStep(seqLab, 5, 'mkdir mydir', 0)).toBe(-1);
        });

        it('should return -1 on a non-sequence step', () => {
            const normalLab: Lab = {
                ...seqLab,
                steps: [{ id: 'normal-1', instruction: 'Run pwd', expectedCommand: 'pwd' }],
            };
            expect(VerificationEngine.verifyGuidedSequenceStep(normalLab, 0, 'pwd', 0)).toBe(-1);
        });
    });

    describe('verifyDIYLab', () => {
        let vfs: VFS;
        const userId = 'guest';

        beforeEach(() => {
            vfs = new VFS(); // Assuming default VFS state has /home/guest
        });

        it('should verify directory_exists successfully', async () => {
            await vfs.mkdir('/home/guest', 'testdir', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'directory_exists', path: '/home/guest/testdir', message: 'Create testdir' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
            expect(result.failedMessages.length).toBe(0);
        });

        it('should fail directory_exists if not present', () => {
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'directory_exists', path: '/home/guest/missingdir', message: 'Create missingdir' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(false);
            expect(result.failedMessages).toContain('Create missingdir');
        });

        it('should verify file_exists successfully', async () => {
            await vfs.writeFile('/home/guest/testfile.txt', 'content', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'file_exists', path: '/home/guest/testfile.txt', message: 'Create testfile.txt' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });

        it('should verify file_not_exists successfully', () => {
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'file_not_exists', path: '/home/guest/deletedfile.txt', message: 'Delete the file' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });

        it('should fail file_not_exists if file is present', async () => {
            await vfs.writeFile('/home/guest/existing.txt', '', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'file_not_exists', path: '/home/guest/existing.txt', message: 'Delete existing.txt' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(false);
        });

        it('should verify file_contains successfully', async () => {
            await vfs.writeFile('/home/guest/hello.txt', 'hello world', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'file_contains', path: '/home/guest/hello.txt', content: 'world', message: 'File must contain world' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });

        it('should fail file_contains if missing substring', async () => {
            await vfs.writeFile('/home/guest/hello.txt', 'hello universe', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'file_contains', path: '/home/guest/hello.txt', content: 'world', message: 'File must contain world' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(false);
        });

        it('should verify file_matches_regex successfully', async () => {
            await vfs.writeFile('/home/guest/data.txt', 'IP: 192.168.1.1', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'file_matches_regex', path: '/home/guest/data.txt', content: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', message: 'Must contain IP' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });

        it('should verify permission_equals successfully', async () => {
            await vfs.writeFile('/home/guest/script.sh', 'echo "hi"', userId);
            await vfs.chmod('/home/guest/script.sh', '755', userId);
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'permission_equals', path: '/home/guest/script.sh', mode: '755', message: 'Must be 755' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });

        it('should verify owner_equals successfully', async () => {
            await vfs.writeFile('/home/guest/rootfile.txt', 'root data', 'root');
            const lab: Lab = {
                id: 'test-diy', title: 'Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ type: 'owner_equals', path: '/home/guest/rootfile.txt', owner: 'root', message: 'Must be root' }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });

        it('should verify file_permissions_bitwise (SUID) successfully', async () => {
            await vfs.writeFile('/home/guest/sudo_mock', 'content', 'root');
            // 0o4111 = setuid + --x--x--x
            await vfs.chmod('/home/guest/sudo_mock', 0o4111, 'root');
            
            const lab: Lab = {
                id: 'test-suid', title: 'Security Test', description: '', module: 1, type: 'diy',
                xpReward: 10, prerequisites: [], completionMessage: 'Done',
                verification: {
                    conditions: [{ 
                        type: 'file_permissions_bitwise', 
                        path: '/home/guest/sudo_mock', 
                        mustHaveSuid: true, 
                        message: 'File must have SUID bit' 
                    }]
                }
            };
            const result = VerificationEngine.verifyDIYLab(lab, vfs, userId, []);
            expect(result.success).toBe(true);
        });
    });
});
