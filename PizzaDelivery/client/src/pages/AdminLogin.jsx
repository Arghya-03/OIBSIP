import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);

        alert("✅ Admin login successful!");

        window.location.href = "/admin";
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Admin login error:", error);

      alert("❌ Could not connect to backend.");
    }
  };

  return (
  <div className="admin-login">
    <div className="admin-login-card">

      <div className="admin-login-header">
        <div className="admin-login-icon">🔐</div>
        <h1>Admin Login</h1>
        <p>Sign in to manage Pizza Delivery</p>
      </div>

      <form onSubmit={handleAdminLogin} className="admin-login-form">

        <div className="admin-form-group">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="admin-login-button">
          Admin Login
        </button>

      </form>

    </div>
  </div>
);
}

export default AdminLogin;