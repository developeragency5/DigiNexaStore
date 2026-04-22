import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null; info: ErrorInfo | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
    console.error("[App ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "24px", fontFamily: "monospace", color: "#111", background: "#fff", minHeight: "100vh" }}>
          <h1 style={{ color: "#b91c1c", fontSize: 22, marginBottom: 12 }}>App crashed during render</h1>
          <p style={{ marginBottom: 8 }}><strong>Message:</strong> {this.state.error.message}</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fef2f2", padding: 12, border: "1px solid #fecaca", borderRadius: 8, fontSize: 12 }}>
            {this.state.error.stack}
          </pre>
          {this.state.info?.componentStack && (
            <pre style={{ whiteSpace: "pre-wrap", background: "#f3f4f6", padding: 12, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, marginTop: 12 }}>
              {this.state.info.componentStack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
