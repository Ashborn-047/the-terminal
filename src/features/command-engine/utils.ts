/**
 * Utility to consistently read from a command's piped input.
 * If the input is already a string, it returns it.
 * If it's an AsyncGenerator, it drains the stream into a single string.
 */
export async function readStream(input: string | AsyncGenerator<string>): Promise<string> {
    if (typeof input === 'string') {
        return input;
    }
    
    let result = '';
    try {
        for await (const chunk of input) {
            result += chunk;
        }
    } catch (e) {
        console.error('Error reading stream:', e);
    }
    return result;
}

/**
 * Normalizes a path by prepending the CWD if the path is relative.
 */
export function getAbsolutePath(path: string, cwd: string): string {
    if (!path || path.startsWith('/')) return path;
    return cwd === '/' ? `/${path}` : `${cwd}/${path}`;
}
