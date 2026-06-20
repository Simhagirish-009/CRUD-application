import React, { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap"; // Imported Spinner
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
  const [loading, setLoading] = useState(false); // Uncommented loading state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message on new submission

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true); // Turn on spinner indicator

    try {
      const data = { email, username, password };
      const response = await register(data);

      toast.success(
        response.data.message || "Registration successful! Please login.",
      ); // Show success toast

      // Clear fields upon a successful account generation pipeline execution
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setLoading(false);
        navigate("/"); // Navigate back to the default login route path configuration
      }, 2000);
    } catch (err) {
      setLoading(false); // Stop spinner to allow corrections
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred during registration. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
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
                  disabled={loading} // Freeze inputs while processing requests
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </Form.Group>

              {/* Submit Button with Spinner Integration */}
              <div className="d-grid mb-3">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="d-flex align-items-center justify-content-center"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating Account...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </Form>

            {/* Link to Login page */}
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              {loading ? (
                <span className="text-muted" style={{ cursor: "not-allowed" }}>
                  Login here
                </span>
              ) : (
                <Link to="/">Login here</Link>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Register;
