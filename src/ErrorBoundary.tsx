import { Component, type ReactNode, type ErrorInfo } from "react";

// Top-level safety net so a runtime exception in any view doesn't blank the
// entire app. Renders a friendly message + Reload button + the error stack
// (collapsed) so Shweta can screenshot it for debugging.
//
// Most importantly: it OFFERS a 'Reset all data' button as a last-resort
// escape hatch in case bad localStorage state is causing the crash, so the
// user is never trapped in an unrecoverable boot loop.
interface State {
  err: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { err: null, info: null };

  static getDerivedStateFromError(err: Error): Partial<State> {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error("App crashed:", err, info);
    this.setState({ info });
  }

  reload = () => {
    window.location.reload();
  };

  resetAll = () => {
    if (!confirm("This will permanently delete ALL Shikhar app data on this device. Continue?")) return;
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith("shikhar-")) localStorage.removeItem(k);
      }
    } catch (e) { console.error(e); }
    window.location.reload();
  };

  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ minHeight: "100vh", padding: "32px 20px", background: "#f8fafc", fontFamily: "Inter, system-ui, -apple-system, sans-serif", color: "#111827" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0, marginBottom: 20, lineHeight: 1.5 }}>
            The app hit an unexpected error. Your data is still safe in browser
            storage. Try reloading first; if the crash repeats, use Reset to
            clear local data and start fresh.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button onClick={this.reload}
              style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Reload app
            </button>
            <button onClick={this.resetAll}
              style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Reset all data
            </button>
          </div>
          <details style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12, fontSize: 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 700, color: "#6b7280" }}>Technical details</summary>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#dc2626", fontSize: 11, marginTop: 8 }}>
              {this.state.err?.name}: {this.state.err?.message}{"\n\n"}
              {this.state.err?.stack || ""}
              {this.state.info?.componentStack || ""}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
