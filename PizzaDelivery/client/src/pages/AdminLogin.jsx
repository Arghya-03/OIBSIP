import { useState } from "react";

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
    <div>
      <h1>🔐 Admin Login</h1>

      <form onSubmit={handleAdminLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Admin Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;