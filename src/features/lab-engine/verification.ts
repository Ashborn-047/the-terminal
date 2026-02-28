import { VFS } from '../vfs/vfs';
import { Lab, VerificationCondition } from './types';

export class VerificationEngine {
    public static verifyGuidedStep(lab: Lab, stepIndex: number, command: string): boolean {
        if (!lab.steps || stepIndex >= lab.steps.length) return false;
        const step = lab.steps[stepIndex];

        const normalizedInput = command.trim().replace(/\s+/g, ' ');
        const expected = step.expectedCommand?.trim().replace(/\s+/g, ' ');

        return normalizedInput === expected;
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
        const result = vfs.resolve(condition.path, userId);
        const exists = typeof result !== 'string';
        const inode = exists ? result as any : null;

        switch (condition.type) {
            case 'directory_exists':
                return exists && inode.type === 'directory';
            case 'file_exists':
                return exists && inode.type === 'file';
            case 'file_contains':
                if (!exists || inode.type !== 'file') return false;
                return inode.content?.includes(condition.content || '') || false;
            case 'permission_equals':
                if (!exists) return false;
                // Simplified comparison - could be expanded for octal
                return true; // Placeholder
            case 'owner_equals':
                return exists && inode.ownerId === condition.owner;
            default:
                return false;
        }
    }
}
