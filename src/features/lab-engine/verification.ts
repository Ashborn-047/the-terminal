import { VFS } from '../vfs/vfs';
import { Lab, VerificationCondition } from './types';

export class VerificationEngine {
    /**
     * Check if a single command matches an expected command string.
     * Supports regexMatch mode for flexible matching.
     */
    private static matchesCommand(input: string, expected: string, regexMatch?: boolean): boolean {
        const normalizedInput = input.trim().replace(/\s+/g, ' ');
        const normalizedExpected = expected.trim().replace(/\s+/g, ' ');

        if (regexMatch) {
            try {
                const regex = new RegExp(`^${normalizedExpected}$`, 'i');
                return regex.test(normalizedInput);
            } catch (e) {
                console.error('Invalid regex in lab step:', e);
                return normalizedInput === normalizedExpected;
            }
        }
        return normalizedInput === normalizedExpected;
    }

    /**
     * Verify a guided step against a single command input.
     * Checks expectedCommand first, then alternativeCommands.
     * Returns true if the command matches any accepted variant.
     */
    public static verifyGuidedStep(lab: Lab, stepIndex: number, command: string): boolean {
        if (!lab.steps || stepIndex >= lab.steps.length) return false;
        const step = lab.steps[stepIndex];

        // If this step has a requiredSequence, use verifyGuidedSequenceStep instead
        if (step.requiredSequence && step.requiredSequence.length > 0) return false;

        const expected = step.expectedCommand;
        if (!expected) return false;

        // Check primary expected command
        if (this.matchesCommand(command, expected, step.regexMatch)) return true;

        // Check alternative commands
        if (step.alternativeCommands) {
            return step.alternativeCommands.some(alt =>
                this.matchesCommand(command, alt, step.regexMatch)
            );
        }

        return false;
    }

    /**
     * Verify a sequence step: the user must enter each command in requiredSequence in order.
     * Returns the new sequenceIndex (incremented if matched), or -1 if the command is wrong.
     */
    public static verifyGuidedSequenceStep(
        lab: Lab, stepIndex: number, command: string, currentSeqIndex: number
    ): number {
        if (!lab.steps || stepIndex >= lab.steps.length) return -1;
        const step = lab.steps[stepIndex];
        if (!step.requiredSequence || step.requiredSequence.length === 0) return -1;

        const expected = step.requiredSequence[currentSeqIndex];
        if (!expected) return -1;

        if (this.matchesCommand(command, expected, step.regexMatch)) {
            return currentSeqIndex + 1;
        }
        return -1;
    }

    public static verifyDIYLab(lab: Lab, vfs: VFS, userId: string): { success: boolean; failedMessages: string[] } {
        if (!lab.verification) return { success: true, failedMessages: [] };

        const failedMessages: string[] = [];
        for (const condition of lab.verification.conditions) {
            const passed = this.checkCondition(condition, vfs, userId);
            if (!passed) {
                failedMessages.push(condition.message);
            }
        }

        return {
            success: failedMessages.length === 0,
            failedMessages,
        };
    }

    private static checkCondition(condition: VerificationCondition, vfs: VFS, userId: string): boolean {
        const normalizedPath = condition.path.replace('/home/guest', '/home/' + userId);
        const result = vfs.resolve(normalizedPath, userId);
        const exists = typeof result !== 'string';
        const inode = exists ? result as any : null;

        switch (condition.type) {
            case 'directory_exists':
                return exists && inode.type === 'directory';
            case 'file_exists':
                return exists && inode.type === 'file';
            case 'file_not_exists':
                return !exists;
            case 'file_contains':
                if (!exists || inode.type !== 'file') return false;
                return inode.content?.includes(condition.content || '') || false;
            case 'file_matches_regex':
                if (!exists || inode.type !== 'file') return false;
                try {
                    const regex = new RegExp(condition.content || '');
                    return regex.test(inode.content || '');
                } catch {
                    return false;
                }
            case 'permission_equals': {
                if (!exists || !condition.mode) return false;
                const perms = inode.permissions;
                if (!perms) return false;
                const toDigit = (p: { read: boolean; write: boolean; execute: boolean }) =>
                    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
                const octal = `${toDigit(perms.owner)}${toDigit(perms.group)}${toDigit(perms.others)}`;
                return octal === condition.mode;
            }
            case 'owner_equals':
                return exists && inode.ownerId === condition.owner;
            case 'symlink_target_equals': {
                // Resolve WITHOUT following symlinks to get the symlink inode itself
                const symlinkResult = vfs.resolve(condition.path, userId, undefined, false);
                if (typeof symlinkResult === 'string') return false;
                const symlinkInode = symlinkResult as any;
                return symlinkInode.type === 'symlink' && symlinkInode.target === condition.content;
            }
            default:
                return false;
        }
    }
}
