import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { ICON_SIZES } from "../../constants";
import Icon from "../ui/Icon";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in application:", error, errorInfo);
  }

  private handleReset = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6 font-sans"
          style={{ backgroundColor: "var(--gray-1)", color: "var(--gray-12)" }}
        >
          <div
            className="max-w-md w-full p-8 rounded-2xl border shadow-xl flex flex-col items-center text-center"
            style={{ backgroundColor: "var(--gray-2)", borderColor: "var(--gray-6)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "var(--accent-3)", color: "var(--accent-11)" }}
            >
              <Icon name="warning" size={ICON_SIZES.lg} />
            </div>

            <h1 className="text-lg font-semibold mb-2">Something went wrong</h1>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--gray-11)" }}>
              A critical error occurred while rendering the application. This is usually caused by corrupted cache or
              invalid local data.
            </p>

            <button
              onClick={this.handleReset}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium cursor-pointer border-none"
              style={{ backgroundColor: "var(--accent-9)", color: "white" }}
            >
              Clear data and reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
