import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

/**
 * ErrorBoundary — per error_handling_logging.md §2.1
 * Wraps major sections to prevent single component crash from taking down the whole UI.
 */
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    section?: string;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error(`ErrorBoundary [${this.props.section || 'unknown'}]:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-6 border-3 border-brutal-red bg-brutal-dark text-brutal-white m-4">
                    <h2 className="font-heading text-xl uppercase mb-2">⚠ Something went wrong</h2>
                    <p className="text-sm text-brutal-gray mb-4">
                        The {this.props.section || 'component'} crashed unexpectedly.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        className="border-2 border-brutal-white px-4 py-2 font-heading uppercase text-xs hover:bg-brutal-white hover:text-brutal-black transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-2 border-2 border-brutal-yellow text-brutal-yellow px-4 py-2 font-heading uppercase text-xs hover:bg-brutal-yellow hover:text-brutal-black transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
