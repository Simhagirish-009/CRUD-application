import React from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
  return (
    <div className="form-background">
      <div className="form-container">
        <Card className="form-card animate__animated animate__fadeIn">
          <Card.Header className="bg-transparent border-0 text-center">
            <Card.Title as="h2">Reset Password</Card.Title>
          </Card.Header>
          <Card.Body>
            {/* Error Alert Display */}
            {error && (
              <div className="alert alert-danger p-2 text-center" role="alert">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
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
                  Reset Password
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
