import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="website-name">HealthBridge</span>
        <span className="copyright">
          © {new Date().getFullYear()} HealthBridge. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
