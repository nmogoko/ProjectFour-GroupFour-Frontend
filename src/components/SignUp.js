import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function SignUpComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        setError('password and confirm password do not match.');
        return;
      }

      const credentials = {
        email: email,
        password: password,
      };

      const response = await fetch('https://projectfour-groupfour-api.onrender.com//sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        
        setLoading(false);
        alert(data.msg || "User created successfully.");
        navigate('/signin');
      } else {
        const errorData = await response.json();
        setLoading(false);
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      setLoading(false);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Sign Up"}</button>
      </form>
    </div>
  );
}

export default SignUpComponent;
