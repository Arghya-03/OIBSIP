import { useEffect, useRef, useState } from "react";
import "./VerifyEmail.css";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying your email...");
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      const token = window.location.pathname.split("/")[2];

      try {
        const response = await fetch(
          `http://localhost:5000/api/verify/${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setMessage("✅ Email verified successfully!");
        } else {
          setMessage("❌ " + data.message);
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("❌ Could not connect to backend.");
      }
    };

    verifyEmail();
  }, []);

  const isError = message.startsWith("❌");
  const isSuccess = message.startsWith("✅");

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">

        <div className="verify-email-icon">✉️</div>

        <h1>Email Verification</h1>

        <div
          className={`verify-message ${
            isError ? "error" : isSuccess ? "success" : "loading"
          }`}
        >
          {message}
        </div>

      </div>
    </div>
  );
}

export default VerifyEmail;