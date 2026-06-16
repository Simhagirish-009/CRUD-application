import React, { useState, useRef } from "react";
import { Form, Button, Card, Modal } from "react-bootstrap";
import "../styles/form-styles.css";

const EmailVerify = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // Fix: Declare input references for OTP auto-focus tracking
  const inputRefs = useRef([]);

  // Handles moving focus forward on typing
  const handleOtpChange = (value, index) => {
    if (/^\d{0,1}$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next box if value is entered
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handles backspacing to previous fields cleanly
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // If current field is already empty, step back and clear previous input
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handles clipboard paste parsing for all 6 slots
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus(); // Focus last element
    }
  };

  // Phase 1: Request OTP
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Sending OTP code to email:", email);
    setShowModal(true);
  };

  // Phase 2: Verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    console.log("Verifying OTP Token:", finalOtp, "for email:", email);
    // Proceed with authentication routing logic here
  };

  return (
    <div className="form-background">
      <div className="form-container">
        {/* Step 1: Base Email Request Card */}
        <Card className="form-card animate__animated animate__fadeIn">
          <Card.Header className="bg-transparent border-0 text-center">
            <Card.Title as="h2">Email Verification</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleEmailSubmit}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Send Code
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Step 2: Verification OTP Modal Popover */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Verification Code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleOtpSubmit}>
              <Form.Group className="mb-4 text-center">
                <Form.Label className="mb-3">
                  Enter the 6-digit OTP sent to your email:
                </Form.Label>

                <div className="d-flex justify-content-center gap-2">
                  {otp.map((data, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="text-center fw-bold fs-4"
                      style={{ width: "45px", height: "50px" }}
                      inputMode="numeric"
                    />
                  ))}
                </div>
              </Form.Group>

              <div className="d-grid">
                <Button variant="success" type="submit" size="lg">
                  Verify & Login
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default EmailVerify;
