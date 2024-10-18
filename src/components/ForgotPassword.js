import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();

    const credentials = {
      email: email,
    };

    try {
      const response = await fetch(
        "https://projectfour-groupfour-api.onrender.com/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Assuming a success message is returned, you might want to show a success notification instead of redirecting
        alert(
          data.message ||
            "Check your email for instructions to reset your password."
        );
        setLoading(false);
        navigate("/"); // Navigate if you want to redirect after success
      } else {
        const errorData = await response.json();
        setLoading(false);
        setError(errorData.msg || "An error occurred. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Send Reset Password Email"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordComponent;
