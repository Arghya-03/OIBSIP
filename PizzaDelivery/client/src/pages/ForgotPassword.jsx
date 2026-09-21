import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ " + data.message);
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      alert("❌ Could not connect to backend.");
    }
  };

  return (
    <div>
      <h1>🔐 Forgot Password</h1>

      <form onSubmit={handleForgotPassword}>
        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;