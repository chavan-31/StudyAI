import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <section className="login-intro">
        <div className="login-background-orb orb-one"></div>
        <div className="login-background-orb orb-two"></div>
        <div className="login-grid"></div>

        <div className="intro-content">
          <div className="intro-logo">
            <span> C </span>
            <div className="logo-glow"></div>
          </div>

          <div className="intro-label">NEXT GENERATION AI LEARNING</div>

          <h1>
            Think smarter.
            <br />
            <span>Learn deeper.</span>
          </h1>

          <p className="intro-description">
            Meet Cognify AI — your intelligent learning companion that
            understands your goals, adapts to your level, and helps you grow.
          </p>

          {/* 3D AI ORB */}
          <div className="cognify-visual">
            <div className="visual-ring ring-one"></div>
            <div className="visual-ring ring-two"></div>
            <div className="visual-ring ring-three"></div>

            <div className="visual-core">
              <div className="core-inner">
                <span>AI</span>
              </div>
            </div>

            <div className="orbit-dot dot-one"></div>
            <div className="orbit-dot dot-two"></div>
            <div className="orbit-dot dot-three"></div>

            <div className="floating-tag tag-one">
              <span>✦</span> Smart Learning
            </div>

            <div className="floating-tag tag-two">
              <span>◈</span> AI Powered
            </div>
          </div>

          <div className="feature-list">
            <div className="feature-row">
              <div className="feature-icon">🧠</div>
              <div>
                <h3>Context-Aware AI</h3>
                <p>Answers based on your learning context.</p>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-icon">📚</div>
              <div>
                <h3>Personalized Learning</h3>
                <p>Learning that adapts to your level.</p>
              </div>
            </div>

            <div className="feature-row">
              <div className="feature-icon">📊</div>
              <div>
                <h3>Learning Analytics</h3>
                <p>Track your learning progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-section">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-icon">C</div>

            <div>
              <h2>Cognify AI</h2>
              <span>Intelligence meets learning</span>
            </div>
          </div>

          <div className="login-heading">
            <span className="login-welcome-label">YOUR LEARNING JOURNEY</span>

            <h1>Welcome back</h1>

            <p>Sign in to continue your learning journey.</p>
          </div>

          {error && <div className="login-error">⚠ {error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label>Email address</label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <div className="password-label">
                <label>Password</label>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Cognify AI
                  <span> → </span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <p>NEW TO COGNIFY?</p>
            <span></span>
          </div>

          <div className="create-account">
            <p>Don't have an account?</p>
            <Link to="/register">Create Account</Link>
          </div>

          <div className="login-security">
            <span>🔐</span>
            Your account is protected with secure authentication.
          </div>
        </div>

        <footer className="login-footer">
          © Cognify AI · Context-Aware Intelligent Learning Platform
        </footer>
      </section>
    </div>
  );
}

export default Login;
