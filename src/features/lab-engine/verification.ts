import { VFS } from '../vfs/vfs';
import { VerificationCondition } from './types';
import { permissionsToOctal } from '../vfs/vfs';

export class VerificationEngine {
    constructor(private vfs: VFS) {}

    public async verify(conditions: VerificationCondition[]): Promise<{ success: boolean; message?: string }> {
        for (const condition of conditions) {
            const isMet = await this.checkCondition(condition);
            if (!isMet) {
                return { success: false, message: condition.message };
            }
        }
        return { success: true };
    }

    private async checkCondition(condition: VerificationCondition): Promise<boolean> {
        const { type, path, content, mode, owner, mustHaveSuid } = condition;
        const inode = this.vfs.getMetadata(path);

        // All checks below (except file_not_exists) require the inode to exist
        if (typeof inode === 'string') {
            if (type === 'file_not_exists') return true;
            return false;
        }

        switch (type) {
            case 'directory_exists':
                return inode.type === 'directory';
            case 'file_exists':
                return inode.type === 'file';
            case 'file_not_exists':
                return false; // Path exists, so file_not_exists is false
            case 'file_contains':
                return inode.content?.includes(content || '') ?? false;
            case 'file_matches_regex':
                return new RegExp(content || '').test(inode.content || '');
            case 'owner_equals':
                return inode.ownerId === owner;
            case 'symlink_target_equals':
                return inode.type === 'symlink' && inode.target === content;
            case 'permission_equals': {
                const currentOctal = permissionsToOctal(inode.permissions).slice(-3);
                const targetOctal = mode?.toString().padStart(3, '0').slice(-3);
                return currentOctal === targetOctal;
            }
            case 'file_permissions_bitwise': {
                // AUTHORITATIVE SUID CHECK (0o4000)
                const perms = inode.permissions;
                let bitwiseMatch = true;
                
                if (mustHaveSuid) {
                    bitwiseMatch = !!perms.setuid;
                }
                
                if (mode !== undefined) {
                    const modeNum = typeof mode === 'string' ? parseInt(mode, 8) : mode;
                    // Check against octal bits if provided
                    const currentMode = this.permissionsToModeNumber(perms);
                    bitwiseMatch = bitwiseMatch && ((currentMode & modeNum) === modeNum);
                }
                
                return bitwiseMatch;
            }
            default:
                return false;
        }
    }

    private permissionsToModeNumber(perms: any): number {
        const toDigit = (p: any) => (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
        const special = (perms.setuid ? 4 : 0) + (perms.setgid ? 2 : 0) + (perms.sticky ? 1 : 0);
        return special * 512 + toDigit(perms.owner) * 64 + toDigit(perms.group) * 8 + toDigit(perms.others);
    }

    // --- Static Utility Methods for Guided Labs ---

    public static verifyGuidedStep(lab: any, stepIndex: number, input: string): boolean {
        if (!lab.steps || stepIndex >= lab.steps.length) return false;
        const step = lab.steps[stepIndex];
        const trimmedInput = input.trim();

        if (step.regexMatch) {
            return new RegExp(step.expectedCommand).test(trimmedInput);
        }

        if (step.alternativeCommands?.includes(trimmedInput)) return true;
        return trimmedInput === step.expectedCommand;
    }

    public static verifyGuidedSequenceStep(lab: any, stepIndex: number, input: string, sequenceIndex: number): number {
        if (!lab.steps || stepIndex >= lab.steps.length) return -1;
        const step = lab.steps[stepIndex];
        if (!step.requiredSequence) return -1;

        const expected = step.requiredSequence[sequenceIndex];
        // Note: we could add more complex logic here if we wanted partial matches
        if (input.trim() === expected) {
            return sequenceIndex + 1;
        }
        return sequenceIndex; // No progress, but no failure either (just ignore wrong commands)
    }
}
