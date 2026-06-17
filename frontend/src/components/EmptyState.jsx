// Lightweight placeholder for empty lists / no-results states.
export const EmptyState = ({ title = "Nothing here yet", message, icon = "📭" }) => (
  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#718096" }}>
    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{icon}</div>
    <h3 style={{ margin: 0 }}>{title}</h3>
    {message && <p style={{ marginTop: "0.4rem" }}>{message}</p>}
  </div>
);

export default EmptyState;
