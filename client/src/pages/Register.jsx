import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NeuralSphere from "../components/NeuralSphere";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-background">
        <div className="register-orb register-orb-one"></div>
        <div className="register-orb register-orb-two"></div>
        <div className="register-grid"></div>
      </div>

      {/* LEFT SIDE */}
      <section className="register-intro">
        <div className="register-logo">
          <span>M</span>
          <div className="register-logo-glow"></div>
        </div>

        <div className="register-label">JOIN MENTORIQ AI</div>

        <h1>
          Start your
          <br />
          <span>learning journey.</span>
        </h1>

        <p className="register-description">
          Create your MentorIQ AI account and get a personalized learning
          experience powered by intelligent AI technology.
        </p>

        {/* 3D NEURAL SPHERE */}
        <div className="register-sphere-wrapper">
          <NeuralSphere />

          <div className="register-floating-tag register-tag-one">
            <span>✦</span> Smart Learning
          </div>

          <div className="register-floating-tag register-tag-two">
            <span>◈</span> AI Powered
          </div>
        </div>

        <div className="register-features">
          <div className="register-feature">
            <div className="register-feature-icon">🧠</div>
            <div>
              <h3>Learn with context</h3>
              <p>AI understands what you're studying.</p>
            </div>
          </div>

          <div className="register-feature">
            <div className="register-feature-icon">🎯</div>
            <div>
              <h3>Personalized goals</h3>
              <p>Build a study plan around your goals.</p>
            </div>
          </div>

          <div className="register-feature">
            <div className="register-feature-icon">📈</div>
            <div>
              <h3>Track your progress</h3>
              <p>See your learning journey over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="register-section">
        <div className="register-card">
          {/* BRAND */}
          <div className="register-brand">
            <div className="register-brand-icon">M</div>
            <div>
              <h2>MentorIQ AI</h2>
              <span>Your Personal AI Learning & Coding Mentor</span>
            </div>
          </div>

          {/* HEADING */}
          <div className="register-heading">
            <h1>Create account</h1>
            <p>Start learning smarter today.</p>
          </div>

          {error && (
            <div className="register-error" role="alert">
              ⚠ {error}
            </div>
          )}

          {success && (
            <div className="register-success" role="status">
              ✓ {success}
            </div>
          )}

          {/* FORM */}
          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="register-divider">
            <span></span>
            <p>ALREADY A MEMBER?</p>
            <span></span>
          </div>

          {/* LOGIN */}
          <div className="register-login">
            <p>Already have an account?</p>
            <Link to="/login">Sign in</Link>
          </div>

          <div className="register-security">
            🔐 Your information is securely protected.
          </div>
        </div>

        <footer className="register-footer">
          © MentorIQ AI · Your Personal AI Learning & Coding Mentor
        </footer>
      </section>
    </main>
  );
}

export default Register;
