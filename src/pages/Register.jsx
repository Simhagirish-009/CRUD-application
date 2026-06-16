import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/form-styles.css";
import { toast } from "react-toastify"; // Import Toastify
import { register } from "../services/user_api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message on new submission

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const data = { email, username, password };
      const response = await register(data);
      alert(response.data.message || "Registration successful! Please login.");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      toast.success(
        response.data.message || "Registration successful! Please login.",
      ); // Show success toast
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred during registration. Please try again.",
      );
      toast.error(error);
    }

    console.log("Registering user:", { username, email, password });
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <Card className="form-card animate__animated animate__fadeIn">
          <Card.Header className="bg-transparent border-0 text-center">
            <Card.Title as="h2">Create Account</Card.Title>
          </Card.Header>
          <Card.Body>
            {/* Error Alert Display */}
            {error && (
              <div className="alert alert-danger p-2 text-center" role="alert">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Username Group */}
              <Form.Group className="mb-3" controlId="registerUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Email Group */}
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password Group */}
              <Form.Group className="mb-3" controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Form.Group>

              {/* Confirm Password Group */}
              <Form.Group className="mb-4" controlId="registerConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Submit Button */}
              <div className="d-grid mb-3">
                <Button variant="primary" type="submit" size="lg">
                  Register
                </Button>
              </div>
            </Form>

            {/* Link to Login page */}
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to="/login">Login here</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;
