import { Component } from "react";

// Catches render-time errors anywhere in the tree and shows a friendly fallback
// instead of a blank white screen.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1>Something went wrong.</h1>
          <p>An unexpected error occurred. Please try reloading the page.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.assign("/");
            }}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "8px",
              border: "none",
              background: "#2b6cb0",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
