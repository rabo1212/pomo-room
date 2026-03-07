'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, error.stack);
    console.error('[ErrorBoundary info]', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <div className="clay bg-cream max-w-sm w-full p-6 text-center">
            <div className="text-4xl mb-3">😵</div>
            <h2 className="text-lg font-bold font-[family-name:var(--font-fredoka)] text-coral mb-2">
              앗, 문제가 생겼어요
            </h2>
            <p className="text-sm text-lavender-dark mb-4">
              페이지를 새로고침하면 해결될 수 있어요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="clay-button inline-block px-6 py-3 text-sm font-bold bg-coral text-white"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
