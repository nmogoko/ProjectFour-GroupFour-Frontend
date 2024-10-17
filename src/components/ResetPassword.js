import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Auth.css";

function ResetPasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const credentials = {
        new_password: password,
      };

      const response = await fetch(`https://projectfour-groupfour-api.onrender.com//reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming a success message is returned, you might want to show a success notification instead of redirecting
        alert(data.message || 'Password has been reset successfully.');
        setLoading(false);
        navigate('/'); // Navigate if you want to redirect after success
      } else {
        const errorData = await response.json();
        setLoading(false);
        setError(errorData.msg || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Reset Password"}</button>
      </form>
    </div>
  );
}

export default ResetPasswordComponent;
