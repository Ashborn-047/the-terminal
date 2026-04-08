/**
 * Centralized Error Codes — per Doc 8 §6.1
 * Maps logical error keys to user-facing messages and unique codes.
 */

export interface SystemError {
    code: string;
    message: string;
    description?: string;
}

export const ERROR_CODES: Record<string, SystemError> = {
    COMMAND_NOT_FOUND: {
        code: 'E_001',
        message: 'Command not found',
        description: 'The requested command does not exist in the current environment.'
    },
    PERMISSION_DENIED: {
        code: 'E_002',
        message: 'Permission denied',
        description: 'You do not have the required permissions to perform this action.'
    },
    FILE_NOT_FOUND: {
        code: 'E_003',
        message: 'No such file or directory',
        description: 'The specified path does not exist.'
    },
    NO_SUCH_FILE_OR_DIRECTORY: {
        code: 'E_003',
        message: 'No such file or directory',
        description: 'The specified path does not exist.'
    },
    DIRECTORY_ALREADY_EXISTS: {
        code: 'E_004',
        message: 'File exists',
        description: 'Cannot create directory: File already exists.'
    },
    IS_DIRECTORY: {
        code: 'E_005',
        message: 'Is a directory',
        description: 'Operation not permitted on a directory.'
    },
    NOT_A_DIRECTORY: {
        code: 'E_006',
        message: 'Not a directory',
        description: 'Specified path is not a directory.'
    },
    GENERIC_INTERNAL_ERROR: {
        code: 'E_999',
        message: 'Internal system error',
        description: 'An unexpected error occurred during execution.'
    }
};

/**
 * Formats a system error for display.
 * Returns standard POSIX-compliant error strings.
 */
export function formatError(errorKey: keyof typeof ERROR_CODES | string): string {
    const error = ERROR_CODES[errorKey] || ERROR_CODES.GENERIC_INTERNAL_ERROR;
    // Immersion: No logical code suffixes (E_xxx) in user-facing output
    return error.message;
}
