import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type LoginLocationState = {
  from?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LoginLocationState | null)?.from || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (username.trim().toLowerCase() === "admin" && password.trim() === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      navigate(from, { replace: true });
      return;
    }

    setError("Invalid credentials. Use admin / admin123.");
    setIsSubmitting(false);
  }

  return (
    <div className="ops-login">
      <div className="login-overlay" />

      <div className="login-box">
        <div className="login-header">
          <div className="logo-circle">A</div>
          <h1>AEROOPS</h1>
          <p>Airport Operations Command Center</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="operator-id">Operator ID</label>
            <input
              id="operator-id"
              type="text"
              placeholder="admin"
              value={username}
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="security-passcode">Security Passcode</label>
            <input
              id="security-passcode"
              type="password"
              placeholder="admin123"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Opening..." : "Access Command Center"}
          </button>
        </form>
      </div>
    </div>
  );
}
