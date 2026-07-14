import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaApple,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.token;

      const user =
        res.data.user ||
        res.data.data || {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        };

      if (!token) {
        alert("Token not received.");
        return;
      }

      const role = user.role.toLowerCase();

      login(
        {
          ...user,
          role,
        },
        token
      );

      if (role === "admin") {
        navigate("/dashboard/admin");
      } else if (role === "organizer") {
        navigate("/dashboard/organizer");
      } else {
        navigate("/temples");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (

<div className="login-page">

    <div className="login-wrapper">

        {/* LEFT PANEL */}

        <div className="login-left">

            <div className="overlay">

                <div className="hero-content">

                    <span className="small-title">
                        🪷 DarshanEase
                    </span>

                    <h1>
                        Experience
                        <br />
                        <span>Divinity</span>
                    </h1>

                    <p>
                        Book temple darshan tickets effortlessly,
                        securely and peacefully from anywhere.
                    </p>

                    <div className="stats">

                        <div className="card">
                            <h2>500+</h2>
                            <span>Temples</span>
                        </div>

                        <div className="card">
                            <h2>50K+</h2>
                            <span>Devotees</span>
                        </div>

                        <div className="card">
                            <h2>99.9%</h2>
                            <span>Secure</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="login-right">

            <div className="login-card">

                <div className="icon-circle">
                    🪷
                </div>

                <h2>Welcome Back</h2>

                <p className="subtitle">
                    Sign in to continue your spiritual journey
                </p>

                <form onSubmit={handleLogin}>

                    <label>Email Address</label>

                    <div className="input-box">

                        <FaEnvelope className="input-icon" />

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="password-row">

                        <label>Password</label>

                        <span>Forgot?</span>

                    </div>

                    <div className="input-box">

                        <FaLock className="input-icon" />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        <div
                            className="eye"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>

                    </div>

                    <div className="remember">

                        <label>

                            <input type="checkbox" />

                            Remember me

                        </label>

                    </div>

                    <button className="login-btn">

                        <FaArrowRight />

                        Login

                    </button>

                </form>

                <div className="divider">

                    <span>or continue with</span>

                </div>

                <div className="social">

                    <button>

                        <FaGoogle />

                        Google

                    </button>

                    <button>

                        <FaApple />

                        Apple

                    </button>

                </div>

                <p className="bottom">

                    Don't have an account?

                    <Link to="/register">

                        Create Account

                    </Link>

                </p>

            </div>

        </div>

    </div>

</div>

);
}

export default LoginPage;