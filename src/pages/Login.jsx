import React, { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap"; // Imported Spinner
import "../styles/form-styles.css";
import { login } from "../services/user_api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import Toastify

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Uncommented loading state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submit
    try {
      const data = { email, password };
      const response = await login(data);
      console.log("Login response:", response.data); // Debugging log
      
      localStorage.clear(); // Clear any previous data
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      toast.success(response.data.message || "Login successful!."); // Show success toast

      setTimeout(() => {
        setLoading(false); // Clear spinner right before routing
        navigate("/viewproducts"); 
      }, 2000); 

    } catch (err) {
      setLoading(false); // Ensure loading is turned off on errors
      alert(err.response?.data?.message || "An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <Card className="form-card animate__animated animate__fadeIn">
          <Card.Header className="bg-transparent border-0 text-center">
            <Card.Title as="h2">Login</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* Email Group */}
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading} // Freezes input during request execution
                />
              </Form.Group>

              {/* Password Group */}
              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Form.Group>

              {/* Submit Button with Spinner Integration */}
              <div className="d-grid">
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
                      Signing In...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <br />
              
              {/* Context Links disabled dynamically while submitting */}
              <Form.Group>
                <Button variant="link" href="/emailverify/" disabled={loading}>
                  Forgotten Password
                </Button>
              </Form.Group>
              <Form.Group>
                <Button variant="link" href="/register/" disabled={loading}>
                  Don't have an account? Register here
                </Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;