import { useState } from "react";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        alert("✅ Login successful!");
        window.location.href = "/dashboard";

        console.log("Logged in user:", data.user);
        console.log("JWT Token:", data.token);
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);

      alert("❌ Could not connect to backend.");
    }
  };

  return (
  <div className="login-page">
    <div className="login-card">
      <h1>🍕 Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
 
        <br />

         <button
            type="button"
            onClick={() => {
              window.location.href = "/forgot-password";
  }}
>
  Forgot Password?
</button>

         </form>
    </div>
  </div>
);
}

export default Login;