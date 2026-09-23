import { useState } from "react";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const token = window.location.pathname.split("/")[2];

    try {
      const response = await fetch(
        "http://localhost:5000/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.error("Reset password error:", error);

      setMessage("❌ Could not connect to backend.");
    }
  };

  return (
  <div className="reset-password-page">
  <div className="reset-password-card">
      <h1>🔐 Reset Password</h1>

      <form onSubmit={handleResetPassword}>
        <div>
          <label>New Password</label>
          <br />

          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Reset Password
        </button>
      </form>

      <h3>{message}</h3>
    </div>
  </div> 
  );
}

export default ResetPassword;